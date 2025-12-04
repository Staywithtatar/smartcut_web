// Job Queue System using BullMQ  
// Handles async video processing with retry logic and concurrency control

import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { createServiceClient } from '@/lib/supabase/server';

// Redis connection
const connection = new Redis(process.env.UPSTASH_REDIS_URL || '', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

// Queue configuration
const queueConfig = {
    connection,
    defaultJobOptions: {
        attempts: 3, // Retry failed jobs 3 times
        backoff: {
            type: 'exponential' as const,
            delay: 2000, // Start with 2 second delay
        },
        removeOnComplete: {
            count: 100, // Keep last 100 completed jobs
            age: 24 * 3600, // Keep for 24 hours
        },
        removeOnFail: {
            count: 500, // Keep last 500 failed jobs for debugging
        },
    },
};

// Create queues for different job types
export const videoProcessingQueue = new Queue('video-processing', queueConfig);
export const transcriptionQueue = new Queue('transcription', queueConfig);
export const analysisQueue = new Queue('analysis', queueConfig);

// Queue events for monitoring
export const videoProcessingEvents = new QueueEvents('video-processing', { connection });
export const transcriptionEvents = new QueueEvents('transcription', { connection });
export const analysisEvents = new QueueEvents('analysis', { connection });

// Job data types
export interface VideoProcessingJobData {
    jobId: string;
    userId: string;
    inputVideoPath: string;
    editingScript: any;
}

export interface TranscriptionJobData {
    jobId: string;
    userId: string;
    inputVideoPath: string;
}

export interface AnalysisJobData {
    jobId: string;
    userId: string;
    transcription: any;
}

/**
 * Add video processing job to queue
 */
export async function addVideoProcessingJob(data: VideoProcessingJobData) {
    const job = await videoProcessingQueue.add(
        'process-video',
        data,
        {
            jobId: data.jobId,
            priority: 1, // Lower number = higher priority
        }
    );

    console.log(`📋 Added video processing job: ${data.jobId}`);
    return job;
}

/**
 * Add transcription job to queue
 */
export async function addTranscriptionJob(data: TranscriptionJobData) {
    const job = await transcriptionQueue.add(
        'transcribe',
        data,
        {
            jobId: data.jobId,
            priority: 2,
        }
    );

    console.log(`📋 Added transcription job: ${data.jobId}`);
    return job;
}

/**
 * Add analysis job to queue
 */
export async function addAnalysisJob(data: AnalysisJobData) {
    const job = await analysisQueue.add(
        'analyze',
        data,
        {
            jobId: data.jobId,
            priority: 2,
        }
    );

    console.log(`📋 Added analysis job: ${data.jobId}`);
    return job;
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string) {
    const job = await videoProcessingQueue.getJob(jobId);

    if (!job) {
        return null;
    }

    const state = await job.getState();
    const progress = job.progress;
    const attemptsMade = job.attemptsMade;
    const failedReason = job.failedReason;

    return {
        id: jobId,
        state,
        progress,
        attemptsMade,
        failedReason,
        data: job.data,
    };
}

/**
 * Cancel a job
 */
export async function cancelJob(jobId: string) {
    const job = await videoProcessingQueue.getJob(jobId);

    if (job) {
        await job.remove();
        console.log(`🚫 Cancelled job: ${jobId}`);
        return true;
    }

    return false;
}

/**
 * Get queue metrics
 */
export async function getQueueMetrics() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
        videoProcessingQueue.getWaitingCount(),
        videoProcessingQueue.getActiveCount(),
        videoProcessingQueue.getCompletedCount(),
        videoProcessingQueue.getFailedCount(),
        videoProcessingQueue.getDelayedCount(),
    ]);

    return {
        waiting,
        active,
        completed,
        failed,
        delayed,
        total: waiting + active + delayed,
    };
}

/**
 * Retry a failed job
 */
export async function retryJob(jobId: string) {
    const job = await videoProcessingQueue.getJob(jobId);

    if (job && (await job.getState()) === 'failed') {
        await job.retry();
        console.log(`🔄 Retrying job: ${jobId}`);
        return true;
    }

    return false;
}

/**
 * Clean old jobs
 */
