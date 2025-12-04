'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Video, CheckCircle2, Loader2, Clock } from 'lucide-react'

const PROCESSING_STEPS = [
    { id: 1, name: 'อัปโหลดวิดีโอ', status: 'completed' },
    { id: 2, name: 'วิเคราะห์เนื้อหา', status: 'processing' },
    { id: 3, name: 'ตัดต่ออัตโนมัติ', status: 'pending' },
    { id: 4, name: 'ส่งออกวิดีโอ', status: 'pending' },
]

function ProcessingContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const jobId = searchParams.get('jobId') || 'demo'

    const [progress, setProgress] = useState(0)
    const [currentStep, setCurrentStep] = useState(2)
    const [statusMessage, setStatusMessage] = useState('กำลังวิเคราะห์วิดีโอ...')
    const [estimatedTime, setEstimatedTime] = useState('~3 นาที')

    // Simulate progress
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(() => {
                        router.push('/jobs')
                    }, 1000)
                    return 100
                }

                const newProgress = prev + Math.random() * 3

                if (newProgress >= 25 && currentStep === 2) {
                    setCurrentStep(3)
                    setStatusMessage('กำลังตัดต่ออัตโนมัติ...')
                    setEstimatedTime('~2 นาที')
                } else if (newProgress >= 75 && currentStep === 3) {
                    setCurrentStep(4)
                    setStatusMessage('กำลังส่งออกวิดีโอ...')
                    setEstimatedTime('~1 นาที')
                }

                return Math.min(newProgress, 100)
            })
        }, 500)

        return () => clearInterval(interval)
    }, [currentStep, router])

    const getStepStatus = (stepId: number) => {
        if (stepId < currentStep) return 'completed'
        if (stepId === currentStep) return 'processing'
        return 'pending'
    }

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
            {/* Background Glow Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(60,100,255)] rounded-full blur-[120px] opacity-20 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(200,50,255)] rounded-full blur-[120px] opacity-20 animate-pulse" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-2xl flex items-center justify-center mx-auto mb-6 glow-blue animate-pulse">
                        <Video className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        กำลังตัดต่อวิดีโอ
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {statusMessage}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="glass-strong rounded-2xl p-8 mb-8 border border-white/10">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-400">ความคืบหน้า</span>
                            <span className="text-2xl font-bold text-gradient-electric">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] transition-all duration-500 glow-blue-soft"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>เหลืออีกประมาณ {estimatedTime}</span>
                    </div>
                </div>

                {/* Steps */}
                <div className="glass-strong rounded-2xl p-8 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-6">ขั้นตอนการประมวลผล</h3>
                    <div className="space-y-4">
                        {PROCESSING_STEPS.map((step) => {
                            const status = getStepStatus(step.id)
                            return (
                                <div
                                    key={step.id}
                                    className="flex items-center gap-4"
                                >
                                    {/* Icon */}
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                                        ${status === 'completed' ? 'bg-green-500/20 text-green-500' : ''}
                                        ${status === 'processing' ? 'bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] text-white glow-blue-soft' : ''}
                                        ${status === 'pending' ? 'bg-white/5 text-gray-500' : ''}
                                    `}>
                                        {status === 'completed' && <CheckCircle2 className="w-5 h-5" />}
                                        {status === 'processing' && <Loader2 className="w-5 h-5 animate-spin" />}
                                        {status === 'pending' && <Clock className="w-5 h-5" />}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1">
                                        <p className={`
                                            font-medium transition-colors
                                            ${status === 'completed' ? 'text-green-500' : ''}
                                            ${status === 'processing' ? 'text-white' : ''}
                                            ${status === 'pending' ? 'text-gray-500' : ''}
                                        `}>
                                            {step.name}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    {status === 'completed' && (
                                        <span className="text-sm text-green-500">เสร็จสิ้น</span>
                                    )}
                                    {status === 'processing' && (
                                        <span className="text-sm text-[rgb(0,255,180)]">กำลังดำเนินการ...</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Info */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    กรุณาอย่าปิดหน้าต่างนี้ในขณะที่กำลังประมวลผล
                </p>
            </div>
        </div>
    )
}

export default function ProcessingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-mesh flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[rgb(60,100,255)] animate-spin" />
            </div>
        }>
            <ProcessingContent />
        </Suspense>
    )
}
