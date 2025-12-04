'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { toast } from 'sonner'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000))

        toast.success('ส่งข้อความสำเร็จ!', {
            description: 'เราจะติดต่อกลับโดยเร็วที่สุด'
        })

        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setLoading(false)

        setTimeout(() => setSubmitted(false), 3000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <ParallaxFloating depth={0.1}>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        ติดต่อ<span className="text-gradient-electric">เรา</span>
                    </h1>
                </ParallaxFloating>
                <ParallaxFloating depth={0.05}>
                    <p className="text-gray-400 text-lg">
                        มีคำถามหรือข้อเสนอแนะ? เราพร้อมรับฟัง
                    </p>
                </ParallaxFloating>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Email */}
                    <ParallaxFloating depth={0.15}>
                        <div className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-[rgb(60,100,255)] hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-lg flex items-center justify-center mb-4 glow-blue-soft">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">อีเมล</h3>
                            <p className="text-gray-400">support@autocut.com</p>
                        </div>
                    </ParallaxFloating>

                    {/* Phone */}
                    <ParallaxFloating depth={0.2}>
                        <div className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-[rgb(60,100,255)] hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-lg flex items-center justify-center mb-4 glow-blue-soft">
                                <Phone className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">โทรศัพท์</h3>
                            <p className="text-gray-400">02-XXX-XXXX</p>
                        </div>
                    </ParallaxFloating>

                    {/* Address */}
                    <ParallaxFloating depth={0.25}>
                        <div className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-[rgb(60,100,255)] hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-lg flex items-center justify-center mb-4 glow-blue-soft">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">ที่อยู่</h3>
                            <p className="text-gray-400">
                                กรุงเทพมหานคร<br />
                                ประเทศไทย
                            </p>
                        </div>
                    </ParallaxFloating>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <ParallaxFloating depth={0.18}>
                        <div className="glass-strong rounded-2xl p-8 border border-white/10">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-[rgb(0,255,180)]/20 rounded-full flex items-center justify-center mx-auto mb-4 glow-mint">
                                        <CheckCircle2 className="w-10 h-10 text-[rgb(0,255,180)]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        ส่งข้อความสำเร็จ!
                                    </h3>
                                    <p className="text-gray-400">
                                        เราจะติดต่อกลับโดยเร็วที่สุด
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <Label htmlFor="name" className="text-white mb-2 block">
                                            ชื่อ
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[rgb(60,100,255)] focus:ring-[rgb(60,100,255)]"
                                            placeholder="ชื่อของคุณ"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <Label htmlFor="email" className="text-white mb-2 block">
                                            อีเมล
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[rgb(60,100,255)] focus:ring-[rgb(60,100,255)]"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <Label htmlFor="subject" className="text-white mb-2 block">
                                            หัวข้อ
                                        </Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[rgb(60,100,255)] focus:ring-[rgb(60,100,255)]"
                                            placeholder="เรื่องที่ต้องการติดต่อ"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <Label htmlFor="message" className="text-white mb-2 block">
                                            ข้อความ
                                        </Label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={6}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-[rgb(60,100,255)] focus:outline-none focus:ring-1 focus:ring-[rgb(60,100,255)]"
                                            placeholder="รายละเอียดที่ต้องการติดต่อ..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] hover:glow-blue text-white font-semibold py-6"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                กำลังส่ง...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                ส่งข้อความ
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </ParallaxFloating>
                </div>
            </div>

            {/* Additional Info */}
            <ParallaxFloating depth={0.1}>
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        💡 เวลาทำการ: จันทร์ - ศุกร์ 9:00 - 18:00 น.
                    </p>
                </div>
            </ParallaxFloating>
        </div>
    )
}
