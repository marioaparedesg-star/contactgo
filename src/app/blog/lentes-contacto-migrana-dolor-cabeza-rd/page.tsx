export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-migrana-dolor-cabeza-rd',
  title: '¿Los Lentes de Contacto Causan Dolor de Cabeza o Migraña?',
  h1: 'Lentes de contacto y dolor de cabeza: ¿hay relación?',
  description: 'Si te duele la cabeza después de usar lentes de contacto, puede ser la graduación, la marca, o algo sin relación. Te explicamos qué revisar.',
  publishedAt: '2026-09-04',
  readMinutes: 6,
  category: 'Salud ocular',
  faq: [
    { q: '¿Es normal que me duela la cabeza los primeros días usando lentes nuevos?',
      a: 'Un leve malestar de adaptación en los primeros 1-3 días puede ocurrir, especialmente si cambiaste de marca o de graduación. Si persiste más de una semana, no es normal y debes revisarlo.' },
    { q: '¿Qué marca de lentes causa menos dolores de cabeza?',
      a: 'No existe una marca "anti-dolor de cabeza" — lo que sí ayuda es usar lentes de silicona hidrogel de buena transmisión de oxígeno, y sobre todo, tener la graduación exacta correcta. La causa casi siempre es la graduación, no la marca.' },
    { q: '¿Cuándo debo preocuparme y consultar a un profesional?',
      a: 'Si el dolor de cabeza es fuerte, viene acompañado de visión doble, dolor ocular intenso, o no mejora al quitarte los lentes, consulta a un oftalmólogo lo antes posible — no es normal y merece revisión.' },
  ],
  relatedSlugs: [
    'cuando-cambiar-graduacion-lentes-contacto-senales-rd',
    'examen-visual-antes-de-comprar-lentes-contacto-rd',
    'lentes-contacto-computadora-pantallas',
    'sensacion-arenilla-irritacion-lentes-contacto-causas',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lentes de contacto dolor de cabeza, lentes de contacto migrana, por que me duele la cabeza con lentes de contacto',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Nota importante antes de empezar: en ContactGo vendemos el producto, no diagnosticamos condiciones médicas. Si tienes dolores de cabeza frecuentes o intensos, la recomendación siempre es consultar con un profesional de salud. Dicho esto, hay varias causas comunes relacionadas con lentes de contacto que vale la pena descartar primero.</p>

      <h2>Las causas más comunes (relacionadas con el lente)</h2>

      <h3>1. Graduación desactualizada o incorrecta</h3>
      <p>Es, por lejos, la causa más frecuente. Cuando la graduación no es exacta, tus ojos hacen un esfuerzo extra constante para enfocar — ese esfuerzo prolongado (llamado fatiga acomodativa) se traduce en dolor de cabeza, generalmente hacia la frente o detrás de los ojos, que empeora conforme pasa el día.</p>

      <h3>2. Astigmatismo sin corregir</h3>
      <p>Si tienes astigmatismo y estás usando lentes esféricos (sin corrección de cilindro), tu cerebro trabaja de más tratando de “arreglar” una imagen que nunca termina de estar completamente nítida. Esto es especialmente común en personas que asumieron que solo tenían miopía sin haber confirmado su CYL exacto.</p>

      <h3>3. Ojo seco por uso prolongado</h3>
      <p>La resequedad ocular por muchas horas de uso (especialmente frente a pantallas, donde parpadeamos menos) puede generar tensión muscular alrededor de los ojos que se percibe como dolor de cabeza.</p>

      <h3>4. Adaptación inicial a una marca o graduación nueva</h3>
      <p>Un leve malestar durante los primeros 1-3 días al cambiar de marca o de graduación es normal — tu sistema visual se está ajustando. Si pasa de una semana, ya no se considera adaptación normal.</p>

      <h2>Qué hacer si te está pasando</h2>
      <ul>
        <li>Confirma que tu receta esté vigente (no mayor a 12 meses) y sea exacta</li>
        <li>Si pasas muchas horas frente a pantallas, considera lentes con mejor transmisión de oxígeno e hidratación</li>
        <li>Aplica la regla 20-20-20: cada 20 minutos, mira algo a 20 pies (6 metros) durante 20 segundos</li>
        <li>Si el dolor es fuerte, frecuente, o viene con visión doble, consulta a un oftalmólogo — no lo relaciones automáticamente con los lentes sin confirmarlo</li>
      </ul>

      <h2>Lo que NO debes hacer</h2>
      <p>No sigas usando la misma graduación “porque ya la tenías” si sospechas que cambió — una receta vencida es una de las causas más evitables de este problema. Tampoco ignores dolores fuertes asumiendo que “es normal” — mejor descartarlo con un profesional que arriesgarte.</p>

      <p>Si sospechas que tu graduación cambió, usa nuestra <Link href="/receta">calculadora</Link> con tu receta más reciente, o escríbenos por WhatsApp al <strong>(809) 694-2268</strong> si tienes dudas sobre qué marca probar.</p>
    </BlogArticle>
  )
}
