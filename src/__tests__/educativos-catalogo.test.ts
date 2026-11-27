import { describe, it, expect } from 'vitest'
import { EDUCATIVOS_NUEVOS } from '../lib/email/educativos-catalogo'
import { buildEducationalEmail } from '../lib/email/educational-templates'
describe('educativos nuevos', () => {
  it('8 correos, sin emojis, con nota informativa y logo', () => {
    expect(EDUCATIVOS_NUEVOS.length).toBe(8)
    for (const e of EDUCATIVOS_NUEVOS) {
      const html = buildEducationalEmail(e)
      expect(html).toContain('/logo.png')
      expect(html).toContain('no sustituye las instrucciones del fabricante')
      expect(e.subject).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u)
      expect(html).not.toMatch(/\{\{|undefined|null/)
    }
  })
})
