'use client'

import { Check, Sparkles, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ParallaxFloating } from '@/components/ui/ParallaxFloating'

const pricingPlans = [
    {
        id: 'basic',
        name: 'Basic',
        price: 99,
        credits: 10,
        features: [
            '10 วิดีโอ',
            'คุณภาพสูงสุด 720p',
            'ความเร็วมาตรฐาน',
            'Support ทาง Email',
        ],
        popular: false,
        isComingSoon: true,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 299,
        credits: 50,
        features: [
            '50 วิดีโอ',
            'คุณภาพสูงสุด 1080p',
            'ความเร็วเร็วขึ้น 2 เท่า',
            'ไม่มี Watermark',
            'Priority Support',
        ],
        popular: true,
        discount: 'ประหยัด 40%',
        isComingSoon: true,
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 599,
        credits: 150,
        features: [
            '150 วิดีโอ',
            'คุณภาพสูงสุด 4K',
            'ความเร็วเร็วที่สุด',
            'ไม่มี Watermark',
            '24/7 Support',
            'API Access',
        ],
        popular: false,
        discount: 'ประหยัด 60%',
        isComingSoon: true,
    },
]

export function PricingCards() {
    const handleSelectPlan = (planId: string) => {
        // Coming soon - do nothing
        // window.location.href = `/checkout?plan=${planId}`
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <ParallaxFloating depth={0.1}>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        เลือก<span className="text-gradient-electric">แพ็คเกจ</span>ของคุณ
                    </h1>
                </ParallaxFloating>
                <ParallaxFloating depth={0.05}>
                    <p className="text-gray-400 text-lg">
                        เติมเครดิตเพื่อตัดต่อวิดีโอได้ไม่จำกัด
                    </p>
                </ParallaxFloating>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {pricingPlans.map((plan, index) => {
                    const depth = 0.15 + (index * 0.05)

                    return (
                        <ParallaxFloating key={plan.id} depth={depth} className="h-full">
                            <div
                                className={`
                                    relative rounded-2xl p-6 border transition-all h-full flex flex-col
                                    ${plan.popular
                                        ? 'glass-strong border-[rgb(60,100,255)] glow-blue scale-105'
                                        : 'glass-strong border-white/10 hover:border-[rgb(60,100,255)]/50 hover:-translate-y-2 duration-300'
                                    }
                                `}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] px-4 py-1 rounded-full flex items-center gap-1">
                                            <Sparkles className="w-4 h-4 text-white" />
                                            <span className="text-sm font-semibold text-white">แนะนำ</span>
                                        </div>
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {plan.discount && (
                                    <div className="absolute -top-3 -right-3">
                                        <div className="bg-[rgb(0,255,180)] px-3 py-1 rounded-full">
                                            <span className="text-xs font-bold text-[rgb(10,10,20)]">{plan.discount}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Plan Name */}
                                <h3 className={`
                                    text-2xl font-bold mb-2
                                    ${plan.popular ? 'text-gradient-electric' : 'text-white'}
                                `}>
                                    {plan.name}
                                </h3>

                                {/* Price */}
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">{plan.price}฿</span>
                                    <p className="text-gray-400 mt-1">{plan.credits} วิดีโอ</p>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-6 flex-grow">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <Check className={`
                                                w-5 h-5 flex-shrink-0 mt-0.5
                                                ${plan.popular ? 'text-[rgb(0,255,180)]' : 'text-[rgb(60,100,255)]'}
                                            `} />
                                            <span className="text-sm text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Button */}
                                {plan.isComingSoon ? (
                                    <Button
                                        disabled
                                        className="w-full font-semibold glass border border-white/10 text-gray-400 cursor-not-allowed opacity-60"
                                    >
                                        <Clock className="w-4 h-4 mr-2" />
                                        เร็วๆ นี้
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleSelectPlan(plan.id)}
                                        className={`
                                            w-full font-semibold
                                            ${plan.popular
                                                ? 'bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] hover:glow-blue text-white'
                                                : 'glass border border-white/10 hover:border-[rgb(60,100,255)] text-white'
                                            }
                                        `}
                                    >
                                        เลือกแพ็คเกจนี้
                                    </Button>
                                )}
                            </div>
                        </ParallaxFloating>
                    )
                })}
            </div>

            {/* Info */}
            <ParallaxFloating depth={0.1}>
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        💳 รองรับการชำระเงินผ่าน บัตรเครดิต, PromptPay, TrueMoney Wallet
                    </p>
                </div>
            </ParallaxFloating>
        </div>
    )
}
