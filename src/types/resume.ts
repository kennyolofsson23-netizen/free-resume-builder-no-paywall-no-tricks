/**
 * Resume data types - source of truth for all resume data structures
 */
import type { ResumeData } from '@/lib/schemas/resume-schema'

export type ResumeTemplate =
  | 'modern'
  | 'classic'
  | 'minimal'
  | 'creative'
  | 'professional'

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  summary?: string
}

export interface Experience {
  id: string
  jobTitle: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  currentlyWorking: boolean
  description: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  gpa?: string
}

export interface Skill {
  id: string
  name: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface Project {
  id: string
  title: string
  description: string
  link?: string
  technologies?: string[]
  startDate?: string
  endDate?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expirationDate?: string
  credentialUrl?: string
}

// Resume is the canonical validated shape inferred from the Zod schema,
// ensuring runtime validation and TypeScript types stay in sync.
export type Resume = ResumeData

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  'modern',
  'classic',
  'minimal',
  'creative',
  'professional',
]

export const SKILL_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
] as const

export type SkillLevel = (typeof SKILL_LEVELS)[number]
