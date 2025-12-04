// Groq Deep Integration - Advanced AI Service Manager
// Features: Spell checking, Deep keyword extraction, Content analysis

export interface TranscriptionResult {
    text: string
    segments: Array<{
        start: number
        end: number
        text: string
    }>
}

export interface SpellCheckResult {
    original: string
    corrected: string
    changes: Array<{ word: string; correction: string; position: number }>
    confidence: number
}

export interface KeywordResult {
    topics: string[]              // Main topics
    viral_keywords: string[]      // Trending/viral words
    seo_keywords: string[]        // SEO-friendly keywords
    highlight_words: string[]     // Words to highlight in subtitles
    suggested_hashtags: string[]  // Recommended hashtags
    content_category: string      // vlog, tutorial, review, etc.
    target_audience: string       // general, youth, family
    emotion_tone: string          // energetic, calm, informative
}

export interface DeepAnalysisResult {
    structure: {
        intro?: { start: number; end: number }
        main_content: Array<{ start: number; end: number; topic: string }>
        outro?: { start: number; end: number }
    }
    pacing: {
        slow_parts: Array<{ start: number; end: number; reason: string }>
        fast_parts: Array<{ start: number; end: number; reason: string }>
        optimal_cuts: Array<{ start: number; end: number; type: string; reason: string }>
    }
    engagement: {
        hook_quality: number  // 0-100
        retention_points: Array<{ time: number; score: number; reason: string }>
        drop_off_risks: Array<{ time: number; risk_level: string; suggestion: string }>
    }
    visual_suggestions: Array<{ time: number; suggestion: string; priority: string }>
    audio_suggestions: Array<{ start: number; end: number; type: string; intensity: string }>
}

export interface AnalysisResult {
    summary: string
    highlights: Array<{
        start: number
        end: number
        reason: string
    }>
    jumpCuts: Array<{
        start: number
        end: number
        reason: string
    }>
    keywords?: string[]
    visual_style?: {
        color_grading?: string
        apply_blur?: boolean
        pacing?: string
    }
    subtitle_settings?: {
        position?: string
        highlight_color?: string
    }
}

export class AIServiceManager {
    private groqKey: string | undefined
    private geminiKey: string | undefined

    constructor() {
        this.groqKey = process.env.GROQ_API_KEY
        this.geminiKey = process.env.GOOGLE_AI_API_KEY
    }

    getAvailableServices(): string[] {
        const services: string[] = []
        if (this.groqKey) services.push('groq')
        if (this.geminiKey) services.push('gemini')
        return services
    }


    // Main transcription with Groq/Gemini fallback
    async transcribe(videoBlob: Blob): Promise<TranscriptionResult> {
        const errors: string[] = []

        // Try Groq Whisper first (primary)
        if (this.groqKey) {
            try {
                console.log('🚀 Transcribing with Groq Whisper Large v3...')
                return await this.transcribeWithGroq(videoBlob)
            } catch (error: any) {
                const msg = error?.message || String(error)
                console.error('❌ Groq failed:', msg)
                errors.push(`Groq: ${msg}`)
            }
        }

        // Fallback to Gemini
        if (this.geminiKey) {
            try {
                console.log('🤖 Falling back to Gemini...')
                return await this.transcribeWithGemini(videoBlob)
            } catch (error: any) {
                const msg = error?.message || String(error)
                console.error('❌ Gemini failed:', msg)
                errors.push(`Gemini: ${msg}`)
            }
        }

        console.log('⚠️ All AI services failed, using mock data')
        return this.mockTranscription()
    }


    // NEW: Spell checking and correction
    async checkAndCorrectSpelling(text: string): Promise<SpellCheckResult> {
        if (!this.groqKey) {
            console.log('⚠️ No Groq key, skipping spell check')
            return {
                original: text,
                corrected: text,
                changes: [],
                confidence: 0
            }
        }

        try {
            console.log('📝 Running spell check with Groq...')
            const Groq = require('groq-sdk').default
            const groq = new Groq({ apiKey: this.groqKey })

            const prompt = `ตรวจสอบและแก้ไขคำผิดในข้อความภาษาไทยนี้ (ถ้ามี):

"${text}"

ส่งคืนเฉพาะ JSON:
{
  "corrected": "ข้อความที่แก้แล้ว",
  "changes": [
    {"word": "คำเดิม", "correction": "คำที่ถูก", "position": 0}
  ],
  "confidence": 0.95
}

กฎ:
- แก้เฉพาะคำที่ผิดจริงๆ
- เก็บความหมายเดิม
- confidence 0-1 (1 = แน่ใจที่สุด)
- ถ้าไม่มีอะไรต้องแก้ ให้ changes เป็น []`

            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3, // Low temp for accuracy
                max_tokens: 2000
            })

            const response = completion.choices[0]?.message?.content
            if (!response) throw new Error('Empty response')

            const match = response.match(/\{[\s\S]*\}/)
            if (!match) throw new Error('No JSON in response')

            const parsed = JSON.parse(match[0])

