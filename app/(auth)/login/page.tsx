import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Video, Loader2 } from 'lucide-react'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'

function LoginFormFallback() {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[rgb(60,100,255)]" />
        </div>
    )
}

export default function LoginPage() {
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
                        ยินดีต้อนรับกลับ
                    </h1>
                    <p className="text-gray-400">
                        เข้าสู่ระบบเพื่อใช้งาน AI ตัดต่อวิดีโอ
                    </p>
                </div>

                {/* Login Form with Suspense for useSearchParams */}
                <Suspense fallback={<LoginFormFallback />}>
                    <LoginForm />
                </Suspense>

                {/* Sign up link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        ยังไม่มีบัญชี?{' '}
                        <Link
                            href="/signup"
                            className="text-[rgb(0,255,180)] hover:text-[rgb(60,100,255)] transition-colors font-semibold"
                        >
                            สมัครสมาชิก
                        </Link>
                    </p>
                </div>
            </div>
        </ParallaxFloating>
    )
}
