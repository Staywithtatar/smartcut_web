'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { X, Video, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface ActiveJob {
    id: string
    job_name: string
    status: string
    progress_percentage: number
    current_step: string | null
}

export function ActiveJobsPopup() {
    const [jobs, setJobs] = useState<ActiveJob[]>([])
    const [isVisible, setIsVisible] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<{ id: string } | null>(null)
    const supabase = createClient()
    const router = useRouter()

    // Get current user
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [supabase.auth])

    // Fetch active jobs
    useEffect(() => {
        if (!user) {
            setIsLoading(false)
            return
        }

        const fetchActiveJobs = async () => {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('id, job_name, status, progress_percentage, current_step')
                    .eq('user_id', user.id)
                    .not('status', 'in', '("COMPLETED","FAILED","CANCELLED")')
                    .order('created_at', { ascending: false })
                    .limit(3)

                if (error) throw error
                setJobs(data || [])
            } catch (error) {
                console.error('Error fetching active jobs:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchActiveJobs()

        // Subscribe to realtime updates
        const channel = supabase
            .channel('active-jobs')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'jobs',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        const updated = payload.new as ActiveJob
                        if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(updated.status)) {
                            // Remove completed/failed jobs from list
                            setJobs(prev => prev.filter(j => j.id !== updated.id))
                        } else {
                            // Update existing job
                            setJobs(prev => prev.map(j =>
                                j.id === updated.id ? updated : j
                            ))
                        }
                    } else if (payload.eventType === 'INSERT') {
                        const newJob = payload.new as ActiveJob
                        if (!['COMPLETED', 'FAILED', 'CANCELLED'].includes(newJob.status)) {
                            setJobs(prev => [newJob, ...prev].slice(0, 3))
                        }
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, supabase])

    // Don't show if no active jobs or user closed it
    if (!isVisible || isLoading || jobs.length === 0) {
        return null
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
            case 'QUEUED':
                return <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
            case 'TRANSCRIBING':
            case 'ANALYZING':
            case 'RENDERING':
                return <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            default:
                return <Video className="w-4 h-4 text-blue-400" />
        }
    }

    const getStatusText = (status: string) => {
        const map: Record<string, string> = {
            PENDING: 'รอดำเนินการ',
            QUEUED: 'อยู่ในคิว',
            TRANSCRIBING: 'กำลังถอดเสียง',
            ANALYZING: 'กำลังวิเคราะห์',
            RENDERING: 'กำลังตัดต่อ',
        }
        return map[status] || status
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-w-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-purple-400" />
                        <span className="font-semibold text-white text-sm">
                            งานที่กำลังประมวลผล
                        </span>
                        <span className="bg-purple-500/30 text-purple-200 text-xs px-2 py-0.5 rounded-full">
                            {jobs.length}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        aria-label="ปิด"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Jobs List */}
                <div className="divide-y divide-white/5">
                    {jobs.map((job) => (
                        <Link
                            key={job.id}
                            href={`/jobs/${job.id}`}
                            className="block px-4 py-3 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {getStatusIcon(job.status)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {job.job_name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {job.current_step || getStatusText(job.status)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-semibold text-purple-300">
                                        {job.progress_percentage}%
                                    </span>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                    style={{ width: `${job.progress_percentage}%` }}
                                />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-white/5 border-t border-white/5">
                    <Link
                        href="/upload"
                        className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
                    >
                        ดูงานทั้งหมด →
                    </Link>
                </div>
            </div>
        </div>
    )
}
