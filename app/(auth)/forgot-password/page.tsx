import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import Link from 'next/link'
import { Video, ArrowLeft } from 'lucide-react'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'

export default function ForgotPasswordPage() {
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
                        ลืมรหัสผ่าน?
                    </h1>
                    <p className="text-gray-400">
                        กรอกอีเมลเพื่อรับลิงก์รีเซ็ตรหัสผ่าน
                    </p>
                </div>

                {/* Form */}
                <ForgotPasswordForm />

                {/* Back to login */}
                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        กลับไปหน้าเข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        </ParallaxFloating>
    )
}
