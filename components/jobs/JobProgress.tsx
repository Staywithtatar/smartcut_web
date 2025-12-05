'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Icons } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { VideoPreview } from '@/components/VideoPreview'
import { useNotification } from '@/lib/hooks/useNotification'

interface Job {
    id: string
    job_name: string
    status: string
    progress_percentage: number
    current_step: string | null
    error_message: string | null
    output_video_path: string | null
    created_at: string
    completed_at: string | null
}

export default function JobProgress({ jobId }: { jobId: string }) {
    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const supabase = createClient()
    const router = useRouter()
    const { notify, requestPermission, permission } = useNotification()
    const hasNotified = useRef(false)

    // Request notification permission on mount
    useEffect(() => {
        if (permission === 'default') {
            requestPermission()
        }
    }, [permission, requestPermission])

    useEffect(() => {
        fetchJob()

        // Subscribe to realtime updates
        const channel = supabase
            .channel(`job-${jobId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'jobs',
                    filter: `id=eq.${jobId}`,
                },
                (payload) => {
                    const updatedJob = payload.new as Job
                    setJob(updatedJob)

                    // Send notification when completed (only once)
                    if (updatedJob.status === 'COMPLETED' && !hasNotified.current) {
                        hasNotified.current = true
                        notify('🎉 วิดีโอตัดต่อเสร็จแล้ว!', {
                            body: `${updatedJob.job_name} พร้อมดาวน์โหลดแล้ว`,
                            tag: `job-${jobId}`,
                        })
                        fetchVideoUrl(updatedJob.output_video_path!)
                    }

                    // Notify on failure
                    if (updatedJob.status === 'FAILED' && !hasNotified.current) {
                        hasNotified.current = true
                        notify('❌ เกิดข้อผิดพลาด', {
                            body: updatedJob.error_message || 'ไม่สามารถประมวลผลวิดีโอได้',
                            tag: `job-${jobId}`,
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [jobId])

    const fetchJob = async () => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', jobId)
                .single()

            if (error) throw error
            setJob(data)

            // Fetch video URL if completed
            if (data.status === 'COMPLETED' && data.output_video_path) {
                await fetchVideoUrl(data.output_video_path)
            }
        } catch (error) {
            console.error('Error fetching job:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchVideoUrl = async (path: string) => {
        try {
            const { data, error } = await supabase.storage
                .from('final-videos')
                .createSignedUrl(path, 3600) // 1 hour

            if (error) throw error
            setVideoUrl(data.signedUrl)
        } catch (error) {
            console.error('Error fetching video URL:', error)
        }
    }

    const downloadVideo = async () => {
        if (!job?.output_video_path) return

        try {
            const { data, error } = await supabase.storage
                .from('final-videos')
                .createSignedUrl(job.output_video_path, 3600)

            if (error) throw error

            const link = document.createElement('a')
            link.href = data.signedUrl
            link.download = job.job_name.replace(/\.[^/.]+$/, '_edited.mp4')
            link.click()
        } catch (error) {
            console.error('Download error:', error)
            alert('ไม่สามารถดาวน์โหลดวิดีโอได้')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Icons.Spinner className="w-12 h-12 animate-spin text-purple-500" />
            </div>
        )
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
                <Card variant="glass" padding="lg" className="max-w-md">
                    <div className="text-center">
                        <Icons.Error className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">
                            ไม่พบงาน
                        </h2>
                        <p className="text-slate-300 mb-6">
                            ไม่พบงานที่คุณกำลังค้นหา
                        </p>
                        <Button
                            onClick={() => router.push('/upload')}
                            variant="primary"
                            icon={Icons.Home}
                        >
                            กลับไปหน้าแรก
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    const getStatusBadgeVariant = (): 'success' | 'error' | 'warning' | 'info' | 'purple' => {
        switch (job.status) {
            case 'COMPLETED':
                return 'success'
            case 'FAILED':
                return 'error'
            case 'PENDING':
            case 'UPLOADING':
                return 'warning'
            default:
                return 'purple'
        }
    }

    const getStatusText = () => {
        const statusMap: Record<string, string> = {
            PENDING: 'รอดำเนินการ',
            UPLOADING: 'กำลังอัปโหลด',
            QUEUED: 'อยู่ในคิว',
            TRANSCRIBING: 'กำลังถอดเสียง',
            ANALYZING: 'กำลังวิเคราะห์',
            RENDERING: 'กำลังตัดต่อ',
            COMPLETED: 'เสร็จสิ้น',
            FAILED: 'ล้มเหลว',
            CANCELLED: 'ยกเลิก',
        }
        return statusMap[job.status] || job.status
    }

    const processingSteps = [
        { step: 'UPLOADING', label: 'อัปโหลดวิดีโอ', icon: Icons.Upload },
        { step: 'TRANSCRIBING', label: 'ถอดเสียงด้วย AI', icon: Icons.Mic },
        { step: 'ANALYZING', label: 'วิเคราะห์เนื้อหา', icon: Icons.Activity },
        { step: 'RENDERING', label: 'ตัดต่อวิดีโอ', icon: Icons.Video },
        { step: 'COMPLETED', label: 'เสร็จสิ้น', icon: Icons.Success },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
            <div className="max-w-6xl mx-auto p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column: Job Info & Progress */}
                    <div className="space-y-6">
                        {/* Header Card */}
                        <Card variant="glass" padding="lg">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-white">{job.job_name}</CardTitle>
                                        <p className="text-sm text-slate-300 mt-2 flex items-center gap-2">
                                            <Icons.Clock size={14} />
                                            สร้างเมื่อ: {new Date(job.created_at).toLocaleString('th-TH')}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={getStatusBadgeVariant()}
                                        size="lg"
                                        dot
                                    >
                                        {getStatusText()}
                                    </Badge>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Progress Card */}
                        {job.status !== 'COMPLETED' && job.status !== 'FAILED' && (
                            <Card variant="glass" padding="lg">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-slate-200 flex items-center gap-2">
                                            <Icons.Activity size={16} className="animate-pulse" />
                                            {job.current_step || 'กำลังประมวลผล...'}
                                        </span>
                                        <span className="text-sm font-medium text-purple-300">
                                            {job.progress_percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${job.progress_percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Completed State */}
                        {job.status === 'COMPLETED' && job.output_video_path && (
                            <Card variant="gradient" padding="lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <Icons.Success className="w-6 h-6 text-green-400" />
                                    <h3 className="text-lg font-semibold text-white">
                                        วิดีโอตัดต่อเสร็จแล้ว!
                                    </h3>
                                </div>
                                <p className="text-purple-100 mb-6">
                                    วิดีโอของคุณพร้อมแล้ว คุณสามารถดาวน์โหลดได้เลย
                                </p>
                                <Button
                                    onClick={downloadVideo}
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    icon={Icons.Download}
                                >
                                    ดาวน์โหลดวิดีโอ
                                </Button>
                            </Card>
                        )}

                        {/* Failed State */}
                        {job.status === 'FAILED' && (
                            <Card variant="glass" padding="lg" className="border-red-500/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <Icons.Error className="w-6 h-6 text-red-400" />
                                    <h3 className="text-lg font-semibold text-white">
                                        เกิดข้อผิดพลาด
                                    </h3>
                                </div>
                                <p className="text-red-200 mb-6">
                                    {job.error_message || 'ไม่สามารถประมวลผลวิดีโอได้'}
                                </p>
                                <Button
                                    onClick={() => router.push('/upload')}
                                    variant="danger"
                                    icon={Icons.Refresh}
                                >
                                    ลองอีกครั้ง
                                </Button>
                            </Card>
                        )}

                        {/* Processing Steps */}
                        <Card variant="glass" padding="lg">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Icons.BarChart size={18} />
                                ขั้นตอนการประมวลผล
                            </h3>
                            <div className="space-y-3">
                                {processingSteps.map((item, index) => {
                                    const isActive = job.status === item.step
                                    const isDone = ['COMPLETED'].includes(job.status) ||
                                        (job.progress_percentage > (index * 25))
                                    const Icon = item.icon

                                    return (
                                        <div
                                            key={item.step}
                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isActive
                                                ? 'bg-purple-500/10 border-purple-500/30'
                                                : isDone
                                                    ? 'bg-green-500/10 border-green-500/30'
                                                    : 'bg-slate-800/50 border-slate-700'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-purple-300' : isDone ? 'text-green-300' : 'text-slate-500'
                                                }`} />
                                            <span className={`font-medium flex-1 ${isActive ? 'text-purple-200' : isDone ? 'text-green-200' : 'text-slate-400'
                                                }`}>
                                                {item.label}
                                            </span>
                                            {isActive && (
                                                <Icons.Spinner className="w-5 h-5 text-purple-400 animate-spin" />
                                            )}
                                            {isDone && !isActive && (
                                                <Icons.Success className="w-5 h-5 text-green-400" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Video Preview */}
                    <div className="space-y-6">
                        <Card variant="glass" padding="lg">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Icons.Video size={18} />
                                ตัวอย่างวิดีโอ
                            </h3>
                            {videoUrl ? (
                                <VideoPreview
                                    src={videoUrl}
                                    className="w-full aspect-video"
                                />
                            ) : (
                                <div className="w-full aspect-video bg-slate-800 rounded-xl flex items-center justify-center">
                                    {job.status === 'COMPLETED' ? (
                                        <div className="text-center">
                                            <Icons.Spinner className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                                            <p className="text-slate-300">กำลังโหลดวิดีโอ...</p>
                                        </div>
                                    ) : (
                                        <div className="text-center p-8">
                                            <Icons.Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                            <p className="text-slate-300">
                                                วิดีโอจะแสดงเมื่อการประมวลผลเสร็จสิ้น
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
