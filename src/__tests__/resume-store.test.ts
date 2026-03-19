import { describe, it, expect, beforeEach } from 'vitest'
import { useResumeStore } from '@/store/resume-store'

describe('Resume Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useResumeStore.setState({
      resume: null,
    })
  })

  it('should create a new resume', () => {
    useResumeStore.getState().createNewResume()
    const resume = useResumeStore.getState().resume

    expect(resume).toBeDefined()
    expect(resume?.template).toBe('modern')
    expect(resume?.personalInfo.fullName).toBe('')
  })

  it('should update template', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateTemplate('classic')

    const resume = useResumeStore.getState().resume
    expect(resume?.template).toBe('classic')
  })

  it('should update personal info', () => {
    useResumeStore.getState().createNewResume()
    const personalInfo = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      location: 'New York, NY',
    }

    useResumeStore.getState().updatePersonalInfo(personalInfo)

    const resume = useResumeStore.getState().resume
    expect(resume?.personalInfo.fullName).toBe('John Doe')
    expect(resume?.personalInfo.email).toBe('john@example.com')
  })

  it('should export as JSON', () => {
    useResumeStore.getState().createNewResume()
    const json = useResumeStore.getState().exportAsJSON()

    expect(json).toBeDefined()
    expect(json.length).toBeGreaterThan(0)

    const parsed = JSON.parse(json)
    expect(parsed.template).toBe('modern')
  })
})
