import { Navigation } from '@/components/home/Navigation'
import { PricingCards } from '@/components/pricing/PricingCards'
import { Footer } from '@/components/home/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ราคาแพ็คเกจ | Hedcut - AI ตัดต่อวิดีโอ',
    description: 'เลือกแพ็คเกจที่เหมาะกับคุณ เริ่มต้นฟรี! ตัดต่อวิดีโออัตโนมัติด้วย AI สำหรับ TikTok, Reels, Shorts',
    openGraph: {
        title: 'ราคาแพ็คเกจ | Hedcut - AI ตัดต่อวิดีโอ',
        description: 'เลือกแพ็คเกจที่เหมาะกับคุณ เริ่มต้นฟรี! ตัดต่อวิดีโออัตโนมัติด้วย AI',
    }
}

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-mesh">
            <Navigation />

            <main className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            เลือกแพ็คเกจของคุณ
                        </h1>
                        <p className="text-xl text-gray-300">
                            เติมเครดิตเพื่อตัดต่อวิดีโอได้ไม่จำกัด
                        </p>
                    </div>

                    <PricingCards />
                </div>
            </main>

            <Footer />
        </div>
    )
}
