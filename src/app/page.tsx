import type { Metadata } from 'next'
import { Header } from '@/components/shared/header'
import { Hero } from '@/components/landing/hero'
import { FeatureGrid } from '@/components/landing/feature-grid'
import { TemplateShowcase } from '@/components/landing/template-showcase'
import { TrustSignals } from '@/components/landing/trust-signals'
import { FAQ } from '@/components/landing/faq'
import { Footer } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'Free Resume Builder — No Paywall, No Tricks',
  description:
    'Free resume builder with 5 ATS-friendly templates, real-time PDF preview, and instant download. No account, no email, no paywall — ever.',
  keywords: [
    'free resume builder',
    'resume builder no paywall',
    'Zety free alternative',
    'free resume download',
    'ATS resume builder',
    'free CV builder',
  ],
  openGraph: {
    type: 'website',
    title: 'Free Resume Builder — No Paywall, No Tricks',
    description:
      'Build a resume in minutes. 5 ATS-friendly templates. Instant PDF download. No account, no email, no paywall.',
    images: [{ url: 'https://resume.usetools.dev/og-image.png', width: 1200, height: 630 }],
  },
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen">
        <Hero />
        <FeatureGrid />
        <TemplateShowcase />
        <TrustSignals />
        <FAQ />
        <Footer />
      </main>
    </>
  )
}
