// Translation strings for Thai and English

export type Language = 'th' | 'en'

export const translations = {
    // Navigation
    nav: {
        features: { th: 'ฟีเจอร์', en: 'Features' },
        howItWorks: { th: 'วิธีใช้งาน', en: 'How it Works' },
        pricing: { th: 'ราคา', en: 'Pricing' },
        login: { th: 'เข้าสู่ระบบ', en: 'Login' },
        signup: { th: 'สมัครสมาชิก', en: 'Sign Up' },
        logout: { th: 'ออกจากระบบ', en: 'Logout' },
    },

    // Hero Section
    hero: {
        title: {
            th: 'AI ตัดต่อวิดีโอ',
            en: 'AI Video Editing'
        },
        subtitle: {
            th: 'ให้คุณอัตโนมัติ',
            en: 'Automatically'
        },
        description: {
            th: 'ตัดต่อวิดีโอสำหรับ TikTok, Reels, Shorts ได้ง่ายๆ ด้วย AI',
            en: 'Create TikTok, Reels, Shorts videos easily with AI'
        },
        cta: { th: 'เริ่มต้นใช้งาน', en: 'Get Started' },
        ctaSecondary: { th: 'ดูวิธีใช้งาน', en: 'Watch Demo' },
    },

    // Features
    features: {
        title: { th: 'ฟีเจอร์หลัก', en: 'Key Features' },
        aiCut: { th: 'AI ตัดอัตโนมัติ', en: 'AI Auto Cut' },
        aiCutDesc: { th: 'ตัดความเงียบและช่วงที่ไม่มีเนื้อหา', en: 'Remove silences and empty parts' },
        subtitles: { th: 'ใส่ซับไตเติ้ลอัตโนมัติ', en: 'Auto Subtitles' },
        subtitlesDesc: { th: 'ถอดเสียงและใส่ซับให้ทันที', en: 'Transcribe and add subtitles instantly' },
        smartCrop: { th: 'Smart Crop 9:16', en: 'Smart Crop 9:16' },
        smartCropDesc: { th: 'ครอปตามใบหน้าอัตโนมัติ', en: 'Auto crop following face' },
        viralPick: { th: 'เลือกช่วง Viral', en: 'Viral Clip Picker' },
        viralPickDesc: { th: 'AI เลือกช่วงที่น่าสนใจที่สุด', en: 'AI picks the most engaging part' },
    },

    // User Menu
    user: {
        profile: { th: 'โปรไฟล์', en: 'Profile' },
        myJobs: { th: 'งานของฉัน', en: 'My Jobs' },
        buyCredits: { th: 'ซื้อเครดิต', en: 'Buy Credits' },
        creditsRemaining: { th: 'เครดิตคงเหลือ', en: 'Credits Remaining' },
    },

    // Pricing
    pricing: {
        title: { th: 'เลือกแพ็คเกจของคุณ', en: 'Choose Your Plan' },
        subtitle: { th: 'เติมเครดิตเพื่อตัดต่อวิดีโอได้ไม่จำกัด', en: 'Top up credits for unlimited video editing' },
        comingSoon: { th: 'เร็วๆ นี้', en: 'Coming Soon' },
        selectPlan: { th: 'เลือกแพ็คเกจนี้', en: 'Select Plan' },
        videos: { th: 'วิดีโอ', en: 'videos' },
        recommended: { th: 'แนะนำ', en: 'Recommended' },
    },

    // Processing
    processing: {
        title: { th: 'กำลังตัดต่อวิดีโอ', en: 'Processing Video' },
        uploading: { th: 'กำลังอัปโหลด', en: 'Uploading' },
        transcribing: { th: 'กำลังถอดเสียง', en: 'Transcribing' },
        analyzing: { th: 'กำลังวิเคราะห์', en: 'Analyzing' },
        rendering: { th: 'กำลังตัดต่อ', en: 'Rendering' },
        completed: { th: 'เสร็จสิ้น', en: 'Completed' },
        failed: { th: 'ล้มเหลว', en: 'Failed' },
        download: { th: 'ดาวน์โหลดวิดีโอ', en: 'Download Video' },
        tryAgain: { th: 'ลองอีกครั้ง', en: 'Try Again' },
    },

    // Upload
    upload: {
        title: { th: 'อัปโหลดวิดีโอ', en: 'Upload Video' },
        dragDrop: { th: 'ลากไฟล์มาวางที่นี่', en: 'Drag & drop your file here' },
        or: { th: 'หรือ', en: 'or' },
        browse: { th: 'เลือกไฟล์', en: 'Browse Files' },
        start: { th: 'เริ่มตัดต่อ', en: 'Start Processing' },
    },

    // Footer
    footer: {
        tagline: { th: 'AI ตัดต่อวิดีโอให้คุณอัตโนมัติ', en: 'AI-powered automatic video editing' },
        copyright: { th: 'สงวนลิขสิทธิ์', en: 'All rights reserved' },
    },

    // Common
    common: {
        loading: { th: 'กำลังโหลด...', en: 'Loading...' },
        error: { th: 'เกิดข้อผิดพลาด', en: 'An error occurred' },
        success: { th: 'สำเร็จ', en: 'Success' },
        cancel: { th: 'ยกเลิก', en: 'Cancel' },
        save: { th: 'บันทึก', en: 'Save' },
        back: { th: 'กลับ', en: 'Back' },
    },
} as const

// Helper function to get translation
export function t(key: string, lang: Language): string {
    const keys = key.split('.')
    let result: unknown = translations

    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = (result as Record<string, unknown>)[k]
        } else {
            return key // Return key if translation not found
        }
    }

    if (result && typeof result === 'object' && lang in result) {
        return (result as Record<string, string>)[lang]
    }

    return key
}
