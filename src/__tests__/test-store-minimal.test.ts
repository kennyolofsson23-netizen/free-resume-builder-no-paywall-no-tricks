import { useResumeStore } from '@/store/resume-store'

describe('minimal store test', () => {
  it('store exists', () => {
    expect(useResumeStore).toBeDefined()
  })
})
