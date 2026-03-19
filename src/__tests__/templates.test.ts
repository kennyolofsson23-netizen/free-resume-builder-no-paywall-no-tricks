import { describe, it, expect } from 'vitest'

describe('Resume Templates', () => {
  it('template names are defined', () => {
    const templates = ['modern', 'classic', 'minimal', 'creative', 'professional']
    expect(templates).toHaveLength(5)
    expect(templates).toContain('modern')
    expect(templates).toContain('classic')
    expect(templates).toContain('minimal')
    expect(templates).toContain('creative')
    expect(templates).toContain('professional')
  })
})
