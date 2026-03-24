import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/shared/theme-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Free Resume Builder — No Paywall, No Tricks',
    template: '%s | Free Resume Builder',
  },
  description:
    'Free resume builder with 5 ATS-friendly templates, real-time PDF preview, and instant download. No account, no email, no paywall — ever.',
  keywords: [
    'free resume builder',
    'resume builder no paywall',
    'Zety free alternative',
    'free resume download',
    'ATS resume builder',
    'CV builder free',
    'resume templates free',
    'online resume builder',
  ],
  authors: [{ name: 'Free Resume Builder' }],
  creator: 'Free Resume Builder',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://free-resume-builder-no-paywall-no-tricks.usetools.dev'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Free Resume Builder — No Paywall, No Tricks',
    description:
      'Build a professional resume in minutes. 5 ATS-friendly templates. Instant PDF download. No account needed.',
    siteName: 'Free Resume Builder',
    images: [
      {
        url: 'https://free-resume-builder-no-paywall-no-tricks.usetools.dev/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: 'https://free-resume-builder-no-paywall-no-tricks.usetools.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder — No Paywall, No Tricks',
    description:
      'Build a professional resume in minutes. No account, no paywall, no tricks.',
    images: ['https://free-resume-builder-no-paywall-no-tricks.usetools.dev/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Free Resume Builder — No Paywall, No Tricks',
  description:
    'Build a professional resume for free. 5 ATS-friendly templates, real-time PDF preview, instant download. No email required. No account. No paywall.',
  url: 'https://free-resume-builder-no-paywall-no-tricks.usetools.dev',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['#tool-description'],
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    '5 ATS-friendly resume templates',
    'Real-time PDF preview',
    'Instant PDF download',
    'No account required',
    'No paywall',
    'Dark mode support',
  ],
  creator: {
    '@type': 'Organization',
    name: 'usetools.dev',
    url: 'https://usetools.dev',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'usetools.dev',
  url: 'https://usetools.dev',
  sameAs: ['https://github.com/kennyolofsson23-netizen'],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this resume builder actually free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — the Free Resume Builder is completely free. The PDF download is free, all five templates are free, and there is no trial period, credit card requirement, or hidden paywall at any step.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account to use the resume builder?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No account is required. Open the builder and start typing immediately. Your work saves automatically to your browser\'s local storage, so it persists between sessions without any login.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the resume templates ATS-compatible?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All five templates are ATS-friendly: text is fully selectable, sections use standard headings, and nothing is rendered as an image. Your resume will parse correctly through systems like Taleo, Greenhouse, Lever, and Workday.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my resume data kept private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your resume data lives entirely in your browser. There is no server, no database, and no way for anyone to access your information. When you close the tab, your data stays on your own device only.',
      },
    },
  ],
}

const jsonLd = [webAppSchema, organizationSchema, faqSchema]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
    (function() {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    })()
  `,
          }}
        />
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <Script
          defer
          data-domain="usetools.dev"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
