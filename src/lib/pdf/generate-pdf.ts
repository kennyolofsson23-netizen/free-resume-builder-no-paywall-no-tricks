export interface GeneratePDFOptions {
  elementId?: string
  filename?: string
}

/**
 * Downloads the resume as a text-selectable, ATS-parseable PDF using the
 * browser's built-in print-to-PDF capability.
 *
 * The element identified by `elementId` must be present in the DOM before
 * calling this function (guards against calling before the resume renders).
 * Print styles in globals.css hide all UI chrome so only the resume prints.
 *
 * The `filename` is applied to document.title so browsers suggest it as the
 * save-as filename in the print dialog.
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

  // Suggest filename via document title (browsers use this in Save PDF dialog)
  const prevTitle = document.title
  document.title = filename.replace(/\.pdf$/i, '')

  try {
    window.print()
  } finally {
    document.title = prevTitle
  }
}
