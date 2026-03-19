'use client'

import * as React from 'react'
import { useResumeStore } from '@/store/resume-store'
import { toast } from '@/hooks/use-toast'

interface UsePdfGeneratorResult {
  generatePdf: () => Promise<void>
  isGenerating: boolean
}

export function usePdfGenerator(): UsePdfGeneratorResult {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const resume = useResumeStore((state) => state.resume)

  const generatePdf = React.useCallback(async () => {
    if (!resume) {
      toast({
        title: 'No resume data',
        description: 'Please create a resume before downloading.',
        variant: 'destructive',
      })
      return
    }

    const { fullName, email } = resume.personalInfo

    if (!fullName || !email) {
      toast({
        title: 'Missing required fields',
        description:
          'Please enter your full name and email before downloading your PDF.',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)

    const { id: toastId } = toast({
      title: 'Generating your PDF...',
      description: 'Please wait while we prepare your resume.',
    })

    try {
      const { generatePDF } = await import('@/lib/pdf/generate-pdf')
      const safeName = fullName.replace(/[^a-z0-9_\- ]/gi, '_').trim()
      await generatePDF('resume-preview', `${safeName}_Resume.pdf`)

      toast({
        title: 'PDF downloaded!',
        description: 'Your resume has been saved successfully.',
      })
    } catch (error) {
      console.error('PDF generation failed:', error)
      toast({
        title: 'PDF generation failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
      // Dismiss the "generating" toast
      void toastId
    }
  }, [resume])

  return { generatePdf, isGenerating }
}
