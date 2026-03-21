/**
 * Edge-case tests for the resume store that are not covered elsewhere:
 *  - updateTemplate does NOT push to undo history
 *  - updateAccentColor does NOT push to undo history
 *  - updateAccentColor rejects invalid hex (no-op)
 *  - setResume pushes previous resume to pastStates
 *  - setResume when resume is null doesn't push history
 *  - setResume clears futureStates
 *  - reorderCertifications
 *  - addProject creates project with correct empty defaults
 *  - addCertification creates certification with correct empty defaults
 *  - reset clears localStorage entry
 *  - Operations on null resume are all no-ops
 */
import { useResumeStore } from '@/store/resume-store'
import { STORAGE_KEY, DEFAULT_ACCENT_COLOR } from '@/lib/constants'
import type { Resume } from '@/types/resume'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeValidResume(overrides = {}): Resume {
  const now = new Date().toISOString()
  return {
    id: 'edge-case-1',
    template: 'modern',
    personalInfo: {
      fullName: 'Edge User',
      email: 'edge@example.com',
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
    accentColor: '#2563eb',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as Resume
}

beforeEach(() => {
  useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
  localStorage.clear()
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// updateTemplate — does NOT push undo history
// ---------------------------------------------------------------------------

describe('Resume Store — updateTemplate does not push undo history', () => {
  it('pastStates is empty after updateTemplate', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateTemplate('classic')
    expect(useResumeStore.getState().pastStates).toHaveLength(0)
  })

  it('canUndo returns false after updateTemplate', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateTemplate('minimal')
    expect(useResumeStore.getState().canUndo()).toBe(false)
  })

  it('switching template multiple times still has empty pastStates', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateTemplate('classic')
    useResumeStore.getState().updateTemplate('minimal')
    useResumeStore.getState().updateTemplate('creative')
    expect(useResumeStore.getState().pastStates).toHaveLength(0)
  })

  it('updateTemplate changes template but does not affect existing undo history', () => {
    useResumeStore.getState().createNewResume()
    // Push one real history entry
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })
    expect(useResumeStore.getState().pastStates).toHaveLength(1)

    // Template change should NOT add to history
    useResumeStore.getState().updateTemplate('professional')
    expect(useResumeStore.getState().pastStates).toHaveLength(1)
  })
})

// ---------------------------------------------------------------------------
// updateAccentColor — does NOT push undo history
// ---------------------------------------------------------------------------

describe('Resume Store — updateAccentColor does not push undo history', () => {
  it('pastStates is empty after updateAccentColor', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateAccentColor('#dc2626')
    expect(useResumeStore.getState().pastStates).toHaveLength(0)
  })

  it('canUndo returns false after updateAccentColor', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateAccentColor('#7c3aed')
    expect(useResumeStore.getState().canUndo()).toBe(false)
  })

  it('updating accent color does not affect pre-existing undo history', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Test' })
    const historyLengthBefore = useResumeStore.getState().pastStates.length

    useResumeStore.getState().updateAccentColor('#16a34a')
    expect(useResumeStore.getState().pastStates).toHaveLength(historyLengthBefore)
  })
})

// ---------------------------------------------------------------------------
// updateAccentColor — invalid hex is a no-op
// ---------------------------------------------------------------------------

describe('Resume Store — updateAccentColor rejects invalid hex', () => {
  it('ignores non-hex color strings', () => {
    useResumeStore.getState().createNewResume()
    const before = useResumeStore.getState().resume?.accentColor
    useResumeStore.getState().updateAccentColor('blue')
    expect(useResumeStore.getState().resume?.accentColor).toBe(before)
  })

  it('ignores 3-digit hex colors', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateAccentColor('#abc')
    expect(useResumeStore.getState().resume?.accentColor).toBe(DEFAULT_ACCENT_COLOR)
  })

  it('ignores empty string', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateAccentColor('')
    expect(useResumeStore.getState().resume?.accentColor).toBe(DEFAULT_ACCENT_COLOR)
  })

  it('ignores hex without # prefix', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateAccentColor('2563eb')
    expect(useResumeStore.getState().resume?.accentColor).toBe(DEFAULT_ACCENT_COLOR)
  })

  it('accepts valid 6-digit uppercase hex', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updateAccentColor('#DC2626')
    expect(useResumeStore.getState().resume?.accentColor).toBe('#DC2626')
  })
})

