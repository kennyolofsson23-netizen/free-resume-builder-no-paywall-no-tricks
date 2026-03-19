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
