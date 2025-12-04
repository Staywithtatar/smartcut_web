'use client'

import { useState } from 'react'
import {
    EditingPreferences,
    PresetName,
    PRESETS,
    PRESET_LABELS,
    DEFAULT_PREFERENCES
} from '@/lib/types/editing-preferences'
import { Icons } from '@/lib/icons'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Textarea, Select } from './ui/Input'

interface Props {
    onSubmit: (preferences: EditingPreferences) => void
    onCancel: () => void
    videoInfo?: {
        name: string
        size: number
        duration?: number
    }
}

const PRESET_ICONS: Record<PresetName, any> = {
    'energetic-vlog': Icons.Zap,
    'calm-tutorial': Icons.BookOpen,
    'dynamic-review': Icons.Video,
    'minimal-clean': Icons.Sparkles,
    'cinematic': Icons.Video,
    'social-media': Icons.Smartphone,
}

export function EditingPreferencesForm({ onSubmit, onCancel, videoInfo }: Props) {
    const [preferences, setPreferences] = useState<EditingPreferences>(DEFAULT_PREFERENCES)

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

    const updateAudio = (key: keyof EditingPreferences['audio'], value: boolean) => {
        setPreferences(prev => ({
            ...prev,
            audio: { ...prev.audio, [key]: value }
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-4 shadow-2xl">
                        <Icons.Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
                        Customize Your Edit
                    </h1>
                    {videoInfo && (
                        <p className="text-purple-300 text-lg flex items-center justify-center gap-2">
                            <Icons.Camera size={18} />
                            {videoInfo.name} • {(videoInfo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    )}
                </div>

                {/* Custom Prompt - Hero Section */}
                <section className="mb-8">
                    <Card variant="glass" padding="lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                <Icons.MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Tell AI What You Want</h2>
                        </div>
                        <Textarea
                            value={preferences.customPrompt || ''}
                            onChange={e => setPreferences(prev => ({ ...prev, customPrompt: e.target.value }))}
                            placeholder="ตัดให้เป็น vlog สไตล์ energetic เน้นความสนุกสนาน ตัดช่วงเงียบออก ใส่ซับไตเติ้ลที่โดดเด่น..."
                            rows={4}
                        />
                        <p className="text-sm text-purple-300 mt-3 flex items-center gap-2">
                            <Icons.Lightbulb size={16} />
                            Tip: อธิบายสไตล์ที่ต้องการด้วยภาษาธรรมชาติ AI จะเข้าใจและปรับแต่งให้
                        </p>
                    </Card>
                </section>

                {/* Presets */}
                <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Icons.Palette size={20} />
                        Quick Presets
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(Object.keys(PRESETS) as PresetName[]).map(presetKey => {
                            const preset = PRESET_LABELS[presetKey]
                            const Icon = PRESET_ICONS[presetKey]
                            const isActive = preferences.preset === presetKey

                            return (
                                <button
                                    key={presetKey}
                                    onClick={() => applyPreset(presetKey)}
                                    className={`group p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${isActive
                                            ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-xl shadow-purple-500/50'
                                            : 'border-white/10 bg-white/5 backdrop-blur-sm hover:border-purple-500/50 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="relative z-10">
                                        <div className={`mb-3 ${isActive ? 'text-purple-300' : 'text-purple-400'}`}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <div className="font-semibold text-white mb-1">{preset.name}</div>
                                        <div className="text-xs text-purple-300">{preset.description}</div>
                                    </div>
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 animate-pulse" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </section>

                {/* Options Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Visual Effects */}
                    <Card variant="glass" padding="md">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Icons.Sparkles size={18} />
                            Visual Effects
                        </h3>
                        <div className="space-y-3">
                            <Checkbox
                                checked={preferences.visualEffects.subtitles}
                                onChange={v => updateVisualEffect('subtitles', v)}
                                label="Subtitles"
                                description="ซับไตเติ้ล"
                            />
                            <Checkbox
                                checked={preferences.visualEffects.colorGrading}
                                onChange={v => updateVisualEffect('colorGrading', v)}
                                label="Color Grading"
                                description="ปรับสีวิดีโอ"
                            />
                            <Checkbox
                                checked={preferences.visualEffects.zoomEffects}
                                onChange={v => updateVisualEffect('zoomEffects', v)}
                                label="Zoom Effects"
                                description="ซูมเข้าออก"
                            />
                            <Checkbox
                                checked={preferences.visualEffects.blurEffects}
                                onChange={v => updateVisualEffect('blurEffects', v)}
                                label="Blur Effects"
                                description="เบลอพื้นหลัง"
                            />
                            <Checkbox
                                checked={preferences.visualEffects.transitions}
                                onChange={v => updateVisualEffect('transitions', v)}
                                label="Transitions"
                                description="ทรานสิชั่น"
                            />
                            <Checkbox
                                checked={preferences.visualEffects.textOverlays}
                                onChange={v => updateVisualEffect('textOverlays', v)}
                                label="Text Overlays"
                                description="ข้อความบนวิดีโอ"
                            />
                        </div>
                    </Card>

                    {/* Audio */}
                    <Card variant="glass" padding="md">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Icons.Music size={18} />
                            Audio
                        </h3>
                        <div className="space-y-3">
                            <Checkbox
                                checked={preferences.audio.keepOriginal}
                                onChange={v => updateAudio('keepOriginal', v)}
                                label="Keep Original Audio"
                                description="เก็บเสียงต้นฉบับ"
                            />
                            <Checkbox
                                checked={preferences.audio.addBackgroundMusic}
                                onChange={v => updateAudio('addBackgroundMusic', v)}
                                label="Background Music"
                                description="เพิ่มดนตรีประกอบ"
                            />
                            <Checkbox
                                checked={preferences.audio.normalizeAudio}
                                onChange={v => updateAudio('normalizeAudio', v)}
                                label="Normalize Audio"
                                description="ปรับเสียงให้สม่ำเสมอ"
                            />
                            <Checkbox
                                checked={preferences.audio.removeNoise}
                                onChange={v => updateAudio('removeNoise', v)}
                                label="Remove Noise"
                                description="ลดเสียงรบกวน"
                            />
                        </div>
                    </Card>

                    {/* Editing Style */}
                    <Card variant="glass" padding="md">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Icons.Scissors size={18} />
                            Editing Style
                        </h3>
                        <div className="space-y-3">
                            <Checkbox
                                checked={preferences.editingStyle.autoCutSilence}
                                onChange={v => updateEditingStyle('autoCutSilence', v)}
                                label="Auto Cut Silence"
                                description="ตัดช่วงเงียบออก"
                            />
                            <Checkbox
                                checked={preferences.editingStyle.autoJumpCuts}
                                onChange={v => updateEditingStyle('autoJumpCuts', v)}
                                label="Auto Jump Cuts"
                                description="ตัด filler words"
                            />
                            <Checkbox
                                checked={preferences.editingStyle.keepPauses}
                                onChange={v => updateEditingStyle('keepPauses', v)}
                                label="Keep Pauses"
                                description="เก็บช่วงหยุด"
                            />
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Pacing</label>
                                <Select
                                    value={preferences.editingStyle.pacing}
                                    onChange={e => updateEditingStyle('pacing', e.target.value as 'fast' | 'medium' | 'slow')}
                                    options={[
                                        { value: 'fast', label: '⚡ Fast' },
                                        { value: 'medium', label: '🚶 Medium' },
                                        { value: 'slow', label: '🐌 Slow' },
                                    ]}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Output Settings */}
                <Card variant="glass" padding="md" className="mb-8">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Icons.Settings size={18} />
                        Output Settings
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <Select
                            label="Aspect Ratio"
                            value={preferences.output.aspectRatio}
                            onChange={e => updateOutput('aspectRatio', e.target.value)}
                            options={[
                                { value: '16:9', label: '16:9 (Landscape)' },
                                { value: '9:16', label: '9:16 (Portrait)' },
                                { value: '1:1', label: '1:1 (Square)' },
                                { value: '4:3', label: '4:3 (Classic)' },
                            ]}
                        />
                        <Select
                            label="Quality"
                            value={preferences.output.quality}
                            onChange={e => updateOutput('quality', e.target.value)}
                            options={[
                                { value: 'high', label: 'High (1080p)' },
                                { value: 'medium', label: 'Medium (720p)' },
                                { value: 'low', label: 'Low (480p)' },
                            ]}
                        />
                        <Select
                            label="Format"
                            value={preferences.output.format}
                            onChange={e => updateOutput('format', e.target.value)}
                            options={[
                                { value: 'mp4', label: 'MP4' },
                                { value: 'mov', label: 'MOV' },
                                { value: 'webm', label: 'WebM' },
                            ]}
                        />
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        onClick={onCancel}
                        variant="ghost"
                        size="lg"
                        fullWidth
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onSubmit(preferences)}
                        variant="primary"
                        size="lg"
                        fullWidth
                        icon={Icons.Rocket}
                    >
                        Start Editing
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Checkbox component with glassmorphism
function Checkbox({
    checked,
    onChange,
    label,
    description
}: {
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
    description?: string
}) {
    return (
        <label className="flex items-start gap-3 p-3 bg-black/20 border border-white/10 rounded-xl cursor-pointer hover:bg-black/30 hover:border-purple-500/50 transition-all group">
            <div className="relative flex items-center justify-center mt-0.5">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={e => onChange(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-white/30 bg-black/30 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer transition-all checked:bg-gradient-to-br checked:from-purple-500 checked:to-pink-500 checked:border-transparent"
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-white group-hover:text-purple-300 transition-colors">{label}</div>
                {description && (
                    <div className="text-xs text-purple-300/70 mt-0.5">{description}</div>
                )}
            </div>
        </label>
    )
}