export async function cleanOldJobs() {
    const grace = 24 * 3600 * 1000; // 24 hours
    const limit = 1000;

    const [completedRemoved, failedRemoved] = await Promise.all([
        videoProcessingQueue.clean(grace, limit, 'completed'),
        videoProcessingQueue.clean(grace * 7, limit, 'failed'), // Keep failed jobs for 7 days
    ]);

    console.log(`🗑️  Cleaned ${completedRemoved.length} completed and ${failedRemoved.length} failed jobs`);
}

// Worker for video processing (runs in separate process/container)
export function createVideoProcessingWorker() {
    const worker = new Worker(
        'video-processing',
        async (job: Job<VideoProcessingJobData>) => {
            console.log(`🎬 Processing video job: ${job.id}`);
            const supabase = createServiceClient();

            try {
                // Update job status
                await supabase
                    .from('jobs')
                    .update({
                        status: 'RENDERING',
                        current_step: 'Preparing video...',
                        progress_percentage: 10,
                    })
                    .eq('id', job.data.jobId);

                // Download video from Supabase
                job.updateProgress(20);
                const { data: videoData, error: downloadError } = await supabase.storage
                    .from('raw-videos')
                    .download(job.data.inputVideoPath);

                if (downloadError || !videoData) {
                    throw new Error(`Failed to download video: ${downloadError?.message}`);
                }

                // Send to Python worker
                job.updateProgress(30);
                const pythonWorkerUrl = process.env.PYTHON_WORKER_URL || 'http://localhost:8000';

                const formData = new FormData();
                formData.append('video', videoData, `${job.data.jobId}_input.mp4`);
                formData.append('editing_script', JSON.stringify(job.data.editingScript));

                const response = await fetch(`${pythonWorkerUrl}/process`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Python worker error: ${response.statusText}`);
                }

                // Upload processed video
                job.updateProgress(70);
                const processedVideo = await response.blob();
                const processedPath = `processed/${job.data.userId}/${job.data.jobId}_output.mp4`;

                const { error: uploadError } = await supabase.storage
                    .from('processed-videos')
                    .upload(processedPath, processedVideo, {
                        contentType: 'video/mp4',
                        upsert: true,
                    });

                if (uploadError) {
                    throw new Error(`Failed to upload processed video: ${uploadError.message}`);
                }

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('processed-videos')
                    .getPublicUrl(processedPath);

                // Update job as complete
                job.updateProgress(100);
                await supabase
                    .from('jobs')
                    .update({
                        status: 'COMPLETED',
                        output_video_path: processedPath,
                        output_video_url: urlData.publicUrl,
                        current_step: 'Completed',
                        progress_percentage: 100,
                        completed_at: new Date().toISOString(),
                    })
                    .eq('id', job.data.jobId);

                console.log(`✅ Video processing complete: ${job.data.jobId}`);
                return { success: true, outputUrl: urlData.publicUrl };

            } catch (error) {
                console.error(`❌ Video processing failed: ${job.data.jobId}`, error);

                // Update job as failed
                await supabase
                    .from('jobs')
                    .update({
                        status: 'FAILED',
                        current_step: 'Failed',
                        error_message: error instanceof Error ? error.message : 'Unknown error',
                    })
                    .eq('id', job.data.jobId);

                throw error;
            }
        },
        {
            connection,
            concurrency: 5, // Process 5 videos simultaneously
            limiter: {
                max: 10, // Max 10 jobs
                duration: 60000, // per minute
            },
        }
    );

    // Worker event handlers
    worker.on('completed', (job) => {
        console.log(`✅ Job completed: ${job.id}`);
    });

    worker.on('failed', (job, error) => {
        console.error(`❌ Job failed: ${job?.id}`, error.message);
    });

    worker.on('error', (error) => {
        console.error('Worker error:', error);
    });

    return worker;
}

// Graceful shutdown
export async function shutdownQueues() {
    console.log('🛑 Shutting down queues...');

    await Promise.all([
        videoProcessingQueue.close(),
        transcriptionQueue.close(),
        analysisQueue.close(),
        videoProcessingEvents.close(),
        transcriptionEvents.close(),
        analysisEvents.close(),
    ]);

    await connection.quit();
    console.log('✅ Queues shut down');
}

// Auto-cleanup on process exit
process.on('SIGTERM', shutdownQueues);
process.on('SIGINT', shutdownQueues);
