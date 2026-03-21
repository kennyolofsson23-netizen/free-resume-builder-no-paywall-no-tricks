/**
 * Extended tests for url-codec.ts
 * Covers encodeResumeForURL / decodeResumeFromURL (z: prefix compression path)
 * in addition to the already-tested encodeResumeData / decodeResumeData.
 */
import { describe, it, expect } from 'vitest'
import {
  encodeResumeForURL,
  decodeResumeFromURL,
  encodeResumeData,
  decodeResumeData,
} from '@/lib/sharing/url-codec'
import { SHARE_COMPRESSION_THRESHOLD } from '@/lib/constants'

// ---------------------------------------------------------------------------
// encodeResumeForURL / decodeResumeFromURL
// ---------------------------------------------------------------------------

describe('encodeResumeForURL / decodeResumeFromURL — small payload (no compression)', () => {
  const sampleData = {
    id: 'test-123',
    template: 'modern',
    personalInfo: { fullName: 'Jane Doe', email: 'jane@example.com' },
  }

  it('roundtrips small data without z: prefix', () => {
    const encoded = encodeResumeForURL(sampleData)
    expect(encoded.startsWith('z:')).toBe(false)
    const decoded = decodeResumeFromURL(encoded)
    expect(decoded).toEqual(sampleData)
  })

  it('produces URL-safe output — no +, /, or =', () => {
    const encoded = encodeResumeForURL(sampleData)
    expect(encoded).not.toContain('+')
    expect(encoded).not.toContain('/')
    expect(encoded).not.toContain('=')
  })

  it('output is a non-empty string', () => {
    const encoded = encodeResumeForURL(sampleData)
    expect(typeof encoded).toBe('string')
    expect(encoded.length).toBeGreaterThan(0)
  })
})

describe('encodeResumeForURL / decodeResumeFromURL — large payload (compressed, z: prefix)', () => {
  const largeData = {
    id: 'large-123',
    template: 'professional',
    personalInfo: { fullName: 'Big Resume' },
    // Pad to exceed compression threshold
    padding: 'x'.repeat(SHARE_COMPRESSION_THRESHOLD + 500),
  }

  it('roundtrips large data with z: prefix', () => {
    const encoded = encodeResumeForURL(largeData)
    expect(encoded.startsWith('z:')).toBe(true)
    const decoded = decodeResumeFromURL(encoded)
    expect(decoded).toEqual(largeData)
  })

  it('z: payload is URL-safe (no +, /, = after prefix)', () => {
    const encoded = encodeResumeForURL(largeData)
    const payload = encoded.slice(2) // strip 'z:'
    expect(payload).not.toContain('+')
    expect(payload).not.toContain('/')
    expect(payload).not.toContain('=')
  })

  it('compressed payload is shorter than uncompressed equivalent', () => {
    const json = JSON.stringify(largeData)
    const uncompressedLength = json.length
    const encoded = encodeResumeForURL(largeData)
    // Compressed base64 should be much shorter than raw JSON length
    expect(encoded.length).toBeLessThan(uncompressedLength)
  })
})

describe('decodeResumeFromURL — error cases', () => {
  it('returns null for completely invalid string', () => {
    expect(decodeResumeFromURL('totally-invalid!!!')).toBeNull()
  })

  it('returns null for corrupted z: compressed payload', () => {
    expect(decodeResumeFromURL('z:!!!notvalidbase64!!!')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(decodeResumeFromURL('')).toBeNull()
  })

  it('returns null for plain invalid base64', () => {
    expect(decodeResumeFromURL('!!!@@@###')).toBeNull()
  })
})

describe('encodeResumeForURL / decodeResumeFromURL — edge cases', () => {
  it('roundtrips an empty object', () => {
    const encoded = encodeResumeForURL({})
    const decoded = decodeResumeFromURL(encoded)
    expect(decoded).toEqual({})
  })

  it('roundtrips an object with special characters in strings', () => {
    const data = {
      name: 'Jane & "Smith" — Developer',
      summary: 'Loves <code> & "design"',
    }
    const encoded = encodeResumeForURL(data)
    const decoded = decodeResumeFromURL(encoded)
    expect(decoded).toEqual(data)
  })

  it('roundtrips an object with unicode characters', () => {
    const data = { name: '田中 太郎', greeting: '你好世界' }
    const encoded = encodeResumeForURL(data)
    const decoded = decodeResumeFromURL(encoded)
    expect(decoded).toEqual(data)
  })

  it('roundtrips nested arrays and objects', () => {
    const data = {
      skills: ['TypeScript', 'Go', 'Rust'],
      nested: { level1: { level2: { value: 42 } } },
    }
    const encoded = encodeResumeForURL(data)
    const decoded = decodeResumeFromURL(encoded)
    expect(decoded).toEqual(data)
  })
})

// ---------------------------------------------------------------------------
// encodeResumeData / decodeResumeData — additional edge cases
// (core roundtrip tested in shareable-link.test.ts already)
// ---------------------------------------------------------------------------

describe('encodeResumeData / decodeResumeData — additional edge cases', () => {
  it('roundtrips an object with boolean and number values', () => {
    const data = { active: true, count: 42, ratio: 3.14 }
    const encoded = encodeResumeData(data)
    const decoded = decodeResumeData(encoded)
    expect(decoded).toEqual(data)
  })

  it('roundtrips nested arrays', () => {
    const data = {
      technologies: ['React', 'TypeScript', 'Node.js'],
    }
    const encoded = encodeResumeData(data)
    const decoded = decodeResumeData(encoded)
    expect(decoded).toEqual(data)
  })

  it('no prefix for small data and z: prefix for large data is mutually exclusive', () => {
    const small = { name: 'Test' }
    const large = { name: 'x'.repeat(SHARE_COMPRESSION_THRESHOLD + 100) }

    const encodedSmall = encodeResumeData(small)
    const encodedLarge = encodeResumeData(large)

    expect(encodedSmall.startsWith('z:')).toBe(false)
    expect(encodedLarge.startsWith('z:')).toBe(true)
  })

  it('decoded result preserves exact numeric precision', () => {
    const data = { value: 1234567890.123456 }
    const encoded = encodeResumeData(data)
    const decoded = decodeResumeData(encoded) as typeof data
    expect(decoded.value).toBe(data.value)
  })
})
