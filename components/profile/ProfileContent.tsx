'use client'

import { useState, useEffect } from 'react'
import { User, CreditCard, Settings, Video } from 'lucide-react'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'
import { createClient } from '@/lib/supabase/client'

export function ProfileContent() {
    const [user, setUser] = useState<{ email: string } | null>(null)
    const [credits, setCredits] = useState(5)
    const [totalCredits] = useState(10)
    const [jobCount, setJobCount] = useState(0)
    const supabase = createClient()

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser({ email: user.email || 'user@email.com' })

                // Fetch job count
                const { count } = await supabase
                    .from('jobs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)

                setJobCount(count || 0)
            }
        }
        fetchUserData()
    }, [supabase])

    const creditsPercentage = (credits / totalCredits) * 100

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <ParallaxFloating depth={0.1}>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        โปรไฟล์
                    </h1>
                </ParallaxFloating>
                <ParallaxFloating depth={0.05}>
                    <p className="text-gray-400 text-lg">
                        จัดการข้อมูลและเครดิตของคุณ
                    </p>
                </ParallaxFloating>
            </div>

            {/* User Info Card */}
            <ParallaxFloating depth={0.15}>
                <div className="glass-strong rounded-2xl p-6 border border-white/10 mb-6 hover:border-[rgb(60,100,255)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-full flex items-center justify-center glow-blue-soft">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">{user?.email || 'Loading...'}</h2>
                                <p className="text-sm text-gray-400">สมาชิก AutoCut</p>
                            </div>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </ParallaxFloating>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Credits Card */}
                <ParallaxFloating depth={0.2}>
                    <div className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-[rgb(60,100,255)] hover:-translate-y-1 transition-all duration-300 h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="w-6 h-6 text-[rgb(0,255,180)]" />
                            <h3 className="text-xl font-bold text-white">เครดิตของคุณ</h3>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400">วิดีโอที่เหลือ</span>
                                <span className="text-2xl font-bold text-gradient-electric">
                                    {credits} / {totalCredits}
                                </span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] transition-all duration-500 glow-blue-soft"
                                    style={{ width: `${creditsPercentage}%` }}
                                />
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 mb-4">
                            เติมเครดิตเพื่อตัดต่อวิดีโอเพิ่มเติม
                        </p>

                        <a
                            href="/pricing"
                            className="inline-block w-full text-center bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] hover:glow-blue text-white font-semibold py-3 px-6 rounded-xl transition-all"
                        >
                            เติมเครดิต
                        </a>
                    </div>
                </ParallaxFloating>

                {/* Job Count Card */}
                <ParallaxFloating depth={0.25}>
                    <div className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-[rgb(60,100,255)] hover:-translate-y-1 transition-all duration-300 h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <Video className="w-6 h-6 text-[rgb(60,100,255)]" />
                            <h3 className="text-xl font-bold text-white">วิดีโอของคุณ</h3>
                        </div>

                        <div className="mb-4">
                            <span className="text-4xl font-bold text-gradient-electric">{jobCount}</span>
                            <span className="text-gray-400 ml-2">วิดีโอที่ตัดต่อแล้ว</span>
                        </div>

                        <a
                            href="/jobs"
                            className="inline-block w-full text-center glass border border-white/10 hover:border-[rgb(60,100,255)] text-white font-semibold py-3 px-6 rounded-xl transition-all"
                        >
                            ดูวิดีโอทั้งหมด
                        </a>
                    </div>
                </ParallaxFloating>
            </div>

            {/* Quick Links */}
            <ParallaxFloating depth={0.15}>
                <div className="glass-strong rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <Settings className="w-6 h-6 text-[rgb(200,50,255)]" />
                        <h3 className="text-xl font-bold text-white">ลิงก์ด่วน</h3>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <a href="/upload" className="glass p-4 rounded-xl border border-white/10 hover:border-[rgb(60,100,255)] transition-all text-center">
                            <span className="text-white font-medium">อัปโหลดวิดีโอ</span>
                        </a>
                        <a href="/contact" className="glass p-4 rounded-xl border border-white/10 hover:border-[rgb(60,100,255)] transition-all text-center">
                            <span className="text-white font-medium">ติดต่อเรา</span>
                        </a>
                        <a href="/pricing" className="glass p-4 rounded-xl border border-white/10 hover:border-[rgb(60,100,255)] transition-all text-center">
                            <span className="text-white font-medium">แพ็คเกจ</span>
                        </a>
                    </div>
                </div>
            </ParallaxFloating>
        </div>
    )
}
