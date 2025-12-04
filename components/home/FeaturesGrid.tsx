'use client'

import { Sparkles, Zap, Video, Subtitles, Maximize2, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'

const features = [
    {
        icon: Sparkles,
        title: 'ตัดต่ออัตโนมัติ',
        description: 'AI วิเคราะห์และตัดช่วงเงียบ ใส่ซับไตเติ้ล และปรับสีให้อัตโนมัติ',
    },
    {
        icon: Subtitles,
        title: 'ใส่ซับไตเติ้ล',
        description: 'ถอดเสียงอัตโนมัติและใส่ซับไตเติ้ลภาษาไทยที่สวยงาม',
    },
    {
        icon: Maximize2,
        title: 'ปรับอัตราส่วน 9:16',
        description: 'แปลงวิดีโอเป็นอัตราส่วน 9:16 พร้อมโพสต์ TikTok, Reels, Shorts',
    },
    {
        icon: Zap,
        title: 'ประมวลผลเร็ว',
        description: 'ประมวลผลเร็ว ได้วิดีโอภายในไม่กี่นาที พร้อมอัปโหลดเลย',
    },
    {
        icon: Video,
        title: 'คุณภาพสูง',
        description: 'ซับไตเติ้ลสวย สีสดใส อัตราส่วน 9:16 พร้อมโพสต์',
    },
    {
        icon: Clock,
        title: 'ใช้งานง่าย',
        description: 'ไม่ต้องมีทักษะการตัดต่อ เพียงอัปโหลดวิดีโอ AI จะทำทุกอย่างให้',
    },
]

export function FeaturesGrid() {
    return (
        <section id="features" className="py-20 px-4 bg-gradient-to-b from-[rgb(10,10,20)] to-[rgb(20,20,35)] overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                {/* Section Header */}
                <div className="text-center mb-16 relative z-10">
                    <ParallaxFloating depth={0.1}>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            ฟีเจอร์ที่คุณจะได้รับ
                        </h2>
                    </ParallaxFloating>
                    <ParallaxFloating depth={0.05}>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            AI ตัดต่อวิดีโอให้คุณอัตโนมัติ พร้อมฟีเจอร์ครบครัน
                        </p>
                    </ParallaxFloating>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        const isEven = index % 2 === 0
                        // Staggered depth based on index to create a "wave" effect
                        // Middle column moves differently than sides
                        const depth = 0.1 + (index % 3) * 0.1

                        return (
                            <ParallaxFloating key={index} depth={depth} className="h-full">
                                <Card
                                    className="glass border-white/10 hover:border-[rgb(60,100,255)] hover-glow-blue transition-all group h-full hover:-translate-y-2 duration-300"
                                >
                                    <CardHeader>
                                        <div className={`w-14 h-14 bg-gradient-to-br ${isEven ? 'from-[rgb(60,100,255)] to-[rgb(200,50,255)]' : 'from-[rgb(200,50,255)] to-[rgb(60,100,255)]'} rounded-xl flex items-center justify-center mb-4 ${isEven ? 'glow-blue-soft' : 'glow-purple-soft'} group-hover:glow-blue transition-all`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base text-gray-400">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </ParallaxFloating>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
