'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, t as translate } from './translations'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'hedcut_language'

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('th')
    const [mounted, setMounted] = useState(false)

    // Load language from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Language | null
        if (stored && (stored === 'th' || stored === 'en')) {
            setLanguageState(stored)
        }
        setMounted(true)
    }, [])

    // Save language to localStorage when changed
    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem(STORAGE_KEY, lang)
    }

    // Translation function bound to current language
    const t = (key: string) => translate(key, language)

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <LanguageContext.Provider value={{ language: 'th', setLanguage, t }}>
                {children}
            </LanguageContext.Provider>
        )
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
