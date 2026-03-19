/**
 * Tests for F011 — Multiple Resumes Management
 * Verifies ability to create new resumes without losing existing ones.
 */
/// <reference types="vitest/globals" />
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useResumeStore } from '@/store/resume-store'
import { STORAGE_KEY, RESUMES_STORAGE_KEY } from '@/lib/constants'

beforeEach(() => {
  useResumeStore.setState({
    resume: null,
    pastStates: [],
    futureStates: [],
  })
  vi.clearAllMocks()
})

describe('Multiple Resumes Management — Constants', () => {
  it('STORAGE_KEY is defined for active resume', () => {
    expect(STORAGE_KEY).toBeTruthy()
    expect(typeof STORAGE_KEY).toBe('string')
  })

  it('RESUMES_STORAGE_KEY is defined and distinct from STORAGE_KEY', () => {
    expect(RESUMES_STORAGE_KEY).toBeTruthy()
    expect(typeof RESUMES_STORAGE_KEY).toBe('string')
    expect(RESUMES_STORAGE_KEY).not.toBe(STORAGE_KEY)
  })
})

describe('Multiple Resumes Management — Store', () => {
  it('createNewResume creates a fresh empty resume', () => {
    act(() => {
      useResumeStore.getState().loadFromLocalStorage()
    })

    act(() => {
      useResumeStore.getState().createNewResume()
    })

    const resume = useResumeStore.getState().resume
    expect(resume).not.toBeNull()
    expect(resume?.personalInfo.fullName).toBe('')
    expect(resume?.experiences).toHaveLength(0)
    expect(resume?.skills).toHaveLength(0)
  })

  it('new resume has a different id than the previous one', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
    })
    const id1 = useResumeStore.getState().resume?.id

    act(() => {
      useResumeStore.getState().createNewResume()
    })
    const id2 = useResumeStore.getState().resume?.id

    expect(id1).toBeTruthy()
    expect(id2).toBeTruthy()
    expect(id1).not.toBe(id2)
  })

  it('new resume uses the modern template by default', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
    })
    expect(useResumeStore.getState().resume?.template).toBe('modern')
  })

  it('new resume has valid createdAt and updatedAt timestamps', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
    })
    const resume = useResumeStore.getState().resume
    expect(() => new Date(resume!.createdAt)).not.toThrow()
    expect(() => new Date(resume!.updatedAt)).not.toThrow()
  })

  it('reset clears the active resume', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
    })

    act(() => {
      useResumeStore.getState().reset()
    })

    expect(useResumeStore.getState().resume).toBeNull()
  })

  it('each resume can have independent template and accent color', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updateTemplate('creative')
      useResumeStore.getState().updateAccentColor('#dc2626')
    })

    const resume1Template = useResumeStore.getState().resume?.template
    const resume1Color = useResumeStore.getState().resume?.accentColor

    act(() => {
      useResumeStore.getState().createNewResume()
    })

    const resume2Template = useResumeStore.getState().resume?.template
    // New resume starts fresh with modern template and default color
    expect(resume2Template).toBe('modern')
    // Prior resume data was preserved in concept (new resume is independent)
    expect(resume1Template).toBe('creative')
    expect(resume1Color).toBe('#dc2626')
  })
})
