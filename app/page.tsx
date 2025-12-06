import { Navigation } from '@/components/home/Navigation'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturesGrid } from '@/components/home/FeaturesGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { ParallaxShowcase } from '@/components/home/ParallaxShowcase'
import { Footer } from '@/components/home/Footer'
import { ActiveJobsPopup } from '@/components/home/ActiveJobsPopup'

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Hedcut',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'THB',
    },
    description: 'AI ตัดต่อวิดีโอให้คุณอัตโนมัติ เหมาะสำหรับ TikTok, Reels, Shorts',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <HeroSection />
      <ParallaxShowcase />
      <FeaturesGrid />
      <HowItWorks />
      <Footer />
      <ActiveJobsPopup />
    </div>
  )
}
