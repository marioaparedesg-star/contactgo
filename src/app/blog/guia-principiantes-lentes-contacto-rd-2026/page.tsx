export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'guia-principiantes-lentes-contacto-rd-2026',
  title: 'Guía para Principiantes de Lentes de Contacto RD 2026',
  h1: 'Guía completa para principiantes de lentes de contacto en República Dominicana',
  description: 'Todo lo que necesitas saber antes de usar lentes de contacto por primera vez: qué necesitas, cómo elegir, cómo ponerlos, cuidados esenciales y errores comunes. Guía 2026.',
  publishedAt: '2026-07-30',
  readMinutes: 10,
  category: 'Guías',
  faq: [
    { q: '¿Cuánto tiempo tarda uno en acostumbrarse a los lentes de contacto?',
      a: 'La mayoría se adapta en 3-7 días. Empieza usándolos 2-3 horas el primer día e incrementa 1-2 horas diarias. En una semana ya deberías poder usarlos 8+ horas sin molestia significativa. Si después de 2 semanas sigues muy incómodo, consulta con un óptico — puede ser que necesites otra marca o graduación.' },
    { q: '¿Duele ponerse los lentes de contacto por primera vez?',
      a: 'No duele — pero es raro al principio. Sientes el lente como una pestaña extraña por unos segundos hasta que el ojo se acostumbra. Con práctica de 3-4 días, no lo sientes en absoluto. Si sientes dolor real (no molestia), retira el lente inmediatamente: puede estar al revés o tener una impureza.' },
    { q: '¿Necesito receta para comprar mis primeros lentes de contacto?',
      a: 'Sí, siempre. Los lentes de contacto son dispositivos médicos regulados. Necesitas una receta óptica vigente (no mayor de 12 meses) con tu graduación exacta. Si nunca has ido, visita primero un óptico u oftalmólogo. Cuesta RD$800-1,500 la consulta.' },
    { q: '¿Cuánto cuestan los primeros lentes de contacto en RD?',
      a: 'Para empezar recomendamos 1-DAY ACUVUE Moist (diarios) por RD$1,850 la caja de 30 lentes = 15 días de uso. O Biofinity mensual por RD$4,025 la caja de 6 = 3 meses de uso. Considera también solución (si vas mensual) RD$750-1,200 y un estuche de lentes RD$150.' },
  ],
  relatedSlugs: [
    'primeros-pasos-lentes-contacto-rd',
    'como-poner-lentes-de-contacto',
    'lentes-diarios-vs-mensuales',
    'cuanto-cuestan-lentes-contacto-rd',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: {
    title: meta.h1, description: meta.description,
    url: `https://www.contactgo.net/blog/${meta.slug}`,
    type: 'article', locale: 'es_DO', siteName: 'ContactGo',
  },
  keywords: 'guia principiantes lentes contacto, primera vez lentes contacto RD, como empezar a usar lentes de contacto, todo lo que debo saber lentes contacto',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Estás pensando en pasarte a los lentes de contacto. Buena decisión: campo visual completo, sin monturas pesadas, mejor para deportes, cambio estético. Pero seguro tienes preguntas: ¿duele? ¿son difíciles de poner? ¿qué marca? ¿cuánto invertir al inicio?</p>

      <p>Esta guía te lleva paso a paso desde antes de comprar hasta convertirte en usuario experto — con la realidad del mercado dominicano (marcas, precios, disponibilidad).</p>

      <h2>Paso 1: Consigue tu receta óptica</h2>

      <p>Antes de nada. Los lentes de contacto son <strong>dispositivos médicos</strong> y necesitas una receta óptica vigente. La receta de gafas <em>casi</em> sirve — pero para lentes de contacto necesitas dos parámetros extra que la receta de gafas no siempre trae:</p>

      <ul>
        <li><strong>Curvatura base (BC):</strong> qué tan curvo es tu ojo. Suele ser 8.4, 8.6 o 8.8.</li>
        <li><strong>Diámetro (DIA):</strong> tamaño del lente. Suele ser 14.0 a 14.5.</li>
      </ul>

      <p>Si tienes receta reciente de gafas (menos de 12 meses), puedes usarla temporalmente asumiendo curvatura estándar. Pero lo ideal es visitar un óptico para una "adaptación" formal de lentes de contacto — cuesta RD$800-1,500 en RD y toma 30 minutos.</p>

      <p>Si ya tienes tu receta de gafas y quieres saber qué lentes de contacto corresponden, usa nuestra <Link href="/receta">calculadora gratuita</Link>: ingresas tu graduación y te dice los productos compatibles con precios reales.</p>

      <h2>Paso 2: Decide diarios o mensuales</h2>

      <p>Es la primera gran decisión. Cada uno tiene ventajas:</p>

      <h3>Lentes diarios (recomendado para empezar)</h3>
      <ul>
        <li>✅ Máxima higiene — cada mañana un lente nuevo</li>
        <li>✅ No necesitas rutina de limpieza</li>
        <li>✅ Ideal para viajes</li>
        <li>✅ Si algo sale mal, tiras el lente y ya</li>
        <li>❌ Más caros a largo plazo</li>
        <li>❌ Más residuo plástico</li>
      </ul>
      <p><strong>Costo:</strong> caja de 30 lentes = 15 días de uso. Un mes ~ RD$3,700. Un año ~ RD$44,000.</p>

      <h3>Lentes mensuales</h3>
      <ul>
        <li>✅ Más económicos por unidad</li>
        <li>✅ Menos residuo plástico</li>
        <li>✅ Materiales más avanzados (silicona hidrogel)</li>
        <li>❌ Requiere rutina de limpieza nocturna</li>
        <li>❌ Necesitas comprar solución multipropósito</li>
        <li>❌ Si contaminas el lente, no puedes tirarlo (ya pagaste el mes)</li>
      </ul>
      <p><strong>Costo:</strong> caja de 6 lentes = 3 meses. Un mes ~ RD$1,340. Un año ~ RD$16,100 + solución RD$12,000 = <strong>RD$28,100 anuales</strong>.</p>

      <p><strong>Nuestra recomendación:</strong> empieza con diarios los primeros 2-3 meses. Cuando ya te sientas cómodo poniéndolos y quitándolos, evalúa cambiar a mensuales si buscas ahorro.</p>

      <h2>Paso 3: Elige la marca correcta</h2>

      <p>Para principiantes en RD, estas son las opciones ganadoras según categoría:</p>

      <h3>Sin astigmatismo (esféricos simples)</h3>
      <ul>
        <li><strong>Diario:</strong> 1-DAY ACUVUE Moist (RD$1,850)</li>
        <li><strong>Mensual:</strong> Biofinity (RD$4,025)</li>
      </ul>

      <h3>Con astigmatismo (necesitas tóricos)</h3>
      <ul>
        <li><strong>Diario:</strong> ACUVUE Moist for Astigmatism (RD$2,400)</li>
        <li><strong>Mensual:</strong> Biofinity Toric (RD$5,750)</li>
      </ul>

      <h3>Con presbicia (+40 años)</h3>
      <ul>
        <li><strong>Mensual multifocal:</strong> Biofinity Multifocal (RD$8,900)</li>
      </ul>

      <h2>Paso 4: Aprende a ponerlos correctamente</h2>

      <p>Esto es lo que más asusta a los principiantes. La técnica correcta:</p>

      <ol>
        <li><strong>Lávate las manos con jabón</strong> y sécalas bien con toalla que no suelte pelusa.</li>
        <li><strong>Verifica que el lente esté "derecho":</strong> ponlo en la yema de tu dedo índice. Si tiene forma de tacita perfecta, está bien. Si los bordes están volteados hacia afuera (como plato de sopa), está al revés — voltéalo suavemente.</li>
        <li><strong>Con la mano opuesta,</strong> abre bien tu párpado superior desde arriba (usa los dedos medios).</li>
        <li><strong>Con la misma mano,</strong> baja tu párpado inferior con el pulgar.</li>
        <li><strong>Mira hacia arriba y ligeramente hacia el lado opuesto.</strong> Coloca el lente sobre la parte blanca del ojo (esclera) — no directamente sobre la pupila.</li>
        <li><strong>Cierra suavemente el ojo</strong> y muévelo en círculos para centrar el lente.</li>
        <li><strong>Parpadea.</strong> Si sientes molestia, es normal las primeras veces. Si duele: quítatelo y verifica que no esté al revés o tenga polvo.</li>
      </ol>

      <p>La primera semana pueden tomarte 15-20 minutos ponerlos. Después bajas a 2 minutos.</p>

      <h2>Paso 5: Rutina diaria y de limpieza (solo para mensuales)</h2>

      <h3>Al ponerlos (mañana)</h3>
      <ol>
        <li>Lavarse las manos con jabón sin fragancia</li>
        <li>Sacar el lente del estuche</li>
        <li>Enjuagarlo con solución multipropósito nueva</li>
        <li>Colocarlo</li>
        <li>Vaciar la solución vieja del estuche y dejarlo secando al aire</li>
      </ol>

      <h3>Al quitarlos (noche)</h3>
      <ol>
        <li>Lavarse las manos</li>
        <li>Retirar el lente pellizcándolo suavemente en la parte inferior del ojo (mirando hacia arriba)</li>
        <li>Ponerlo en la palma de la mano</li>
        <li>Aplicar 2-3 gotas de solución y frotar suavemente 20 segundos con el dedo</li>
        <li>Enjuagar con más solución</li>
        <li>Guardar en estuche limpio con solución nueva (nunca reutilizar la del día anterior)</li>
      </ol>

      <p>Cambia tu estuche cada 3 meses.</p>

      <h2>Errores comunes de principiantes (evita estos)</h2>

      <ul>
        <li><strong>Poner los lentes con las manos mojadas</strong> — el agua del grifo contiene microorganismos (Acanthamoeba) que causan queratitis grave.</li>
        <li><strong>Nadar o bañarse con lentes puestos</strong> — mismo riesgo.</li>
        <li><strong>Dormir con los lentes puestos</strong> — reduce oxígeno a la córnea drásticamente. Salvo lentes específicamente aprobados para uso nocturno.</li>
        <li><strong>Excederse en el tiempo</strong> — 8-10 horas máximo al día como principiante. Si excedes, ojos rojos e irritados.</li>
        <li><strong>"Rellenar" la solución del estuche</strong> — siempre solución nueva cada vez. La vieja está contaminada.</li>
        <li><strong>Usar los lentes más allá de su vida útil</strong> — un mensual usado por 45 días acumula depósitos y puede infectarte.</li>
        <li><strong>Compartir lentes</strong> — obvio pero pasa. Nunca.</li>
      </ul>

      <h2>Señales de alarma: cuándo consultar</h2>
      <p>Retira los lentes y consulta con un óptico si presentas:</p>
      <ul>
        <li>Ojo rojo persistente (más de 24 horas)</li>
        <li>Dolor real (no molestia)</li>
        <li>Visión borrosa que no se resuelve al quitarse el lente</li>
        <li>Sensibilidad extrema a la luz</li>
        <li>Secreción amarillenta o verdosa</li>
        <li>Lagrimeo excesivo continuo</li>
      </ul>

      <h2>Checklist para tu primer par</h2>
      <ul>
        <li>☐ Receta óptica vigente (menos de 12 meses)</li>
        <li>☐ Caja de lentes (marca recomendada según tu caso)</li>
        <li>☐ Solución multipropósito (si vas mensual)</li>
        <li>☐ Estuche de lentes (viene incluido con la solución generalmente)</li>
        <li>☐ Gotas humectantes de respaldo (Systane, Refresh)</li>
        <li>☐ Toalla limpia sin pelusa para las manos</li>
      </ul>

      <p>¿Listo para comprar tus primeros lentes? Empieza por nuestra <Link href="/receta">calculadora</Link> — solo necesitas tu receta de gafas. Si tienes dudas específicas, escríbenos por WhatsApp al <strong>(809) 694-2268</strong> y te asesoramos.</p>
    </BlogArticle>
  )
}
