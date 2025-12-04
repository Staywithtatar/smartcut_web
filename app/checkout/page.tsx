import { Navigation } from '@/components/home/Navigation'
import { CheckoutContent } from '@/components/checkout/CheckoutContent'

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ plan?: string }>
}) {
    const { plan } = await searchParams

    return (
        <div className="min-h-screen bg-mesh">
            <Navigation />

            <main className="container mx-auto px-4 pt-24 pb-16">
                <CheckoutContent planId={plan || 'pro'} />
            </main>
        </div>
    )
}
