'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resume-store'
import { toast } from '@/hooks/use-toast'

interface UseShareableLinkReturn {
  generateLink: () => Promise<void>
  isCopied: boolean
}

export function useShareableLink(): UseShareableLinkReturn {
  const [isCopied, setIsCopied] = useState(false)
  const generateShareableURL = useResumeStore(
    (state) => state.generateShareableURL
  )

  const generateLink = async (): Promise<void> => {
    try {
      const url = generateShareableURL()
      if (!url) {
        toast({
          title: 'Error',
          description: 'No resume data to share.',
          variant: 'destructive',
        })
        return
      }

      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      toast({
        title: 'Link copied to clipboard!',
        description: 'Share this link to let others view your resume.',
      })

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard.',
        variant: 'destructive',
      })
    }
  }

  return { generateLink, isCopied }
}
