export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-color-ojos-claros-vs-oscuros-rd',
  title: 'Lentes de Color: Cuáles Se Ven Mejor Según tu Color de Ojos',
  h1: 'Lentes de contacto de color: qué tono elegir según tu color de ojos',
  description: 'No todos los tonos de AIR OPTIX Colors se ven igual en ojos claros que en ojos oscuros. Guía práctica para elegir el color que mejor te va.',
  publishedAt: '2026-09-08',
  readMinutes: 6,
  category: 'Color',
  faq: [
    { q: '¿Los lentes de color se ven bien en ojos oscuros?', a: 'Sí — AIR OPTIX Colors usa tecnología de 3 capas específicamente pensada para dar cobertura completa incluso sobre ojos color café oscuro, el tono más común en RD.' },
    { q: '¿Qué color se ve más natural si tengo ojos color café?', a: 'Avellana (Hazel) y Miel (Honey) suelen verse más naturales sobre ojos oscuros que tonos muy claros como el Azul Ártico, que contrastan más fuerte.' },
    { q: '¿Necesito graduación para usarlos?', a: 'No necesariamente — están disponibles con graduación o en versión "plano" (solo efecto de color, sin corrección visual).' },
  ],
  relatedSlugs: [
    'air-optix-colors-precio-republica-dominicana',
    'lentes-contacto-colores-rd',
    'lentes-contacto-carnaval-antifaz-disfraz-rd',
    'como-saber-si-lentes-contacto-son-originales-o-falsos-rd',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lentes de color ojos oscuros, lentes de color ojos claros, air optix colors republica dominicana, mejor color de lentes de contacto',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>La mayoría de las personas en República Dominicana tiene ojos color café — y eso cambia completamente qué tono de lente de color se va a ver bien. Un tono que luce espectacular sobre ojos claros puede verse apagado o poco natural sobre ojos oscuros, y viceversa. Aquí la guía real.</p>

      <h2>Por qué el color base de tus ojos importa tanto</h2>
      <p>Un lente de color no "pinta" tu ojo como una capa opaca — la mayoría de las líneas de calidad (como AIR OPTIX Colors) usan varias capas semi-translúcidas que se mezclan con tu color natural. Sobre ojos claros, esa mezcla apenas se nota. Sobre ojos oscuros, el tono final puede verse distinto de lo que muestra la foto del empaque, porque tu color de fondo influye en el resultado.</p>

      <h2>Si tienes ojos color café (el caso más común en RD)</h2>
      <ul>
        <li><strong>Avellana (Hazel)</strong> — el más recomendado, se mezcla de forma natural y da un efecto de "cambio sutil" en vez de un color obviamente artificial</li>
        <li><strong>Miel (Honey/Amber)</strong> — buen contraste sin verse forzado, especialmente con luz natural</li>
        <li><strong>Gris</strong> — funciona mejor de lo que se piensa sobre ojos oscuros, da un efecto más frío y sofisticado</li>
        <li><strong>Azul o Verde muy claros</strong> — son los que más contrastan; se ven definitivamente artificiales sobre ojos muy oscuros, lo cual no es malo si es justo el efecto que buscas (para una fiesta, Carnaval, sesión de fotos)</li>
      </ul>

      <h2>Si tienes ojos claros (verde, avellana claro, café claro)</h2>
      <p>Aquí casi cualquier tono funciona bien, porque hay menos pigmento natural con el cual "competir". Los tonos claros (Azul Ártico, Verde Gemstone) se ven especialmente naturales, casi como si fuera tu color real. Los tonos oscuros también se ven bien, dando un cambio dramático pero limpio.</p>

      <h2>Un tip que casi nadie menciona</h2>
      <p>La luz donde te vas a ver con más frecuencia importa. Bajo luz artificial de interior, los tonos con base dorada (Miel, Avellana) suelen verse más favorecedores. Bajo luz natural de día, los tonos con base fría (Gris, Azul) resaltan más.</p>

      <h2>¿Con o sin graduación?</h2>
      <p>AIR OPTIX Colors está disponible en versión "plano" (solo el efecto de color, sin corrección) y con graduación completa si también necesitas corregir tu visión — ambas usan exactamente la misma tecnología de color de 3 capas.</p>

      <p>¿No estás segura de cuál tono elegir? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong> con una foto de tus ojos y te recomendamos el tono que mejor se va a ver, o revisa los <Link href="/catalogo?tipo=color">12 tonos disponibles</Link> en el catálogo.</p>
    </BlogArticle>
  )
}
