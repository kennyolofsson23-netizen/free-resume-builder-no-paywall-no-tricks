import { useResumeStore } from '@/store/resume-store'
import { MAX_UNDO_HISTORY } from '@/lib/constants'

describe('minimal store test', () => {
  beforeEach(() => {
    useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
    vi.clearAllMocks()
  })
  
  it('constant exists', () => {
    expect(MAX_UNDO_HISTORY).toBe(50)
  })
})
