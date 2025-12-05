'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { UserMenu } from '@/components/home/UserMenu'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { createBrowserClient } from '@supabase/ssr'

interface UserData {
    email: string
    avatarUrl?: string
    name?: string
}

export function Navigation() {
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)
    const { t } = useLanguage()

    useEffect(() => {
        const checkUser = async () => {
            try {
                const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                )
                const { data: { user } } = await supabase.auth.getUser()

                if (user) {
                    setUser({
                        email: user.email || '',
                        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                        name: user.user_metadata?.full_name || user.user_metadata?.name,
                    })
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.error('Error checking user:', error)
            } finally {
                setLoading(false)
            }
        }
        checkUser()
    }, [])

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-15 h-15 rounded-xl overflow-hidden group-hover:scale-110 transition-transform">
                            <Image
                                src="/logo.png"
                                alt="Hedcut"
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </Link>

                    {/* Navigation Links - Centered */}
                    <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        <Link href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">
                            {t('nav.features')}
                        </Link>
                        <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors font-medium">
                            {t('nav.howItWorks')}
                        </Link>
                        <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors font-medium">
                            {t('nav.pricing')}
                        </Link>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-3">
                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                        ) : user ? (
                            <UserMenu
                                email={user.email}
                                credits={5}
                                avatarUrl={user.avatarUrl}
                                name={user.name}
                            />
                        ) : (
                            <>
                                {/* Login Button */}
                                <Button asChild variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/5">
                                    <Link href="/login">{t('nav.login')}</Link>
                                </Button>

                                {/* Signup Button */}
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] hover:glow-blue text-white border-0 font-semibold"
                                >
                                    <Link href="/signup">{t('nav.signup')}</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
