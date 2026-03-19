import { create } from 'zustand'
import { z } from 'zod'
import type {
  Resume,
  ResumeTemplate,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Project,
  Certification,
} from '@/types/resume'
import { resumeSchema, resumeTemplateSchema } from '@/lib/schemas/resume-schema'
import { encodeResumeForURL, decodeResumeFromURL } from '@/lib/sharing/url-codec'
import {
  DEFAULT_ACCENT_COLOR,
  MAX_UNDO_HISTORY,
  STORAGE_KEY,
  RESUMES_STORAGE_KEY,
} from '@/lib/constants'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function createEmptyResume(): Resume {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    template: 'modern',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    accentColor: DEFAULT_ACCENT_COLOR,
    createdAt: now,
    updatedAt: now,
  }
}

interface ResumeStore {
  resume: Resume | null
  pastStates: Resume[]
  futureStates: Resume[]

  // Core CRUD
  setResume: (resume: Resume) => void
  createNewResume: () => void
  reset: () => void

  // Personal info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void

  // Experiences
  addExperience: () => void
  updateExperience: (id: string, data: Partial<Experience>) => void
  removeExperience: (id: string) => void
  reorderExperiences: (ids: string[]) => void

  // Education
  addEducation: () => void
  updateEducation: (id: string, data: Partial<Education>) => void
  removeEducation: (id: string) => void
  reorderEducation: (ids: string[]) => void

  // Skills
  addSkill: () => void
  updateSkill: (id: string, data: Partial<Skill>) => void
  removeSkill: (id: string) => void

  // Projects
  addProject: () => void
  updateProject: (id: string, data: Partial<Project>) => void
  removeProject: (id: string) => void

  // Certifications
  addCertification: () => void
  updateCertification: (id: string, data: Partial<Certification>) => void
  removeCertification: (id: string) => void

  // Template & styling
  updateTemplate: (template: ResumeTemplate) => void
  updateAccentColor: (color: string) => void

  // Persistence
  loadFromLocalStorage: () => void
  saveToLocalStorage: () => void

  // Import/Export
  exportAsJSON: () => string
  importFromJSON: (json: string) => boolean

  // Sharing
  generateShareableURL: () => string
  loadFromShareableURL: (hash: string) => boolean

  // Undo/Redo
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

function pushHistory(pastStates: Resume[], currentResume: Resume): Resume[] {
  const next = [...pastStates, currentResume]
  if (next.length > MAX_UNDO_HISTORY) {
    return next.slice(next.length - MAX_UNDO_HISTORY)
  }
  return next
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: null,
  pastStates: [],
  futureStates: [],

  setResume: (resume: Resume) =>
    set((state) => ({
      pastStates: state.resume
        ? pushHistory(state.pastStates, state.resume)
        : state.pastStates,
      futureStates: [],
      resume: { ...resume, updatedAt: new Date().toISOString() },
    })),

  createNewResume: () =>
    set({
      resume: createEmptyResume(),
      pastStates: [],
      futureStates: [],
    }),

  reset: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    set({ resume: null, pastStates: [], futureStates: [] })
  },

