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

  // Render element to canvas at 2× resolution for crisp output
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false,
  })

  const imgData = canvas.toDataURL('image/jpeg', 0.95)

  // US Letter: 8.5 × 11 inches = 612 × 792 points
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Scale canvas to fit the page width
  const ratio = pageWidth / canvas.width
  const scaledHeight = canvas.height * ratio

  // Add image, paginating if the content is taller than one page
  let yOffset = 0
  let remaining = scaledHeight

  while (remaining > 0) {
    pdf.addImage(imgData, 'JPEG', 0, yOffset, pageWidth, scaledHeight)
    remaining -= pageHeight
    if (remaining > 0) {
      pdf.addPage()
      yOffset -= pageHeight
    }
  }

  pdf.save(filename)
}
