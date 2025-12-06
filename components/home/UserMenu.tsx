'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User, CreditCard, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { signOut } from '@/lib/auth/actions'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface UserMenuProps {
    email: string
    credits?: number
    avatarUrl?: string
    name?: string
}

export function UserMenu({ email, credits = 0, avatarUrl, name }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useLanguage()

    const handleLogout = async () => {
        toast.success(t('nav.logout') + '!')
        await signOut()
    }

    return (
        <div className="relative">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="ghost"
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-white/5"
            >
                {/* Avatar */}
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt={name || email}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/50"
                    />
                ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                )}
                <span className="hidden md:inline text-sm">{email}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 glass rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden">
                        {/* User Info */}
                        <div className="p-4 border-b border-white/10">
                            <p className="text-white font-medium truncate">{name || email}</p>
                            <p className="text-sm text-[rgb(0,255,180)]">{credits} {t('user.creditsRemaining')}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <User className="w-4 h-4" />
                                {t('user.profile')}
                            </Link>
                            <Link
                                href="/jobs"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                {t('user.myJobs')}
                            </Link>
                            <Link
                                href="/pricing"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <CreditCard className="w-4 h-4" />
                                {t('user.buyCredits')}
                            </Link>
                        </div>

                        {/* Logout */}
                        <div className="p-2 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full"
                            >
                                <LogOut className="w-4 h-4" />
                                {t('nav.logout')}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
