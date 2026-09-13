export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'receta-vencida-vs-graduacion-cambiada-diferencia-rd',
  title: 'Receta Vencida vs. Graduación Cambiada: ¿Cuál es la Diferencia?',
  h1: 'Receta vencida vs. graduación cambiada: no es lo mismo',
  description: 'Muchas personas confunden estos dos conceptos. Te explicamos la diferencia real y por qué importa saberla antes de reordenar tus lentes.',
  publishedAt: '2026-09-10',
  readMinutes: 5,
  category: 'Guías',
  faq: [
    { q: '¿Cuánto tiempo es válida una receta de lentes de contacto?', a: 'Generalmente 1 año, aunque puede variar según el optometrista y tu historial ocular — revisa la fecha de tu última evaluación.' },
    { q: '¿Puedo seguir pidiendo el mismo lente si mi receta está vencida pero mi vista no ha cambiado?', a: 'Técnicamente los números pueden seguir siendo correctos, pero una receta vencida significa que no se ha confirmado que tu córnea y salud ocular sigan bien — vale la pena una revisión aunque tu graduación no haya cambiado.' },
    { q: '¿Cómo sé si mi graduación cambió sin ir al optometrista?', a: 'Señales como visión borrosa que antes no tenías, dolores de cabeza frecuentes, o entrecerrar los ojos para ver bien son indicios — pero solo un examen confirma si realmente cambió.' },
  ],
  relatedSlugs: [
    'como-leer-receta-optica-rd',
    'lentes-contacto-primera-cita-optometrista-que-esperar-rd',
    'examen-visual-antes-de-comprar-lentes-contacto-rd',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'receta vencida lentes de contacto, graduacion cambiada lentes de contacto, cuanto dura receta lentes de contacto rd',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Es común escuchar estos dos términos usados como si fueran lo mismo, pero son conceptos distintos — y entender la diferencia te ayuda a saber cuándo realmente necesitas volver al optometrista, en vez de asumir que “todo sigue igual” solo porque ves bien.</p>

      <h2>Receta vencida: es sobre el tiempo, no sobre tu visión</h2>
      <p>Una receta de lentes de contacto tiene una fecha de vencimiento — generalmente 1 año desde tu última evaluación — sin importar si tu graduación cambió o no. El vencimiento no significa que tus números estén mal; significa que ha pasado suficiente tiempo desde tu última evaluación completa de salud ocular, no solo de tu graduación.</p>
      <p>Una receta vencida puede tener exactamente los mismos números que tenías hace un año — el problema no es el número, es que no se ha confirmado recientemente que tu córnea y ojo en general sigan sanos para seguir usando lentes de contacto con seguridad.</p>

      <h2>Graduación cambiada: es sobre tu visión, no sobre el calendario</h2>
      <p>Tu graduación puede cambiar en cualquier momento, independientemente de si tu receta está vigente o vencida. Señales de que esto podría estar pasando:</p>
      <ul>
        <li>Visión borrosa que antes no tenías, especialmente de lejos o de cerca</li>
        <li>Dolores de cabeza frecuentes, especialmente después de leer o usar pantallas</li>
        <li>Entrecerrar los ojos para enfocar mejor</li>
        <li>Fatiga visual que antes no experimentabas con la misma intensidad</li>
      </ul>
      <p>Solo un examen de refracción confirma si realmente cambió — no puedes “sentir” el número exacto de tu nueva graduación por tu cuenta.</p>

      <h2>¿Puedo tener uno sin el otro?</h2>
      <p>Sí, y de hecho es común:</p>
      <ul>
        <li><strong>Receta vigente + graduación cambiada:</strong> menos común, pero posible si tu vista cambió rápido entre evaluaciones</li>
        <li><strong>Receta vencida + graduación igual:</strong> el caso más común — han pasado más de 12 meses pero tu vista se ha mantenido estable</li>
        <li><strong>Ambos vigentes y correctos:</strong> el escenario ideal, y la razón por la que se recomienda una revisión anual aunque te sientas bien</li>
      </ul>

      <h2>Por qué esto importa al reordenar tus lentes</h2>
      <p>Si tu receta está vencida, es el momento de programar una nueva evaluación antes de simplemente reordenar el mismo producto de siempre — no porque tus números vayan a estar necesariamente mal, sino porque una evaluación completa confirma que todo sigue bien para seguir usando lentes de contacto con seguridad.</p>

      <p>¿No estás seguro si tu receta sigue vigente? Revisa la fecha en tu copia, o escríbenos por WhatsApp al <strong>(809) 694-2268</strong> si tienes dudas sobre cómo proceder.</p>
    </BlogArticle>
  )
}
