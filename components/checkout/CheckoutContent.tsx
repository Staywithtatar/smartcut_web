'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Smartphone, Wallet, Check, Lock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

const pricingPlans = {
    basic: {
        id: 'basic',
        name: 'Basic',
        price: 99,
        credits: 10,
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: 299,
        credits: 50,
    },
    premium: {
        id: 'premium',
        name: 'Premium',
        price: 599,
        credits: 150,
    },
}

const paymentMethods = [
    {
        id: 'credit-card',
        name: 'บัตรเครดิต/เดบิต',
        description: 'Visa, Mastercard, JCB',
        icon: CreditCard,
        available: true,
    },
    {
        id: 'promptpay',
        name: 'PromptPay QR Code',
        description: 'สแกนจ่ายผ่านแอปธนาคาร',
        icon: Smartphone,
        available: true,
    },
    {
        id: 'truemoney',
        name: 'TrueMoney Wallet',
        description: 'ชำระผ่าน TrueMoney',
        icon: Wallet,
        available: true,
    },
]

interface CheckoutContentProps {
    planId: string
}

export function CheckoutContent({ planId }: CheckoutContentProps) {
    const router = useRouter()
    const [selectedPayment, setSelectedPayment] = useState('credit-card')
    const [processing, setProcessing] = useState(false)

    const plan = pricingPlans[planId as keyof typeof pricingPlans] || pricingPlans.pro

    const handlePayment = async () => {
        setProcessing(true)

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        toast.success('ชำระเงินสำเร็จ!', {
            description: `เติมเครดิต ${plan.credits} วิดีโอเรียบร้อยแล้ว`
        })

        setProcessing(false)

        // Redirect to profile
        setTimeout(() => {
            router.push('/profile')
        }, 1000)
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                กลับ
            </button>

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    ชำระเงิน
                </h1>
                <p className="text-gray-400">
                    เติมเครดิตเพื่อเริ่มตัดต่อวิดีโอ
                </p>
            </div>

            {/* Order Summary */}
            <div className="glass-strong rounded-2xl p-6 border border-white/10 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">สรุปคำสั่งซื้อ</h3>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">แพ็คเกจ</span>
                        <span className="text-white font-semibold">{plan.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">เครดิต</span>
                        <span className="text-white font-semibold">{plan.credits} วิดีโอ</span>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-white">ยอดรวม</span>
                            <span className="text-2xl font-bold text-gradient-electric">{plan.price}฿</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="glass-strong rounded-2xl p-6 border border-white/10 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">เลือกวิธีชำระเงิน</h3>

                <div className="space-y-3">
                    {paymentMethods.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id)}
                            disabled={!method.available}
                            className={`
                                w-full p-4 rounded-xl border-2 transition-all text-left
                                ${selectedPayment === method.id
                                    ? 'border-[rgb(60,100,255)] bg-[rgb(60,100,255)]/10'
                                    : 'border-white/10 hover:border-white/20'
                                }
                                ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`
                                    w-12 h-12 rounded-lg flex items-center justify-center
                                    ${selectedPayment === method.id
                                        ? 'bg-gradient-to-br from-[rgb(60,100,255)] to-[rgb(200,50,255)]'
                                        : 'bg-white/5'
                                    }
                                `}>
                                    <method.icon className={`
                                        w-6 h-6
                                        ${selectedPayment === method.id ? 'text-white' : 'text-gray-400'}
                                    `} />
                                </div>

                                <div className="flex-1">
                                    <p className="font-semibold text-white">{method.name}</p>
                                    <p className="text-sm text-gray-400">{method.description}</p>
                                </div>

                                {selectedPayment === method.id && (
                                    <Check className="w-5 h-5 text-[rgb(0,255,180)]" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Payment Button */}
            <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-[rgb(60,100,255)] to-[rgb(200,50,255)] hover:glow-blue text-white font-semibold text-lg py-6"
            >
                {processing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        กำลังประมวลผล...
                    </>
                ) : (
                    <>
                        ชำระเงิน {plan.price}฿
                    </>
                )}
            </Button>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>ชำระเงินปลอดภัย SSL Encrypted</span>
            </div>

            {/* Note */}
            <div className="mt-4 p-4 bg-[rgb(60,100,255)]/10 border border-[rgb(60,100,255)]/20 rounded-xl">
                <p className="text-sm text-gray-400 text-center">
                    💡 <strong className="text-white">หมายเหตุ:</strong> ระบบชำระเงินจะเปิดใช้งานในอนาคต ตอนนี้เป็นเพียงการสาธิต
                </p>
            </div>
        </div>
    )
}
