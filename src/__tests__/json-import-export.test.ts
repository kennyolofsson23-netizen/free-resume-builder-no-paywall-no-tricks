import { describe, it, expect, beforeEach } from 'vitest'
import { useResumeStore } from '@/store/resume-store'
import { sampleResume } from '@/lib/templates/sample-data'

describe('JSON Export', () => {
  beforeEach(() => {
    useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
    useResumeStore.getState().createNewResume()
  })

  it('exportAsJSON returns valid JSON string', () => {
    const json = useResumeStore.getState().exportAsJSON()
    expect(() => JSON.parse(json)).not.toThrow()
  })

  it('exported JSON contains complete resume data', () => {
    useResumeStore
      .getState()
      .updatePersonalInfo({ fullName: 'Jane Doe', email: 'jane@example.com' })
    const json = useResumeStore.getState().exportAsJSON()
    const data = JSON.parse(json)
    expect(data.personalInfo.fullName).toBe('Jane Doe')
    expect(data.personalInfo.email).toBe('jane@example.com')
    expect(data).toHaveProperty('experiences')
    expect(data).toHaveProperty('education')
    expect(data).toHaveProperty('skills')
    expect(data).toHaveProperty('projects')
    expect(data).toHaveProperty('certifications')
    expect(data).toHaveProperty('template')
    expect(data).toHaveProperty('accentColor')
  })

  it('exported JSON conforms to Resume TypeScript type schema', () => {
    const json = useResumeStore.getState().exportAsJSON()
    const data = JSON.parse(json)
    expect(data).toHaveProperty('id')
    expect(data).toHaveProperty('template')
    expect(data).toHaveProperty('personalInfo')
    expect(data).toHaveProperty('createdAt')
    expect(data).toHaveProperty('updatedAt')
  })

  it('returns empty string when no resume exists', () => {
    useResumeStore.setState({ resume: null })
    const json = useResumeStore.getState().exportAsJSON()
    expect(json).toBe('')
  })
})

describe('JSON Import', () => {
  beforeEach(() => {
    useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
    useResumeStore.getState().createNewResume()
  })

  it('importFromJSON loads valid resume data', () => {
    const json = JSON.stringify(sampleResume)
    const result = useResumeStore.getState().importFromJSON(json)
    expect(result).toBe(true)
    const resume = useResumeStore.getState().resume
    expect(resume?.personalInfo.fullName).toBe(
      sampleResume.personalInfo.fullName
    )
  })

  it('importFromJSON returns false for invalid JSON', () => {
    const result = useResumeStore
      .getState()
      .importFromJSON('not valid json {{{')
    expect(result).toBe(false)
  })

  it('importFromJSON returns false for valid JSON but invalid schema', () => {
    const invalidData = { foo: 'bar', notAResume: true }
    const result = useResumeStore
      .getState()
      .importFromJSON(JSON.stringify(invalidData))
    expect(result).toBe(false)
  })

  it('does not overwrite data when import fails', () => {
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Original Name' })
    const result = useResumeStore.getState().importFromJSON('invalid json')
    expect(result).toBe(false)
    // Data should still be there
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Original Name'
    )
  })

  it('importFromJSON loads all resume sections', () => {
    const json = JSON.stringify(sampleResume)
    useResumeStore.getState().importFromJSON(json)
    const resume = useResumeStore.getState().resume
    expect(resume?.experiences.length).toBeGreaterThan(0)
    expect(resume?.education.length).toBeGreaterThan(0)
    expect(resume?.skills.length).toBeGreaterThan(0)
  })

  it('roundtrip: export then import returns identical data', () => {
    useResumeStore.getState().updatePersonalInfo({
      fullName: 'Test User',
      email: 'test@example.com',
    })
    const json = useResumeStore.getState().exportAsJSON()

    // Reset to different state
    useResumeStore.getState().createNewResume()

    // Import the exported JSON
    const success = useResumeStore.getState().importFromJSON(json)
    expect(success).toBe(true)
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Test User'
    )
  })
})
