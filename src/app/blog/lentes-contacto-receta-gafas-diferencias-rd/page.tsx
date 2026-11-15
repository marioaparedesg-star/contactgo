export const revalidate = 86400
import type { Metadata } from 'next'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'
const meta: BlogMeta = {
  "slug": "lentes-contacto-receta-gafas-diferencias-rd",
  "title": "Receta de gafas vs. receta de lentes de contacto: diferencias",
  "h1": "¿La receta de tus gafas sirve para comprar lentes de contacto?",
  "description": "Descubre por qué la graduación de tus gafas no siempre coincide con la receta de lentes de contacto y qué datos necesitas para comprar con seguridad.",
  "publishedAt": "2026-11-15",
  "updatedAt": "2026-11-15",
  "readMinutes": 7,
  "category": "Guías",
  "faq": [
    {
      "q": "¿Puedo comprar lentes usando solo mi receta de gafas?",
      "a": "No es recomendable. La receta de gafas no suele incluir todos los parámetros necesarios para adaptar lentes de contacto."
    },
    {
      "q": "¿La graduación siempre cambia?",
      "a": "No siempre, pero la equivalencia depende de la graduación y del ajuste. Debe confirmarla un profesional."
    }
  ],
  "relatedSlugs": [
    "como-leer-receta-optica-rd",
    "examen-visual-antes-de-comprar-lentes-contacto-rd"
  ]
}
export const metadata: Metadata = {
 title: meta.title, description: meta.description,
 alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
 openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
 robots: { index: true, follow: true },
}
export default function Page(){ return <BlogArticle meta={meta}>
<p>Si ya usas gafas, puede parecer lógico pedir lentes de contacto con los mismos números. Sin embargo, ambas prescripciones no son intercambiables. El lente de contacto se coloca directamente sobre el ojo y necesita una evaluación específica.</p><h2>Qué aparece en cada receta</h2><p>La receta de gafas suele indicar potencia esférica y, si corresponde, cilindro y eje. La prescripción de contacto puede incluir esos valores y parámetros propios del lente: curva base (BC), diámetro (DIA), marca, material y modalidad de uso. No todos los diseños sirven para todas las graduaciones.</p><h2>Por qué no debes copiar los números</h2><p>La distancia entre una lente de gafas y el ojo no es la misma que la de un lente de contacto. En graduaciones altas puede cambiar la potencia necesaria. Además, el profesional debe comprobar movimiento, centrado, comodidad y visión con el lente puesto.</p><h2>Qué hacer antes de comprar</h2><ul><li>Lleva tu receta reciente y pide una evaluación para lentes de contacto.</li><li>Confirma marca, modelo y parámetros para cada ojo.</li><li>Pregunta cuándo debes volver para revisar la adaptación.</li></ul><p>Consulta nuestra <Link href="/blog/como-leer-receta-optica-rd">guía para leer la receta</Link> y revisa el <Link href="/catalogo">catálogo</Link> solo cuando tengas una indicación compatible. Esta página no sustituye una prescripción individual.</p>
<section className="mt-10 border-t border-gray-100 pt-6"><h2>Fuentes y lectura complementaria</h2><p>Contenido informativo; no sustituye una evaluación ni una prescripción individual. Sigue las instrucciones del fabricante y de tu profesional de salud visual.</p><ul><li><a href="https://www.cdc.gov/contact-lenses/prevention/index.html" rel="noopener noreferrer">CDC — Prevención y cuidado de lentes de contacto</a></li><li><a href="https://www.fda.gov/medical-devices/consumer-products/contact-lenses" rel="noopener noreferrer">FDA — Información para usuarios de lentes de contacto</a></li></ul></section>
</BlogArticle> }
