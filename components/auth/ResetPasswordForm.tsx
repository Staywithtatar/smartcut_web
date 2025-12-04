'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@/lib/auth/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function ResetPasswordForm() {
    const router = useRouter()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

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

        const result = await updatePassword(password)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        }
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[rgb(var(--primary-blue))] to-[rgb(var(--primary-purple))] rounded-full flex items-center justify-center mx-auto glow-blue">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                    เปลี่ยนรหัสผ่านสำเร็จ!
                </h3>
                <p className="text-gray-400">
                    กำลังนำคุณไปหน้าเข้าสู่ระบบ...
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                    รหัสผ่านใหม่
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
                    ยืนยันรหัสผ่านใหม่
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
                        กำลังเปลี่ยนรหัสผ่าน...
                    </>
                ) : (
                    'เปลี่ยนรหัสผ่าน'
                )}
            </Button>
        </form>
    )
}
