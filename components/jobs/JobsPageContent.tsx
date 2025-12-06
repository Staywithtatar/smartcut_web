'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icons } from '@/lib/icons'
import { VideoThumbnail } from '@/components/jobs/VideoThumbnail'
import { ActiveJobsList } from '@/components/jobs/ActiveJobsList'
import { CompletedJobsGrid } from '@/components/jobs/CompletedJobsGrid'

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

interface JobsPageContentProps {
    activeJobs: Job[]
    completedJobs: Job[]
}

type TabType = 'active' | 'completed'

export function JobsPageContent({ activeJobs, completedJobs }: JobsPageContentProps) {
    const [activeTab, setActiveTab] = useState<TabType>('active')

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/">
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={Icons.ChevronLeft}
                            className="text-gray-300 hover:text-white hover:bg-white/5"
                        >
                            ย้อนกลับ
                        </Button>
                    </Link>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <Icons.Video size={32} />
                    งานของฉัน
                </h1>
                <p className="text-slate-300">
                    จัดการวิดีโอทั้งหมดของคุณ
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex gap-2 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-6 py-3 font-medium transition-colors relative ${
                            activeTab === 'active'
                                ? 'text-white'
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        กำลังประมวลผล
                        {activeJobs.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-500/30 text-purple-200">
                                {activeJobs.length}
                            </span>
                        )}
                        {activeTab === 'active' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-6 py-3 font-medium transition-colors relative ${
                            activeTab === 'completed'
                                ? 'text-white'
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        เสร็จแล้ว
                        {completedJobs.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500/30 text-green-200">
                                {completedJobs.length}
                            </span>
                        )}
                        {activeTab === 'completed' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'active' ? (
                <ActiveJobsList jobs={activeJobs} />
            ) : (
                <CompletedJobsGrid jobs={completedJobs} />
            )}
        </div>
    )
}


