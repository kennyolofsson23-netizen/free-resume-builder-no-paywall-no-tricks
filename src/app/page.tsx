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
    'The best free resume builder with no paywall. Build a professional resume online with 5 ATS-friendly templates, real-time PDF preview, and instant download. No email, no account, no tricks. The best Zety free alternative.',
  keywords: [
    'free resume builder no paywall',
    'Zety free alternative',
    'resume builder free download',
    'free resume builder no sign up',
    'ATS resume builder free',
    'free resume builder no credit card',
    'online resume builder free',
    'resume builder no subscription',
    'free CV builder',
    'resume maker free',
  ],
  alternates: {
    canonical: 'https://freeresumebuilder.app',
  },
  openGraph: {
    type: 'website',
    url: 'https://freeresumebuilder.app',
    title: 'Free Resume Builder — No Paywall, No Tricks',
    description:
      'Build a professional resume for free. 5 ATS-friendly templates, real-time preview, instant PDF download. No account required. The Zety alternative that actually stays free.',
    siteName: 'Free Resume Builder',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Resume Builder — No Paywall, No Tricks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder — No Paywall, No Tricks',
    description:
      'Build your resume for free. No account, no paywall, no tricks. Instant PDF download.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Free Resume Builder',
  url: 'https://freeresumebuilder.app',
  description:
    'Free online resume builder with 5 professional templates, real-time preview, and instant PDF download. No account or payment required.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Real-time resume preview',
    'Instant PDF download',
    '5 professional templates',
    '100% private — data never leaves browser',
    'No account required',
    'ATS-friendly templates',
    'Shareable resume links',
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content" className="min-h-screen">
        <Hero />
        <TrustSignals />
        <FeatureGrid />
        <TemplateShowcase />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
