import { useResumeStore } from '@/store/resume-store'

beforeEach(() => {
  useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
})

describe('minimal store test', () => {
  it('store exists', () => {
    expect(useResumeStore).toBeDefined()
  })
})
