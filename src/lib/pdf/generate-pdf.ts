import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface GeneratePDFOptions {
  elementId?: string
  filename?: string
}

/**
 * Downloads the resume as a PDF using jsPDF + html2canvas.
 * Renders the DOM element to a canvas, then embeds it into a PDF document
 * and triggers a download — no browser print dialog is opened.
 */
export async function generatePDF(
  options: GeneratePDFOptions = {}
): Promise<void> {
  const { elementId = 'resume-preview-container', filename = 'Resume.pdf' } =
    options

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element #${elementId} not found`)
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4',
  })

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const canvasAspect = canvas.height / canvas.width
  const imgHeight = pdfWidth * canvasAspect

  // If the content fits on one page, add it directly; otherwise scale to fit
  if (imgHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight)
  } else {
    // Scale down to fit the page height
    const scaledWidth = pdfHeight / canvasAspect
    const xOffset = (pdfWidth - scaledWidth) / 2
    pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, pdfHeight)
  }

  pdf.save(filename)
}
