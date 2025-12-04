import { SignupForm } from '@/components/auth/SignupForm'
import Link from 'next/link'
import { Video } from 'lucide-react'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'

export default function SignupPage() {
    return (
        <ParallaxFloating depth={0.15}>
            <div className="glass p-8 rounded-2xl border border-white/10 hover:border-[rgb(60,100,255)] transition-all duration-300">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-xl flex items-center justify-center glow-blue-soft group-hover:glow-blue transition-all">
                        <Video className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gradient-electric">
                        AutoCut
                    </span>
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        สร้างบัญชีใหม่
                    </h1>
                    <p className="text-gray-400">
                        เริ่มใช้งาน AI ตัดต่อวิดีโอฟรี
                    </p>
                </div>

                {/* Signup Form */}
                <SignupForm />

                {/* Login link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        มีบัญชีอยู่แล้ว?{' '}
                        <Link
                            href="/login"
                            className="text-[rgb(0,255,180)] hover:text-[rgb(60,100,255)] transition-colors font-semibold"
                        >
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                </div>
            </div>
        </ParallaxFloating>
    )
}
