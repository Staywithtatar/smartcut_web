import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { AIServiceManager } from '@/lib/ai/service-manager'

export const maxDuration = 10 // Vercel Free: 10s timeout

export async function POST(request: NextRequest) {
    const aiService = new AIServiceManager()
    let jobId: string | null = null

    try {
        const body = await request.json()
        jobId = body.jobId

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
        }

        // Check available AI services
        const availableServices = aiService.getAvailableServices()
        if (availableServices.length === 0) {
            return NextResponse.json(
                { error: 'No AI service configured. Please set GOOGLE_AI_API_KEY or GROQ_API_KEY' },
                { status: 500 }
            )
        }

        console.log(`🔑 Available AI services: ${availableServices.join(', ')}`)

        const supabase = createServiceClient()

        // Get job details
        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single()

        if (jobError || !job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        // ============================================================
        // STEP 1: Create signed URL (instead of downloading the video)
        // ============================================================
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('raw-videos')
            .createSignedUrl(job.input_video_path, 3600) // 1 hour validity

        if (signedUrlError || !signedUrlData) {
            throw new Error(`Failed to create signed URL: ${signedUrlError?.message}`)
        }

        console.log(`🔗 Created signed URL for video`)

        // Update status: Transcribing
        await supabase
            .from('jobs')
            .update({
                status: 'TRANSCRIBING',
                current_step: 'กำลังถอดเสียง...',
                progress_percentage: 5,
            })
            .eq('id', jobId)

        // ============================================================
        // STEP 2: Download video for transcription only (smaller chunk)
        // Note: We still need to download for Groq transcription
        // But this is fast and under 4.5MB usually works
        // ============================================================
        const { data: videoData, error: downloadError } = await supabase.storage
            .from('raw-videos')
            .download(job.input_video_path)

        if (downloadError || !videoData) {
            throw new Error(`Failed to download video: ${downloadError?.message}`)
        }

        const fileSizeMB = videoData.size / (1024 * 1024)
        console.log(`📥 Downloaded video for transcription: ${fileSizeMB.toFixed(2)}MB`)

        // ============================================================
        // STEP 3: Transcribe with AI
        // ============================================================
        const transcription = await aiService.transcribe(videoData)

        await supabase
            .from('jobs')
            .update({
                transcription_json: transcription,
                progress_percentage: 25,
                current_step: 'วิเคราะห์เนื้อหา...',
                status: 'ANALYZING',
            })
            .eq('id', jobId)

        // ============================================================
        // STEP 4: Analyze transcript with AI
        // ============================================================
        const analysis = await aiService.analyzeTranscript(transcription)

        if (analysis) {
            await supabase
                .from('jobs')
                .update({
                    analysis_json: analysis,
                })
                .eq('id', jobId)
        }

        // ============================================================
        // STEP 5: Dispatch to Python Worker (Fire & Forget)
        // Send signed URL instead of video file
        // ============================================================
        await supabase
            .from('jobs')
            .update({
                status: 'RENDERING',
                current_step: 'ส่งไปประมวลผล...',
                progress_percentage: 40,
            })
            .eq('id', jobId)

        const outputPath = `${job.user_id}/${jobId}/output.mp4`

        const editingScript = {
            job_id: jobId,

            // Metadata
            metadata: {
                contentType: 'vlog',
                topic: analysis?.summary || '',
                mood: 'casual',
                pacing: 'medium',
                targetAudience: 'general'
            },

            // Timeline operations
            timeline: {
                cuts: (analysis?.jumpCuts || [])
                    .filter((cut: any) => typeof cut.start === 'number' && typeof cut.end === 'number')
                    .map((cut: any) => ({
                        start: cut.start,
                        end: cut.end,
                        reason: cut.reason || 'AI detected',
                        type: 'silence'
                    })),
                highlights: (analysis?.highlights || [])
                    .filter((h: any) => typeof h.start === 'number' && typeof h.end === 'number')
                    .map((h: any) => ({
                        start: h.start,
                        end: h.end,
                        reason: h.reason || 'Key moment',
                        effects: {
                            zoom: {
                                intensity: 'medium',
                                easing: 'ease-in-out',
                                duration: 1.0
                            }
                        }
                    })),
                transitions: []
            },

            // Audio processing
            audio: {
                normalization: {
                    enabled: true,
                    targetLoudness: -16
                },
                segments: [],
                backgroundMusic: null
            },

            // Visual processing
            visual: {
                colorGrading: {
                    preset: analysis?.visual_style?.color_grading || 'vibrant'
                },
                aspectRatio: {
                    target: '9:16',
                    strategy: analysis?.visual_style?.apply_blur ? 'blur_background' : 'center_crop'
                }
            },

            // Subtitles
            subtitles: {
                segments: transcription.segments.map((seg: any) => ({
                    start: seg.start,
                    end: seg.end,
                    text: seg.text,
                })),
                style: {
                    font: 'Kanit ExtraBold',
                    size: 'auto',
                    position: analysis?.subtitle_settings?.position || 'bottom',
                    color: 'white',
                    backgroundColor: null,
                    outline: true
                },
                keywords: analysis?.keywords || []
            },

            // Recommendations
            recommendations: {
                targetDuration: null,
                suggestedThumbnailTimestamp: null,
                qualityScore: 75,
                improvementSuggestions: []
            }
        }

        // Send to Python Worker (async - don't wait for response)
        const pythonWorkerUrl = process.env.PYTHON_WORKER_URL || 'http://localhost:8000'

        console.log(`🚀 Dispatching to Python Worker: ${pythonWorkerUrl}/process-async`)

        const pythonResponse = await fetch(
            `${pythonWorkerUrl}/process-async`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job_id: jobId,
                    video_url: signedUrlData.signedUrl,
                    output_path: outputPath,
                    user_id: job.user_id,
                    editing_script: editingScript,
                }),
            }
        )

        if (!pythonResponse.ok) {
            const errorText = await pythonResponse.text()
            throw new Error(`Python worker failed: ${errorText}`)
        }

        const pythonResult = await pythonResponse.json()
        console.log(`✅ Python Worker accepted job: ${pythonResult.status}`)

        // Update status: Processing started
        await supabase
            .from('jobs')
            .update({
                status: 'RENDERING',
                current_step: 'กำลังตัดต่อวิดีโอ...',
                progress_percentage: 45,
            })
            .eq('id', jobId)

        // Return immediately - Python will update status when done
        return NextResponse.json({
            success: true,
            status: 'processing',
            jobId,
            message: 'Video processing started. Check job status for progress.',
            servicesUsed: availableServices,
        })

    } catch (error: any) {
        console.error('❌ Process job error:', error)

        // Update job status to FAILED
        if (jobId) {
            try {
                const supabase = createServiceClient()
                await supabase
                    .from('jobs')
                    .update({
                        status: 'FAILED',
                        error_message: error.message,
                        current_step: 'ล้มเหลว',
                    })
                    .eq('id', jobId)
            } catch (updateError) {
                console.error('Failed to update job status:', updateError)
            }
        }

        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
