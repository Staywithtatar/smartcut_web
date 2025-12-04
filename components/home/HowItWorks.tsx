'use client'

import { Upload, Brain, Scissors, Download, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'

const steps = [
    {
        number: '1',
        icon: Upload,
        title: 'อัปโหลดวิดีโอ',
        description: 'เลือกวิดีโอที่ต้องการตัดต่อจากอุปกรณ์ของคุณ',
    },
    {
        number: '2',
        icon: Brain,
        title: 'AI วิเคราะห์',
        description: 'AI ถอดเสียงและวิเคราะห์เนื้อหาอัตโนมัติ',
    },
    {
        number: '3',
        icon: Scissors,
        title: 'ตัดต่ออัตโนมัติ',
        description: 'AI ตัดช่วงเงียบ ใส่ซับไตเติ้ล และปรับอัตราส่วนให้',
    },
    {
        number: '4',
        icon: Download,
        title: 'ดาวน์โหลด',
        description: 'ได้วิดีโอพร้อมโพสต์ในไม่กี่นาที',
    },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-[rgb(10,10,20)] to-[rgb(20,20,35)] overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <ParallaxFloating depth={0.1}>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            วิธีใช้งาน
                        </h2>
                    </ParallaxFloating>
                    <ParallaxFloating depth={0.05}>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            เพียง 4 ขั้นตอนง่ายๆ คุณก็ได้วิดีโอที่ตัดต่อเสร็จแล้ว
                        </p>
                    </ParallaxFloating>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection Line (Desktop) - Gradient */}
                    <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-[rgb(60,100,255)] via-[rgb(0,255,180)] to-[rgb(200,50,255)] opacity-30"></div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isLast = index === steps.length - 1
                            const depth = 0.15 + (index * 0.05)

                            return (
                                <ParallaxFloating key={index} depth={depth} className="relative h-full">
                                    <Card className="glass border-white/10 hover:border-[rgb(60,100,255)] hover-glow-blue transition-all text-center h-full group hover:-translate-y-2 duration-300">
                                        <CardContent className="pt-6">
                                            {/* Step Number */}
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] text-white text-2xl font-bold rounded-full mb-6 shadow-lg glow-blue-soft group-hover:glow-blue transition-all">
                                                {step.number}
                                            </div>

                                            {/* Icon */}
                                            <div className="mb-4 flex justify-center">
                                                <div className="w-12 h-12 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-xl flex items-center justify-center glow-blue-soft">
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-bold text-white mb-3">
                                                {step.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-gray-400">
                                                {step.description}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Arrow (Desktop, not last) */}
                                    {!isLast && (
                                        <div className="hidden lg:block absolute top-24 -right-4 z-10">
                                            <ArrowRight className="w-8 h-8 text-[rgb(0,255,180)]" />
                                        </div>
                                    )}
                                </ParallaxFloating>
                            )
                        })}
                    </div>
                </div>

                {/* CTA */}
                <ParallaxFloating depth={0.2}>
                    <div className="text-center mt-12">
                        <p className="text-lg text-gray-400 mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</p>
                        <a
                            href="/upload"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] text-white rounded-xl font-semibold text-lg hover:glow-blue transition-all shadow-lg"
                        >
                            เริ่มตัดต่อวิดีโอเลย
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </ParallaxFloating>
            </div>
        </section>
    )
}
