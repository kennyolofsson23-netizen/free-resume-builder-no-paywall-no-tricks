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
    "Build a professional resume for free. 5 ATS-friendly templates, real-time PDF preview, instant download. No email required. No account. No paywall. Unlike Zety, we don't lock your PDF behind a subscription.",
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder — No Paywall, No Tricks',
    description:
      'Build a professional resume in minutes. No account, no paywall, no tricks.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
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
