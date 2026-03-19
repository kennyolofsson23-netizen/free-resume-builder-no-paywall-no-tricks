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

  // Use the browser's print engine so text is selectable and ATS-parseable
  // (html2canvas produces rasterized JPEG images where text is not copyable)
  const prevTitle = document.title
  document.title = filename

  await new Promise<void>((resolve) => {
    const cleanup = () => {
      document.title = prevTitle
      resolve()
    }
    window.addEventListener('afterprint', cleanup, { once: true })
    window.print()
  })
}
