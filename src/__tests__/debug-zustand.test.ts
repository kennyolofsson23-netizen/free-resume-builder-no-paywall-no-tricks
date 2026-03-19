import { useResumeStore } from '@/store/resume-store'

beforeEach(() => {
  useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
})

describe('debug', () => {
  it('works', () => {
    expect(1).toBe(1)
  })
})
