/**
 * Tests for src/lib/constants.ts
 *
 * Verifies that all exported constants have the correct shape, values,
 * and constraints that the rest of the application depends on.
 */
import { describe, it, expect } from 'vitest'
import {
  TEMPLATE_LIST,
  SKILL_LEVELS,
  FIELD_LIMITS,
  DEFAULT_ACCENT_COLOR,
  PRESET_ACCENT_COLORS,
  STORAGE_KEY,
  RESUMES_STORAGE_KEY,
  AUTO_SAVE_DEBOUNCE_MS,
  MAX_UNDO_HISTORY,
  SHARE_COMPRESSION_THRESHOLD,
  PREVIEW_RERENDER_TARGET_MS,
} from '@/lib/constants'

// ---------------------------------------------------------------------------
// TEMPLATE_LIST
// ---------------------------------------------------------------------------

describe('TEMPLATE_LIST', () => {
  it('has exactly 5 templates', () => {
    expect(TEMPLATE_LIST).toHaveLength(5)
  })

  it('contains all 5 expected template ids', () => {
    const ids = TEMPLATE_LIST.map((t) => t.id)
    expect(ids).toContain('modern')
    expect(ids).toContain('classic')
    expect(ids).toContain('minimal')
    expect(ids).toContain('creative')
    expect(ids).toContain('professional')
  })

  it('every template entry has a non-empty id, name, and description', () => {
    for (const t of TEMPLATE_LIST) {
      expect(typeof t.id).toBe('string')
      expect(t.id.length).toBeGreaterThan(0)
      expect(typeof t.name).toBe('string')
      expect(t.name.length).toBeGreaterThan(0)
      expect(typeof t.description).toBe('string')
      expect(t.description.length).toBeGreaterThan(0)
    }
  })

  it('template ids are unique', () => {
    const ids = TEMPLATE_LIST.map((t) => t.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('template names are unique', () => {
    const names = TEMPLATE_LIST.map((t) => t.name)
    const unique = new Set(names)
    expect(unique.size).toBe(names.length)
  })
})

// ---------------------------------------------------------------------------
// SKILL_LEVELS
// ---------------------------------------------------------------------------

describe('SKILL_LEVELS', () => {
  it('has exactly 4 skill level options', () => {
    expect(SKILL_LEVELS).toHaveLength(4)
  })

  it('contains beginner, intermediate, advanced, expert values', () => {
    const values = SKILL_LEVELS.map((s) => s.value)
    expect(values).toContain('beginner')
    expect(values).toContain('intermediate')
    expect(values).toContain('advanced')
    expect(values).toContain('expert')
  })

  it('every skill level has a non-empty value and label', () => {
    for (const s of SKILL_LEVELS) {
      expect(typeof s.value).toBe('string')
      expect(s.value.length).toBeGreaterThan(0)
      expect(typeof s.label).toBe('string')
      expect(s.label.length).toBeGreaterThan(0)
    }
  })

  it('skill level values are ordered beginner → expert', () => {
    const values = SKILL_LEVELS.map((s) => s.value)
    expect(values[0]).toBe('beginner')
    expect(values[3]).toBe('expert')
  })
})

// ---------------------------------------------------------------------------
// FIELD_LIMITS
// ---------------------------------------------------------------------------

describe('FIELD_LIMITS', () => {
  it('fullName limit is 100', () => {
    expect(FIELD_LIMITS.fullName).toBe(100)
  })

  it('email limit is 254', () => {
    expect(FIELD_LIMITS.email).toBe(254)
  })

  it('phone limit is 20', () => {
    expect(FIELD_LIMITS.phone).toBe(20)
  })

  it('location limit is 100', () => {
    expect(FIELD_LIMITS.location).toBe(100)
  })

  it('summary limit is 2000', () => {
    expect(FIELD_LIMITS.summary).toBe(2000)
  })

  it('jobTitle limit is 100', () => {
    expect(FIELD_LIMITS.jobTitle).toBe(100)
  })

  it('company limit is 100', () => {
    expect(FIELD_LIMITS.company).toBe(100)
  })

  it('description limit is 5000', () => {
    expect(FIELD_LIMITS.description).toBe(5000)
  })

  it('skillName limit is 50', () => {
    expect(FIELD_LIMITS.skillName).toBe(50)
  })

  it('projectTitle limit is 100', () => {
    expect(FIELD_LIMITS.projectTitle).toBe(100)
  })

  it('projectDescription limit is 2000', () => {
    expect(FIELD_LIMITS.projectDescription).toBe(2000)
  })

  it('gpa limit is 10', () => {
    expect(FIELD_LIMITS.gpa).toBe(10)
  })

  it('every limit is a positive integer', () => {
    for (const [key, value] of Object.entries(FIELD_LIMITS)) {
      expect(typeof value).toBe('number')
      expect(value).toBeGreaterThan(0)
      expect(Number.isInteger(value)).toBe(true)
    }
  })
})

// ---------------------------------------------------------------------------
// DEFAULT_ACCENT_COLOR
// ---------------------------------------------------------------------------

describe('DEFAULT_ACCENT_COLOR', () => {
  it('is a valid 6-digit hex color', () => {
    expect(DEFAULT_ACCENT_COLOR).toMatch(/^#[0-9a-fA-F]{6}$/)
  })

  it('is the standard blue #2563eb', () => {
    expect(DEFAULT_ACCENT_COLOR).toBe('#2563eb')
  })
})

// ---------------------------------------------------------------------------
// PRESET_ACCENT_COLORS
// ---------------------------------------------------------------------------

describe('PRESET_ACCENT_COLORS', () => {
  it('has exactly 12 preset colors', () => {
    expect(PRESET_ACCENT_COLORS).toHaveLength(12)
  })

  it('every preset color is a valid 6-digit hex', () => {
    for (const color of PRESET_ACCENT_COLORS) {
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })

  it('preset colors are unique', () => {
    const unique = new Set(PRESET_ACCENT_COLORS)
    expect(unique.size).toBe(PRESET_ACCENT_COLORS.length)
  })

  it('includes the default accent color', () => {
    expect(PRESET_ACCENT_COLORS).toContain(DEFAULT_ACCENT_COLOR)
  })
})

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------

describe('STORAGE_KEY and RESUMES_STORAGE_KEY', () => {
  it('STORAGE_KEY is a non-empty string', () => {
    expect(typeof STORAGE_KEY).toBe('string')
    expect(STORAGE_KEY.length).toBeGreaterThan(0)
  })

  it('RESUMES_STORAGE_KEY is a non-empty string', () => {
    expect(typeof RESUMES_STORAGE_KEY).toBe('string')
    expect(RESUMES_STORAGE_KEY.length).toBeGreaterThan(0)
  })

  it('STORAGE_KEY and RESUMES_STORAGE_KEY are distinct', () => {
    expect(STORAGE_KEY).not.toBe(RESUMES_STORAGE_KEY)
  })
})

// ---------------------------------------------------------------------------
// Numeric thresholds and delays
// ---------------------------------------------------------------------------

describe('AUTO_SAVE_DEBOUNCE_MS', () => {
  it('is a positive number in milliseconds', () => {
    expect(typeof AUTO_SAVE_DEBOUNCE_MS).toBe('number')
    expect(AUTO_SAVE_DEBOUNCE_MS).toBeGreaterThan(0)
  })

  it('is 1000ms (1 second)', () => {
    expect(AUTO_SAVE_DEBOUNCE_MS).toBe(1000)
  })
})

describe('MAX_UNDO_HISTORY', () => {
  it('is a positive integer', () => {
    expect(typeof MAX_UNDO_HISTORY).toBe('number')
    expect(MAX_UNDO_HISTORY).toBeGreaterThan(0)
    expect(Number.isInteger(MAX_UNDO_HISTORY)).toBe(true)
  })

  it('is 50', () => {
    expect(MAX_UNDO_HISTORY).toBe(50)
  })
})

describe('SHARE_COMPRESSION_THRESHOLD', () => {
  it('is a positive integer in bytes', () => {
    expect(typeof SHARE_COMPRESSION_THRESHOLD).toBe('number')
    expect(SHARE_COMPRESSION_THRESHOLD).toBeGreaterThan(0)
    expect(Number.isInteger(SHARE_COMPRESSION_THRESHOLD)).toBe(true)
  })

  it('is 8192 bytes (8 KB)', () => {
    expect(SHARE_COMPRESSION_THRESHOLD).toBe(8192)
  })
})

describe('PREVIEW_RERENDER_TARGET_MS', () => {
  it('is a positive number', () => {
    expect(typeof PREVIEW_RERENDER_TARGET_MS).toBe('number')
    expect(PREVIEW_RERENDER_TARGET_MS).toBeGreaterThan(0)
  })

  it('is 200ms', () => {
    expect(PREVIEW_RERENDER_TARGET_MS).toBe(200)
  })
})
