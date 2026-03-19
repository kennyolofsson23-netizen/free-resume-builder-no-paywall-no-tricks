import { useResumeStore } from '@/store/resume-store'
import { MAX_UNDO_HISTORY } from '@/lib/constants'

beforeEach(() => {
  useResumeStore.setState({
    resume: null,
    pastStates: [],
    futureStates: [],
  })
  vi.clearAllMocks()
})

describe('Undo/Redo — basic behavior', () => {
  it('undo reverts last change', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane Doe' })
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Jane Doe'
    )

    useResumeStore.getState().undo()
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')
  })

  it('redo re-applies an undone change', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane Doe' })
    useResumeStore.getState().undo()
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')

    useResumeStore.getState().redo()
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Jane Doe'
    )
  })

  it('canUndo returns false on fresh resume', () => {
    useResumeStore.getState().createNewResume()
    expect(useResumeStore.getState().canUndo()).toBe(false)
  })

  it('canUndo returns true after a change', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Test' })
    expect(useResumeStore.getState().canUndo()).toBe(true)
  })

  it('canRedo returns false when nothing has been undone', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Test' })
    expect(useResumeStore.getState().canRedo()).toBe(false)
  })

  it('canRedo returns true after an undo', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Test' })
    useResumeStore.getState().undo()
    expect(useResumeStore.getState().canRedo()).toBe(true)
  })
})

describe('Undo/Redo — multiple operations', () => {
  it('can undo multiple sequential changes', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'First' })
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Second' })
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Third' })

    useResumeStore.getState().undo()
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Second'
    )

    useResumeStore.getState().undo()
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'First'
    )

    useResumeStore.getState().undo()
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')
  })

  it('clears redo stack when a new change is made after undo', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })
    useResumeStore.getState().undo()

    // Making a new change should clear the redo stack
    useResumeStore.getState().updatePersonalInfo({ fullName: 'John' })
    expect(useResumeStore.getState().canRedo()).toBe(false)
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('John')
  })

  it('undo does nothing when pastStates is empty', () => {
    useResumeStore.getState().createNewResume()
    const resumeBefore = useResumeStore.getState().resume

    useResumeStore.getState().undo()
    // Resume should be unchanged
    expect(useResumeStore.getState().resume).toEqual(resumeBefore)
  })

  it('redo does nothing when futureStates is empty', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Test' })
    const resumeBefore = useResumeStore.getState().resume

    useResumeStore.getState().redo()
    // Resume should be unchanged
    expect(useResumeStore.getState().resume).toEqual(resumeBefore)
  })
})

describe('Undo/Redo — history limit', () => {
  it(`undo stack is limited to ${MAX_UNDO_HISTORY} entries`, () => {
    useResumeStore.getState().createNewResume()

    // Make more changes than the limit
    for (let i = 0; i <= MAX_UNDO_HISTORY + 5; i++) {
      useResumeStore.getState().updatePersonalInfo({ fullName: `Name ${i}` })
    }

    const { pastStates } = useResumeStore.getState()
    expect(pastStates.length).toBeLessThanOrEqual(MAX_UNDO_HISTORY)
  })

  it('oldest entries are dropped when limit is exceeded', () => {
    useResumeStore.getState().createNewResume()

    // Make exactly MAX_UNDO_HISTORY + 1 changes so the oldest gets dropped
    for (let i = 0; i < MAX_UNDO_HISTORY + 1; i++) {
      useResumeStore.getState().updatePersonalInfo({ fullName: `Name ${i}` })
    }

    // Undo all the way back — should stop at MAX_UNDO_HISTORY undos
    let undoCount = 0
    while (useResumeStore.getState().canUndo()) {
      useResumeStore.getState().undo()
      undoCount++
    }

    expect(undoCount).toBe(MAX_UNDO_HISTORY)
  })
})
