'use client'

import { useState } from 'react'
import { resetPassword } from '@/lib/auth/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Loader2, Mail } from 'lucide-react'

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await resetPassword(email)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[rgb(var(--primary-blue))] to-[rgb(var(--primary-purple))] rounded-full flex items-center justify-center mx-auto glow-blue">
                    <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                    ตรวจสอบอีเมลของคุณ
                </h3>
                <p className="text-gray-400">
                    เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่{' '}
                    <span className="text-[rgb(var(--accent-mint))]">{email}</span>
                    <br />
                    กรุณาคลิกลิงก์เพื่อตั้งรหัสผ่านใหม่
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

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[rgb(var(--primary-blue))] to-[rgb(var(--primary-purple))] hover:glow-blue text-white font-semibold"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        กำลังส่ง...
                    </>
                ) : (
                    'ส่งลิงก์รีเซ็ตรหัสผ่าน'
                )}
            </Button>
        </form>
    )
}
