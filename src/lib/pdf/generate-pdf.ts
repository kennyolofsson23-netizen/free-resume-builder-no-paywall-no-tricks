/**
 * Client-side PDF generation using jsPDF + html2canvas.
 * Captures the target element and saves as a letter-size PDF.
 */
export async function generatePDF(
  elementId: string,
  filename: string
): Promise<void> {
  const html2canvas = (await import('html2canvas')).default
  const { jsPDF } = await import('jspdf')

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`)
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  })

  // Letter page dimensions in inches: 8.5 x 11
  const pageWidth = 8.5
  const pageHeight = 11

  const pdf = new jsPDF({
    format: 'letter',
    unit: 'in',
    orientation: 'portrait',
  })

  const imgData = canvas.toDataURL('image/png')

  // Calculate dimensions to fit the canvas into the letter page
  const canvasAspect = canvas.width / canvas.height
  const pageAspect = pageWidth / pageHeight

  let imgWidth = pageWidth
  let imgHeight = pageWidth / canvasAspect

  if (imgHeight > pageHeight) {
    imgHeight = pageHeight
    imgWidth = pageHeight * canvasAspect
  }

  // Center horizontally if narrower than page
  const xOffset = (pageWidth - imgWidth) / 2
  const yOffset = (pageAspect > canvasAspect ? (pageHeight - imgHeight) / 2 : 0)

  pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight)
  pdf.save(filename)
}
