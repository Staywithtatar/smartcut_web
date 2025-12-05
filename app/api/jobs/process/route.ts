import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const maxDuration = 10 // Vercel Free: 10s timeout

export async function POST(request: NextRequest) {
    let jobId: string | null = null

    try {
        const body = await request.json()
        jobId = body.jobId

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
        }

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

        // Create signed URL (fast - no download)
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('raw-videos')
            .createSignedUrl(job.input_video_path, 3600)

        if (signedUrlError || !signedUrlData) {
            throw new Error(`Failed to create signed URL: ${signedUrlError?.message}`)
        }

        console.log(`🔗 Created signed URL for job ${jobId}`)

        // Update status
        await supabase
            .from('jobs')
            .update({
                status: 'QUEUED',
                current_step: 'กำลังเริ่มประมวลผล...',
                progress_percentage: 5,
            })
            .eq('id', jobId)

        // Dispatch to Python Worker (fire & forget)
        const pythonWorkerUrl = process.env.PYTHON_WORKER_URL || 'http://localhost:8000'
        const outputPath = `${job.user_id}/${jobId}/output.mp4`

        console.log(`🚀 Dispatching to: ${pythonWorkerUrl}/process-async`)

        // Fire and forget - don't await the full response
        fetch(`${pythonWorkerUrl}/process-async`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                job_id: jobId,
                video_url: signedUrlData.signedUrl,
                output_path: outputPath,
                user_id: job.user_id,
                // Pass API keys for Python to use
                groq_api_key: process.env.GROQ_API_KEY || '',
                google_api_key: process.env.GOOGLE_AI_API_KEY || '',
            }),
        }).catch(err => {
            console.error('Python dispatch error:', err)
        })

        // Return immediately
        return NextResponse.json({
            success: true,
            status: 'dispatched',
            jobId,
            message: 'Job dispatched to worker',
        })

    } catch (error: any) {
        console.error('❌ Process job error:', error)

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
            } catch { }
        }

        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
