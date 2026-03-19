import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useResumeStore } from '@/store/resume-store'

// Reset store before each test
beforeEach(() => {
  useResumeStore.setState({
    resume: null,
    pastStates: [],
    futureStates: [],
  })
  vi.clearAllMocks()
})

describe('Resume Store — createNewResume', () => {
  it('creates a resume with defaults', () => {
    useResumeStore.getState().createNewResume()
    const { resume } = useResumeStore.getState()

    expect(resume).toBeDefined()
    expect(resume?.template).toBe('modern')
    expect(resume?.personalInfo.fullName).toBe('')
    expect(resume?.accentColor).toBe('#2563eb')
    expect(resume?.experiences).toHaveLength(0)
    expect(resume?.skills).toHaveLength(0)
  })
})

describe('Resume Store — updateTemplate', () => {
  it('switches template', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateTemplate('classic')
    expect(useResumeStore.getState().resume?.template).toBe('classic')
  })
})

describe('Resume Store — updatePersonalInfo', () => {
  it('merges personal info', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
    })
    const { resume } = useResumeStore.getState()
    expect(resume?.personalInfo.fullName).toBe('Jane Doe')
    expect(resume?.personalInfo.email).toBe('jane@example.com')
    // Phone should remain unchanged
    expect(resume?.personalInfo.phone).toBe('')
  })

  it('adds to undo history', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })
    expect(useResumeStore.getState().pastStates).toHaveLength(1)
  })
})

describe('Resume Store — experience CRUD', () => {
  it('adds an experience', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()
    expect(useResumeStore.getState().resume?.experiences).toHaveLength(1)
  })

  it('updates an experience', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()
    const id = useResumeStore.getState().resume!.experiences[0]!.id
    useResumeStore.getState().updateExperience(id, { jobTitle: 'Engineer' })
    expect(useResumeStore.getState().resume?.experiences[0]?.jobTitle).toBe(
      'Engineer'
    )
  })

  it('removes an experience', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()
    const id = useResumeStore.getState().resume!.experiences[0]!.id
    useResumeStore.getState().removeExperience(id)
    expect(useResumeStore.getState().resume?.experiences).toHaveLength(0)
  })

  it('reorders experiences', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()
    useResumeStore.getState().addExperience()
    const exps = useResumeStore.getState().resume!.experiences
    const [first, second] = exps
    useResumeStore.getState().reorderExperiences([second!.id, first!.id])
    const reordered = useResumeStore.getState().resume!.experiences
    expect(reordered[0]!.id).toBe(second!.id)
    expect(reordered[1]!.id).toBe(first!.id)
  })
})

describe('Resume Store — skills CRUD', () => {
  it('adds a skill', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addSkill()
    expect(useResumeStore.getState().resume?.skills).toHaveLength(1)
  })

  it('updates a skill', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addSkill()
    const id = useResumeStore.getState().resume!.skills[0]!.id
    useResumeStore
      .getState()
      .updateSkill(id, { name: 'TypeScript', level: 'expert' })
    expect(useResumeStore.getState().resume?.skills[0]?.name).toBe('TypeScript')
  })

  it('removes a skill', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addSkill()
    const id = useResumeStore.getState().resume!.skills[0]!.id
    useResumeStore.getState().removeSkill(id)
    expect(useResumeStore.getState().resume?.skills).toHaveLength(0)
  })
})

describe('Resume Store — undo/redo', () => {
  it('undoes the last change', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })
    useResumeStore.getState().undo()
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')
  })

  it('redoes an undone change', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })
    useResumeStore.getState().undo()
    useResumeStore.getState().redo()
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('Jane')
  })

  it('canUndo returns false on new resume', () => {
    useResumeStore.getState().createNewResume()
    expect(useResumeStore.getState().canUndo()).toBe(false)
  })

  it('canRedo returns false when nothing undone', () => {
    useResumeStore.getState().createNewResume()
    expect(useResumeStore.getState().canRedo()).toBe(false)
  })
})

describe('Resume Store — exportAsJSON', () => {
  it('exports valid JSON', () => {
    useResumeStore.getState().createNewResume()
    const json = useResumeStore.getState().exportAsJSON()
    expect(json).toBeTruthy()
    const parsed = JSON.parse(json)
    expect(parsed.template).toBe('modern')
    expect(parsed.personalInfo).toBeDefined()
  })

  it('returns empty string when no resume', () => {
    expect(useResumeStore.getState().exportAsJSON()).toBe('')
  })
})

