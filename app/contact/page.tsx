import { Navigation } from '@/components/home/Navigation'
import { ContactForm } from '@/components/contact/ContactForm'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-mesh">
            <Navigation />

            <main className="container mx-auto px-4 pt-24 pb-16">
                <ContactForm />
            </main>
        </div>
    )
}
