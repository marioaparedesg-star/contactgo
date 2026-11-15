// Secuencia educativa de bienvenida (7 correos). SIN emojis. Contenido informativo.
// No sustituye las instrucciones del fabricante ni la orientación profesional.
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.contactgo.net'
const BRAND = '#002455'
const ACCENT = '#01B2B7'
const NOTA = 'Este contenido es informativo y no sustituye las instrucciones del fabricante ni la orientación de un profesional de la salud visual.'

export type EducationalEmail = { id: string; subject: string; titulo: string; parrafos: string[]; cta: { texto: string; url: string } }

export const BIENVENIDA: EducationalEmail[] = [
  { id: 'bienvenida-1', subject: 'Bienvenido a ContactGo | Tu cuidado visual comienza aquí', titulo: 'Bienvenido a ContactGo',
    parrafos: ['Gracias por unirte a ContactGo. Somos una tienda dedicada exclusivamente a lentes de contacto originales, entregados en tu puerta en República Dominicana.', 'Trabajamos directamente con distribuidores autorizados de cada marca. Puedes explorar nuestro catálogo de lentes diarios, mensuales, tóricos, multifocales y de colores.'],
    cta: { texto: 'Explorar productos', url: `${SITE}/catalogo` } },
  { id: 'bienvenida-2', subject: '¿Qué debes saber antes de elegir tus lentes de contacto?', titulo: 'Antes de elegir tus lentes',
    parrafos: ['Los lentes de contacto son dispositivos médicos. Lo más importante es que uses una prescripción vigente y adecuada para ti.', 'Tu receta indica la esfera (SPH), el cilindro (CYL), el eje (AXIS) y la adición (ADD), según corresponda. Cada lente se fabrica para una graduación específica.'],
    cta: { texto: 'Conocer los tipos de lentes', url: `${SITE}/catalogo` } },
  { id: 'bienvenida-3', subject: 'Diarios, mensuales, tóricos o multifocales: conoce sus diferencias', titulo: 'Tipos de lentes de contacto',
    parrafos: ['Los lentes diarios se usan una vez y se desechan al final del día.', 'Los mensuales se reemplazan según el período indicado por el fabricante. Los tóricos corrigen el astigmatismo y los multifocales ayudan con la presbicia. Los de colores tienen opciones con y sin graduación.'],
    cta: { texto: 'Explorar el catálogo', url: `${SITE}/catalogo` } },
  { id: 'bienvenida-4', subject: 'La higiene es fundamental al utilizar lentes de contacto', titulo: 'Higiene y manipulación',
    parrafos: ['Lávate y sécate las manos antes de manipular tus lentes. Sigue las instrucciones de limpieza y conservación de tu fabricante.', 'Respeta siempre el período de reemplazo de tu tipo de lente. No reutilices lentes diarios.'],
    cta: { texto: 'Conocer productos de cuidado', url: `${SITE}/soluciones` } },
  { id: 'bienvenida-5', subject: 'Errores comunes al utilizar lentes de contacto', titulo: 'Errores que conviene evitar',
    parrafos: ['No duermas con lentes si no están autorizados para ello.', 'No uses lentes fuera del período recomendado, no reutilices lentes diarios y no los manipules sin lavarte las manos.', 'Si sientes molestias, enrojecimiento, secreción o visión borrosa, retira los lentes y busca evaluación profesional.'],
    cta: { texto: 'Explorar productos', url: `${SITE}/catalogo` } },
  { id: 'bienvenida-6', subject: '¿Cómo elegir los lentes de contacto adecuados?', titulo: 'Cómo elegir tus lentes',
    parrafos: ['Para elegir tus lentes, es importante que tu receta esté completa y sea reciente. Revisa la esfera, el cilindro, el eje y la adición.', 'Si tienes dudas sobre tu graduación o la compatibilidad con un producto, consulta con un profesional de la salud visual antes de comprar.'],
    cta: { texto: 'Ver opciones disponibles', url: `${SITE}/receta` } },
  { id: 'bienvenida-7', subject: 'Tus ojos merecen buenos hábitos', titulo: 'Buenos hábitos con tus lentes',
    parrafos: ['Mantén una higiene constante, respeta los reemplazos y haz seguimiento periódico con tu profesional de la salud visual.', 'No cambies tu graduación por tu cuenta. Tu bienestar visual depende de una prescripción adecuada.'],
    cta: { texto: 'Visitar ContactGo', url: SITE } },
]

export function buildEducationalEmail(e: EducationalEmail): string {
  const p = e.parrafos.map(t => `<p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#334155">${t}</p>`).join('')
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${e.titulo} · ContactGo</title></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:Arial,Helvetica,sans-serif;color:#172033">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:28px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border-radius:16px;overflow:hidden">
<tr><td align="center" style="padding:24px 32px;border-bottom:3px solid ${ACCENT}"><img src="${SITE}/logo.png" alt="ContactGo" width="200" height="33" style="display:block;margin:0 auto;width:200px;height:auto;border:0"></td></tr>
<tr><td style="padding:30px 32px 8px"><h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:${BRAND}">${e.titulo}</h1>${p}</td></tr>
<tr><td align="center" style="padding:8px 32px 28px"><a href="${e.cta.url}" style="display:inline-block;padding:13px 24px;background:${ACCENT};border-radius:8px;color:#fff;text-decoration:none;font-size:14px;font-weight:700">${e.cta.texto}</a></td></tr>
<tr><td style="padding:18px 32px 26px;border-top:1px solid #E5EAF0;font-size:12px;line-height:1.6;color:#64748B;text-align:center"><p style="margin:0 0 10px;font-style:italic">${NOTA}</p><strong style="color:${BRAND}">ContactGo</strong> · contactgo.net · info@contactgo.net<br><a href="${SITE}/cuenta" style="color:#64748B">Preferencias de comunicación</a></td></tr>
</table></td></tr></table></body></html>`
}
