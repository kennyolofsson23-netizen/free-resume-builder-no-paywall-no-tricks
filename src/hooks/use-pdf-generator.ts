'use client'
import { useState, useCallback } from 'react'
import { useResumeStore } from '@/store/resume-store'
import { useToast } from '@/hooks/use-toast'

export type PDFGeneratorStatus = 'idle' | 'generating' | 'success' | 'error'

export function usePdfGenerator() {
  const resume = useResumeStore((state) => state.resume)
  const { toast } = useToast()
  const [status, setStatus] = useState<PDFGeneratorStatus>('idle')

  const validateResume = useCallback((): string | null => {
    if (!resume) return 'Add your details in the editor first'
    if (!resume.personalInfo.fullName?.trim())
      return 'Add your name in the Personal tab before downloading'
    if (!resume.personalInfo.email?.trim())
      return 'Add your email in the Personal tab before downloading'
    return null
  }, [resume])

  const downloadPDF = useCallback(async () => {
    const validationError = validateResume()
    if (validationError) {
      toast({
        title: 'Almost ready — one more thing',
        description: validationError,
        variant: 'destructive',
      })
      return
    }

    setStatus('generating')
    try {
      // Dynamically import to keep initial bundle small
      const { generatePDF } = await import('@/lib/pdf/generate-pdf')
      const name = resume?.personalInfo.fullName?.trim() ?? 'Resume'
      const filename = `${name.replace(/\s+/g, '_')}_Resume.pdf`
      await generatePDF({ elementId: 'resume-preview-container', filename })
      setStatus('success')
      toast({
        title: 'PDF downloaded!',
        description: `${filename} is in your downloads folder. No account needed, no tricks.`,
      })
      // Reset status after 2 seconds
      setTimeout(() => setStatus('idle'), 2000)
    } catch (error) {
      setStatus('error')
      toast({
        title: 'PDF generation failed',
        description: 'Something went wrong. Try again in a moment.',
        variant: 'destructive',
      })
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [resume, validateResume, toast])

  return { downloadPDF, status, isGenerating: status === 'generating' }
}
