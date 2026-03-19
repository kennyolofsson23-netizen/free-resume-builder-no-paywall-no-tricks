import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface GeneratePDFOptions {
  elementId?: string
  filename?: string
}

export async function generatePDF(
  options: GeneratePDFOptions = {}
): Promise<void> {
  const { elementId = 'resume-preview-container', filename = 'Resume.pdf' } =
    options

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element #${elementId} not found`)
  }

  // Capture the element at 2x resolution for quality
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    // Ensure colors print correctly
    allowTaint: false,
  })

  const imgData = canvas.toDataURL('image/jpeg', 0.95)

  // US Letter dimensions in points (1 inch = 72 points)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter', // 612 x 792 pt
  })

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  // Calculate dimensions to fit the canvas in the PDF
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  const ratio = canvasWidth / canvasHeight

  // If content fits on one page, render it; otherwise tile pages
  const imgHeight = pdfWidth / ratio

  if (imgHeight <= pdfHeight) {
    // Single page
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight)
  } else {
    // Multi-page: split canvas into page-sized chunks
    let yOffset = 0
    let pageNum = 0

    while (yOffset < canvasHeight) {
      if (pageNum > 0) pdf.addPage()

      const pageHeightPx = (pdfHeight / pdfWidth) * canvasWidth
      const sourceY = yOffset
      const sourceH = Math.min(pageHeightPx, canvasHeight - yOffset)

      // Create a temporary canvas for this page slice
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvasWidth
      pageCanvas.height = sourceH
      const ctx = pageCanvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvasWidth,
          sourceH,
          0,
          0,
          canvasWidth,
          sourceH
        )
      }

      const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95)
      const pageImgHeight = (sourceH / canvasWidth) * pdfWidth
      pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pageImgHeight)

      yOffset += pageHeightPx
      pageNum++
    }
  }

  pdf.save(filename)
}
