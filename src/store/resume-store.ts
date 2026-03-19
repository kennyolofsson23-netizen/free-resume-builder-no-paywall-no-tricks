import { create } from 'zustand'
import { Resume, ResumeTemplate, PersonalInfo } from '@/types/resume'

interface ResumeStore {
  resume: Resume | null
  setResume: (resume: Resume) => void
  updateTemplate: (template: ResumeTemplate) => void
  updatePersonalInfo: (personalInfo: PersonalInfo) => void
  createNewResume: () => void
  loadFromLocalStorage: () => void
  saveToLocalStorage: () => void
  exportAsJSON: () => string
}

const createEmptyResume = (): Resume => ({
  id: Date.now().toString(),
  template: 'modern',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: null,

  setResume: (resume: Resume) => set({ resume }),

  updateTemplate: (template: ResumeTemplate) =>
    set((state) => ({
      resume: state.resume ? { ...state.resume, template } : null,
    })),

  updatePersonalInfo: (personalInfo: PersonalInfo) =>
    set((state) => ({
      resume: state.resume ? { ...state.resume, personalInfo } : null,
    })),

  createNewResume: () => set({ resume: createEmptyResume() }),

  loadFromLocalStorage: () => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('resume-builder-data')
      if (stored) {
        const resume = JSON.parse(stored)
        set({ resume })
      } else {
        set({ resume: createEmptyResume() })
      }
    } catch (error) {
      console.error('Failed to load resume from localStorage:', error)
      set({ resume: createEmptyResume() })
    }
  },

  saveToLocalStorage: () => {
    if (typeof window === 'undefined') return

    const state = get()
    if (state.resume) {
      try {
        localStorage.setItem(
          'resume-builder-data',
          JSON.stringify({
            ...state.resume,
            updatedAt: new Date().toISOString(),
          })
        )
      } catch (error) {
        console.error('Failed to save resume to localStorage:', error)
      }
    }
  },

  exportAsJSON: () => {
    const state = get()
    if (!state.resume) return ''
    return JSON.stringify(state.resume, null, 2)
  },
}))
