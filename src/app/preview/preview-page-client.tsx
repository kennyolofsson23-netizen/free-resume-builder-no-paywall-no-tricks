'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Resume } from '@/types/resume'
import { decodeResumeFromURL, decodeResumeData } from '@/lib/sharing/url-codec'
import { resumeSchema } from '@/lib/schemas/resume-schema'
import { PreviewViewer } from '@/components/preview/preview-viewer'
import { PreviewCta } from '@/components/preview/preview-cta'
import { TEMPLATE_LIST } from '@/lib/constants'

type PageState = 'loading' | 'valid' | 'invalid'

export function PreviewPageClient() {
  const [state, setState] = useState<PageState>('loading')
  const [resume, setResume] = useState<Resume | null>(null)

  useEffect(() => {
    const hash = window.location.hash.slice(1)

    if (!hash) {
      setState('invalid')
      return
    }

    try {
      // Try new codec first (handles 'z:' compressed and plain base64url)
      // Fall back to legacy 'c:'/'j:' prefixed format
      const decoded =
        hash.startsWith('z:') ||
        (!hash.startsWith('c:') && !hash.startsWith('j:'))
          ? decodeResumeFromURL(hash)
          : decodeResumeData(hash)

      const result = resumeSchema.safeParse(decoded)

      if (result.success) {
        setResume(result.data as Resume)
        setState('valid')
      } else {
        setState('invalid')
      }
    } catch {
      setState('invalid')
    }
  }, [])

  const templateName = resume
    ? (TEMPLATE_LIST.find((t) => t.id === resume.template)?.name ??
      resume.template)
    : ''

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="mt-3 text-muted-foreground">
            Loading resume preview&hellip;
          </p>
        </div>
      </div>
    )
  }

  if (state === 'invalid') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Share link didn&apos;t work
          </h1>
          <p className="text-muted-foreground mb-6">
            The link may be truncated, corrupted, or from an older version of
            the builder. Ask the person who shared it to hit{' '}
            <strong>Share</strong> again and send you the new link.
          </p>
          <Link
            href="/builder"
            className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Build Your Own Resume &mdash; It&apos;s Free
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <PreviewCta templateName={templateName} />
      {resume && <PreviewViewer resume={resume} />}
    </>
  )
}
