import type { ResumeTemplate } from '@/types/resume'

/** Available resume templates with display metadata */
export const TEMPLATE_LIST: Array<{
  id: ResumeTemplate
  name: string
  description: string
}> = [
  {
    id: 'modern',
    name: 'Modern',
    description:
      'Clean lines, accent color, two-column layout. Ideal for tech and product roles.',
  },
  {
    id: 'classic',
    name: 'Classic',
    description:
      'Single-column, serif headings, clear hierarchy. Timeless and universally ATS-safe.',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description:
      'Maximum white space. Your content does the talking, nothing else.',
  },
  {
    id: 'creative',
    name: 'Creative',
    description:
      'Bold header, icon-enhanced contact info. Stands out without sacrificing readability.',
  },
  {
    id: 'professional',
    name: 'Professional',
    description:
      'Dark sidebar, structured sections. The go-to for finance, law, and executive roles.',
  },
]

/** Skill level options */
export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
] as const

/** Field character limits */
export const FIELD_LIMITS = {
  fullName: 100,
  email: 254,
  phone: 20,
  location: 100,
  url: 2048,
  summary: 2000,
  jobTitle: 100,
  company: 100,
  description: 5000,
  school: 100,
  degree: 100,
  field: 100,
  gpa: 10,
  skillName: 50,
  projectTitle: 100,
  projectDescription: 2000,
  certName: 100,
  certIssuer: 100,
} as const

/** Default accent color for templates */
export const DEFAULT_ACCENT_COLOR = '#2563eb'

/** Preset accent colors for color picker */
export const PRESET_ACCENT_COLORS = [
  '#2563eb', // Blue
  '#7c3aed', // Violet
  '#db2777', // Pink
  '#dc2626', // Red
  '#ea580c', // Orange
  '#d97706', // Amber
  '#16a34a', // Green
  '#0891b2', // Cyan
  '#0f172a', // Slate (near black)
  '#374151', // Gray
  '#6b21a8', // Purple
  '#0e7490', // Teal
] as const

/** localStorage key for resume data */
export const STORAGE_KEY = 'resume-builder-data'

/** localStorage key for multiple resumes */
export const RESUMES_STORAGE_KEY = 'resume-builder-resumes'

/** Debounce delay for auto-save (ms) */
export const AUTO_SAVE_DEBOUNCE_MS = 1000

/** Max undo history entries */
export const MAX_UNDO_HISTORY = 50

/** Max URL hash size before compression (bytes) */
export const SHARE_COMPRESSION_THRESHOLD = 8192

/** Preview panel re-render target (ms) */
export const PREVIEW_RERENDER_TARGET_MS = 200
