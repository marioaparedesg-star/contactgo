export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-maratonista-corredor-larga-distancia-rd',
  title: 'Lentes de Contacto para Corredores y Maratonistas',
  h1: 'Lentes de contacto para corredores y maratonistas',
  description: 'Sudor, viento, horas de esfuerzo continuo — qué considerar si entrenas para una maratón o corres con regularidad y usas lentes de contacto.',
  publishedAt: '2026-09-10',
  readMinutes: 5,
  category: 'Consejos',
  faq: [
    { q: '¿Puedo correr una maratón completa con lentes de contacto?', a: 'Sí, es una práctica común entre corredores — solo considera llevar gotas lubricantes en tu kit de carrera para trayectos muy largos (más de 2-3 horas).' },
    { q: '¿El sudor puede hacer que se me salga un lente durante la carrera?', a: 'Es poco común — los lentes se adhieren por tensión superficial, no dependen de que no haya sudor. Si te entra sudor directo al ojo, puede causar ardor momentáneo, no desprendimiento del lente.' },
    { q: '¿Qué lente es mejor para entrenamientos de más de 2 horas?', a: 'Diarios o de buena retención de humedad como Biofinity o Bausch+Lomb ULTRA — importante para comodidad sostenida durante esfuerzo prolongado.' },
  ],
  relatedSlugs: [
    'lentes-contacto-gimnasio-pesas-crossfit-rd',
    'lentes-contacto-deporte-actividad-fisica',
    'lentes-contacto-clima-tropical-playa-rd',
    'ojos-secos-lentes-contacto',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lentes de contacto correr, lentes de contacto maraton republica dominicana, lentes de contacto corredores',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Ya sea que entrenes para la Maratón de Santo Domingo, corras con regularidad por tu sector, o simplemente hagas running como rutina, los lentes de contacto son casi siempre mejores que las gafas para correr — pero el esfuerzo prolongado trae consideraciones propias.</p>

      <h2>Por qué son mejores que las gafas para correr</h2>
      <ul>
        <li><strong>Sin deslizamiento</strong> — el rebote natural de correr hace que las gafas se muevan constantemente; los lentes de contacto no</li>
        <li><strong>Campo visual completo</strong> — sin marco limitando tu visión periférica, relevante para ver el terreno y obstáculos a los lados</li>
        <li><strong>Compatibles con gafas de sol deportivas</strong> — puedes usar cualquier gafa de sol para corredores sin necesidad de graduación</li>
        <li><strong>Sin empañamiento</strong> — el calor corporal y la respiración agitada no generan el mismo problema que con gafas</li>
      </ul>

      <h2>Sobre el sudor</h2>
      <p>Un mito común es que el sudor puede “sacar” el lente de contacto — en la práctica, esto es muy raro. Los lentes se mantienen en su lugar por tensión superficial de la lágrima, no por ausencia de sudor. Lo que sí puede pasar es que el sudor te entre directo al ojo y cause ardor momentáneo — una banda para la cabeza ayuda a controlar esto en carreras largas.</p>

      <h2>Para entrenamientos y carreras largas (más de 2 horas)</h2>
      <p>El esfuerzo prolongado, combinado con exposición al viento y al sol, puede acelerar la sensación de resequedad. Para esto:</p>
      <ul>
        <li><strong>Lleva gotas lubricantes</strong> en tu kit de carrera, especialmente para medias maratones o maratones completas</li>
        <li><strong>Considera lentes diarios</strong> para el día de la carrera específicamente — empiezas con un lente fresco, sin depósitos acumulados de entrenamientos previos</li>
        <li><strong>Hidrátate bien</strong> — la hidratación general también influye en la producción de lágrima</li>
      </ul>

      <h2>Correr de noche o madrugada</h2>
      <p>Si entrenas de madrugada o de noche (común para evitar el calor), los lentes de contacto eliminan los reflejos que las gafas pueden generar con luces de vehículos o postes de alumbrado — una ventaja adicional para corredores urbanos.</p>

      <h2>Si entrenas con regularidad</h2>
      <p>Una <Link href="/cuenta">suscripción de recompra automática</Link> asegura que nunca te quedes sin lentes justo antes de una carrera importante.</p>

      <p>¿Buscas la mejor opción para tu entrenamiento? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong>.</p>
    </BlogArticle>
  )
}