const validResumeJSON = JSON.stringify({
  id: 'test-id-123',
  template: 'modern',
  personalInfo: {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '555-0100',
    location: 'New York, NY',
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
  accentColor: '#2563eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

describe('Resume Store — importFromJSON', () => {
  it('imports valid JSON', () => {
    const success = useResumeStore.getState().importFromJSON(validResumeJSON)
    expect(success).toBe(true)
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'John Doe'
    )
  })

  it('rejects invalid JSON', () => {
    useResumeStore.getState().createNewResume()
    const success = useResumeStore.getState().importFromJSON('not json')
    expect(success).toBe(false)
  })

  it('rejects JSON that fails schema validation', () => {
    const success = useResumeStore
      .getState()
      .importFromJSON(JSON.stringify({ invalid: 'data' }))
    expect(success).toBe(false)
  })
})

describe('Resume Store — accentColor', () => {
  it('updates accent color', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateAccentColor('#ff0000')
    expect(useResumeStore.getState().resume?.accentColor).toBe('#ff0000')
  })
})

describe('Resume Store — education CRUD', () => {
  it('adds an education entry', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addEducation()
    expect(useResumeStore.getState().resume?.education).toHaveLength(1)
  })

  it('removes an education entry', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addEducation()
    useResumeStore.getState().addEducation()
    const id = useResumeStore.getState().resume!.education[0]!.id
    useResumeStore.getState().removeEducation(id)
    expect(useResumeStore.getState().resume?.education).toHaveLength(1)
  })

  it('updates an education entry', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addEducation()
    const id = useResumeStore.getState().resume!.education[0]!.id
    useResumeStore
      .getState()
      .updateEducation(id, { school: 'MIT', degree: 'BS' })
    expect(useResumeStore.getState().resume?.education[0]?.school).toBe('MIT')
  })

  it('reorders education entries', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addEducation()
    useResumeStore.getState().addEducation()
    const edu = useResumeStore.getState().resume!.education
    const [first, second] = edu
    useResumeStore.getState().reorderEducation([second!.id, first!.id])
    const reordered = useResumeStore.getState().resume!.education
    expect(reordered[0]!.id).toBe(second!.id)
  })
})

describe('Resume Store — projects CRUD', () => {
  it('adds a project', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addProject()
    expect(useResumeStore.getState().resume?.projects).toHaveLength(1)
  })

  it('removes a project', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addProject()
    useResumeStore.getState().addProject()
    const id = useResumeStore.getState().resume!.projects[0]!.id
    useResumeStore.getState().removeProject(id)
    expect(useResumeStore.getState().resume?.projects).toHaveLength(1)
  })

  it('updates a project', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addProject()
    const id = useResumeStore.getState().resume!.projects[0]!.id
    useResumeStore.getState().updateProject(id, { title: 'My App' })
    expect(useResumeStore.getState().resume?.projects[0]?.title).toBe('My App')
  })
})

describe('Resume Store — certifications CRUD', () => {
  it('adds a certification', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addCertification()
    expect(useResumeStore.getState().resume?.certifications).toHaveLength(1)
  })

  it('removes a certification', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addCertification()
    useResumeStore.getState().addCertification()
    const id = useResumeStore.getState().resume!.certifications[0]!.id
    useResumeStore.getState().removeCertification(id)
    expect(useResumeStore.getState().resume?.certifications).toHaveLength(1)
  })

  it('updates a certification', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addCertification()
    const id = useResumeStore.getState().resume!.certifications[0]!.id
    useResumeStore
      .getState()
      .updateCertification(id, { name: 'AWS', issuer: 'Amazon' })
    expect(useResumeStore.getState().resume?.certifications[0]?.name).toBe(
      'AWS'
    )
  })
})

describe('Resume Store — generateShareableURL', () => {
  it('returns empty string when no resume', () => {
    const url = useResumeStore.getState().generateShareableURL()
    expect(url).toBe('')
  })

  it('generates a URL containing /preview# and encoded data', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Shareable User' })
    const url = useResumeStore.getState().generateShareableURL()
    expect(url).toContain('/preview#')
    expect(url.length).toBeGreaterThan(20)
  })
})

describe('Resume Store — loadFromShareableURL', () => {
  it('loads a resume from a valid encoded hash', () => {
    // Use a schema-valid resume as source
    useResumeStore.getState().importFromJSON(validResumeJSON)
    const url = useResumeStore.getState().generateShareableURL()
    const hash = url.split('#')[1]!

    useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
    const result = useResumeStore.getState().loadFromShareableURL(hash)
    expect(result).toBe(true)
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'John Doe'
    )
  })

  it('returns false for an invalid hash', () => {
    const result = useResumeStore
      .getState()
      .loadFromShareableURL('!!! not base64 !!!')
    expect(result).toBe(false)
  })

  it('returns false for a hash decoding to invalid data', () => {
    const bad = btoa(JSON.stringify({ foo: 'bar' }))
    const result = useResumeStore.getState().loadFromShareableURL(bad)
    expect(result).toBe(false)
  })
})
