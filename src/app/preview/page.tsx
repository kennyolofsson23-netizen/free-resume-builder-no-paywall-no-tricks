import type { Metadata } from 'next'
import { PreviewPageClient } from './preview-page-client'

export const metadata: Metadata = {
  title: 'Resume Preview — Free Resume Builder',
  description:
    'View and download this resume. Build your own for free — no account, no paywall.',
}

export default function PreviewPage() {
  return <PreviewPageClient />
}
