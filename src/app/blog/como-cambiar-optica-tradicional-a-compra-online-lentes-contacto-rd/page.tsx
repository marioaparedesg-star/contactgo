export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'como-cambiar-optica-tradicional-a-compra-online-lentes-contacto-rd',
  title: 'Cómo Pasar de tu Óptica de Siempre a Comprar Lentes de Contacto Online',
  h1: 'Cómo cambiarte de tu óptica de siempre a comprar lentes de contacto online',
  description: 'Llevas años comprando en la misma óptica. Guía paso a paso para hacer el cambio a compra online sin perder continuidad ni cometer errores en tu primer pedido.',
  publishedAt: '2026-07-31',
  readMinutes: 6,
  category: 'Guías',
  faq: [
    { q: '¿Pierdo mi historial médico si dejo de comprar en mi óptica de siempre?',
      a: 'No. Tu historial médico y receta pertenecen a ti, no a la óptica. Puedes solicitar una copia de tu receta más reciente antes de cambiar, o simplemente usar los datos que ya tienes anotados (graduación, curvatura, diámetro) en cualquier tienda que elijas.' },
    { q: '¿Necesito avisarle a mi óptico que voy a comprar en otro lugar?',
      a: 'No es obligatorio, pero si tienes una buena relación con tu óptico y planeas seguir yendo para tus exámenes visuales anuales, no hay problema en mantener ambas relaciones: examen presencial con tu óptico de confianza, compra recurrente donde te convenga más.' },
    { q: '¿Qué debo tener listo antes de hacer mi primer pedido online?',
      a: 'Tu receta completa (graduación de cada ojo, y si tienes astigmatismo el cilindro y eje), la marca exacta que usas actualmente (para no tener que adaptarte a un producto nuevo en tu primera compra online), y tu dirección de entrega exacta.' },
  ],
  relatedSlugs: ['optica-fisica-vs-tienda-online-especializada-lentes-contacto-rd', 'como-leer-tu-receta', 'comprar-lentes-contacto-online-republica-dominicana'],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'cambiar de optica a compra online lentes contacto, dejar de comprar en optica lentes contacto, primer pedido online lentes contacto RD',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Llevas años yendo a la misma óptica, conoces al personal, confías en el lugar — pero cada vez te cuesta más el tiempo, el desplazamiento, o simplemente notas que el precio no es el mejor del mercado. Hacer el cambio a comprar online no significa "abandonar" tu óptica de confianza — significa optimizar dónde compras tu reposición regular.</p>

      <h2>Paso 1: Reúne tu información de receta</h2>
      <p>Antes de cualquier cambio, necesitas tener a mano:</p>
      <ul>
        <li><strong>Graduación exacta de cada ojo</strong> (SPH para OD y OI)</li>
        <li><strong>Si tienes astigmatismo:</strong> cilindro (CYL) y eje (AXIS)</li>
        <li><strong>Si tienes presbicia:</strong> la potencia adicional (ADD)</li>
        <li><strong>Marca y modelo exacto</strong> que usas actualmente</li>
        <li><strong>Curvatura base y diámetro</strong> si los tienes (opcional pero útil)</li>
      </ul>
      <p>Puedes encontrar esta información en la caja de tu última compra, en tu receta física/digital, o pidiéndole a tu óptico una copia de tu prescripción más reciente — es tu derecho como paciente.</p>

      <h2>Paso 2: Verifica que tu receta siga vigente</h2>
      <p>Las recetas de lentes de contacto se consideran válidas generalmente hasta 12 meses. Si la tuya es más antigua, considera hacer una revisión rápida antes de tu primer pedido online — no necesariamente tienes que cambiar de graduación, solo confirmar que sigue siendo la correcta.</p>

      <h2>Paso 3: Haz tu primera compra con la MISMA marca que ya usas</h2>
      <p>El error más común al cambiar de proveedor es aprovechar para "probar algo nuevo" en la misma compra. No lo hagas en tu primer pedido. Compra exactamente la misma marca y presentación que ya conoces — así, si algo no coincide (precio, tiempo de entrega, calidad del servicio), sabes que la variable es la tienda, no el producto.</p>

      <p>Una vez que confirmes que el servicio te funciona bien, ahí sí puedes explorar otras marcas o promociones con confianza.</p>

      <h2>Paso 4: Guarda tu información para futuros pedidos</h2>
      <p>La ventaja real de comprar en una tienda especializada online es no tener que repetir el proceso completo cada vez. Al registrar tu cuenta, tu receta y dirección quedan guardadas — tu segunda compra toma literalmente 30 segundos.</p>

      <h2>¿Debo dejar de ir a mi óptico por completo?</h2>
      <p>No necesariamente. Recomendamos mantener la relación con tu óptico de confianza para:</p>
      <ul>
        <li>Tu examen visual anual (salud ocular, no solo graduación)</li>
        <li>Cualquier síntoma o molestia que requiera evaluación presencial</li>
        <li>Adaptaciones nuevas o cambios de tipo de lente (por ejemplo, pasar a multifocales por primera vez)</li>
      </ul>
      <p>Y usar la tienda online especializada para tu <strong>compra recurrente regular</strong> — que es donde realmente se nota la diferencia en comodidad y precio.</p>

      <h2>Comparación rápida antes de decidir</h2>
      <p>Antes de comprometerte por completo, compara tu primera compra online contra lo que pagas actualmente en tu óptica:</p>
      <ol>
        <li>Anota el precio exacto que pagas hoy por tu producto habitual</li>
        <li>Busca el mismo producto en una tienda online especializada</li>
        <li>Compara: precio, tiempo de entrega, facilidad del proceso</li>
        <li>Decide con datos reales, no solo por costumbre</li>
      </ol>

      <h2>Cómo empezar en ContactGo</h2>
      <p>Si ya tienes tu receta lista, usa nuestra <Link href="/receta">calculadora gratuita</Link> — ingresa tu graduación y te mostramos exactamente el producto que corresponde, con precio real. O si prefieres, escríbenos por WhatsApp al <strong>(809) 694-2268</strong> con una foto de tu receta actual y te confirmamos disponibilidad y precio antes de que decidas hacer el cambio.</p>
    </BlogArticle>
  )
}
