// URL encoding/decoding for shareable resume links
// Uses pako for compression when data > SHARE_COMPRESSION_THRESHOLD bytes
// Single scheme: 'z:' prefix for compressed, plain base64url for small payloads.

import pako from 'pako'
import { SHARE_COMPRESSION_THRESHOLD } from '@/lib/constants'

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromBase64Url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const binaryStr = atob(b64)
  const bytes = new Uint8Array(binaryStr.length)
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  return bytes
}

/**
 * Encode resume data for URL fragment.
 * Compressed payloads (> SHARE_COMPRESSION_THRESHOLD bytes) are prefixed with 'z:'.
 * Small payloads are plain base64url without a prefix.
 */
export function encodeResumeForURL(data: object): string {
  const json = JSON.stringify(data)
  const jsonBytes = new TextEncoder().encode(json)

  if (jsonBytes.length > SHARE_COMPRESSION_THRESHOLD) {
    const compressed = pako.deflate(jsonBytes)
    return 'z:' + toBase64Url(compressed)
  }

  return toBase64Url(jsonBytes)
}

/**
 * Decode resume data from URL fragment.
 * Handles both compressed ('z:' prefix) and plain base64url payloads.
 * Returns null and logs a warning if decoding fails.
 */
export function decodeResumeFromURL(hash: string): object | null {
  try {
    if (!hash) return null

    if (hash.startsWith('z:')) {
      const bytes = fromBase64Url(hash.slice(2))
      const decompressed = pako.inflate(bytes, { to: 'string' })
      return JSON.parse(decompressed) as object
    }

    // Plain base64url (uncompressed, no prefix)
    const bytes = fromBase64Url(hash)
    const json = new TextDecoder().decode(bytes)
    return JSON.parse(json) as object
  } catch (err) {
    console.warn('[url-codec] Failed to decode resume from URL:', err)
    return null
  }
}

// ---------------------------------------------------------------------------
// Aliases — kept so callers that import the legacy names keep working.
// Both delegate to the canonical encode/decode pair above, ensuring that
// encoded output and decoded input always use the same 'z:'/no-prefix scheme.
// ---------------------------------------------------------------------------

/** Alias for encodeResumeForURL. Use encodeResumeForURL for new code. */
export const encodeResumeData: (data: object) => string = encodeResumeForURL

/** Alias for decodeResumeFromURL. Use decodeResumeFromURL for new code. */
export const decodeResumeData: (hash: string) => object | null = decodeResumeFromURL
