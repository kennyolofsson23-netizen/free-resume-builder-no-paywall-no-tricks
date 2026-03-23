import jsPDF from 'jspdf'
import type { Resume } from '@/types/resume'

/**
 * A4 page constants (millimetres).
 * Exported so tests can assert against the same values.
 */
export const PDF_PAGE_WIDTH_MM = 210
export const PDF_PAGE_HEIGHT_MM = 297
export const PDF_MARGIN_MM = 15

export interface GeneratePDFOptions {
  resume: Resume
  filename?: string
}

/**
 * Downloads the resume as a text-native PDF using jsPDF.
 * All content is written as actual text objects — every glyph is selectable
 * and copyable in any PDF viewer. No rasterisation via html2canvas.
 */
export async function generatePDF(options: GeneratePDFOptions): Promise<void> {
  const { resume, filename = 'Resume.pdf' } = options

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const contentWidth = PDF_PAGE_WIDTH_MM - 2 * PDF_MARGIN_MM
  const lineHeight = 5 // mm per line at 10pt
  let y = PDF_MARGIN_MM + 5

  /** Add a new page and reset y when content would overflow. */
  const checkPageOverflow = (needed = lineHeight) => {
    if (y + needed > PDF_PAGE_HEIGHT_MM - PDF_MARGIN_MM) {
      pdf.addPage()
      y = PDF_MARGIN_MM
    }
  }

  // ── Personal Info ──────────────────────────────────────────────────────────
  const { personalInfo } = resume

  pdf.setFontSize(22)
  pdf.setFont('helvetica', 'bold')
  pdf.text(personalInfo.fullName, PDF_MARGIN_MM, y)
  y += 9

  const contacts: string[] = []
  if (personalInfo.email) contacts.push(personalInfo.email)
  if (personalInfo.phone) contacts.push(personalInfo.phone)
  if (personalInfo.location) contacts.push(personalInfo.location)
  if (personalInfo.website) contacts.push(personalInfo.website)
  if (personalInfo.linkedin) contacts.push(personalInfo.linkedin)
  if (personalInfo.github) contacts.push(personalInfo.github)

  if (contacts.length > 0) {
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    const wrappedContact = pdf.splitTextToSize(
      contacts.join('  ·  '),
      contentWidth
    )
    pdf.text(wrappedContact, PDF_MARGIN_MM, y)
    y += wrappedContact.length * lineHeight
  }

  if (personalInfo.summary) {
    y += 3
    checkPageOverflow(6)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const summaryLines = pdf.splitTextToSize(personalInfo.summary, contentWidth)
    pdf.text(summaryLines, PDF_MARGIN_MM, y)
    y += summaryLines.length * lineHeight
  }

  // ── Section header helper ──────────────────────────────────────────────────
  const addSectionHeader = (title: string) => {
    y += 5
    checkPageOverflow(10)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text(title.toUpperCase(), PDF_MARGIN_MM, y)
    y += 1.5
    pdf.setDrawColor(100, 100, 100)
    pdf.setLineWidth(0.3)
    pdf.line(PDF_MARGIN_MM, y, PDF_MARGIN_MM + contentWidth, y)
    y += 4
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
  }

  // ── Experience ─────────────────────────────────────────────────────────────
  if (resume.experiences.length > 0) {
    addSectionHeader('Experience')
    for (const exp of resume.experiences) {
      checkPageOverflow(8)
      const dateStr = exp.currentlyWorking
        ? `${exp.startDate} – Present`
        : [exp.startDate, exp.endDate].filter(Boolean).join(' – ')

      pdf.setFont('helvetica', 'bold')
      pdf.text(exp.jobTitle, PDF_MARGIN_MM, y)
      pdf.setFont('helvetica', 'normal')
      pdf.text(dateStr, PDF_MARGIN_MM + contentWidth, y, { align: 'right' })
      y += lineHeight

      const companyLocation = [exp.company, exp.location]
        .filter(Boolean)
        .join(', ')
      if (companyLocation) {
        pdf.setFont('helvetica', 'italic')
        pdf.text(companyLocation, PDF_MARGIN_MM, y)
        pdf.setFont('helvetica', 'normal')
        y += lineHeight
      }

      if (exp.description) {
        checkPageOverflow(6)
        const lines = pdf.splitTextToSize(exp.description, contentWidth)
        pdf.text(lines, PDF_MARGIN_MM, y)
        y += lines.length * lineHeight
      }
      y += 2
    }
  }

  // ── Education ──────────────────────────────────────────────────────────────
  if (resume.education.length > 0) {
    addSectionHeader('Education')
    for (const edu of resume.education) {
      checkPageOverflow(8)
      const degreeField = [edu.degree, edu.field].filter(Boolean).join(' in ')
      const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(' – ')

      pdf.setFont('helvetica', 'bold')
      pdf.text(degreeField || edu.school, PDF_MARGIN_MM, y)
      pdf.setFont('helvetica', 'normal')
      if (dateStr) {
        pdf.text(dateStr, PDF_MARGIN_MM + contentWidth, y, { align: 'right' })
      }
      y += lineHeight

      const schoolGpa = [edu.school, edu.gpa ? `GPA: ${edu.gpa}` : '']
        .filter(Boolean)
        .join('  ·  ')
      if (schoolGpa) {
        pdf.setFont('helvetica', 'italic')
        pdf.text(schoolGpa, PDF_MARGIN_MM, y)
        pdf.setFont('helvetica', 'normal')
        y += lineHeight
      }
      y += 2
    }
  }

  // ── Skills ─────────────────────────────────────────────────────────────────
  if (resume.skills.length > 0) {
    addSectionHeader('Skills')
    checkPageOverflow(6)
    const skillLines = pdf.splitTextToSize(
      resume.skills.map((s) => s.name).join('  ·  '),
      contentWidth
    )
    pdf.text(skillLines, PDF_MARGIN_MM, y)
    y += skillLines.length * lineHeight + 2
  }

  // ── Projects ───────────────────────────────────────────────────────────────
  if (resume.projects.length > 0) {
    addSectionHeader('Projects')
    for (const proj of resume.projects) {
      checkPageOverflow(8)
      pdf.setFont('helvetica', 'bold')
      pdf.text(proj.title, PDF_MARGIN_MM, y)
      pdf.setFont('helvetica', 'normal')
      y += lineHeight

      if (proj.description) {
        const lines = pdf.splitTextToSize(proj.description, contentWidth)
        pdf.text(lines, PDF_MARGIN_MM, y)
        y += lines.length * lineHeight
      }
      if (proj.technologies?.length) {
        checkPageOverflow(lineHeight)
        pdf.setFont('helvetica', 'italic')
        pdf.text(
          `Technologies: ${proj.technologies.join(', ')}`,
          PDF_MARGIN_MM,
          y
        )
        pdf.setFont('helvetica', 'normal')
        y += lineHeight
      }
      y += 2
    }
  }

  // ── Certifications ─────────────────────────────────────────────────────────
  if (resume.certifications.length > 0) {
    addSectionHeader('Certifications')
    for (const cert of resume.certifications) {
      checkPageOverflow(8)
      pdf.setFont('helvetica', 'bold')
      pdf.text(cert.name, PDF_MARGIN_MM, y)
      pdf.setFont('helvetica', 'normal')
      if (cert.issueDate) {
        pdf.text(cert.issueDate, PDF_MARGIN_MM + contentWidth, y, {
          align: 'right',
        })
      }
      y += lineHeight
      pdf.text(cert.issuer, PDF_MARGIN_MM, y)
      y += lineHeight + 2
    }
  }

  pdf.save(filename)
}
