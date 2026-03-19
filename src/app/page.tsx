import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Download, Eye, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Free Resume Builder — No Paywall, No Tricks',
}

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="mb-6 inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
              Unlike Zety — we don't lock your PDF behind a subscription
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Free Resume Builder
            </h1>

            <p className="mb-8 text-xl text-slate-300">
              Professional templates. Real-time preview. Instant PDF download.
              <br />
              No email. No account. No '$1.95 trial that auto-renews.'
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/builder"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-100"
              >
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:bg-opacity-10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
            Everything you need
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Real-time Preview
              </h3>
              <p className="text-muted-foreground">
                See your resume update instantly as you type. Switch between templates with one click.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 inline-block rounded-lg bg-green-100 p-3">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Instant PDF Download
              </h3>
              <p className="text-muted-foreground">
                Download your resume as a PDF instantly. No waiting, no email, no account needed.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 inline-block rounded-lg bg-purple-100 p-3">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                5 Professional Templates
              </h3>
              <p className="text-muted-foreground">
                Choose from 5 clean, modern templates designed to pass ATS systems.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 inline-block rounded-lg bg-amber-100 p-3">
                <Zap className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                100% Client-Side
              </h3>
              <p className="text-muted-foreground">
                Your data never leaves your browser. No servers, no tracking, no corporate BS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground">
            Ready to build your resume?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            It takes less than 10 minutes. No credit card required.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center justify-center rounded-lg bg-foreground px-8 py-3 font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
