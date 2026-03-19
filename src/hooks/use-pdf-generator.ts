'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useResumeStore } from '@/store/resume-store'
import { useToast } from '@/hooks/use-toast'
import { generatePDF } from '@/lib/pdf/generate-pdf'

export type PDFGeneratorStatus = 'idle' | 'generating' | 'success' | 'error'

export function usePdfGenerator() {
  const resume = useResumeStore((state) => state.resume)
  const { toast } = useToast()
  const [status, setStatus] = useState<PDFGeneratorStatus>('idle')
  const mountedRef = useRef(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

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
      const name = resume?.personalInfo.fullName?.trim() ?? 'Resume'
      const filename = `${name.replace(/\s+/g, '_')}_Resume.pdf`
      await generatePDF({ elementId: 'resume-preview-container', filename })
      if (mountedRef.current) {
        setStatus('success')
        toast({
          title: 'PDF downloaded!',
          description: `${filename} is in your downloads folder. No account needed, no tricks.`,
        })
        // Reset status after 2 seconds
        timerRef.current = setTimeout(() => {
          if (mountedRef.current) setStatus('idle')
        }, 2000)
      }
    } catch {
      if (mountedRef.current) {
        setStatus('error')
        toast({
          title: 'PDF generation failed',
          description: 'Something went wrong. Try again in a moment.',
          variant: 'destructive',
        })
        timerRef.current = setTimeout(() => {
          if (mountedRef.current) setStatus('idle')
        }, 3000)
      }
    }
  }, [resume, validateResume, toast])

  return { downloadPDF, status, isGenerating: status === 'generating' }
}