  updatePersonalInfo: (info: Partial<PersonalInfo>) =>
    set((state) => {
      if (!state.resume) return state
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          personalInfo: { ...state.resume.personalInfo, ...info },
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  addExperience: () =>
    set((state) => {
      if (!state.resume) return state
      const newExp: Experience = {
        id: generateId(),
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: '',
      }
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          experiences: [...state.resume.experiences, newExp],
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  updateExperience: (id: string, data: Partial<Experience>) =>
    set((state) => {
      if (!state.resume) return state
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          experiences: state.resume.experiences.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  removeExperience: (id: string) =>
    set((state) => {
      if (!state.resume) return state
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          experiences: state.resume.experiences.filter((e) => e.id !== id),
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  reorderExperiences: (ids: string[]) =>
    set((state) => {
      if (!state.resume) return state
      const map = new Map(state.resume.experiences.map((e) => [e.id, e]))
      const reordered = ids
        .map((id) => map.get(id))
        .filter(Boolean) as Experience[]
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          experiences: reordered,
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  addEducation: () =>
    set((state) => {
      if (!state.resume) return state
      const newEdu: Education = {
        id: generateId(),
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
      }
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          education: [...state.resume.education, newEdu],
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  updateEducation: (id: string, data: Partial<Education>) =>
    set((state) => {
      if (!state.resume) return state
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          education: state.resume.education.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  removeEducation: (id: string) =>
    set((state) => {
      if (!state.resume) return state
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          education: state.resume.education.filter((e) => e.id !== id),
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  reorderEducation: (ids: string[]) =>
    set((state) => {
      if (!state.resume) return state
      const map = new Map(state.resume.education.map((e) => [e.id, e]))
      const reordered = ids
        .map((id) => map.get(id))
        .filter(Boolean) as Education[]
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          education: reordered,
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  addSkill: () =>
    set((state) => {
      if (!state.resume) return state
      const newSkill: Skill = { id: generateId(), name: '' }
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          skills: [...state.resume.skills, newSkill],
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  updateSkill: (id: string, data: Partial<Skill>) =>
    set((state) => {
      if (!state.resume) return state
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          skills: state.resume.skills.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  removeSkill: (id: string) =>
    set((state) => {
      if (!state.resume) return state
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          skills: state.resume.skills.filter((s) => s.id !== id),
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  addProject: () =>
    set((state) => {
      if (!state.resume) return state
      const newProject: Project = {
        id: generateId(),
        title: '',
        description: '',
        link: '',
        technologies: [],
        startDate: '',
        endDate: '',
      }
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          projects: [...state.resume.projects, newProject],
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  updateProject: (id: string, data: Partial<Project>) =>
    set((state) => {
      if (!state.resume) return state
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          projects: state.resume.projects.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  removeProject: (id: string) =>
    set((state) => {
      if (!state.resume) return state
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          projects: state.resume.projects.filter((p) => p.id !== id),
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  addCertification: () =>
    set((state) => {
      if (!state.resume) return state
      const newCert: Certification = {
        id: generateId(),
        name: '',
        issuer: '',
        issueDate: '',
        expirationDate: '',
        credentialUrl: '',
      }
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          certifications: [...state.resume.certifications, newCert],
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  updateCertification: (id: string, data: Partial<Certification>) =>
    set((state) => {
      if (!state.resume) return state
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          certifications: state.resume.certifications.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  removeCertification: (id: string) =>
    set((state) => {
      if (!state.resume) return state
      return {
        pastStates: pushHistory(state.pastStates, state.resume),
        futureStates: [],
        resume: {
          ...state.resume,
          certifications: state.resume.certifications.filter(
            (c) => c.id !== id
          ),
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  updateTemplate: (template: ResumeTemplate) =>
    set((state) => {
      if (!state.resume) return state
      return {
        resume: {
          ...state.resume,
          template,
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  updateAccentColor: (color: string) =>
    set((state) => {
      if (!state.resume) return state
      return {
        resume: {
          ...state.resume,
          accentColor: color,
          updatedAt: new Date().toISOString(),
        },
      }
    }),

  loadFromLocalStorage: () => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Use a lenient schema for loading stored data so that in-progress
        // resumes (with empty required fields) are still restored correctly.
        const lenientPersonalInfoSchema =
          resumeSchema.shape.personalInfo.extend({
            fullName: z.string().default(''),
            email: z.string().default(''),
          })
        const lenientExperienceSchema = z.object({
          id: z.string(),
          jobTitle: z.string().default(''),
          company: z.string().default(''),
          location: z.string().optional().default(''),
          startDate: z.string().default(''),
          endDate: z.string().optional().default(''),
          currentlyWorking: z.boolean().default(false),
          description: z.string().default(''),
        })
        const lenientSkillSchema = z.object({
          id: z.string(),
          name: z.string().default(''),
          level: z
            .enum(['beginner', 'intermediate', 'advanced', 'expert'])
            .optional(),
        })
        const lenientSchema = resumeSchema.extend({
          personalInfo: lenientPersonalInfoSchema,
          experiences: z.array(lenientExperienceSchema).default([]),
          skills: z.array(lenientSkillSchema).default([]),
          template: resumeTemplateSchema.default('modern'),
          accentColor: z
            .string()
            .regex(/^#[0-9a-fA-F]{6}$/)
            .default(DEFAULT_ACCENT_COLOR),
        })
        const result = lenientSchema.safeParse(parsed)
        if (result.success) {
          set({
            resume: result.data as Resume,
            pastStates: [],
            futureStates: [],
          })
        } else {
          set({ resume: createEmptyResume(), pastStates: [], futureStates: [] })
        }
      } else {
        set({ resume: createEmptyResume(), pastStates: [], futureStates: [] })
      }
    } catch {
      set({ resume: createEmptyResume(), pastStates: [], futureStates: [] })
    }
  },

  saveToLocalStorage: () => {
    if (typeof window === 'undefined') return
    const { resume } = get()
    if (!resume) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...resume, updatedAt: new Date().toISOString() })
      )
    } catch (error) {
      throw error
    }
  },

  exportAsJSON: () => {
    const { resume } = get()
    if (!resume) return ''
    return JSON.stringify(resume, null, 2)
  },

  importFromJSON: (json: string): boolean => {
    try {
      const parsed = JSON.parse(json)
      const result = resumeSchema.safeParse(parsed)
      if (result.success) {
        set({
          resume: result.data as Resume,
          pastStates: [],
          futureStates: [],
        })
        return true
      }
      return false
    } catch {
      return false
    }
  },

  generateShareableURL: (): string => {
    const { resume } = get()
    if (!resume || typeof window === 'undefined') return ''
    try {
      const encoded = encodeResumeForURL(resume)
      return `${window.location.origin}/preview#${encoded}`
    } catch {
      return ''
    }
  },

  loadFromShareableURL: (hash: string): boolean => {
    try {
      const decoded = decodeResumeFromURL(hash)
      const result = resumeSchema.safeParse(decoded)
      if (result.success) {
        set({
          resume: result.data as Resume,
          pastStates: [],
          futureStates: [],
        })
        return true
      }
      return false
    } catch {
      return false
    }
  },

  undo: () =>
    set((state) => {
      if (state.pastStates.length === 0 || !state.resume) return state
      const previous = state.pastStates[state.pastStates.length - 1] ?? null
      return {
        pastStates: state.pastStates.slice(0, -1),
        futureStates: [state.resume, ...state.futureStates],
        resume: previous,
      }
    }),

  redo: () =>
    set((state) => {
      if (state.futureStates.length === 0 || !state.resume) return state
      const next = state.futureStates[0] ?? null
      return {
        pastStates: [...state.pastStates, state.resume],
        futureStates: state.futureStates.slice(1),
        resume: next,
      }
    }),

  canUndo: () => get().pastStates.length > 0,
  canRedo: () => get().futureStates.length > 0,
}))
