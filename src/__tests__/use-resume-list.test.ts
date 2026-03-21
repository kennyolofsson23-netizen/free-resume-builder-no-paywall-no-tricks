/**
 * Tests for the useResumeList hook.
 * Covers: loading from localStorage, saving, switching, deleting, and
 * creating-and-switching between resumes.
 */
/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useResumeStore } from '@/store/resume-store'
import { RESUMES_STORAGE_KEY, STORAGE_KEY } from '@/lib/constants'
import { useResumeList } from '@/hooks/use-resume-list'

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
// Initial state
// ---------------------------------------------------------------------------

describe('useResumeList — initial state', () => {
  it('returns an empty resumeList when localStorage has no list', () => {
    const { result } = renderHook(() => useResumeList())
    expect(result.current.resumeList).toEqual([])
  })

  it('loads resumeList from localStorage on mount', () => {
    const mockList = [
      {
        id: 'r-1',
        name: 'Resume 1',
        template: 'modern',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'r-2',
        name: 'Resume 2',
        template: 'classic',
        updatedAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(mockList))

    const { result } = renderHook(() => useResumeList())

    expect(result.current.resumeList).toHaveLength(2)
    expect(result.current.resumeList[0]?.id).toBe('r-1')
    expect(result.current.resumeList[1]?.id).toBe('r-2')
  })

  it('handles corrupt localStorage data gracefully (empty list)', () => {
    localStorage.setItem(RESUMES_STORAGE_KEY, 'not valid json{{')

    const { result } = renderHook(() => useResumeList())
    // Should not throw — just ends up empty
    expect(result.current.resumeList).toEqual([])
  })

  it('exposes saveCurrentToList, switchToResume, deleteResume, createAndSwitch, loadList', () => {
    const { result } = renderHook(() => useResumeList())
    expect(typeof result.current.saveCurrentToList).toBe('function')
    expect(typeof result.current.switchToResume).toBe('function')
    expect(typeof result.current.deleteResume).toBe('function')
    expect(typeof result.current.createAndSwitch).toBe('function')
    expect(typeof result.current.loadList).toBe('function')
  })
})

// ---------------------------------------------------------------------------
// saveCurrentToList
// ---------------------------------------------------------------------------

describe('useResumeList — saveCurrentToList', () => {
  it('adds current resume to list with its fullName', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane Doe' })
    })

    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    expect(result.current.resumeList).toHaveLength(1)
    expect(result.current.resumeList[0]?.name).toBe('Jane Doe')
  })

  it('uses "My Resume" when fullName is empty', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
    })

    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    expect(result.current.resumeList[0]?.name).toBe('My Resume')
  })

  it('stores the correct template in the list item', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updateTemplate('creative')
    })

    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    expect(result.current.resumeList[0]?.template).toBe('creative')
  })

  it('updates an existing entry when the same resume is saved again', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Initial Name' })
    })

    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    // Update name and save again
    act(() => {
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Updated Name' })
    })
    act(() => {
      result.current.saveCurrentToList()
    })

    expect(result.current.resumeList).toHaveLength(1)
    expect(result.current.resumeList[0]?.name).toBe('Updated Name')
  })

  it('can add multiple different resumes to the list', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Resume A' })
    })

    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    // Switch to a new resume
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Resume B' })
    })
    act(() => {
      result.current.saveCurrentToList()
    })

    expect(result.current.resumeList).toHaveLength(2)
    const names = result.current.resumeList.map((r) => r.name)
    expect(names).toContain('Resume A')
    expect(names).toContain('Resume B')
  })

  it('does nothing when no resume is in the store', () => {
    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    expect(result.current.resumeList).toHaveLength(0)
  })

  it('persists the list to localStorage after saving', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({
        fullName: 'Persisted',
        email: 'p@test.com',
      })
    })

    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    const stored = localStorage.getItem(RESUMES_STORAGE_KEY)
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]?.name).toBe('Persisted')
  })

  it('also stores the full resume data keyed by resume id', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Full Data' })
    })

    const resumeId = useResumeStore.getState().resume!.id
    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    const stored = localStorage.getItem(`resume-${resumeId}`)
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed.personalInfo.fullName).toBe('Full Data')
  })
})

// ---------------------------------------------------------------------------
// deleteResume
// ---------------------------------------------------------------------------

describe('useResumeList — deleteResume', () => {
  it('removes a resume from the list', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'To Delete' })
    })

    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    const id = result.current.resumeList[0]?.id

    act(() => {
      result.current.deleteResume(id!)
    })

    expect(result.current.resumeList).toHaveLength(0)
  })

  it('only removes the targeted resume', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Keep Me' })
    })

    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Delete Me' })
    })

    act(() => {
      result.current.saveCurrentToList()
    })

    const deleteId = result.current.resumeList.find(
      (r) => r.name === 'Delete Me'
    )?.id

    act(() => {
      result.current.deleteResume(deleteId!)
    })

    expect(result.current.resumeList).toHaveLength(1)
    expect(result.current.resumeList[0]?.name).toBe('Keep Me')
  })

  it('updates localStorage after deletion', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
    })

    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    const id = result.current.resumeList[0]?.id

    act(() => {
      result.current.deleteResume(id!)
    })

    const stored = localStorage.getItem(RESUMES_STORAGE_KEY)
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(0)
  })

  it('removes the full resume data from localStorage', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
    })

    const resumeId = useResumeStore.getState().resume!.id
    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.saveCurrentToList()
    })

    act(() => {
      result.current.deleteResume(resumeId)
    })

    expect(localStorage.getItem(`resume-${resumeId}`)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// switchToResume
// ---------------------------------------------------------------------------

describe('useResumeList — switchToResume', () => {
  it('loads a resume from localStorage and sets it as active', () => {
    // Create and save a resume
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({
        fullName: 'Target Resume',
        email: 'target@example.com',
      })
    })

    const resumeId = useResumeStore.getState().resume!.id
    const resumeData = useResumeStore.getState().resume!

    // Manually store the full resume data
    localStorage.setItem(`resume-${resumeId}`, JSON.stringify(resumeData))

    // Switch to a different resume
    act(() => {
      useResumeStore.getState().createNewResume()
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')

    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.switchToResume(resumeId)
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Target Resume'
    )
  })

  it('does nothing if resume id does not exist in localStorage', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Current' })
    })

    const currentName = useResumeStore.getState().resume?.personalInfo.fullName
    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.switchToResume('non-existent-id')
    })

    // Current resume should be unchanged
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      currentName
    )
  })
})

// ---------------------------------------------------------------------------
// createAndSwitch
// ---------------------------------------------------------------------------

describe('useResumeList — createAndSwitch', () => {
  it('saves current resume to list then creates a new empty resume', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Old Resume' })
    })

    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.createAndSwitch()
    })

    // New resume should be blank
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')

    // Old resume should now be in the list
    expect(result.current.resumeList).toHaveLength(1)
    expect(result.current.resumeList[0]?.name).toBe('Old Resume')
  })

  it('new resume id differs from previous resume id', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
    })

    const oldId = useResumeStore.getState().resume?.id
    const { result } = renderHook(() => useResumeList())

    act(() => {
      result.current.createAndSwitch()
    })

    const newId = useResumeStore.getState().resume?.id
    expect(newId).not.toBe(oldId)
  })
})
