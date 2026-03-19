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
      // Lazy-load heavy PDF libraries only when user clicks download
      const [html2canvasMod, jspdfMod] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])
      const html2canvas = html2canvasMod.default as unknown as (
        element: HTMLElement,
        options?: object
      ) => Promise<HTMLCanvasElement>
      const { jsPDF } = jspdfMod

      const element = document.getElementById('resume-preview')
      if (!element) throw new Error('Preview element not found')

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const pdf = new jsPDF({
        format: 'letter',
        unit: 'in',
        orientation: 'portrait',
      })
      const imgData = canvas.toDataURL('image/png')
      const pageWidth = 8.5
      const pageHeight = 11
      const canvasAspect = canvas.width / canvas.height
      let imgWidth = pageWidth
      let imgHeight = pageWidth / canvasAspect
      if (imgHeight > pageHeight) {
        imgHeight = pageHeight
        imgWidth = pageHeight * canvasAspect
      }
      const xOffset = (pageWidth - imgWidth) / 2
      const yOffset =
        canvasAspect < pageWidth / pageHeight ? (pageHeight - imgHeight) / 2 : 0
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight)

      const safeName = fullName.replace(/[^a-z0-9_\- ]/gi, '_').trim()
      pdf.save(`${safeName}_Resume.pdf`)

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
