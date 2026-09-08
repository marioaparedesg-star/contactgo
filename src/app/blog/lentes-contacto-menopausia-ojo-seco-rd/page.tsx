export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-menopausia-ojo-seco-rd',
  title: 'Lentes de Contacto Durante la Menopausia: Guía de Ojo Seco',
  h1: 'Lentes de contacto y menopausia: por qué cambia la comodidad',
  description: 'Los cambios hormonales de la menopausia pueden afectar cómo se sienten tus lentes de contacto de siempre. Te explicamos por qué y qué opciones ayudan.',
  publishedAt: '2026-09-08',
  readMinutes: 6,
  category: 'Salud ocular',
  faq: [
    { q: '¿Por qué mis lentes de contacto ya no se sienten igual de cómodos?', a: 'Los cambios hormonales de la menopausia pueden reducir la producción natural de lágrima, un efecto conocido y documentado — no es algo que estés imaginando ni una señal de que algo está mal con tus lentes.' },
    { q: '¿Debo dejar de usar lentes de contacto durante la menopausia?', a: 'No necesariamente — muchas mujeres solo necesitan cambiar a una marca con mejor retención de humedad, o combinar sus lentes con gotas lubricantes compatibles.' },
    { q: '¿Qué marca es mejor para este caso?', a: 'Proclear, con PC Technology diseñada específicamente para comodidad en ojo seco, suele ser la primera opción a probar en este tipo de situación.' },
  ],
  relatedSlugs: [
    'proclear-sphere-precio-republica-dominicana',
    'ojos-secos-lentes-contacto',
    'sensacion-arenilla-irritacion-lentes-contacto-causas',
    'lentes-contacto-computadora-pantallas',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lentes de contacto menopausia, ojo seco hormonal, lentes de contacto despues de los 45',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si llevas años usando la misma marca de lentes de contacto sin problema y de repente empiezan a sentirse incómodos o secos, y coincide con la etapa de la menopausia, no es coincidencia — hay una razón fisiológica real detrás de esto.</p>

      <h2>Por qué pasa esto</h2>
      <p>Durante la menopausia, los niveles de estrógeno disminuyen, y el estrógeno tiene un rol directo en la producción de lágrima y en la salud de las glándulas que la generan. Es un cambio ampliamente documentado en oftalmología — no significa que hiciste algo mal ni que tus lentes de siempre ahora sean "malos", simplemente tu ojo está produciendo menos lubricación natural que antes.</p>

      <h2>Señales de que esto te está pasando</h2>
      <ul>
        <li>Lentes que antes usabas todo el día ahora se sienten incómodos después de pocas horas</li>
        <li>Sensación de arenilla o cuerpo extraño que no tenías antes</li>
        <li>Necesidad de usar gotas lubricantes con más frecuencia</li>
        <li>Visión que se siente borrosa hacia el final del día, mejorando al parpadear</li>
      </ul>

      <h2>Qué puedes hacer — sin necesidad de dejar los lentes de contacto</h2>

      <h3>1. Cambiar a un material pensado para ojo seco</h3>
      <p><strong>Proclear</strong> usa PC Technology, una tecnología diseñada específicamente para retener humedad en casos de sequedad ocular — es frecuentemente la primera opción que se prueba en este tipo de situación.</p>

      <h3>2. Considerar reemplazo diario</h3>
      <p>Los lentes diarios (como 1-DAY ACUVUE Moist o clariti 1 day) no acumulan depósitos día tras día, lo que puede ayudar si la sequedad se combina con mayor sensibilidad a residuos en el lente.</p>

      <h3>3. Usar gotas lubricantes compatibles</h3>
      <p>Aplicar gotas específicamente formuladas para uso con lentes de contacto durante el día puede complementar cualquier cambio de marca.</p>

      <h3>4. Hablar con tu oftalmólogo</h3>
      <p>Si la sequedad es significativa, vale la pena una consulta — hay tratamientos médicos específicos para el síndrome de ojo seco que van más allá de simplemente cambiar de lente, y tu doctor puede evaluar si aplican en tu caso.</p>

      <h2>Lo importante de recordar</h2>
      <p>Este cambio no significa que debas resignarte a dejar de usar lentes de contacto — para la mayoría de las mujeres, un ajuste de marca o una rutina de cuidado adicional es suficiente para seguir usándolos cómodamente.</p>

      <p>¿Quieres probar Proclear o hablar sobre qué opción te conviene? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong> — te ayudamos a encontrar la marca que mejor se adapte a lo que estás sintiendo ahora.</p>
    </BlogArticle>
  )
}
