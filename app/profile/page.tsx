import { Navigation } from '@/components/home/Navigation'
import { ProfileContent } from '@/components/profile/ProfileContent'

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-mesh">
            <Navigation />

            <main className="container mx-auto px-4 pt-24 pb-16">
                <ProfileContent />
            </main>
        </div>
    )
}
