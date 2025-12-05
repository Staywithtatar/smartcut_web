'use client'

import Link from 'next/link'
import { Upload, Play, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function HeroSection() {
    const { t } = useLanguage()

    return (
        <section className="relative min-h-screen flex justify-center pt-64 pb-20 px-4 bg-mesh overflow-hidden">
            {/* Animated Gradient Orbs - Background (Slow Parallax) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <ParallaxFloating depth={0.2} className="absolute top-1/4 left-1/4">
                    <div className="w-96 h-96 bg-[rgb(60,100,255)] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-mesh"></div>
                </ParallaxFloating>
                <ParallaxFloating depth={0.3} className="absolute top-1/3 right-1/4">
                    <div className="w-96 h-96 bg-[rgb(200,50,255)] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-mesh animation-delay-2000"></div>
                </ParallaxFloating>
                <ParallaxFloating depth={0.1} className="absolute bottom-1/4 left-1/3">
                    <div className="w-96 h-96 bg-[rgb(0,255,180)] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-mesh animation-delay-4000"></div>
                </ParallaxFloating>
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center">
                    {/* Badge */}
                    <ParallaxFloating depth={0.8}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 glow-blue-soft">
                            <Sparkles className="w-4 h-4 text-[rgb(0,255,180)]" />
                            <span className="text-sm font-medium text-gray-200">🍄 Hedcut - {t('hero.title')}</span>
                        </div>
                    </ParallaxFloating>

                    {/* Main Headline */}
                    <ParallaxFloating depth={1}>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            {t('hero.title')}
                            <br />
                            <span className="text-gradient-electric animate-gradient">
                                {t('hero.subtitle')}
                            </span>
                        </h1>
                    </ParallaxFloating>

                    {/* Subheadline */}
                    <ParallaxFloating depth={1.1}>
                        <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
                            {t('hero.description')}
                        </p>
                    </ParallaxFloating>

                    {/* CTA Buttons */}
                    <ParallaxFloating depth={1.2}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] hover:glow-blue text-white shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6 h-auto font-semibold border-0"
                            >
                                <Link href="/upload" className="flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    {t('hero.cta')}
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="glass border-white/20 hover:border-[rgb(0,255,180)] hover:text-[rgb(0,255,180)] hover:glow-mint text-white text-lg px-8 py-6 h-auto font-semibold transition-all"
                            >
                                <Link href="#how-it-works" className="flex items-center gap-2">
                                    <Play className="w-5 h-5" />
                                    {t('hero.ctaSecondary')}
                                </Link>
                            </Button>
                        </div>
                    </ParallaxFloating>

                    {/* Hero Image/Video Placeholder */}
                    <ParallaxFloating depth={1.4}>
                        <div className="relative max-w-4xl mx-auto">
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 glow-blue-soft transform hover:scale-[1.02] transition-transform duration-500">
                                <div className="aspect-video glass-strong flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg glow-blue">
                                            <Sparkles className="w-10 h-10 text-white" />
                                        </div>
                                        <p className="text-gray-300 font-medium">วิดีโอตัวอย่างผลลัพธ์</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ParallaxFloating>
                </div>
            </div>
        </section>
    )
}
