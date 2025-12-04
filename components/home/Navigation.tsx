'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Video } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { UserMenu } from '@/components/home/UserMenu'
import { createBrowserClient } from '@supabase/ssr'

export function Navigation() {
    const [user, setUser] = useState<{ email: string } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            try {
                const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                )
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user ? { email: user.email || '' } : null)
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
                        <div className="w-10 h-10 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-xl flex items-center justify-center glow-blue-soft group-hover:glow-blue transition-all">
                            <Video className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gradient-electric">
                            AutoCut
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                            ฟีเจอร์
                        </Link>
                        <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                            วิธีใช้งาน
                        </Link>
                        <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                            ราคา
                        </Link>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-3">
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                        ) : user ? (
                            <UserMenu email={user.email} credits={5} />
                        ) : (
                            <>
                                {/* Login Button */}
                                <Button asChild variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/5">
                                    <Link href="/login">เข้าสู่ระบบ</Link>
                                </Button>

                                {/* Signup Button */}
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] hover:glow-blue text-white border-0 font-semibold"
                                >
                                    <Link href="/signup">สมัครสมาชิก</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
