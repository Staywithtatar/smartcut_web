// Custom Editing Preferences - Type Definitions
// Allows users to control editing behavior through UI

export interface EditingPreferences {
    // User's custom natural language prompt
    customPrompt?: string

    // Visual effects toggles
    visualEffects: {
        subtitles: boolean
        colorGrading: boolean
        zoomEffects: boolean
        blurEffects: boolean
        transitions: boolean
        textOverlays: boolean
    }

    // Audio settings
    audio: {
        keepOriginal: boolean
        addBackgroundMusic: boolean
        normalizeAudio: boolean
        removeNoise: boolean
    }

    // Editing style preferences
    editingStyle: {
        autoCutSilence: boolean
        autoJumpCuts: boolean
        keepPauses: boolean
        pacing: 'fast' | 'medium' | 'slow'
    }

    // Output configuration
    output: {
        aspectRatio: '16:9' | '9:16' | '1:1' | '4:3'
        quality: 'high' | 'medium' | 'low'
        format: 'mp4' | 'mov' | 'webm'
    }

    // Selected preset name (if any)
    preset?: PresetName
}

export type PresetName =
    | 'energetic-vlog'
    | 'calm-tutorial'
    | 'dynamic-review'
    | 'minimal-clean'
    | 'cinematic'
    | 'social-media'

// Preset configurations
export const PRESETS: Record<PresetName, Partial<EditingPreferences>> = {
    'energetic-vlog': {
        customPrompt: 'ตัดให้เป็น vlog สไตล์สนุกสนาน energetic เน้นความรวดเร็ว ตัดช่วงเงียบออก ใส่ซับไตเติ้ลโดดเด่น',
        visualEffects: {
            subtitles: true,
            colorGrading: true,
            zoomEffects: true,
            blurEffects: false,
            transitions: true,
            textOverlays: true
        },
        audio: {
            keepOriginal: true,
            addBackgroundMusic: false,
            normalizeAudio: true,
            removeNoise: false
        },
        editingStyle: {
            autoCutSilence: true,
            autoJumpCuts: true,
            keepPauses: false,
            pacing: 'fast'
        },
        output: {
            aspectRatio: '9:16',
            quality: 'high',
            format: 'mp4'
        }
    },

    'calm-tutorial': {
        customPrompt: 'ตัดให้เป็นสไตล์สอน อธิบายให้ชัดเจน ใช้เวลาตามธรรมชาติ ไม่ต้องรีบ',
        visualEffects: {
            subtitles: true,
            colorGrading: false,
            zoomEffects: false,
            blurEffects: false,
            transitions: false,
            textOverlays: true
        },
        audio: {
            keepOriginal: true,
            addBackgroundMusic: false,
            normalizeAudio: true,
            removeNoise: true
        },
        editingStyle: {
            autoCutSilence: false,
            autoJumpCuts: false,
            keepPauses: true,
            pacing: 'medium'
        },
        output: {
            aspectRatio: '16:9',
            quality: 'high',
            format: 'mp4'
        }
    },

    'dynamic-review': {
        customPrompt: 'ตัดให้เป็นรีวิว dynamic มีพลัง ตัดจุดที่ซ้ำซากออก เน้นจุดไฮไลท์',
        visualEffects: {
            subtitles: true,
            colorGrading: true,
            zoomEffects: true,
            blurEffects: false,
            transitions: true,
            textOverlays: true
        },
        audio: {
            keepOriginal: true,
            addBackgroundMusic: true,
            normalizeAudio: true,
            removeNoise: false
        },
        editingStyle: {
            autoCutSilence: true,
            autoJumpCuts: true,
            keepPauses: false,
            pacing: 'fast'
        },
        output: {
            aspectRatio: '16:9',
            quality: 'high',
            format: 'mp4'
        }
    },

    'minimal-clean': {
        customPrompt: 'ตัดแบบเรียบง่าย สะอาด minimal ไม่มี effect มากเกินไป',
        visualEffects: {
            subtitles: true,
            colorGrading: false,
            zoomEffects: false,
            blurEffects: false,
            transitions: false,
            textOverlays: false
        },
        audio: {
            keepOriginal: true,
            addBackgroundMusic: false,
            normalizeAudio: true,
            removeNoise: false
        },
        editingStyle: {
            autoCutSilence: true,
            autoJumpCuts: false,
            keepPauses: true,
            pacing: 'medium'
        },
        output: {
            aspectRatio: '16:9',
            quality: 'high',
            format: 'mp4'
        }
    },

    'cinematic': {
        customPrompt: 'ตัดให้เป็นสไตล์ cinematic สวยงาม มีอารมณ์ ใช้เวลาเล่าเรื่อง',
        visualEffects: {
            subtitles: false,
            colorGrading: true,
            zoomEffects: false,
            blurEffects: true,
            transitions: true,
            textOverlays: false
        },
        audio: {
            keepOriginal: true,
            addBackgroundMusic: true,
            normalizeAudio: true,
            removeNoise: true
        },
        editingStyle: {
            autoCutSilence: false,
            autoJumpCuts: false,
            keepPauses: true,
            pacing: 'slow'
        },
        output: {
            aspectRatio: '16:9',
            quality: 'high',
            format: 'mp4'
        }
    },

    'social-media': {
        customPrompt: 'ตัดให้เหมาะกับ social media เน้นความรวดเร็ว สั้น กระชับ ซับไตเติ้ลชัดเจน',
        visualEffects: {
            subtitles: true,
            colorGrading: true,
            zoomEffects: true,
            blurEffects: false,
            transitions: true,
            textOverlays: true
        },
        audio: {
            keepOriginal: true,
            addBackgroundMusic: true,
            normalizeAudio: true,
            removeNoise: false
        },
        editingStyle: {
            autoCutSilence: true,
            autoJumpCuts: true,
            keepPauses: false,
            pacing: 'fast'
        },
        output: {
            aspectRatio: '9:16',
            quality: 'high',
            format: 'mp4'
        }
    }
}

