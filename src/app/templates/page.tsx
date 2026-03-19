import type { Metadata } from 'next'
import Link from 'next/link'
import { TemplateGallery } from '@/components/templates/template-gallery'

export const metadata: Metadata = {
  title: 'Free Resume Templates — 5 Professional Designs',
  description:
    'Choose from 5 free, ATS-friendly resume templates: Modern, Classic, Minimal, Creative, and Professional. No paywall, no account needed. Download your PDF instantly.',
  keywords: [
    'free resume templates',
    'resume templates download',
    'ATS resume templates',
    'professional resume templates free',
    'modern resume template',
    'classic resume template',
    'minimal resume template',
  ],
  openGraph: {
    title: 'Free Resume Templates — 5 Professional Designs',
    description:
      'Browse 5 ATS-friendly resume templates. Select one and start building your resume instantly — free, no account required.',
  },
}

export default function TemplatesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-blue-600 hover:text-blue-700"
          >
            Free Resume Builder
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/builder"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Builder
            </Link>
            <Link
              href="/builder"
              className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Build Your Resume — It&apos;s Free
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            5 Free Professional Resume Templates
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            All templates are ATS-friendly, professionally designed, and 100%
            free to download. No account. No paywall. No tricks.
          </p>
          <p className="text-sm text-gray-500">
            Unlike Zety and Resume.io, we never charge you to download your
            resume.
          </p>
        </div>
      </div>

      {/* Template gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TemplateGallery />
      </div>

      {/* Bottom CTA */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            No paywall waiting for you at the end.
          </h2>
          <p className="text-blue-100 mb-8">
            Pick a template, fill in your details, and download your PDF — all
            free. No account. No credit card. No last-minute surprise.
          </p>
          <Link
            href="/builder"
            className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Build Your Resume — It&apos;s Free
          </Link>
        </div>
      </div>
    </main>
  )
}
