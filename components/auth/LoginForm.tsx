'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from '@/lib/auth/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Checkbox } from '@/components/ui/Checkbox'
import { SocialLoginButtons } from './SocialLoginButtons'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectTo') || '/'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await signIn(email, password, rememberMe)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            toast.error('เข้าสู่ระบบไม่สำเร็จ', {
                description: result.error
            })
        } else {
            toast.success('เข้าสู่ระบบสำเร็จ!', {
                description: 'ยินดีต้อนรับกลับมา'
            })
            router.push(redirectTo)
            router.refresh()
        }
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
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm text-gray-400 cursor-pointer"
                        >
                            จำการเข้าสู่ระบบ
                        </label>
                    </div>

                    <Link
                        href="/forgot-password"
                        className="text-sm text-[rgb(var(--accent-mint))] hover:text-[rgb(var(--primary-purple))] transition-colors"
                    >
                        ลืมรหัสผ่าน?
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[rgb(var(--primary-blue))] to-[rgb(var(--primary-purple))] hover:glow-blue text-white font-semibold"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            กำลังเข้าสู่ระบบ...
                        </>
                    ) : (
                        'เข้าสู่ระบบ'
                    )}
                </Button>
            </form>
        </div>
    )
}
