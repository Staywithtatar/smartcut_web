import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import Link from 'next/link'
import { Video } from 'lucide-react'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'

export default function ResetPasswordPage() {
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
                        ตั้งรหัสผ่านใหม่
                    </h1>
                    <p className="text-gray-400">
                        กรุณากรอกรหัสผ่านใหม่ของคุณ
                    </p>
                </div>

                {/* Form */}
                <ResetPasswordForm />
            </div>
        </ParallaxFloating>
    )
}
