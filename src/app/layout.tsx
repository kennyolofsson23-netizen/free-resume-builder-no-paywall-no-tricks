import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Resume Builder — No Paywall, No Tricks',
  description:
    "Professional resume builder with 5 clean templates, real-time preview, and instant PDF download. No email, no account, no paywall. Unlike Zety, we don't lock your PDF behind a subscription.",
  keywords: [
    'resume builder',
    'free resume',
    'no paywall',
    'Zety alternative',
    'CV builder',
    'resume templates',
  ],
  authors: [{ name: 'Resume Builder Team' }],
  creator: 'Resume Builder Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://resumebuilder.example.com',
    title: 'Free Resume Builder — No Paywall, No Tricks',
    description: 'Professional resume builder with no paywall',
    siteName: 'Free Resume Builder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder — No Paywall, No Tricks',
    description: 'Professional resume builder with no paywall',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <div className="min-h-screen bg-background">{children}</div>
      </body>
    </html>
  )
}
