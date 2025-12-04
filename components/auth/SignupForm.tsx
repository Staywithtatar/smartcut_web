'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { SocialLoginButtons } from './SocialLoginButtons'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function SignupForm() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [needsVerification, setNeedsVerification] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน')
            setLoading(false)
            return
        }

        // Validate password length
        if (password.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
            setLoading(false)
            return
        }

        const result = await signUp(email, password)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            // Check if email verification is required
            if (result.user && !result.user.email_confirmed_at) {
                // Email verification required
                setNeedsVerification(true)
                setLoading(false)
            } else {
                // No verification needed, redirect to upload
                router.push('/upload')
                router.refresh()
            }
        }
    }

    // Show email verification message
    if (needsVerification) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[rgb(var(--primary-blue))] to-[rgb(var(--primary-purple))] rounded-full flex items-center justify-center mx-auto glow-blue">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                    ตรวจสอบอีเมลของคุณ
                </h3>
                <p className="text-gray-400">
                    เราได้ส่งลิงก์ยืนยันไปที่ <span className="text-[rgb(var(--accent-mint))]">{email}</span>
                    <br />
                    กรุณาคลิกลิงก์เพื่อยืนยันบัญชีของคุณ
                </p>
                <Button
                    onClick={() => router.push('/login')}
                    className="bg-gradient-to-r from-[rgb(var(--primary-blue))] to-[rgb(var(--primary-purple))] hover:glow-blue text-white font-semibold"
                >
                    ไปหน้าเข้าสู่ระบบ
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Social Login */}
            <SocialLoginButtons />

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[rgb(var(--midnight))] text-gray-400">
                        หรือใช้อีเมล
                    </span>
                </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                        อีเมล
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                        รหัสผ่าน
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                    <p className="text-xs text-gray-500">
                        ต้องมีอย่างน้อย 6 ตัวอักษร
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                        ยืนยันรหัสผ่าน
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[rgb(var(--primary-blue))] to-[rgb(var(--primary-purple))] hover:glow-blue text-white font-semibold"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            กำลังสร้างบัญชี...
                        </>
                    ) : (
                        'สร้างบัญชี'
                    )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                    การสมัครสมาชิกแสดงว่าคุณยอมรับ{' '}
                    <a href="#" className="text-[rgb(var(--accent-mint))] hover:underline">
                        เงื่อนไขการใช้งาน
                    </a>
                </p>
            </form>
        </div>
    )
}
