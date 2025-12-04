// Custom Prompt Builder - Fuses User Preferences with AI Insights
// Takes user's custom prompt + checkboxes + AI analysis → Enhanced editing instructions

import {
    EditingPreferences
} from '@/lib/types/editing-preferences'
import {
    TranscriptionResult,
    DeepAnalysisResult,
    KeywordResult
} from '@/lib/ai/service-manager'

export class CustomPromptBuilder {

    /**
     * Build enhanced prompt that combines:
     * 1. User's custom natural language request
     * 2. Feature toggles (checkboxes)
     * 3. AI insights (deep analysis)
     * 4. Content context (transcript)
     */
    async buildEnhancedPrompt(
        userPreferences: EditingPreferences,
        transcript: TranscriptionResult,
        deepAnalysis: DeepAnalysisResult | null,
        keywords: KeywordResult
    ): Promise<string> {

        const parts: string[] = []

        // 1. User's Custom Request (HIGHEST PRIORITY)
        if (userPreferences.customPrompt && userPreferences.customPrompt.trim()) {
            parts.push(`🎯 USER'S REQUEST (TOP PRIORITY):
"${userPreferences.customPrompt}"
→ This is what the user explicitly wants. Follow this closely!`)
        }

        // 2. Feature Instructions from Checkboxes
        const featureInstructions = this.translatePreferencesToInstructions(userPreferences)
        parts.push(`⚙️ FEATURES TO APPLY:
${featureInstructions.join('\n')}`)

        // 3. AI Analysis Insights
        if (deepAnalysis) {
            const aiInsights = this.summarizeAnalysis(deepAnalysis, keywords)
            parts.push(`🧠 AI INSIGHTS:
${aiInsights}`)
        }

        // 4. Content Context
        const contentPreview = transcript.text.substring(0, 800)
        parts.push(`📝 CONTENT (first 800 chars):
"${contentPreview}..."

Duration: ${transcript.segments[transcript.segments.length - 1]?.end || 0}s
Segments: ${transcript.segments.length} subtitle segments`)

        // 5. Final Instructions for AI
        parts.push(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 YOUR TASK:
Create a professional editing script that:
1. **RESPECTS user's request first** (highest priority!)
2. **APPLIES selected features** (subtitles, zoom, etc.)
3. **USES AI insights** to optimize (pacing, cuts, highlights)
4. **MAINTAINS content quality** and user intent

Generate complete JSON editing script:
{
  "jumpCuts": [
    {"start": 0.0, "end": 1.5, "reason": "silence/filler"}
  ],
  "highlights": [
    {
      "start": 10.0,
      "end": 15.0,
      "reason": "key moment",
      "effects": {
        "zoom": {"intensity": "medium", "easing": "ease-in-out"}
      }
    }
  ],
  "subtitles": {
    "enabled": true,
    "position": "bottom",
    "highlight_keywords": ["คำสำคัญ"],
    "segments": [use provided transcript segments]
  },
  "audio": {
    "normalize": true,
    "remove_silence": true,
    "background_music": false
  },
  "visual": {
    "color_grading": "vibrant",
    "aspect_ratio": "9:16",
    "transitions": true
  }
}

CRITICAL RULES:
- User request > AI suggestions
- Only apply features user enabled
- Keep natural flow unless user wants fast pacing
- Preserve important content
`)

        return parts.join('\n\n')
    }

    /**
     * Translate user's checkbox selections into clear instructions
     */
    private translatePreferencesToInstructions(prefs: EditingPreferences): string[] {
        const instructions: string[] = []

        // Visual Effects
        if (prefs.visualEffects.subtitles) {
            instructions.push('✅ SUBTITLES: Add dynamic subtitles with keyword highlighting')
        } else {
            instructions.push('❌ SUBTITLES: Skip (user disabled)')
        }

        if (prefs.visualEffects.colorGrading) {
            instructions.push('✅ COLOR GRADING: Apply vibrant/cinematic color correction')
        } else {
            instructions.push('❌ COLOR GRADING: Keep natural colors')
        }

        if (prefs.visualEffects.zoomEffects) {
            instructions.push('✅ ZOOM: Apply zoom effects at highlights/key moments')
        } else {
            instructions.push('❌ ZOOM: No zoom effects')
        }

        if (prefs.visualEffects.blurEffects) {
            instructions.push('✅ BLUR: Apply background blur (for vertical videos)')
        } else {
            instructions.push('❌ BLUR: No blur effects')
        }

        if (prefs.visualEffects.transitions) {
            instructions.push('✅ TRANSITIONS: Add smooth transitions between scenes')
        } else {
            instructions.push('❌ TRANSITIONS: Hard cuts only')
        }

        if (prefs.visualEffects.textOverlays) {
            instructions.push('✅ TEXT OVERLAYS: Add text highlights/callouts')
        } else {
            instructions.push('❌ TEXT OVERLAYS: No additional text')
        }

        // Audio
        if (prefs.audio.normalizeAudio) {
            instructions.push('✅ AUDIO NORMALIZE: Balance audio levels')
        }

        if (prefs.audio.removeNoise) {
            instructions.push('✅ NOISE REDUCTION: Remove background noise')
        }

        if (prefs.audio.addBackgroundMusic) {
            instructions.push('✅ BACKGROUND MUSIC: Add suitable background music')
        } else {
            instructions.push('❌ BACKGROUND MUSIC: Keep audio clean')
        }

        // Editing Style
        if (prefs.editingStyle.autoCutSilence) {
            instructions.push('✅ CUT SILENCE: Remove silent parts (>0.5s)')
        } else {
            instructions.push('❌ CUT SILENCE: Keep natural pauses')
        }

        if (prefs.editingStyle.autoJumpCuts) {
            instructions.push('✅ JUMP CUTS: Remove filler words, repetitions')
        } else {
            instructions.push('❌ JUMP CUTS: Keep natural flow')
        }

        if (prefs.editingStyle.keepPauses) {
            instructions.push('✅ KEEP PAUSES: Maintain natural timing')
        }

        // Pacing
        const pacingMap = {
            fast: '⚡ PACING: Fast (quick cuts, energetic)',
            medium: '🚶 PACING: Medium (balanced, natural)',
            slow: '🐌 PACING: Slow (cinematic, storytelling)'
        }
        instructions.push(pacingMap[prefs.editingStyle.pacing])

        // Output
        instructions.push(`📐 ASPECT RATIO: ${prefs.output.aspectRatio}`)
        instructions.push(`🎞️ OUTPUT: ${prefs.output.quality} quality, ${prefs.output.format.toUpperCase()}`)

        return instructions
    }

    /**
     * Summarize AI insights in human-readable format
     */
    private summarizeAnalysis(analysis: DeepAnalysisResult, keywords: KeywordResult): string {
        const parts: string[] = []

        // Structure
        if (analysis.structure) {
            parts.push(`📊 Structure:`)
            if (analysis.structure.intro) {
                parts.push(`  - Intro: ${analysis.structure.intro.start}s - ${analysis.structure.intro.end}s`)
            }
            if (analysis.structure.main_content?.length) {
                parts.push(`  - Main: ${analysis.structure.main_content.length} sections`)
            }
            if (analysis.structure.outro) {
                parts.push(`  - Outro: ${analysis.structure.outro.start}s - ${analysis.structure.outro.end}s`)
            }
        }

        // Pacing
        if (analysis.pacing) {
            parts.push(`\n⏱️ Pacing:`)
            if (analysis.pacing.slow_parts?.length) {
                parts.push(`  - ${analysis.pacing.slow_parts.length} slow sections (can speed up)`)
            }
            if (analysis.pacing.optimal_cuts?.length) {
                parts.push(`  - ${analysis.pacing.optimal_cuts.length} suggested cuts`)
            }
        }

        // Engagement
        if (analysis.engagement) {
            parts.push(`\n🎯 Engagement:`)
            parts.push(`  - Hook quality: ${analysis.engagement.hook_quality}/100`)
            if (analysis.engagement.retention_points?.length) {
                parts.push(`  - ${analysis.engagement.retention_points.length} retention points`)
            }
            if (analysis.engagement.drop_off_risks?.length) {
                parts.push(`  - ⚠️ ${analysis.engagement.drop_off_risks.length} drop-off risks`)
            }
        }

        // Keywords
        parts.push(`\n🔑 Keywords:`)
        if (keywords.topics?.length) {
            parts.push(`  - Topics: ${keywords.topics.join(', ')}`)
        }
        if (keywords.viral_keywords?.length) {
            parts.push(`  - Viral: ${keywords.viral_keywords.join(', ')}`)
        }
        if (keywords.highlight_words?.length) {
            parts.push(`  - Highlight: ${keywords.highlight_words.slice(0, 5).join(', ')}`)
        }

        // Suggestions
        if (analysis.visual_suggestions?.length) {
            parts.push(`\n💡 Suggestions:`)
            analysis.visual_suggestions.slice(0, 3).forEach(sug => {
                parts.push(`  - ${sug.time}s: ${sug.suggestion}`)
            })
        }

        return parts.join('\n')
    }

    /**
     * Quick validation of preferences
     */
    validatePreferences(prefs: EditingPreferences): {
        valid: boolean
        errors: string[]
    } {
        const errors: string[] = []

        // Check conflicting options
        if (prefs.editingStyle.keepPauses && prefs.editingStyle.autoCutSilence) {
            errors.push('Cannot both keep pauses AND auto-cut silence')
        }

        if (prefs.editingStyle.pacing === 'slow' && prefs.editingStyle.autoJumpCuts) {
            errors.push('Slow pacing conflicts with auto jump cuts')
        }

        // Warn about heavy processing
        const heavyFeatures = [
            prefs.visualEffects.colorGrading,
            prefs.visualEffects.zoomEffects,
            prefs.visualEffects.blurEffects,
            prefs.audio.removeNoise
        ].filter(Boolean).length

        if (heavyFeatures >= 3) {
            console.warn('⚠️ Multiple heavy features enabled - processing may take longer')
        }

        return {
            valid: errors.length === 0,
            errors
        }
    }
}
