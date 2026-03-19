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

describe('Form Editor — Personal Info', () => {
  it('personal info starts with empty fields after createNewResume', () => {
    useResumeStore.getState().createNewResume()
    const { resume } = useResumeStore.getState()

    expect(resume).toBeDefined()
    expect(resume?.personalInfo.fullName).toBe('')
    expect(resume?.personalInfo.email).toBe('')
    expect(resume?.personalInfo.phone).toBe('')
    expect(resume?.personalInfo.location).toBe('')
    expect(resume?.personalInfo.website).toBe('')
    expect(resume?.personalInfo.linkedin).toBe('')
    expect(resume?.personalInfo.github).toBe('')
    expect(resume?.personalInfo.summary).toBe('')
  })

  it('updatePersonalInfo updates fields individually', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane Doe' })

    const { resume } = useResumeStore.getState()
    expect(resume?.personalInfo.fullName).toBe('Jane Doe')
    // Other fields unchanged
    expect(resume?.personalInfo.email).toBe('')
  })

  it('updatePersonalInfo can update multiple fields at once', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({
      fullName: 'John Smith',
      email: 'john@example.com',
      phone: '555-1234',
    })

    const { resume } = useResumeStore.getState()
    expect(resume?.personalInfo.fullName).toBe('John Smith')
    expect(resume?.personalInfo.email).toBe('john@example.com')
    expect(resume?.personalInfo.phone).toBe('555-1234')
  })
})

describe('Form Editor — Add Experience', () => {
  it('addExperience adds a new empty experience entry', () => {
    useResumeStore.getState().createNewResume()
    expect(useResumeStore.getState().resume?.experiences).toHaveLength(0)

    useResumeStore.getState().addExperience()

    const { resume } = useResumeStore.getState()
    expect(resume?.experiences).toHaveLength(1)
  })

  it('new experience entry has empty required fields', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()

    const exp = useResumeStore.getState().resume?.experiences[0]
    expect(exp).toBeDefined()
    expect(exp?.jobTitle).toBe('')
    expect(exp?.company).toBe('')
    expect(exp?.currentlyWorking).toBe(false)
    expect(exp?.description).toBe('')
  })

  it('addExperience can be called multiple times', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()
    useResumeStore.getState().addExperience()
    useResumeStore.getState().addExperience()

    expect(useResumeStore.getState().resume?.experiences).toHaveLength(3)
  })

  it('removeExperience removes the correct entry', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()
    useResumeStore.getState().addExperience()

    const experiences = useResumeStore.getState().resume?.experiences ?? []
    expect(experiences).toHaveLength(2)

    const firstExp = experiences[0]
    if (!firstExp) throw new Error('Expected first experience to exist')
    useResumeStore.getState().removeExperience(firstExp.id)

    const remaining = useResumeStore.getState().resume?.experiences ?? []
    expect(remaining).toHaveLength(1)
    expect(remaining[0]?.id).not.toBe(firstExp.id)
  })
})

describe('Form Editor — Currently Working checkbox', () => {
  it('setting currentlyWorking to true clears endDate', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()

    const expArr = useResumeStore.getState().resume!.experiences
    const exp = expArr[0]
    if (!exp) throw new Error('Expected experience to exist')

    // Set an end date first
    useResumeStore.getState().updateExperience(exp.id, { endDate: '2023-12' })
    expect(useResumeStore.getState().resume?.experiences[0]?.endDate).toBe(
      '2023-12'
    )

    // Check "currently working" — should clear end date
    useResumeStore.getState().updateExperience(exp.id, {
      currentlyWorking: true,
      endDate: '',
    })

    const updated = useResumeStore.getState().resume?.experiences[0]
    expect(updated?.currentlyWorking).toBe(true)
    expect(updated?.endDate).toBe('')
  })

  it('unchecking currentlyWorking allows setting endDate again', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addExperience()

    const expArr2 = useResumeStore.getState().resume!.experiences
    const exp = expArr2[0]
    if (!exp) throw new Error('Expected experience to exist')

    // Set currently working
    useResumeStore.getState().updateExperience(exp.id, {
      currentlyWorking: true,
      endDate: '',
    })

    // Uncheck currently working and provide end date
    useResumeStore.getState().updateExperience(exp.id, {
      currentlyWorking: false,
      endDate: '2024-06',
    })

    const updated = useResumeStore.getState().resume?.experiences[0]
    expect(updated?.currentlyWorking).toBe(false)
    expect(updated?.endDate).toBe('2024-06')
  })
})