// Default preferences
export const DEFAULT_PREFERENCES: EditingPreferences = {
    visualEffects: {
        subtitles: true,
        colorGrading: true,
        zoomEffects: true,
        blurEffects: false,
        transitions: true,
        textOverlays: false
    },
    audio: {
        keepOriginal: true,
        addBackgroundMusic: false,
        normalizeAudio: true,
        removeNoise: false
    },
    editingStyle: {
        autoCutSilence: true,
        autoJumpCuts: true,
        keepPauses: false,
        pacing: 'fast'
    },
    output: {
        aspectRatio: '9:16',
        quality: 'high',
        format: 'mp4'
    }
}

// Preset display names
export const PRESET_LABELS: Record<PresetName, { name: string; emoji: string; description: string }> = {
    'energetic-vlog': {
        name: 'Energetic Vlog',
        emoji: '⚡',
        description: 'สนุกสนาน รวดเร็ว สำหรับ vlog'
    },
    'calm-tutorial': {
        name: 'Calm Tutorial',
        emoji: '📚',
        description: 'สอนให้ชัดเจน ใช้เวลาตามธรรมชาติ'
    },
    'dynamic-review': {
        name: 'Dynamic Review',
        emoji: '🎬',
        description: 'รีวิวแบบมีพลัง เน้นไฮไลท์'
    },
    'minimal-clean': {
        name: 'Minimal Clean',
        emoji: '✨',
        description: 'เรียบง่าย สะอาด ไม่มาก'
    },
    'cinematic': {
        name: 'Cinematic',
        emoji: '🎥',
        description: 'สวยงาม มีอารมณ์ storytelling'
    },
    'social-media': {
        name: 'Social Media',
        emoji: '📱',
        description: 'เหมาะกับโซเชียล สั้น กระชับ'
    }
}
