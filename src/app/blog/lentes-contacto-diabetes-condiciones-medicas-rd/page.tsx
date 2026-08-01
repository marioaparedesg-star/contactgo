export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-diabetes-condiciones-medicas-rd',
  title: 'Lentes de Contacto si Tienes Diabetes u Otra Condición Médica',
  h1: '¿Puedo usar lentes de contacto si tengo diabetes u otra condición médica?',
  description: 'Información sobre el uso de lentes de contacto en personas con diabetes, hipotiroidismo, síndrome de Sjögren y otras condiciones que afectan la salud ocular.',
  publishedAt: '2026-08-01',
  readMinutes: 6,
  category: 'Salud',
  faq: [
    { q: '¿Las personas con diabetes pueden usar lentes de contacto?',
      a: 'En general sí, siempre que la diabetes esté bien controlada y no haya complicaciones oculares significativas (como retinopatía diabética avanzada). Es fundamental consultar con tu oftalmólogo, ya que la diabetes puede afectar la córnea y la producción de lágrimas, requiriendo seguimiento más cercano.' },
    { q: '¿Qué condiciones médicas dificultan el uso de lentes de contacto?',
      a: 'Las que más comúnmente requieren precaución especial son: diabetes no controlada, síndrome de Sjögren y otras enfermedades autoinmunes que causan ojo seco severo, hipotiroidismo (asociado a menor producción de lágrimas), y cualquier infección ocular activa.' },
    { q: '¿Debo avisarle a la tienda si tengo una condición médica al comprar lentes de contacto?',
      a: 'No es obligatorio para la compra en sí (los lentes de contacto son de venta libre con receta vigente), pero si tienes una condición que afecta tus ojos, es importante que tu receta provenga de una consulta reciente donde el profesional haya evaluado específicamente tu aptitud para usar lentes de contacto.' },
  ],
  relatedSlugs: ['ojos-secos-lentes-contacto', 'lentes-contacto-embarazo-republica-dominicana', 'lentes-contacto-alergia-conjuntivitis'],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lentes de contacto diabetes, puedo usar lentes contacto con condicion medica, lentes contacto enfermedad autoinmune RD',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si tienes una condición médica como diabetes, hipotiroidismo, o alguna enfermedad autoinmune, es natural preguntarte si eso afecta tu posibilidad de usar lentes de contacto con seguridad. Aquí información general — aunque siempre recomendamos confirmar tu caso específico con tu médico u oftalmólogo.</p>

      <p><strong>Importante:</strong> este artículo es informativo, no reemplaza el consejo médico personalizado. Si tienes cualquier condición que afecte tu salud ocular, consulta siempre con tu profesional de salud antes de usar lentes de contacto.</p>

      <h2>Diabetes y lentes de contacto</h2>
      <p>La diabetes, especialmente si no está bien controlada, puede afectar los ojos de varias formas:</p>
      <ul>
        <li><strong>Fluctuaciones en la córnea</strong> — los niveles altos de glucosa pueden causar cambios temporales en la curvatura corneal, afectando cómo calza el lente</li>
        <li><strong>Menor sensibilidad corneal</strong> — algunas personas con diabetes de larga data tienen menor capacidad de sentir irritación temprana, lo que retrasa la detección de problemas</li>
        <li><strong>Cicatrización más lenta</strong> — cualquier microlesión en la córnea puede tardar más en sanar</li>
        <li><strong>Retinopatía diabética</strong> (en casos avanzados) — no afecta directamente el uso de lentes de contacto, pero requiere seguimiento oftalmológico regular de cualquier forma</li>
      </ul>
      <p><strong>En general:</strong> personas con diabetes bien controlada pueden usar lentes de contacto sin problema, pero se recomienda seguimiento oftalmológico más frecuente (cada 6 meses en vez de anual) para monitorear la salud corneal.</p>

      <h2>Enfermedades autoinmunes y ojo seco severo</h2>
      <p>Condiciones como el <strong>síndrome de Sjögren</strong>, lupus, artritis reumatoide, y otras enfermedades autoinmunes frecuentemente causan sequedad ocular significativa por afectar las glándulas productoras de lágrimas.</p>
      <p>Esto no necesariamente elimina la posibilidad de usar lentes de contacto, pero sí requiere:</p>
      <ul>
        <li>Elegir materiales de máxima retención de humedad (Bausch+Lomb Ultra, DAILIES Total1)</li>
        <li>Uso de gotas humectantes con mayor frecuencia</li>
        <li>Reducir horas de uso diario comparado con alguien sin esta condición</li>
        <li>Seguimiento oftalmológico más cercano</li>
      </ul>

      <h2>Hipotiroidismo</h2>
      <p>El hipotiroidismo (tiroides poco activa) puede asociarse con menor producción de lágrimas y, en algunos casos, cambios en la textura de la piel de los párpados. La mayoría de personas con hipotiroidismo bien controlado con medicación no tienen restricciones significativas para usar lentes de contacto, aunque algunos pueden beneficiarse de lentes de mayor humectación.</p>

      <h2>Embarazo</h2>
      <p>El embarazo puede causar cambios hormonales temporales que afectan la curvatura corneal y la producción de lágrimas, especialmente en el segundo y tercer trimestre. Muchas mujeres reportan menor comodidad con sus lentes habituales durante este período. No es una contraindicación absoluta, pero vale la pena tener paciencia con posibles ajustes temporales de comodidad.</p>

      <h2>¿Cuándo definitivamente debo consultar antes de usar lentes de contacto?</h2>
      <ul>
        <li>Tienes una infección ocular activa (conjuntivitis, blefaritis aguda)</li>
        <li>Tu diabetes no está bien controlada actualmente</li>
        <li>Experimentas síntomas de ojo seco severo (ardor constante, sensación de arena permanente)</li>
        <li>Estás bajo tratamiento con medicamentos que afectan la producción de lágrimas</li>
        <li>Tienes cualquier duda sobre cómo tu condición específica podría interactuar con el uso de lentes de contacto</li>
      </ul>

      <h2>Lo que puedes hacer</h2>
      <p>Si tienes alguna condición médica y ya usas lentes de contacto sin problema, sigue con tu rutina habitual y mantén tus revisiones periódicas. Si estás considerando empezar a usarlos y tienes una condición médica relevante, la recomendación es simple: <strong>consulta primero con tu oftalmólogo</strong> para una evaluación específica de tu caso antes de tu primera compra.</p>

      <p>Una vez que tengas la autorización y receta correspondiente, puedes revisar nuestro <Link href="/catalogo">catálogo</Link> con opciones de alta humectación, o escribirnos por WhatsApp al <strong>(809) 694-2268</strong> para que te orientemos según tu situación específica.</p>
    </BlogArticle>
  )
}