// ---------------------------------------------------------------------------
// setResume — pushes to pastStates
// ---------------------------------------------------------------------------

describe('Resume Store — setResume pushes history', () => {
  it('setResume pushes previous resume to pastStates', () => {
    useResumeStore.getState().createNewResume()
    const firstResume = useResumeStore.getState().resume!

    const newResume = makeValidResume({ id: 'new-id' })
    useResumeStore.getState().setResume(newResume)

    const { pastStates, resume } = useResumeStore.getState()
    expect(pastStates).toHaveLength(1)
    expect(pastStates[0]?.id).toBe(firstResume.id)
    expect(resume?.id).toBe('new-id')
  })

  it('setResume when resume is null does not push to pastStates', () => {
    // No resume exists — null resume should not push to history
    const newResume = makeValidResume({ id: 'fresh-id' })
    useResumeStore.getState().setResume(newResume)
    expect(useResumeStore.getState().pastStates).toHaveLength(0)
  })

  it('setResume clears futureStates', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Future' })
    useResumeStore.getState().undo() // now futureStates has one entry
    expect(useResumeStore.getState().futureStates).toHaveLength(1)

    useResumeStore.getState().setResume(makeValidResume({ id: 'override-id' }))
    expect(useResumeStore.getState().futureStates).toHaveLength(0)
  })

  it('setResume updates the updatedAt timestamp', () => {
    useResumeStore.getState().createNewResume()
    const before = useResumeStore.getState().resume!.updatedAt

    // Small delay
    const newResume = makeValidResume({
      updatedAt: new Date(Date.now() - 10000).toISOString(),
    })
    useResumeStore.getState().setResume(newResume)
    const after = useResumeStore.getState().resume!.updatedAt

    // setResume replaces updatedAt with current time
    expect(new Date(after).getTime()).toBeGreaterThanOrEqual(
      new Date(before).getTime()
    )
  })
})

// ---------------------------------------------------------------------------
// Operations on null resume are no-ops
// ---------------------------------------------------------------------------

