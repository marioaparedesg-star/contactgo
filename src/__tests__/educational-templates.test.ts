import { describe, it, expect } from 'vitest'
import { BIENVENIDA, buildEducationalEmail } from '../lib/email/educational-templates'
describe('secuencia educativa de bienvenida', () => {
  it('tiene 7 correos con asunto', () => { expect(BIENVENIDA.length).toBe(7); BIENVENIDA.forEach(e => expect(e.subject.length).toBeGreaterThan(10)) })
  for (const e of BIENVENIDA) {
    it(`${e.id}: sin emojis, con logo, nota informativa y sin variables sin resolver`, () => {
      const html = buildEducationalEmail(e)
      expect(html).toContain('/logo.png')
      expect(html).toContain('no sustituye las instrucciones del fabricante')
      expect(html).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u)
      expect(html).not.toMatch(/\{\{|undefined|null/)
    })
  }
})
