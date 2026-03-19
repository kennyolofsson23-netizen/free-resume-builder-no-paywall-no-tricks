/**
 * Tests for resume store localStorage persistence:
 *   - loadFromLocalStorage
 *   - saveToLocalStorage
 * These test the full save → load roundtrip and edge-cases.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useResumeStore } from '@/store/resume-store'
import { STORAGE_KEY } from '@/lib/constants'
import type { Resume } from '@/types/resume'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeValidStoredResume(overrides = {}) {
  const now = new Date().toISOString()
  return {
    id: 'stored-resume-1',
    template: 'classic',
    personalInfo: {
      fullName: 'Stored User',
      email: 'stored@example.com',
      phone: '555-0100',
      location: 'San Francisco, CA',
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
    accentColor: '#7c3aed',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

beforeEach(() => {
  useResumeStore.setState({
    resume: null,
    pastStates: [],
    futureStates: [],
  })
  localStorage.clear()
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// loadFromLocalStorage
// ---------------------------------------------------------------------------

describe('loadFromLocalStorage — no data stored', () => {
  it('creates a fresh empty resume when localStorage is empty', () => {
    useResumeStore.getState().loadFromLocalStorage()

    const { resume } = useResumeStore.getState()
    expect(resume).not.toBeNull()
    expect(resume?.personalInfo.fullName).toBe('')
    expect(resume?.personalInfo.email).toBe('')
    expect(resume?.template).toBe('modern')
  })

  it('generates a unique id for the new empty resume', () => {
    useResumeStore.getState().loadFromLocalStorage()
    const { resume } = useResumeStore.getState()
    expect(resume?.id).toBeTruthy()
    expect(typeof resume?.id).toBe('string')
  })
})

describe('loadFromLocalStorage — valid stored data', () => {
  it('loads the stored resume from localStorage', () => {
    const stored = makeValidStoredResume()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

    useResumeStore.getState().loadFromLocalStorage()

    const { resume } = useResumeStore.getState()
    expect(resume?.personalInfo.fullName).toBe('Stored User')
    expect(resume?.personalInfo.email).toBe('stored@example.com')
  })

  it('preserves template on load', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(makeValidStoredResume({ template: 'creative' }))
    )

    useResumeStore.getState().loadFromLocalStorage()
    expect(useResumeStore.getState().resume?.template).toBe('creative')
  })

  it('preserves accentColor on load', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(makeValidStoredResume({ accentColor: '#dc2626' }))
    )

    useResumeStore.getState().loadFromLocalStorage()
    expect(useResumeStore.getState().resume?.accentColor).toBe('#dc2626')
  })

  it('preserves nested experience data on load', () => {
    const stored = makeValidStoredResume({
      experiences: [
        {
          id: 'exp-1',
          jobTitle: 'Engineer',
          company: 'Acme',
          location: 'NYC',
          startDate: '2020-01',
          endDate: '',
          currentlyWorking: true,
          description: 'Built systems.',
        },
      ],
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

    useResumeStore.getState().loadFromLocalStorage()

    const { resume } = useResumeStore.getState()
    expect(resume?.experiences).toHaveLength(1)
    expect(resume?.experiences[0]?.jobTitle).toBe('Engineer')
  })

  it('clears undo/redo history after successful load', () => {
    // Put something in history first
    useResumeStore.setState({
      resume: makeValidStoredResume() as Resume,
      pastStates: [makeValidStoredResume() as Resume],
      futureStates: [makeValidStoredResume() as Resume],
    })

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        makeValidStoredResume({
          personalInfo: {
            fullName: 'Loaded',
            email: 'l@e.com',
            phone: '',
            location: '',
            website: '',
            linkedin: '',
            github: '',
            summary: '',
          },
        })
      )
    )

    useResumeStore.getState().loadFromLocalStorage()

    expect(useResumeStore.getState().pastStates).toHaveLength(0)
    expect(useResumeStore.getState().futureStates).toHaveLength(0)
  })
})

describe('loadFromLocalStorage — invalid stored data', () => {
  it('creates empty resume when stored JSON fails schema validation', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ invalid: 'data' }))

    useResumeStore.getState().loadFromLocalStorage()

    const { resume } = useResumeStore.getState()
    expect(resume).not.toBeNull()
    expect(resume?.personalInfo.fullName).toBe('')
  })

  it('creates empty resume when stored data is malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json {{{{')

    useResumeStore.getState().loadFromLocalStorage()

    const { resume } = useResumeStore.getState()
    expect(resume).not.toBeNull()
    expect(resume?.personalInfo.fullName).toBe('')
  })

  it('creates empty resume when stored data has wrong template value', () => {
    const badResume = makeValidStoredResume({ template: 'unknown-template' })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(badResume))

    useResumeStore.getState().loadFromLocalStorage()

    const { resume } = useResumeStore.getState()
    expect(resume?.personalInfo.fullName).toBe('')
  })

  it('creates empty resume when stored data has invalid accentColor', () => {
    const badResume = makeValidStoredResume({ accentColor: 'not-a-hex' })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(badResume))

    useResumeStore.getState().loadFromLocalStorage()

    const { resume } = useResumeStore.getState()
    expect(resume?.personalInfo.fullName).toBe('')
  })
})

// ---------------------------------------------------------------------------
// saveToLocalStorage
// ---------------------------------------------------------------------------

describe('saveToLocalStorage — basic behavior', () => {
  it('saves current resume to localStorage', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({
      fullName: 'Save Me',
      email: 'save@example.com',
    })

    useResumeStore.getState().saveToLocalStorage()

    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed.personalInfo.fullName).toBe('Save Me')
    expect(parsed.personalInfo.email).toBe('save@example.com')
  })

  it('does not write to localStorage when no resume exists', () => {
    useResumeStore.getState().saveToLocalStorage()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('saved data is valid JSON', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().saveToLocalStorage()

    const stored = localStorage.getItem(STORAGE_KEY)
    expect(() => JSON.parse(stored!)).not.toThrow()
  })

  it('saved data includes updatedAt timestamp', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().saveToLocalStorage()

    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = JSON.parse(stored!)
    expect(parsed.updatedAt).toBeTruthy()
    expect(() => new Date(parsed.updatedAt)).not.toThrow()
  })

  it('saved data includes all resume sections', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()
    useResumeStore.getState().addSkill()
    useResumeStore.getState().addEducation()
    useResumeStore.getState().saveToLocalStorage()

    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = JSON.parse(stored!)
    expect(parsed.experiences).toHaveLength(1)
    expect(parsed.skills).toHaveLength(1)
    expect(parsed.education).toHaveLength(1)
  })

  it('throws when localStorage quota is exceeded', () => {
    useResumeStore.getState().createNewResume()
    vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError')
    })

    expect(() => useResumeStore.getState().saveToLocalStorage()).toThrow()
  })
})

// ---------------------------------------------------------------------------
// Full roundtrip: saveToLocalStorage → loadFromLocalStorage
// ---------------------------------------------------------------------------

describe('Persistence roundtrip — save then load', () => {
  it('restores fullName after roundtrip', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({
      fullName: 'Roundtrip User',
      email: 'round@example.com',
    })
    useResumeStore.getState().saveToLocalStorage()

    // Clear store
    useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })

    useResumeStore.getState().loadFromLocalStorage()
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Roundtrip User'
    )
  })

  it('restores template after roundtrip', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateTemplate('professional')
    useResumeStore.getState().saveToLocalStorage()

    useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })

    useResumeStore.getState().loadFromLocalStorage()
    expect(useResumeStore.getState().resume?.template).toBe('professional')
  })

  it('restores accentColor after roundtrip', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateAccentColor('#16a34a')
    useResumeStore.getState().saveToLocalStorage()

    useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })

    useResumeStore.getState().loadFromLocalStorage()
    expect(useResumeStore.getState().resume?.accentColor).toBe('#16a34a')
  })

  it('restores skills after roundtrip', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addSkill()
    const skillId = useResumeStore.getState().resume!.skills[0]!.id
    useResumeStore
      .getState()
      .updateSkill(skillId, { name: 'Python', level: 'advanced' })
    useResumeStore.getState().saveToLocalStorage()

    useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })

    useResumeStore.getState().loadFromLocalStorage()
    const { resume } = useResumeStore.getState()
    expect(resume?.skills).toHaveLength(1)
    expect(resume?.skills[0]?.name).toBe('Python')
    expect(resume?.skills[0]?.level).toBe('advanced')
  })

  it('restores experiences after roundtrip', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()
    const expId = useResumeStore.getState().resume!.experiences[0]!.id
    useResumeStore
      .getState()
      .updateExperience(expId, { jobTitle: 'Staff Eng', company: 'TechCorp' })
    useResumeStore.getState().saveToLocalStorage()

    useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })

    useResumeStore.getState().loadFromLocalStorage()
    const { resume } = useResumeStore.getState()
    expect(resume?.experiences).toHaveLength(1)
    expect(resume?.experiences[0]?.jobTitle).toBe('Staff Eng')
    expect(resume?.experiences[0]?.company).toBe('TechCorp')
  })

  it('saves over previous entry on repeated saves', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({
      fullName: 'First',
      email: 'first@example.com',
    })
    useResumeStore.getState().saveToLocalStorage()

    useResumeStore.getState().updatePersonalInfo({ fullName: 'Second' })
    useResumeStore.getState().saveToLocalStorage()

    const stored = localStorage.getItem(STORAGE_KEY)!
    const parsed = JSON.parse(stored)
    expect(parsed.personalInfo.fullName).toBe('Second')
  })
})