describe('Resume Store — null resume guards', () => {
  it('updatePersonalInfo on null resume does not throw', () => {
    expect(() => {
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Ghost' })
    }).not.toThrow()
    expect(useResumeStore.getState().resume).toBeNull()
  })

  it('addExperience on null resume does not throw', () => {
    expect(() => {
      useResumeStore.getState().addExperience()
    }).not.toThrow()
    expect(useResumeStore.getState().resume).toBeNull()
  })

  it('addSkill on null resume does not throw', () => {
    expect(() => {
      useResumeStore.getState().addSkill()
    }).not.toThrow()
    expect(useResumeStore.getState().resume).toBeNull()
  })

  it('addEducation on null resume does not throw', () => {
    expect(() => {
      useResumeStore.getState().addEducation()
    }).not.toThrow()
    expect(useResumeStore.getState().resume).toBeNull()
  })

  it('addProject on null resume does not throw', () => {
    expect(() => {
      useResumeStore.getState().addProject()
    }).not.toThrow()
    expect(useResumeStore.getState().resume).toBeNull()
  })

  it('addCertification on null resume does not throw', () => {
    expect(() => {
      useResumeStore.getState().addCertification()
    }).not.toThrow()
    expect(useResumeStore.getState().resume).toBeNull()
  })

  it('updateTemplate on null resume does not throw', () => {
    expect(() => {
      useResumeStore.getState().updateTemplate('classic')
    }).not.toThrow()
    expect(useResumeStore.getState().resume).toBeNull()
  })

  it('updateAccentColor on null resume does not throw', () => {
    expect(() => {
      useResumeStore.getState().updateAccentColor('#ff0000')
    }).not.toThrow()
    expect(useResumeStore.getState().resume).toBeNull()
  })

  it('undo on null resume does not throw', () => {
    expect(() => {
      useResumeStore.getState().undo()
    }).not.toThrow()
    expect(useResumeStore.getState().resume).toBeNull()
  })

  it('redo on null resume does not throw', () => {
    expect(() => {
      useResumeStore.getState().redo()
    }).not.toThrow()
    expect(useResumeStore.getState().resume).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// addProject — default shape
// ---------------------------------------------------------------------------

describe('Resume Store — addProject default shape', () => {
  it('new project has empty title, description, link, and technologies', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addProject()
    const project = useResumeStore.getState().resume?.projects[0]
    expect(project).toBeDefined()
    expect(project?.title).toBe('')
    expect(project?.description).toBe('')
    expect(project?.link).toBe('')
    expect(project?.technologies).toEqual([])
  })

  it('new project has a unique id', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addProject()
    useResumeStore.getState().addProject()
    const projects = useResumeStore.getState().resume!.projects
    expect(projects[0]!.id).not.toBe(projects[1]!.id)
  })
})

// ---------------------------------------------------------------------------
// addCertification — default shape
// ---------------------------------------------------------------------------

describe('Resume Store — addCertification default shape', () => {
  it('new certification has empty name, issuer, issueDate', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addCertification()
    const cert = useResumeStore.getState().resume?.certifications[0]
    expect(cert).toBeDefined()
    expect(cert?.name).toBe('')
    expect(cert?.issuer).toBe('')
    expect(cert?.issueDate).toBe('')
    expect(cert?.expirationDate).toBe('')
    expect(cert?.credentialUrl).toBe('')
  })
})

// ---------------------------------------------------------------------------
// reorderCertifications
// ---------------------------------------------------------------------------

describe('Resume Store — reorderCertifications', () => {
  it('reorders certifications by id array', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addCertification()
    useResumeStore.getState().addCertification()
    const certs = useResumeStore.getState().resume!.certifications
    const [first, second] = certs
    useResumeStore.getState().reorderCertifications([second!.id, first!.id])
    const reordered = useResumeStore.getState().resume!.certifications
    expect(reordered[0]!.id).toBe(second!.id)
    expect(reordered[1]!.id).toBe(first!.id)
  })

  it('reorderCertifications pushes undo history', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().addCertification()
    useResumeStore.getState().addCertification()
    // reset history from the adds above
    useResumeStore.setState({ pastStates: [] })

    const certs = useResumeStore.getState().resume!.certifications
    useResumeStore.getState().reorderCertifications([certs[1]!.id, certs[0]!.id])
    expect(useResumeStore.getState().pastStates.length).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// reset — clears localStorage
// ---------------------------------------------------------------------------

describe('Resume Store — reset', () => {
  it('reset removes the STORAGE_KEY from localStorage', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().saveToLocalStorage()
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()

    useResumeStore.getState().reset()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('reset sets resume to null', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().reset()
    expect(useResumeStore.getState().resume).toBeNull()
  })

  it('reset clears pastStates', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Test' })
    expect(useResumeStore.getState().pastStates.length).toBeGreaterThan(0)

    useResumeStore.getState().reset()
    expect(useResumeStore.getState().pastStates).toHaveLength(0)
  })

  it('reset clears futureStates', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Test' })
    useResumeStore.getState().undo()
    expect(useResumeStore.getState().futureStates.length).toBeGreaterThan(0)

    useResumeStore.getState().reset()
    expect(useResumeStore.getState().futureStates).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// updateResume updatedAt is always refreshed
// ---------------------------------------------------------------------------

describe('Resume Store — updatedAt is refreshed on every mutation', () => {
  it('updatePersonalInfo updates updatedAt', async () => {
    useResumeStore.getState().createNewResume()
    const before = useResumeStore.getState().resume!.updatedAt

    // Force some delay
    await new Promise((r) => setTimeout(r, 5))
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Changed' })
    const after = useResumeStore.getState().resume!.updatedAt
    expect(new Date(after).getTime()).toBeGreaterThanOrEqual(
      new Date(before).getTime()
    )
  })

  it('addExperience updates updatedAt', async () => {
    useResumeStore.getState().createNewResume()
    const before = useResumeStore.getState().resume!.updatedAt
    await new Promise((r) => setTimeout(r, 5))
    useResumeStore.getState().addExperience()
    const after = useResumeStore.getState().resume!.updatedAt
    expect(new Date(after).getTime()).toBeGreaterThanOrEqual(
      new Date(before).getTime()
    )
  })
})
