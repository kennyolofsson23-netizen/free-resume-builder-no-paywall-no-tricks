import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useResumeStore } from '@/store/resume-store'

// No vi.mock

beforeEach(() => {
  useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
})

describe('debug', () => {
  it('works', () => { expect(1).toBe(1) })
})