            console.log(`✅ Spell check: ${parsed.changes.length} corrections, confidence ${parsed.confidence}`)

            return {
                original: text,
                corrected: parsed.corrected || text,
                changes: parsed.changes || [],
                confidence: parsed.confidence || 0
            }
        } catch (error) {
            console.error('Spell check failed:', error)
            return {
                original: text,
                corrected: text,
                changes: [],
                confidence: 0
            }
        }
    }

    // NEW: Advanced keyword extraction
    async extractKeywords(text: string): Promise<KeywordResult> {
        if (!this.groqKey) {
            return this.mockKeywords()
        }

        try {
            console.log('🔑 Extracting keywords with Groq...')
            const Groq = require('groq-sdk').default
            const groq = new Groq({ apiKey: this.groqKey })

            const prompt = `วิเคราะห์ข้อความนี้และสกัดคำสำคัญ:

"${text.substring(0, 1000)}..."

ส่งคืนเฉพาะ JSON:
{
  "topics": ["หัวข้อหลัก1", "หัวข้อหลัก2"],
  "viral_keywords": ["คำที่ฮิต", "เทรนด์"],
  "seo_keywords": ["SEO1", "SEO2"],
  "highlight_words": ["คำโดดเด่น1", "คำโดดเด่น2"],
  "suggested_hashtags": ["#tag1", "#tag2"],
  "content_category": "vlog",
  "target_audience": "general",
  "emotion_tone": "energetic"
}

เกณฑ์:
- topics: หัวข้อหลัก 2-3 คำ
- viral_keywords: คำที่กำลังฮิต trendy
- seo_keywords: คำที่คนค้นหา
- highlight_words: คำที่ควรเน้นในซับ (impact words)
- hashtags: 3-5 tags
- category: vlog|tutorial|review|entertainment|travel|food
- audience: general|youth|family|professional
- tone: energetic|calm|informative|funny|serious`

            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1000
            })

            const response = completion.choices[0]?.message?.content
            if (!response) throw new Error('Empty response')

            const match = response.match(/\{[\s\S]*\}/)
            if (!match) throw new Error('No JSON')

            const parsed = JSON.parse(match[0])

            console.log(`✅ Keywords: ${parsed.topics?.length || 0} topics, ${parsed.viral_keywords?.length || 0} viral`)

            return {
                topics: parsed.topics || [],
                viral_keywords: parsed.viral_keywords || [],
                seo_keywords: parsed.seo_keywords || [],
                highlight_words: parsed.highlight_words || [],
                suggested_hashtags: parsed.suggested_hashtags || [],
                content_category: parsed.content_category || 'general',
                target_audience: parsed.target_audience || 'general',
                emotion_tone: parsed.emotion_tone || 'neutral'
            }
        } catch (error) {
            console.error('Keyword extraction failed:', error)
            return this.mockKeywords()
        }
    }

    // NEW: Deep content analysis
    async deepAnalyze(transcript: TranscriptionResult): Promise<DeepAnalysisResult | null> {
        if (!this.groqKey) return null

        try {
            console.log('🧠 Running deep analysis with Groq...')
            const Groq = require('groq-sdk').default
            const groq = new Groq({ apiKey: this.groqKey })

            const text = transcript.text
            const duration = transcript.segments[transcript.segments.length - 1]?.end || 60

            const prompt = `วิเคราะห์เนื้อหาวิดีโออย่างละเอียด:

ความยาว: ${duration}s
Transcript: "${text.substring(0, 1500)}..."

ส่งคืนเฉพาะ JSON:
{
  "structure": {
    "intro": {"start": 0, "end": 10},
    "main_content": [{"start": 10, "end": 90, "topic": "หัวข้อ"}],
    "outro": {"start": 90, "end": 100}
  },
  "pacing": {
    "slow_parts": [{"start": 20, "end": 30, "reason": "พูดช้า"}],
    "fast_parts": [{"start": 50, "end": 60, "reason": "พูดเร็ว"}],
    "optimal_cuts": [{"start": 5, "end": 7, "type": "silence", "reason": "เงียบนาน"}]
  },
  "engagement": {
    "hook_quality": 85,
    "retention_points": [{"time": 15, "score": 90, "reason": "จุดน่าสนใจ"}],
    "drop_off_risks": [{"time": 40, "risk_level": "medium", "suggestion": "ตัดส่วนนี้"}]
  },
  "visual_suggestions": [{"time": 20, "suggestion": "zoom in", "priority": "high"}],
  "audio_suggestions": [{"start": 0, "end": 10, "type": "music", "intensity": "medium"}]
}

วิเคราะห์:
1. Structure: แบ่ง intro/main/outro
2. Pacing: หาส่วนที่พูดช้า/เร็ว และควรตัด
3. Engagement: คะแนน hook, จุดที่น่าสนใจ, ความเสี่ยงคนดรอป
4. Visual: แนะนำ zoom, text overlay
5. Audio: แนะนำดนตรี, sfx`

            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 2000
            })

            const response = completion.choices[0]?.message?.content
            if (!response) return null

            const match = response.match(/\{[\s\S]*\}/)
            if (!match) return null

            const parsed = JSON.parse(match[0])

            console.log(`✅ Deep analysis: hook ${parsed.engagement?.hook_quality}/100`)

            return parsed
        } catch (error) {
            console.error('Deep analysis failed:', error)
            return null
        }
    }

    private mockTranscription(): TranscriptionResult {
        return {
            text: "ข้อความตัวอย่างสำหรับทดสอบ เนื่องจาก AI services ไม่พร้อมใช้งาน",
            segments: [
                { start: 0, end: 3, text: "ข้อความตัวอย่าง" },
                { start: 3, end: 6, text: "สำหรับทดสอบ" },
                { start: 6, end: 10, text: "AI ไม่พร้อมใช้งาน" },
            ]
        }
    }

    private mockKeywords(): KeywordResult {
        return {
            topics: ["ทดสอบ", "ตัวอย่าง"],
            viral_keywords: [],
            seo_keywords: [],
            highlight_words: [],
            suggested_hashtags: ["#test"],
            content_category: "general",
            target_audience: "general",
            emotion_tone: "neutral"
        }
    }

    private async transcribeWithGroq(videoBlob: Blob): Promise<TranscriptionResult> {
        const Groq = require('groq-sdk').default
        const groq = new Groq({ apiKey: this.groqKey })

        const sizeMB = videoBlob.size / (1024 * 1024)
        if (sizeMB > 25) {
            throw new Error(`Video too large: ${sizeMB.toFixed(2)}MB (max 25MB)`)
        }

        const file = new File([videoBlob], 'video.mp4', { type: 'video/mp4' })

        // Common Thai words to help Whisper recognize correctly
        const thaiPrompt = `คำศัพท์ที่พบบ่อย: ทุเรียน มังคุด ลำไย ลิ้นจี่ ราชบุรี เชียงใหม่ ภูเก็ต กรุงเทพ สวัสดี ขอบคุณ`

        const transcription = await groq.audio.transcriptions.create({
            file: file,
            model: 'whisper-large-v3',
            language: 'th',
            response_format: 'verbose_json',
            timestamp_granularities: ['word', 'segment'],
            temperature: 0.0,
            prompt: thaiPrompt,  // เพิ่ม prompt hint สำหรับคำภาษาไทย
        })

        if (!transcription.text) {
            throw new Error('Empty transcription')
        }

        const result: TranscriptionResult = {
            text: transcription.text,
            segments: (transcription.segments || []).map((seg: any) => ({
                start: seg.start || 0,
                end: seg.end || 0,
                text: seg.text || ''
            }))
        }

        console.log(`✅ Groq transcribed: ${result.segments.length} segments, ${transcription.words?.length || 0} words`)
        return result
    }

    private async transcribeWithGemini(videoBlob: Blob): Promise<TranscriptionResult> {
        const { GoogleGenAI } = require('@google/genai')
        const ai = new GoogleGenAI({ apiKey: this.geminiKey })

        const arrayBuffer = await videoBlob.arrayBuffer()
        const base64Video = Buffer.from(arrayBuffer).toString('base64')

        const sizeMB = videoBlob.size / (1024 * 1024)
        if (sizeMB > 50) {
            throw new Error(`Video too large: ${sizeMB.toFixed(2)}MB (max 50MB)`)
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                role: 'user',
                parts: [
                    { text: `ถอดเสียงเป็น JSON:\n{"text": "...", "segments": [{"start": 0, "end": 2, "text": "..."}]}` },
                    { inlineData: { mimeType: 'video/mp4', data: base64Video } }
                ]
            }]
        })

        const text = response.text
        if (!text) throw new Error('Empty response')

        const match = text.match(/\{[\s\S]*\}/)
        if (!match) throw new Error('No JSON')

        const clean = match[0].replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        const parsed = JSON.parse(clean)

        if (!parsed.text || !Array.isArray(parsed.segments)) {
            throw new Error('Invalid structure')
        }

        console.log(`✅ Gemini transcribed: ${parsed.segments.length} segments`)
        return parsed
    }

    // Enhanced analysis (backward compatible)
    async analyzeTranscript(transcript: TranscriptionResult): Promise<AnalysisResult | null> {
        if (transcript.text.includes("ตัวอย่าง")) {
            return {
                summary: "Mock analysis",
                highlights: [],
                jumpCuts: [],
                keywords: []
            }
        }

        if (!this.groqKey) return null

        try {
            const Groq = require('groq-sdk').default
            const groq = new Groq({ apiKey: this.groqKey })

            const response = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{
                    role: 'user',
                    content: `วิเคราะห์: ${transcript.text}\n\nJSON: {"summary":"...","highlights":[],"jumpCuts":[],"keywords":[]}`
                }],
                temperature: 0.7,
                max_tokens: 2000
            })

            const text = response.choices[0]?.message?.content
            const match = text?.match(/\{[\s\S]*\}/)
            return match ? JSON.parse(match[0]) : null
        } catch (error) {
            console.error('Analysis failed:', error)
            return null
        }
    }
}
