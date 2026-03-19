import type { Metadata } from 'next'
import { Header } from '@/components/shared/header'
import { Hero } from '@/components/landing/hero'
import { FeatureGrid } from '@/components/landing/feature-grid'
import { TemplateShowcase } from '@/components/landing/template-showcase'
import { TrustSignals } from '@/components/landing/trust-signals'
import { FAQ } from '@/components/landing/faq'
import { Footer } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'Free Resume Builder  No Paywall, No Tricks',
  description:
    "Build a professional resume for free. 5 ATS-friendly templates, real-time PDF preview, instant download. No email. No account. Unlike Zety  we don't charge $29.99/month to download your own resume.",
  keywords: [
    'free resume builder',
    'resume builder no paywall',
    'Zety free alternative',
    'free resume download',
    'ATS resume builder',
    'free CV builder',
  ],
  openGraph: {
    title: 'Free Resume Builder  No Paywall, No Tricks',
    description:
      'Build a resume in minutes. No email. No account. No $1.95 trial that auto-renews. Just your resume, instantly.',
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
