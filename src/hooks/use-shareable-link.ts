'use client'

import { useState, useRef, useEffect } from 'react'
import { useResumeStore } from '@/store/resume-store'
import { encodeResumeForURL } from '@/lib/sharing/url-codec'
import { toast } from '@/hooks/use-toast'

interface UseShareableLinkReturn {
  generateLink: () => Promise<void>
  isCopied: boolean
}

export function useShareableLink(): UseShareableLinkReturn {
  const [isCopied, setIsCopied] = useState(false)
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current !== null) {
        clearTimeout(copiedTimerRef.current)
      }
    }
  }, [])

  const resume = useResumeStore((state) => state.resume)
  const generateShareableURL = useResumeStore(
    (state) => state.generateShareableURL
  )

  const generateLink = async (): Promise<void> => {
    // Step 1: encode (may throw if pako fails)
    let url: string
    try {
      if (resume && typeof window !== 'undefined') {
        const encoded = encodeResumeForURL(resume)
        url = `${window.location.origin}/preview#${encoded}`
      } else {
        url = generateShareableURL()
      }
    } catch (err) {
      console.error('[useShareableLink] Failed to encode resume for sharing:', err)
      toast({
        title: 'Could not generate share link',
        description: 'Failed to encode your resume. Please try again.',
        variant: 'destructive',
      })
      return
    }

    if (!url) {
      toast({
        title: 'Nothing to share yet',
        description: 'Add some information to your resume first.',
        variant: 'destructive',
      })
      return
    }

    // Step 2: copy to clipboard (may throw on permission denial)
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      toast({
        title: 'Link copied to clipboard!',
        description:
          'Anyone with this link can view your resume — no account required.',
      })

      copiedTimerRef.current = setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch {
      toast({
        title: 'Clipboard access denied',
        description:
          'Copy failed. Check your browser permissions and try again.',
        variant: 'destructive',
      })
    }
  }

  return { generateLink, isCopied }
}
