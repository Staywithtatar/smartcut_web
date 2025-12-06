'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icons } from '@/lib/icons'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

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

interface ActiveJobsListProps {
    jobs: Job[]
}

export function ActiveJobsList({ jobs: initialJobs }: ActiveJobsListProps) {
    const [jobs, setJobs] = useState(initialJobs)
    const supabase = createClient()

    useEffect(() => {
        if (initialJobs.length === 0) return

        // Subscribe to realtime updates
        const channel = supabase
            .channel('active-jobs-list')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'jobs',
                    filter: `id=in.(${initialJobs.map(j => j.id).join(',')})`,
                },
                (payload) => {
                    const updated = payload.new as Job
                    setJobs(prev => prev.map(j => 
                        j.id === updated.id ? updated : j
                    ))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [initialJobs, supabase])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
            case 'UPLOADING':
            case 'QUEUED':
                return <Icons.Spinner className="w-5 h-5 animate-spin text-yellow-400" />
            case 'TRANSCRIBING':
            case 'ANALYZING':
            case 'RENDERING':
                return <Icons.Spinner className="w-5 h-5 animate-spin text-purple-400" />
            default:
                return <Icons.Video className="w-5 h-5 text-blue-400" />
        }
    }

    const getStatusText = (status: string) => {
        const map: Record<string, string> = {
            PENDING: 'รอดำเนินการ',
            UPLOADING: 'กำลังอัปโหลด',
            QUEUED: 'อยู่ในคิว',
            TRANSCRIBING: 'กำลังถอดเสียง',
            ANALYZING: 'กำลังวิเคราะห์',
            RENDERING: 'กำลังตัดต่อ',
        }
        return map[status] || status
    }

    const getStatusBadgeVariant = (status: string): 'warning' | 'purple' | 'info' => {
        switch (status) {
            case 'PENDING':
            case 'UPLOADING':
                return 'warning'
            case 'TRANSCRIBING':
            case 'ANALYZING':
            case 'RENDERING':
                return 'purple'
            default:
                return 'info'
        }
    }

    if (jobs.length === 0) {
        return (
            <Card variant="glass" padding="lg" className="text-center py-16">
                <Icons.Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">
                    ไม่มีงานที่กำลังประมวลผล
                </h2>
                <p className="text-slate-300 mb-6">
                    งานที่กำลังประมวลผลจะแสดงที่นี่
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
        <div className="space-y-4">
            {jobs.map((job) => (
                <Card key={job.id} variant="glass" padding="lg" hover>
                    <Link href={`/jobs/${job.id}`}>
                        <div className="flex items-center gap-4">
                            {/* Status Icon */}
                            <div className="flex-shrink-0">
                                {getStatusIcon(job.status)}
                            </div>

                            {/* Job Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-white truncate mb-1">
                                            {job.job_name}
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            {job.current_step || getStatusText(job.status)}
                                        </p>
                                    </div>
                                    <Badge variant={getStatusBadgeVariant(job.status)} size="sm" dot>
                                        {getStatusText(job.status)}
                                    </Badge>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-400">ความคืบหน้า</span>
                                        <span className="text-sm font-semibold text-purple-300">
                                            {job.progress_percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                            style={{ width: `${job.progress_percentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Created Date */}
                                <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Icons.Calendar size={12} />
                                        {new Date(job.created_at).toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Icons.Clock size={12} />
                                        {new Date(job.created_at).toLocaleTimeString('th-TH', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </Card>
            ))}
        </div>
    )
}


