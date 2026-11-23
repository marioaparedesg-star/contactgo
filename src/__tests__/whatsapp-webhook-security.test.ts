import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { isValidMetaSignature } from '@/lib/whatsapp-webhook-security'

describe('isValidMetaSignature', () => {
  const body = JSON.stringify({ object: 'whatsapp_business_account', entry: [] })
  const secret = 'unit-test-meta-app-secret'
  const valid = 'sha256=' + createHmac('sha256', secret).update(body).digest('hex')

  it('accepts a valid Meta SHA-256 signature', () => {
    expect(isValidMetaSignature(body, valid, secret)).toBe(true)
  })

  it('rejects a changed body', () => {
    expect(isValidMetaSignature(body + ' ', valid, secret)).toBe(false)
  })

  it('rejects a missing secret or signature', () => {
    expect(isValidMetaSignature(body, valid, '')).toBe(false)
    expect(isValidMetaSignature(body, null, secret)).toBe(false)
  })

  it('rejects malformed signatures', () => {
    expect(isValidMetaSignature(body, 'sha1=abcd', secret)).toBe(false)
    expect(isValidMetaSignature(body, 'sha256=abcd', secret)).toBe(false)
  })
})
