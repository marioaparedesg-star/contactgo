import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Validates Meta's X-Hub-Signature-256 header against the exact raw request body.
 * Fails closed when the secret/header/format is missing or malformed.
 */
export function isValidMetaSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string,
): boolean {
  if (!appSecret || !signatureHeader || !rawBody) return false
  const match = /^sha256=([a-f0-9]{64})$/i.exec(signatureHeader.trim())
  if (!match) return false

  const expected = createHmac('sha256', appSecret).update(rawBody, 'utf8').digest()
  const received = Buffer.from(match[1], 'hex')
  return received.length === expected.length && timingSafeEqual(received, expected)
}
