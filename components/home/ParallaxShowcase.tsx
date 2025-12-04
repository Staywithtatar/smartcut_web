'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'
import { Video, Sparkles, Zap, Layers, Scissors, TrendingUp, Palette, Music } from 'lucide-react'

export function ParallaxShowcase() {
    const containerRef = useRef(null)

    return (
        <section ref={containerRef} className="relative py-32 overflow-hidden min-h-[120vh]">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-[rgb(10,10,20)] via-[rgb(20,20,35)] to-[rgb(10,10,20)] z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-24 relative">
                    <ParallaxFloating depth={0.2} className="inline-block">
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            มิติใหม่แห่งการ
                            <br />
                            <span className="text-gradient-electric">ตัดต่อวิดีโอ</span>
                        </h2>
                    </ParallaxFloating>

                    <ParallaxFloating depth={0.1} className="max-w-2xl mx-auto">
                        <p className="text-xl text-gray-400">
                            สัมผัสประสบการณ์การใช้งานที่ลื่นไหล รวดเร็ว และทรงพลัง
                            ด้วยเทคโนโลยี AI ที่ทำงานอยู่เบื้องหลัง
                        </p>
                    </ParallaxFloating>
                </div>

                {/* Floating Gallery */}
                <div className="relative h-[800px] w-full max-w-6xl mx-auto perspective-1000">

                    {/* Center Main Content */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-20">
                        <ParallaxFloating depth={0.5}>
                            <div className="glass-strong rounded-3xl p-8 border border-white/20 glow-blue shadow-2xl">
                                <div className="aspect-[9/16] bg-black/50 rounded-2xl overflow-hidden relative mb-6">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Video className="w-16 h-16 text-white/20" />
                                    </div>
                                    {/* Simulated UI Overlay */}
                                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                                        <div className="h-2 bg-white/20 rounded-full w-3/4" />
                                        <div className="h-2 bg-white/20 rounded-full w-1/2" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">AI Processing</h3>
                                        <p className="text-xs text-gray-400">กำลังประมวลผลวิดีโอของคุณ...</p>
                                    </div>
                                </div>
                            </div>
                        </ParallaxFloating>
                    </div>

                    {/* Floating Elements - Left */}
                    <div className="absolute left-0 top-1/4 z-10 hidden md:block">
                        <ParallaxFloating depth={1.2}>
                            <div className="glass p-6 rounded-2xl border border-white/10 w-64 glow-purple-soft rotate-[-6deg]">
                                <div className="flex items-center gap-3 mb-3">
                                    <Zap className="w-6 h-6 text-[rgb(0,255,180)]" />
                                    <span className="text-white font-semibold">Fast Render</span>
                                </div>
                                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full w-[85%] bg-[rgb(0,255,180)] shadow-[0_0_10px_rgb(0,255,180)]" />
                                </div>
                                <p className="text-right text-xs text-[rgb(0,255,180)] mt-1">85% Completed</p>
                            </div>
                        </ParallaxFloating>
                    </div>

                    <div className="absolute left-20 bottom-1/4 z-30 hidden md:block">
                        <ParallaxFloating depth={0.8}>
                            <div className="glass p-4 rounded-xl border border-white/10 w-48 glow-blue-soft rotate-[3deg]">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-[rgb(60,100,255)]" />
                                    <span className="text-gray-200 text-sm">Auto Captions</span>
                                </div>
                            </div>
                        </ParallaxFloating>
                    </div>

                    {/* Floating Elements - Right */}
                    <div className="absolute right-0 top-1/3 z-10 hidden md:block">
                        <ParallaxFloating depth={1.5}>
                            <div className="glass p-6 rounded-2xl border border-white/10 w-72 glow-blue-soft rotate-[6deg]">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-400 text-sm">Export Quality</span>
                                    <span className="text-[rgb(200,50,255)] font-bold">4K 60FPS</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="aspect-video bg-white/5 rounded-lg" />
                                    <div className="aspect-video bg-white/5 rounded-lg" />
                                    <div className="aspect-video bg-white/5 rounded-lg" />
                                </div>
                            </div>
                        </ParallaxFloating>
                    </div>

                    {/* New Elements - Top Right High */}
                    <div className="absolute right-20 top-0 z-0 hidden md:block">
                        <ParallaxFloating depth={0.6}>
                            <div className="glass p-4 rounded-xl border border-white/10 w-40 glow-purple-soft rotate-[-12deg] opacity-80">
                                <div className="flex items-center gap-2">
                                    <Scissors className="w-5 h-5 text-[rgb(245,158,11)]" />
                                    <span className="text-gray-200 text-sm">Smart Cut</span>
                                </div>
                            </div>
                        </ParallaxFloating>
                    </div>

                    {/* New Elements - Bottom Left Low */}
                    <div className="absolute left-10 bottom-0 z-20 hidden md:block">
                        <ParallaxFloating depth={1.8}>
                            <div className="glass p-5 rounded-2xl border border-white/10 w-56 glow-mint rotate-[8deg]">
                                <div className="flex items-center gap-3 mb-2">
                                    <TrendingUp className="w-6 h-6 text-[rgb(0,255,180)]" />
                                    <span className="text-white font-semibold">Viral Templates</span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <div className="h-16 w-12 bg-white/10 rounded-lg" />
                                    <div className="h-16 w-12 bg-white/10 rounded-lg" />
                                    <div className="h-16 w-12 bg-white/10 rounded-lg" />
                                </div>
                            </div>
                        </ParallaxFloating>
                    </div>

                    {/* New Elements - Bottom Right */}
                    <div className="absolute right-10 bottom-10 z-20 hidden md:block">
                        <ParallaxFloating depth={1.3}>
                            <div className="glass p-4 rounded-xl border border-white/10 w-48 glow-purple-soft rotate-[-5deg]">
                                <div className="flex items-center gap-3">
                                    <Palette className="w-5 h-5 text-[rgb(200,50,255)]" />
                                    <div>
                                        <div className="text-sm text-white font-medium">Color Grading</div>
                                        <div className="text-xs text-gray-400">Cinematic Look</div>
                                    </div>
                                </div>
                            </div>
                        </ParallaxFloating>
                    </div>

                    <div className="absolute right-32 bottom-1/3 z-0 hidden md:block">
                        <ParallaxFloating depth={0.3}>
                            <div className="w-96 h-96 bg-[rgb(60,100,255)]/20 rounded-full blur-3xl" />
                        </ParallaxFloating>
                    </div>

                </div>
            </div>
        </section>
    )
}
