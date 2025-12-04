import { Navigation } from '@/components/home/Navigation'
import { PricingCards } from '@/components/pricing/PricingCards'

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-mesh">
            <Navigation />

            <main className="container mx-auto px-4 pt-24 pb-16">
                <PricingCards />
            </main>
        </div>
    )
}
