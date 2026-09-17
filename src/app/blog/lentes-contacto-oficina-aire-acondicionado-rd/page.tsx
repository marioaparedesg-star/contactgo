export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-oficina-aire-acondicionado-rd',
  title: 'Lentes de Contacto en Oficina con Aire Acondicionado',
  h1: 'Lentes de contacto en la oficina: el reto del aire acondicionado',
  description: '8 horas bajo A/C directo es de los ambientes más resecos para lentes de contacto. Te explicamos por qué y qué hacer al respecto.',
  publishedAt: '2026-09-17',
  readMinutes: 5,
  category: 'Consejos',
  faq: [
    { q: '¿Por qué el aire acondicionado reseca tanto los ojos?', a: 'El A/C reduce la humedad relativa del aire para poder enfriarlo, y ese aire seco acelera la evaporación de tu lágrima natural — mientras más directo te llegue el flujo, más se nota el efecto.' },
    { q: '¿Debo evitar sentarme cerca de la rejilla del A/C?', a: 'Si es posible, sí — o al menos reorientar la rejilla para que no sople directo hacia tu cara, un cambio simple que reduce bastante la resequedad.' },
    { q: '¿Qué lente aguanta mejor un ambiente de oficina con A/C todo el día?', a: 'Marcas con buena retención de humedad como Biofinity, Proclear, o Bausch+Lomb ULTRA suelen sentirse mejor en este tipo de ambiente que opciones básicas.' },
  ],
  relatedSlugs: [
    'lentes-contacto-computadora-pantallas',
    'lentes-contacto-parpadeo-fatiga-visual-rd',
    'ojos-secos-lentes-contacto',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lentes de contacto oficina, lentes de contacto aire acondicionado, ojos secos oficina republica dominicana',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si trabajas en oficina con aire acondicionado (la norma en la mayoría de empresas en RD) y usas lentes de contacto, es probable que hayas notado que los ojos se sienten más secos hacia el final del día laboral que en cualquier otro momento. No es tu imaginación — hay una razón ambiental real detrás.</p>

      <h2>Por qué el A/C reseca tanto</h2>
      <p>Un sistema de aire acondicionado enfría el aire reduciendo su capacidad de retener humedad — el resultado es aire con humedad relativa mucho más baja que el ambiente natural, ya de por sí húmedo, de República Dominicana. Ese aire seco circulando constantemente acelera la evaporación de tu lágrima natural, con o sin lentes de contacto, pero se nota especialmente con ellos puestos.</p>

      <h2>El problema se combina con otro factor: las pantallas</h2>
      <p>La mayoría de trabajos de oficina también implican uso constante de computadora — y ya sabemos que la concentración frente a una pantalla reduce el parpadeo natural. Combina eso con el aire seco del A/C, y tienes las condiciones perfectas para sentir los ojos resecos hacia media tarde.</p>

      <h2>Qué hacer al respecto</h2>

      <h3>1. Reorienta la rejilla de A/C si puedes</h3>
      <p>Si el aire te sopla directo a la cara, pide reorientar la rejilla o cambia de posición si es posible — un ajuste simple que reduce bastante el efecto.</p>

      <h3>2. Gotas lubricantes en tu escritorio</h3>
      <p>Tener un frasco pequeño de gotas lubricantes compatibles con lentes de contacto en tu gaveta del escritorio es de las soluciones más prácticas y efectivas.</p>

      <h3>3. Aplica la regla 20-20-20</h3>
      <p>Cada 20 minutos, mira algo a 20 pies de distancia durante 20 segundos — ayuda tanto con la fatiga visual como con el parpadeo reducido.</p>

      <h3>4. Considera una planta o humidificador de escritorio</h3>
      <p>Un pequeño humidificador de escritorio, o incluso una planta cerca de tu espacio de trabajo, puede ayudar marginalmente a contrarrestar la sequedad ambiental general.</p>

      <h3>5. Elige el material correcto</h3>
      <p>Si trabajas en oficina con A/C todos los días, vale la pena priorizar marcas con buena retención de humedad — Biofinity, Proclear, o Bausch+Lomb ULTRA suelen sentirse considerablemente mejor en este ambiente específico que opciones básicas.</p>

      <h2>Si ya probaste todo esto y sigue siendo incómodo</h2>
      <p>Si después de ajustar el ambiente y probar diferentes marcas la resequedad persiste, vale la pena una consulta con tu optometrista — podría haber un componente de ojo seco que se beneficia de un tratamiento específico más allá de solo cambiar de lente.</p>

      <p>¿Buscas la mejor opción para tu ambiente de oficina? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong>.</p>
    </BlogArticle>
  )
}
