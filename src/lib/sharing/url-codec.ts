// URL encoding/decoding for shareable resume links
// Uses pako for compression when data > SHARE_COMPRESSION_THRESHOLD bytes
// Single scheme: 'z:' prefix for compressed, plain base64url for small payloads.

import pako from 'pako'
import { SHARE_COMPRESSION_THRESHOLD } from '@/lib/constants'

/** Maximum allowed decompressed payload size (1 MB) to prevent compression-bomb DoS */
const MAX_DECOMPRESSED_BYTES = 1 * 1024 * 1024

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

/** Custom error types for structured error handling in callers */
export class DecodeSizeError extends Error {
  constructor(size: number) {
    super(
      `Decompressed payload (${size} bytes) exceeds maximum allowed size (${MAX_DECOMPRESSED_BYTES} bytes)`
    )
    this.name = 'DecodeSizeError'
  }
}

export class DecodeFormatError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'DecodeFormatError'
  }
}

/**
 * Decode resume data from URL fragment.
 * Handles both compressed ('z:' prefix) and plain base64url payloads.
 *
 * Returns null and logs a warning on failure. Differentiates:
 *  - DecodeSizeError: payload exceeds the 1 MB decompression cap
 *  - DecodeFormatError: bad base64, corrupt gzip, or invalid JSON
 */
export function decodeResumeFromURL(hash: string): object | null {
  if (!hash) return null

  try {
    if (hash.startsWith('z:')) {
      let bytes: Uint8Array
      try {
        bytes = fromBase64Url(hash.slice(2))
      } catch (err) {
        throw new DecodeFormatError(
          'Invalid base64url in compressed payload',
          err
        )
      }

      let decompressed: string
      try {
        const raw = pako.inflate(bytes)
        if (raw.byteLength > MAX_DECOMPRESSED_BYTES) {
          throw new DecodeSizeError(raw.byteLength)
        }
        decompressed = new TextDecoder().decode(raw)
      } catch (err) {
        if (err instanceof DecodeSizeError) throw err
        throw new DecodeFormatError('Failed to decompress gzip payload', err)
      }

      try {
        return JSON.parse(decompressed) as object
      } catch (err) {
        throw new DecodeFormatError(
          'Decompressed payload is not valid JSON',
          err
        )
      }
    }

    // Plain base64url (uncompressed, no prefix)
    let bytes: Uint8Array
    try {
      bytes = fromBase64Url(hash)
    } catch (err) {
      throw new DecodeFormatError('Invalid base64url in plain payload', err)
    }

    const json = new TextDecoder().decode(bytes)
    try {
      return JSON.parse(json) as object
    } catch (err) {
      throw new DecodeFormatError('Plain payload is not valid JSON', err)
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      if (err instanceof DecodeSizeError) {
        console.warn(
          '[url-codec] Compression-bomb guard triggered:',
          err.message
        )
      } else if (err instanceof DecodeFormatError) {
        console.warn(
          '[url-codec] Failed to decode resume from URL:',
          err.message,
          err.cause
        )
      } else {
        console.warn(
          '[url-codec] Unexpected error decoding resume from URL:',
          err
        )
      }
    }
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
export const decodeResumeData: (hash: string) => object | null =
  decodeResumeFromURL
