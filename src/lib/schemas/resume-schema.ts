import { z } from 'zod'

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).default(''),
  location: z.string().max(100).default(''),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  summary: z.string().max(2000).optional().or(z.literal('')),
})

export const experienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  company: z.string().min(1, 'Company is required').max(100),
  location: z.string().max(100).optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  currentlyWorking: z.boolean().default(false),
  description: z.string().max(5000).default(''),
})

export const educationSchema = z.object({
  id: z.string(),
  school: z.string().min(1, 'School is required').max(100),
  degree: z.string().min(1, 'Degree is required').max(100),
  field: z.string().max(100).default(''),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  gpa: z.string().max(10).optional().or(z.literal('')),
})

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required').max(50),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
})

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Project title is required').max(100),
  description: z.string().max(2000).default(''),
  link: z.string().url('Invalid URL').optional().or(z.literal('')),
  technologies: z.array(z.string()).default([]),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
})

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required').max(100),
  issuer: z.string().min(1, 'Issuer is required').max(100),
  issueDate: z.string().min(1, 'Issue date is required'),
  expirationDate: z.string().optional().or(z.literal('')),
  credentialUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const resumeTemplateSchema = z.enum([
  'modern',
  'classic',
  'minimal',
  'creative',
  'professional',
])

export const resumeSchema = z.object({
  id: z.string(),
  template: resumeTemplateSchema,
  personalInfo: personalInfoSchema,
  experiences: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default('#2563eb'),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type ResumeData = z.infer<typeof resumeSchema>
export type PersonalInfoData = z.infer<typeof personalInfoSchema>
export type ExperienceData = z.infer<typeof experienceSchema>
export type EducationData = z.infer<typeof educationSchema>
export type SkillData = z.infer<typeof skillSchema>
export type ProjectData = z.infer<typeof projectSchema>
export type CertificationData = z.infer<typeof certificationSchema>
