'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icons } from '@/lib/icons'
import { VideoThumbnail } from '@/components/jobs/VideoThumbnail'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Job {
    id: string
    job_name: string
    status: string
    progress_percentage: number
    current_step: string | null
    output_video_path: string | null
    created_at: string
    completed_at: string | null
}

interface CompletedJobsGridProps {
    jobs: Job[]
}

export function CompletedJobsGrid({ jobs: initialJobs }: CompletedJobsGridProps) {
    const [jobs, setJobs] = useState(initialJobs)
    const [videoUrls, setVideoUrls] = useState<Record<string, string | null>>({})
    const supabase = createClient()

    useEffect(() => {
        // Fetch video URLs for all completed jobs
        const fetchVideoUrls = async () => {
            const urls: Record<string, string | null> = {}
            
            await Promise.all(
                initialJobs.map(async (job) => {
                    if (!job.output_video_path) {
                        urls[job.id] = null
                        return
                    }

                    try {
                        const { data, error } = await supabase.storage
                            .from('final-videos')
                            .createSignedUrl(job.output_video_path, 3600)

                        if (error) throw error
                        urls[job.id] = data.signedUrl
                    } catch (error) {
                        console.error(`Error fetching video URL for job ${job.id}:`, error)
                        urls[job.id] = null
                    }
                })
            )

            setVideoUrls(urls)
        }

        if (initialJobs.length > 0) {
            fetchVideoUrls()
        }
    }, [initialJobs, supabase])

    if (jobs.length === 0) {
        return (
            <Card variant="glass" padding="lg" className="text-center py-16">
                <Icons.Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">
                    ยังไม่มีวิดีโอที่ตัดต่อเสร็จ
                </h2>
                <p className="text-slate-300 mb-6">
                    เมื่อคุณตัดต่อวิดีโอเสร็จแล้ว วิดีโอจะแสดงที่นี่
                </p>
                <Link href="/upload">
                    <Button variant="primary" icon={Icons.Upload}>
                        อัปโหลดวิดีโอใหม่
                    </Button>
                </Link>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
                <Card 
                    key={job.id} 
                    variant="glass" 
                    padding="none" 
                    hover
                    className="overflow-hidden group"
                >
                    <Link href={`/jobs/${job.id}`}>
                        <div className="relative aspect-video bg-slate-800 overflow-hidden">
                            {videoUrls[job.id] ? (
                                <VideoThumbnail src={videoUrls[job.id]!} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    {videoUrls[job.id] === undefined ? (
                                        <Icons.Spinner className="w-8 h-8 text-purple-500 animate-spin" />
                                    ) : (
                                        <Icons.Video className="w-12 h-12 text-slate-600" />
                                    )}
                                </div>
                            )}
                        </div>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-white line-clamp-2 flex-1">
                                    {job.job_name}
                                </h3>
                                <Badge variant="success" size="sm" dot>
                                    เสร็จสิ้น
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Icons.Calendar size={14} />
                                    {new Date(job.completed_at || job.created_at).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Icons.Clock size={14} />
                                    {new Date(job.completed_at || job.created_at).toLocaleTimeString('th-TH', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </CardContent>
                    </Link>
                </Card>
            ))}
        </div>
    )
}


