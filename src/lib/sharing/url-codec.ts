// URL encoding/decoding for shareable resume links
// Uses pako for compression when data > SHARE_COMPRESSION_THRESHOLD bytes

import pako from 'pako'
import { SHARE_COMPRESSION_THRESHOLD } from '@/lib/constants'

function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function fromBase64Url(str: string): string {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

export function encodeResumeData(data: object): string {
  const json = JSON.stringify(data)
  const encoder = new TextEncoder()
  const bytes = encoder.encode(json)

  if (bytes.byteLength > SHARE_COMPRESSION_THRESHOLD) {
    const compressed = pako.deflate(bytes)
    return 'c:' + toBase64Url(compressed)
  }

  const jsonBytes = new Uint8Array(bytes)
  return 'j:' + toBase64Url(jsonBytes)
}

export function decodeResumeData(encoded: string): unknown {
  try {
    if (encoded.startsWith('c:')) {
      const b64 = encoded.slice(2)
      const decoded = fromBase64Url(b64)
      const compressedBytes = new Uint8Array(
        decoded.split('').map((c) => c.charCodeAt(0))
      )
      const inflated = pako.inflate(compressedBytes)
      const json = new TextDecoder().decode(inflated)
      return JSON.parse(json)
    }

    if (encoded.startsWith('j:')) {
      const b64 = encoded.slice(2)
      const decoded = fromBase64Url(b64)
      return JSON.parse(decoded)
    }

    return null
  } catch {
    return null
  }
}

/**
 * Encode resume data for URL fragment.
 * Uses gzip compression if data exceeds threshold.
 * Compressed payloads are prefixed with 'z:'.
 */
export function encodeResumeForURL(data: object): string {
  const json = JSON.stringify(data)
  const jsonBytes = new TextEncoder().encode(json)

  if (jsonBytes.length > SHARE_COMPRESSION_THRESHOLD) {
    const compressed = pako.deflate(json)
    return (
      'z:' +
      btoa(String.fromCharCode(...compressed))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
    )
  } else {
    return btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }
}

/**
 * Decode resume data from URL fragment.
 * Handles both compressed ('z:' prefix) and plain base64url payloads.
 */
export function decodeResumeFromURL(hash: string): object | null {
  try {
    if (hash.startsWith('z:')) {
      const b64 = hash.slice(2).replace(/-/g, '+').replace(/_/g, '/')
      const binary = atob(b64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      const decompressed = pako.inflate(bytes, { to: 'string' })
      return JSON.parse(decompressed)
    } else {
      const b64 = hash.replace(/-/g, '+').replace(/_/g, '/')
      const json = decodeURIComponent(escape(atob(b64)))
      return JSON.parse(json)
    }
  } catch {
    return null
  }
}
