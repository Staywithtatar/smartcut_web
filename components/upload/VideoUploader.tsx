'use client'

import { useState, Fragment, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, X, Sparkles, Video, Zap, Settings, Play } from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import { EditingPreferences, PresetName, PRESETS, PRESET_LABELS, DEFAULT_PREFERENCES } from '@/lib/types/editing-preferences'
import { Button } from '@/components/ui/Button'
import { Icons } from '@/lib/icons'
import { VideoPreview } from '@/components/VideoPreview'
import { Navigation } from '@/components/home/Navigation'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'

type UploadStep = 'select' | 'uploading'

const PRESET_ICONS: Record<PresetName, any> = {
    'energetic-vlog': Icons.Zap,
    'calm-tutorial': Icons.BookOpen,
    'dynamic-review': Icons.Video,
    'minimal-clean': Icons.Sparkles,
    'cinematic': Icons.Video,
    'social-media': Icons.Smartphone,
}

export default function VideoUploader() {
    const [step, setStep] = useState<UploadStep>('select')
    const [file, setFile] = useState<File | null>(null)
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
    const [showPreferences, setShowPreferences] = useState(false)
    const [preferences, setPreferences] = useState<EditingPreferences>(DEFAULT_PREFERENCES)
    const [uploading, setUploading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    // Fetch authenticated user on mount
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
            } else {
                router.push('/login?redirectTo=/upload')
            }
        }
        fetchUser()
    }, [router, supabase.auth])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            await processFile(selectedFile)
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile) {
            await processFile(droppedFile)
        }
    }

    const processFile = async (selectedFile: File) => {
        if (!selectedFile.type.startsWith('video/')) {
            setError('กรุณาเลือกไฟล์วิดีโอเท่านั้น')
            return
        }

        if (selectedFile.size > 50 * 1024 * 1024) {
            setError('ไฟล์ใหญ่เกิน 50MB')
            return
        }

        setFile(selectedFile)
        setError(null)

        const previewUrl = URL.createObjectURL(selectedFile)
        setVideoPreviewUrl(previewUrl)

        await uploadVideo(selectedFile)
    }

    const uploadVideo = async (videoFile: File) => {
        if (!userId) {
            setError('กรุณาเข้าสู่ระบบก่อนอัปโหลด')
            router.push('/login?redirectTo=/upload')
            return
        }

        setStep('uploading')
        setUploading(true)

        try {
            setProgress(10)

            setProgress(30)

            const { data: job, error: jobError } = await supabase
                .from('jobs')
                .insert({
                    job_name: videoFile.name,
                    status: 'UPLOADING',
                    input_file_size_mb: videoFile.size / (1024 * 1024),
                    user_id: userId,
                })
                .select()
                .single()

            if (jobError) {
                console.error('Job creation error:', jobError)
                throw new Error(`ข้อผิดพลาดฐานข้อมูล: ${jobError.message}`)
            }

            setProgress(50)

            const filePath = `${userId}/${job.id}/${videoFile.name}`

            const { error: uploadError } = await supabase.storage
                .from('raw-videos')
                .upload(filePath, videoFile, {
                    cacheControl: '3600',
                    upsert: false,
                })

            if (uploadError) {
                console.error('Storage upload error:', uploadError)
                throw new Error(`ข้อผิดพลาดการอัปโหลด: ${uploadError.message}`)
            }

            setProgress(80)

            const { error: updateError } = await supabase
                .from('jobs')
                .update({
                    input_video_path: filePath,
                    status: 'PENDING',
                })
                .eq('id', job.id)

            if (updateError) {
                console.error('Job update error:', updateError)
                throw new Error(`ข้อผิดพลาดการอัปเดต: ${updateError.message}`)
            }

            setProgress(100)

            setStep('select')
            setUploading(false)
            setShowPreferences(true)

        } catch (err: any) {
            console.error('Upload error:', err)
            setError(err.message || 'เกิดข้อผิดพลาดในการอัปโหลด')
            setStep('select')
            setUploading(false)
        }
    }

    const handleStartEditing = async () => {
        if (!file || !userId) return

        setShowPreferences(false)
        setProcessing(true)

        try {
            const { data: jobs } = await supabase
                .from('jobs')
                .select('id')
                .eq('job_name', file.name)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)

            if (!jobs || jobs.length === 0) {
                throw new Error('ไม่พบงานที่อัปโหลด')
            }

            const jobId = jobs[0].id

            await supabase
                .from('jobs')
                .update({ preferences_json: preferences })
                .eq('id', jobId)

            const response = await fetch('/api/jobs/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId }),
            })

            if (!response.ok) {
                throw new Error('ไม่สามารถเริ่มประมวลผลได้')
            }

            router.push(`/jobs/${jobId}`)
        } catch (err: any) {
            console.error('Processing error:', err)
            setError(err.message || 'เกิดข้อผิดพลาดในการประมวลผล')
            setProcessing(false)
        }
    }

    const applyPreset = (presetName: PresetName) => {
        const preset = PRESETS[presetName]
        setPreferences(prev => ({
            ...prev,
            ...preset,
            preset: presetName
        }))
    }

    const updateVisualEffect = (key: keyof EditingPreferences['visualEffects'], value: boolean) => {
        setPreferences(prev => ({
            ...prev,
            visualEffects: { ...prev.visualEffects, [key]: value }
        }))
    }

    const updateEditingStyle = (
        key: keyof EditingPreferences['editingStyle'],
        value: boolean | 'fast' | 'medium' | 'slow'
    ) => {
        setPreferences(prev => ({
            ...prev,
            editingStyle: { ...prev.editingStyle, [key]: value }
        }))
    }

    const updateOutput = (
        key: keyof EditingPreferences['output'],
        value: string
    ) => {
        setPreferences(prev => ({
            ...prev,
            output: { ...prev.output, [key]: value }
        }))
    }

    // Processing State
    if (processing) {
        return (
            <div className="min-h-screen bg-mesh">
                <Navigation />
                <div className="flex items-center justify-center min-h-screen pt-16">
                    <ParallaxFloating depth={0.3}>
                        <div className="glass-strong p-12 rounded-3xl border border-white/10 glow-purple max-w-lg text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-2xl flex items-center justify-center mx-auto mb-6 glow-blue animate-pulse">
                                <Loader2 className="w-10 h-10 text-white animate-spin" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3">กำลังเริ่มตัดต่อ...</h2>
                            <p className="text-gray-400">กรุณารอสักครู่ กำลังนำคุณไปยังหน้าประมวลผล</p>
                        </div>
                    </ParallaxFloating>
                </div>
            </div>
        )
    }

    // Uploading State
    if (step === 'uploading') {
        return (
            <div className="min-h-screen bg-mesh">
                <Navigation />
                <div className="flex items-center justify-center min-h-screen pt-16">
                    <ParallaxFloating depth={0.3}>
                        <div className="glass-strong p-12 rounded-3xl border border-white/10 glow-blue max-w-lg">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-2xl flex items-center justify-center mx-auto mb-6 glow-blue">
                                    <Upload className="w-10 h-10 text-white animate-bounce" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">กำลังอัปโหลด...</h2>
                                <p className="text-gray-400">กรุณารอสักครู่</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-300">ความคืบหน้า</span>
                                    <span className="text-sm font-bold text-[rgb(0,255,180)]">{progress}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] h-3 rounded-full transition-all duration-500 ease-out glow-blue"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                    <p className="text-sm text-red-300">{error}</p>
                                </div>
                            )}
                        </div>
                    </ParallaxFloating>
                </div>
            </div>
        )
    }

    // Main Upload UI
    return (
        <>
            <div className="min-h-screen bg-mesh">
                <Navigation />

                {/* Background Orbs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(60,100,255)] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-mesh"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[rgb(200,50,255)] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-mesh animation-delay-2000"></div>
                </div>

                <div className="relative pt-32 pb-20 px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <ParallaxFloating depth={0.2}>
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 glow-blue-soft">
                                    <Sparkles className="w-4 h-4 text-[rgb(0,255,180)]" />
                                    <span className="text-sm font-medium text-gray-200">AI ตัดต่อวิดีโออัตโนมัติ</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    อัปโหลด<span className="text-gradient-electric"> วิดีโอ</span>
                                </h1>
                                <p className="text-lg text-gray-400 max-w-xl mx-auto">
                                    เลือกวิดีโอที่ต้องการตัดต่อ AI จะจัดการทุกอย่างให้คุณ
                                </p>
                            </div>
                        </ParallaxFloating>

                        {/* Upload Card */}
                        <ParallaxFloating depth={0.3}>
                            <div className="glass-strong p-8 rounded-3xl border border-white/10 hover:border-[rgb(60,100,255)]/50 transition-all duration-300">
                                {/* Drop Zone */}
                                <label
                                    htmlFor="video-upload"
                                    className="block w-full cursor-pointer"
                                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                                    onDragLeave={() => setIsDragOver(false)}
                                    onDrop={handleDrop}
                                >
                                    <div className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${isDragOver
                                            ? 'border-[rgb(0,255,180)] bg-[rgb(0,255,180)]/5 glow-mint'
                                            : 'border-white/20 hover:border-[rgb(60,100,255)] hover:bg-[rgb(60,100,255)]/5'
                                        }`}>
                                        {file ? (
                                            <div className="space-y-4">
                                                <div className="w-20 h-20 bg-gradient-to-br from-[rgb(0,255,180)] to-[rgb(60,100,255)] rounded-2xl flex items-center justify-center mx-auto glow-mint">
                                                    <Video className="w-10 h-10 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-xl font-bold text-white mb-1">{file.name}</p>
                                                    <p className="text-sm text-[rgb(0,255,180)]">
                                                        ขนาด: {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className={`w-20 h-20 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-2xl flex items-center justify-center mx-auto transition-all ${isDragOver ? 'scale-110 glow-blue' : 'glow-blue-soft'
                                                    }`}>
                                                    <Upload className="w-10 h-10 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-xl font-bold text-white mb-2">
                                                        {isDragOver ? 'วางวิดีโอที่นี่!' : 'ลากวิดีโอมาวางที่นี่'}
                                                    </p>
                                                    <p className="text-gray-400 mb-4">หรือคลิกเพื่อเลือกไฟล์</p>
                                                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Video className="w-4 h-4" /> MP4, MOV, AVI
                                                        </span>
                                                        <span>•</span>
                                                        <span>สูงสุด 50MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="video-upload"
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>

                                {/* Error Message */}
                                {error && (
                                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                        <p className="text-sm text-red-300 flex items-center gap-2">
                                            <X className="w-4 h-4" />
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {/* Tips */}
                                <div className="mt-6 p-4 glass rounded-xl">
                                    <p className="text-sm text-gray-300 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-[rgb(0,255,180)]" />
                                        <span><strong className="text-[rgb(0,255,180)]">เคล็ดลับ:</strong> วิดีโอที่มีเสียงพูดชัดเจนจะได้ซับไตเติ้ลที่แม่นยำที่สุด</span>
                                    </p>
                                </div>
                            </div>
                        </ParallaxFloating>

                        {/* Features */}
                        <div className="grid md:grid-cols-3 gap-6 mt-12">
                            {[
                                { icon: Icons.Sparkles, title: 'ซับไตเติ้ลอัตโนมัติ', desc: 'AI ถอดเสียงและใส่ซับให้' },
                                { icon: Icons.Scissors, title: 'ตัดช่วงเงียบ', desc: 'ตัดส่วนที่ไม่จำเป็นออก' },
                                { icon: Icons.Palette, title: 'ปรับอัตราส่วน 9:16', desc: 'พร้อมโพสต์ TikTok, Reels' },
                            ].map((feature, idx) => (
                                <ParallaxFloating key={idx} depth={0.1 + idx * 0.05}>
                                    <div className="glass p-6 rounded-2xl border border-white/10 hover:border-[rgb(60,100,255)] hover-glow-blue transition-all group">
                                        <feature.icon className="w-8 h-8 text-[rgb(60,100,255)] mb-4 group-hover:text-[rgb(0,255,180)] transition-colors" />
                                        <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                                    </div>
                                </ParallaxFloating>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences Modal */}
            <Transition appear show={showPreferences} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowPreferences(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-3xl glass-strong border border-white/10 transition-all">
                                    <div className="grid md:grid-cols-2 gap-0">
                                        {/* Left: Preferences Form */}
                                        <div className="p-8 overflow-y-auto max-h-[90vh] bg-gradient-to-br from-[rgb(10,10,20)] to-[rgb(20,20,35)]">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                                        <Settings className="w-6 h-6 text-[rgb(60,100,255)]" />
                                                        ปรับแต่งการตัดต่อ
                                                    </h2>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {file?.name} • {(file?.size! / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setShowPreferences(false)}
                                                    className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                                                >
                                                    <X className="w-5 h-5 text-gray-400" />
                                                </button>
                                            </div>

                                            {/* Custom Prompt */}
                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                                    <Icons.MessageSquare size={16} className="text-[rgb(0,255,180)]" />
                                                    บอก AI ว่าต้องการให้ตัดต่ออย่างไร
                                                </label>
                                                <textarea
                                                    value={preferences.customPrompt || ''}
                                                    onChange={e => setPreferences(prev => ({ ...prev, customPrompt: e.target.value }))}
                                                    placeholder="เช่น: ตัดให้เป็น vlog สนุกๆ ตัดช่วงเงียบออก ใส่ซับไตเติ้ลสีสดใส..."
                                                    rows={3}
                                                    className="w-full p-4 glass border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-[rgb(60,100,255)] focus:border-transparent resize-none placeholder-gray-500 bg-transparent"
                                                />
                                            </div>

                                            {/* Presets */}
                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                                    <Icons.Palette size={16} className="text-[rgb(200,50,255)]" />
                                                    สไตล์ที่ต้องการ
                                                </label>
                                                <div className="flex gap-2 flex-wrap">
                                                    {(Object.keys(PRESETS) as PresetName[]).slice(0, 4).map(presetKey => {
                                                        const preset = PRESET_LABELS[presetKey]
                                                        const Icon = PRESET_ICONS[presetKey]
                                                        const isActive = preferences.preset === presetKey
                                                        return (
                                                            <button
                                                                key={presetKey}
                                                                onClick={() => applyPreset(presetKey)}
                                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isActive
                                                                    ? 'bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] text-white glow-blue'
                                                                    : 'glass border border-white/10 text-gray-200 hover:border-[rgb(60,100,255)]'
                                                                    }`}
                                                            >
                                                                <Icon size={16} />
                                                                {preset.name}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Size */}
                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-white mb-3">ขนาดวิดีโอ</label>
                                                <select
                                                    value={preferences.output.aspectRatio}
                                                    onChange={e => updateOutput('aspectRatio', e.target.value)}
                                                    className="w-full p-4 glass border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[rgb(60,100,255)] bg-transparent"
                                                >
                                                    <option value="9:16" className="bg-[rgb(20,20,35)]">แนวตั้ง (9:16) - TikTok, Reels</option>
                                                    <option value="16:9" className="bg-[rgb(20,20,35)]">แนวนอน (16:9) - YouTube</option>
                                                    <option value="1:1" className="bg-[rgb(20,20,35)]">สี่เหลี่ยมจัตุรัส (1:1) - Instagram</option>
                                                </select>
                                            </div>

                                            {/* Visual Effects */}
                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                                    <Icons.Sparkles size={16} className="text-[rgb(0,255,180)]" />
                                                    เอฟเฟกต์ภาพ
                                                </label>
                                                <div className="space-y-3">
                                                    <Checkbox
                                                        checked={preferences.visualEffects.subtitles}
                                                        onChange={v => updateVisualEffect('subtitles', v)}
                                                        label="ซับไตเติ้ล"
                                                    />
                                                    <Checkbox
                                                        checked={preferences.visualEffects.colorGrading}
                                                        onChange={v => updateVisualEffect('colorGrading', v)}
                                                        label="ปรับสีวิดีโอ"
                                                    />
                                                    <Checkbox
                                                        checked={preferences.visualEffects.zoomEffects}
                                                        onChange={v => updateVisualEffect('zoomEffects', v)}
                                                        label="ซูมเข้าออกอัตโนมัติ"
                                                    />
                                                </div>
                                            </div>

                                            {/* Editing Style */}
                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                                    <Icons.Scissors size={16} className="text-[rgb(200,50,255)]" />
                                                    รูปแบบการตัดต่อ
                                                </label>
                                                <div className="space-y-3">
                                                    <Checkbox
                                                        checked={preferences.editingStyle.autoCutSilence}
                                                        onChange={v => updateEditingStyle('autoCutSilence', v)}
                                                        label="ตัดช่วงเงียบออกอัตโนมัติ"
                                                    />
                                                    <Checkbox
                                                        checked={preferences.editingStyle.autoJumpCuts}
                                                        onChange={v => updateEditingStyle('autoJumpCuts', v)}
                                                        label="ตัดคำฟิลเลอร์ (เอ่อ, อืม)"
                                                    />
                                                </div>
                                            </div>

                                            {/* Pacing */}
                                            <div className="mb-8">
                                                <label className="block text-sm font-semibold text-white mb-3">ความเร็ววิดีโอ</label>
                                                <select
                                                    value={preferences.editingStyle.pacing}
                                                    onChange={e => updateEditingStyle('pacing', e.target.value as 'fast' | 'medium' | 'slow')}
                                                    className="w-full p-4 glass border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[rgb(60,100,255)] bg-transparent"
                                                >
                                                    <option value="fast" className="bg-[rgb(20,20,35)]">เร็ว - เหมาะกับ Short Form</option>
                                                    <option value="medium" className="bg-[rgb(20,20,35)]">ปานกลาง - สมดุล</option>
                                                    <option value="slow" className="bg-[rgb(20,20,35)]">ช้า - เน้นรายละเอียด</option>
                                                </select>
                                            </div>

                                            {/* Start Button */}
                                            <button
                                                onClick={handleStartEditing}
                                                className="w-full py-4 bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] text-white font-bold text-lg rounded-xl hover:glow-blue transition-all flex items-center justify-center gap-3"
                                            >
                                                <Play className="w-5 h-5" />
                                                เริ่มตัดต่อวิดีโอ
                                            </button>
                                        </div>

                                        {/* Right: Video Preview */}
                                        <div className="bg-gradient-to-br from-[rgb(20,20,35)] to-[rgb(10,10,20)] p-8 flex items-center justify-center border-l border-white/10">
                                            <div className="w-full max-w-md">
                                                <h3 className="text-white font-bold text-xl mb-6 text-center flex items-center justify-center gap-2">
                                                    <Video className="w-5 h-5 text-[rgb(60,100,255)]" />
                                                    ตัวอย่างวิดีโอ
                                                </h3>
                                                {videoPreviewUrl ? (
                                                    <div className="w-full aspect-video max-h-[70vh] mx-auto">
                                                        <VideoPreview
                                                            src={videoPreviewUrl}
                                                            className="w-full h-full rounded-2xl overflow-hidden glow-blue-soft"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="glass p-8 rounded-2xl">
                                                        <div className="w-full aspect-video bg-gradient-to-br from-[rgb(60,100,255)]/20 to-[rgb(200,50,255)]/20 rounded-xl flex items-center justify-center">
                                                            <Video className="w-16 h-16 text-white/30" />
                                                        </div>
                                                        <p className="text-gray-400 text-sm text-center mt-4">
                                                            วิดีโอจะแสดงที่นี่หลังจากอัปโหลด
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

function Checkbox({
    checked,
    onChange,
    label
}: {
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
}) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${checked
                    ? 'bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] border-transparent glow-blue-soft'
                    : 'border-white/30 group-hover:border-[rgb(60,100,255)]'
                }`}>
                {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="hidden"
            />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
        </label>
    )
}
