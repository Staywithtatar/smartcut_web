'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()

    return (
        <button
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg border border-white/10 hover:border-white/20 transition-all text-sm font-medium"
            aria-label="Switch language"
        >
            <span className={language === 'th' ? 'text-white' : 'text-gray-500'}>
                🇹🇭
            </span>
            <span className="text-gray-500">/</span>
            <span className={language === 'en' ? 'text-white' : 'text-gray-500'}>
                🇺🇸
            </span>
        </button>
    )
}
