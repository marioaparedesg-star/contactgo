export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-gimnasio-pesas-crossfit-rd',
  title: 'Lentes de Contacto para el Gimnasio, Pesas y CrossFit',
  h1: 'Lentes de contacto para gimnasio, pesas y CrossFit',
  description: 'Sudor, esfuerzo, movimiento rápido — qué considerar si entrenas fuerte y usas lentes de contacto, y qué marcas aguantan mejor una rutina intensa.',
  publishedAt: '2026-09-08',
  readMinutes: 5,
  category: 'Consejos',
  faq: [
    { q: '¿El sudor daña los lentes de contacto?', a: 'El sudor en sí no daña el material del lente, pero si te entra en los ojos puede causar irritación temporal — usar una banda o toalla para controlarlo ayuda, igual que harías sin lentes de contacto.' },
    { q: '¿Puedo usar lentes de contacto para levantamiento de pesas pesado?', a: 'Sí, sin ningún problema — de hecho es más seguro que usar gafas, que pueden deslizarse o golpearte la cara durante un levantamiento.' },
    { q: '¿Qué pasa si un lente se me sale a mitad del entrenamiento?', a: 'Detente, lávate las manos si es posible, y sigue los pasos para reposicionarlo — nunca se "pierde" dentro del ojo, es físicamente imposible.' },
  ],
  relatedSlugs: [
    'lentes-contacto-deporte-actividad-fisica',
    'lentes-contacto-computadora-pantallas',
    'se-me-salio-perdio-un-lente-de-contacto-que-hacer',
    'lentes-contacto-clima-tropical-playa-rd',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lentes de contacto gimnasio, lentes de contacto crossfit, lentes de contacto para pesas rd',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si entrenas con regularidad — pesas, CrossFit, funcional — los lentes de contacto son en muchos sentidos mejores que las gafas: no se deslizan, no se empañan, no te limitan el campo visual periférico durante un levantamiento. Pero hay algunas cosas específicas que vale la pena saber.</p>

      <h2>Por qué son mejores que las gafas para entrenar fuerte</h2>
      <ul>
        <li>No se deslizan por el sudor durante un levantamiento pesado</li>
        <li>No hay riesgo de que se rompan o te golpeen la cara en un movimiento explosivo</li>
        <li>Campo visual completo, sin el marco limitando tu visión periférica — relevante para deportes con movimiento rápido</li>
        <li>Compatibles con gafas de protección si tu disciplina las requiere</li>
      </ul>

      <h2>El sudor y tus ojos</h2>
      <p>El sudor que entra en contacto con el lente no lo daña, pero si te escurre hacia los ojos puede causar ardor o irritación temporal — el sudor tiene sal y otros compuestos que naturalmente irritan cualquier ojo, con o sin lentes de contacto. Una banda para la cabeza o una toalla para secarte la frente entre series ayuda con esto, igual que ayudaría a cualquier persona.</p>

      <h2>Para entrenamientos muy intensos o largos</h2>
      <p>Si tus sesiones son largas (CrossFit, entrenamientos de más de 1 hora), considera:</p>
      <ul>
        <li><strong>Silicona hidrogel de buena transmisión de oxígeno</strong> — toda nuestra línea principal lo es, importante para uso prolongado sin sensación de resequedad</li>
        <li><strong>Lentes diarios</strong> si entrenas con mucha frecuencia y sudas bastante — evitas depósitos acumulados de una sesión intensa</li>
        <li><strong>Gotas lubricantes</strong> a mano si notas resequedad hacia el final de la sesión</li>
      </ul>

      <h2>Si un lente se mueve o se sale durante el entrenamiento</h2>
      <p>Detente, no sigas el ejercicio con visión afectada. Lávate las manos si tienes acceso a un baño cerca, y sigue el proceso normal para reposicionar un lente — nunca se pierde "dentro" del ojo, es imposible físicamente. Si no logras resolverlo en el momento, retíralo y continúa con el otro ojo o pospón el resto de la sesión.</p>

      <h2>Deportes de contacto o alto impacto</h2>
      <p>Para boxeo, artes marciales, o deportes donde hay contacto físico directo cerca de los ojos, consulta con tu entrenador y considera protección adicional — los lentes de contacto por sí solos no ofrecen protección física ante un golpe directo, igual que no la ofrecerían tus propios ojos sin nada.</p>

      <p>¿Quieres una recomendación específica para tu rutina de entrenamiento? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong>.</p>
    </BlogArticle>
  )
}
