import { Navigation } from '@/components/home/Navigation'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturesGrid } from '@/components/home/FeaturesGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { ParallaxShowcase } from '@/components/home/ParallaxShowcase'
import { Footer } from '@/components/home/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ParallaxShowcase />
      <FeaturesGrid />
      <HowItWorks />
      <Footer />
    </div>
  )
}
