export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-estudiantes-universidad-examenes-rd',
  title: 'Lentes de Contacto para Estudiantes en Época de Exámenes',
  h1: 'Lentes de contacto para estudiantes universitarios en época de exámenes',
  description: 'Largas horas de estudio, poco sueño, mucha pantalla — cómo cuidar tus ojos y tus lentes de contacto durante la temporada de exámenes.',
  publishedAt: '2026-09-17',
  readMinutes: 5,
  category: 'Consejos',
  faq: [
    { q: '¿Puedo dormir con lentes de contacto si me quedo estudiando hasta tarde?', a: 'No, salvo que sean lentes específicamente aprobados para uso prolongado/nocturno — quedarte dormido con lentes normales, aunque sea sin querer, aumenta el riesgo de irritación e infección.' },
    { q: '¿Cuántas horas seguidas puedo usar lentes de contacto estudiando?', a: 'El límite recomendado normal (8-10 horas para la mayoría de marcas) sigue aplicando — estudiar no cambia ese límite, así que respeta tu horario de retiro habitual.' },
    { q: '¿El estrés de los exámenes afecta mis lentes de contacto?', a: 'El estrés en sí no afecta el lente directamente, pero puede afectar hábitos como dormir menos o frotarte los ojos con más frecuencia — ambos sí pueden generar molestia con lentes puestos.' },
  ],
  relatedSlugs: [
    'lentes-contacto-computadora-pantallas',
    'lentes-contacto-parpadeo-fatiga-visual-rd',
    'lentes-contacto-adolescentes-primera-vez-padres-rd',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lentes de contacto estudiantes, lentes de contacto examenes universidad, lentes de contacto epoca de examenes rd',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Época de exámenes significa largas horas de estudio, mucha pantalla, y a veces noches cortas de sueño — una combinación que le pasa factura a tus ojos, especialmente si usas lentes de contacto. Aquí cómo cuidarte durante estas semanas intensas.</p>

      <h2>El riesgo real: quedarte dormido con lentes puestos</h2>
      <p>Es más común de lo que parece durante temporada de exámenes — te quedas estudiando, el cansancio gana, y te duermes sin darte cuenta con los lentes puestos. Salvo que uses lentes específicamente aprobados para uso prolongado, esto aumenta el riesgo de irritación o infección. Si te pasa, retira los lentes apenas despiertes y dale a tus ojos un descanso antes de ponerte otro par.</p>

      <h2>Respeta el límite de horas, aunque estés estudiando</h2>
      <p>El límite recomendado de uso diario (generalmente 8-10 horas para la mayoría de marcas) no cambia solo porque tengas un examen importante al día siguiente. Si sabes que vas a estudiar más de esas horas, considera tener gafas de respaldo para las horas finales de la sesión.</p>

      <h2>Pantallas + lectura prolongada = doble fatiga</h2>
      <p>Estudiar combina lectura de libros/apuntes con pantallas de laptop o tablet — ambas actividades reducen tu parpadeo natural. Aplica la <strong>regla 20-20-20</strong>: cada 20 minutos, mira algo a 20 pies de distancia durante 20 segundos. Ayuda tanto con la fatiga visual como con la resequedad.</p>

      <h2>Gotas lubricantes: tu aliado en época de exámenes</h2>
      <p>Ten un frasco pequeño de gotas lubricantes en tu mochila o mesa de estudio — sesiones largas de concentración son exactamente cuando más se necesitan.</p>

      <h2>Sobre el estrés y frotarse los ojos</h2>
      <p>El estrés de los exámenes no afecta el lente de contacto directamente, pero sí puede llevarte a frotarte los ojos con más frecuencia de lo normal — un hábito que puede irritar la superficie ocular y, en casos raros, desplazar el lente. Si notas que lo haces mucho, es momento de una pausa.</p>

      <h2>Si estudias en la biblioteca con aire acondicionado</h2>
      <p>Las bibliotecas suelen tener A/C fuerte — el mismo efecto de resequedad que en una oficina. Si vas a estar horas ahí, lleva tus gotas lubricantes contigo.</p>

      <h2>Para la noche antes del examen</h2>
      <p>Prioriza dormir lo suficiente sobre estudiar una hora más — además de todo lo demás, dormir mal afecta directamente la producción de lágrima, haciendo que el día del examen tus lentes se sientan más incómodos de lo normal justo cuando necesitas estar concentrado.</p>

      <p>¿Necesitas reponer tus lentes o gotas antes de la temporada de exámenes? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong>.</p>
    </BlogArticle>
  )
}
