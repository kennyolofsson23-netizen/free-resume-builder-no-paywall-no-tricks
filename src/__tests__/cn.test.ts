/**
 * Unit tests for the cn() class-merging utility (lib/cn.ts).
 * Verifies Tailwind-aware merging and clsx conditional behavior.
 */
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/cn'

describe('cn — basic usage', () => {
  it('returns a single class unchanged', () => {
    expect(cn('bg-red-500')).toBe('bg-red-500')
  })

  it('joins multiple classes with a space', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('returns empty string when called with no arguments', () => {
    expect(cn()).toBe('')
  })

  it('returns empty string for empty string input', () => {
    expect(cn('')).toBe('')
  })

  it('handles multiple spaces by normalising output', () => {
    // twMerge/clsx should produce a clean output
    const result = cn('text-sm', '', 'font-bold')
    expect(result).toBe('text-sm font-bold')
  })
})

describe('cn — Tailwind conflict resolution', () => {
  it('last class wins for the same utility', () => {
    // bg-red-500 then bg-blue-500 → bg-blue-500 wins
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('deduplicates px- padding', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('deduplicates py- padding', () => {
    expect(cn('py-2', 'py-8')).toBe('py-8')
  })

  it('deduplicates text-size classes', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('does not strip non-conflicting classes', () => {
    const result = cn('text-sm', 'font-bold', 'text-lg')
    // text-sm and text-lg conflict → text-lg wins; font-bold is kept
    expect(result).toContain('font-bold')
    expect(result).toContain('text-lg')
    expect(result).not.toContain('text-sm')
  })
})

describe('cn — conditional classes (clsx)', () => {
  it('includes class when condition is truthy', () => {
    const result = cn('text-sm', true && 'font-bold')
    expect(result).toContain('font-bold')
    expect(result).toContain('text-sm')
  })

  it('excludes class when condition is false', () => {
    const result = cn('text-sm', false && 'font-bold')
    expect(result).not.toContain('font-bold')
    expect(result).toContain('text-sm')
  })

  it('excludes class when condition is null', () => {
    const result = cn('text-sm', null)
    expect(result).toBe('text-sm')
  })

  it('excludes class when condition is undefined', () => {
    const result = cn('text-sm', undefined)
    expect(result).toBe('text-sm')
  })

  it('handles mixed truthy and falsy conditions', () => {
    const isActive = true
    const isDisabled = false
    const result = cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class'
    )
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
    expect(result).not.toContain('disabled-class')
  })
})

describe('cn — object syntax', () => {
  it('includes class when object value is true', () => {
    const result = cn({ 'text-sm': true, 'font-bold': true })
    expect(result).toContain('text-sm')
    expect(result).toContain('font-bold')
  })

  it('excludes class when object value is false', () => {
    const result = cn({ 'text-sm': true, 'font-bold': false })
    expect(result).toContain('text-sm')
    expect(result).not.toContain('font-bold')
  })

  it('mixes string and object syntax', () => {
    const result = cn('base', { active: true, disabled: false })
    expect(result).toContain('base')
    expect(result).toContain('active')
    expect(result).not.toContain('disabled')
  })
})

describe('cn — array syntax', () => {
  it('flattens an array of classes', () => {
    const result = cn(['text-sm', 'font-bold'])
    expect(result).toBe('text-sm font-bold')
  })

  it('handles nested arrays', () => {
    const result = cn(['text-sm', ['font-bold', 'underline']])
    expect(result).toContain('text-sm')
    expect(result).toContain('font-bold')
    expect(result).toContain('underline')
  })

  it('handles array with falsy values', () => {
    const result = cn(['text-sm', false, null, undefined, 'font-bold'])
    expect(result).toBe('text-sm font-bold')
  })
})

describe('cn — real-world patterns', () => {
  it('computes button variant classes correctly', () => {
    const isPrimary = true
    const result = cn(
      'rounded px-4 py-2',
      isPrimary ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
    )
    expect(result).toContain('bg-blue-600')
    expect(result).toContain('text-white')
    expect(result).not.toContain('bg-gray-200')
  })

  it('handles size variant with conflict resolution', () => {
    // Simulates a component that has default size but can be overridden
    const result = cn('text-base px-3 py-1', 'text-sm px-2')
    // text-sm overrides text-base; px-2 overrides px-3
    expect(result).toContain('text-sm')
    expect(result).not.toContain('text-base')
    expect(result).toContain('px-2')
    expect(result).not.toContain('px-3')
  })
})
