export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-de-contacto-miopia-alta-graduacion-fuerte-rd',
  title: 'Lentes de Contacto para Miopía Alta (-6.00 y más) en RD',
  h1: 'Lentes de contacto para miopía alta y graduaciones fuertes en República Dominicana',
  description: 'Guía completa para usuarios con miopía alta (-6.00 y más). Qué lentes de contacto conseguir en RD, cómo funciona el efecto vértice, y las mejores marcas con rango extendido.',
  publishedAt: '2026-07-30',
  readMinutes: 8,
  category: 'Salud',
  faq: [
    { q: '¿Hasta cuántas dioptrías cubren los lentes de contacto en RD?',
      a: 'La mayoría de marcas estándar cubren hasta -6.00 o -8.00. Para graduaciones altas (más de -8.00, hasta -15.00 y más), se necesitan versiones XR (Extended Range) como Biofinity XR, ACUVUE Oasys XR o Air Optix XR. Estos requieren pedido especial con 2-3 semanas de espera.' },
    { q: '¿Por qué mi graduación de lentes de contacto es diferente a mis gafas si tengo miopía alta?',
      a: 'Se llama "efecto vértice". Cuando la graduación de tus gafas es mayor a -4.00, la distancia entre el cristal y el ojo (12mm) hace que necesites una graduación ligeramente MENOR en lentes de contacto (que están directamente sobre la córnea). Por ejemplo, -8.00 en gafas puede equivaler a -7.25 en lentes. Nuestra calculadora hace la conversión automáticamente.' },
    { q: '¿Puedo usar lentes de contacto con -10.00 o -12.00 en RD?',
      a: 'Sí, con Biofinity XR (Extended Range) que cubre hasta -15.00 esférico. Requiere ordenarse (no siempre hay stock inmediato). También hay opciones ACUVUE Oasys en rangos altos. Escríbenos por WhatsApp para verificar disponibilidad de tu graduación exacta.' },
    { q: '¿Son más caros los lentes de contacto para miopía alta?',
      a: 'Ligeramente. Los XR de Biofinity cuestan alrededor de RD$5,200-5,800 vs RD$4,025 del Biofinity estándar. Para uso diario, un año de lentes mensuales XR ronda los RD$62,000-70,000, aún mucho más económico que gafas nuevas de alta graduación con antireflejante premium.' },
  ],
  relatedSlugs: [
    'biofinity-xr-precio-republica-dominicana',
    'como-leer-tu-receta',
    'lentes-contacto-vs-gafas-cual-es-mejor',
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
  keywords: 'lentes contacto miopia alta RD, graduacion alta lentes contacto, -6.00 -8.00 -10.00 lentes contacto, Biofinity XR republica dominicana',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si tu graduación pasa de <strong>-6.00 dioptrías</strong>, probablemente ya conoces las incomodidades de las gafas de alta graduación: cristales gruesos, aro pesado, efecto de "ojos pequeños" desde afuera, y la distorsión periférica que limita tu visión lateral.</p>

      <p>La buena noticia: los lentes de contacto son <strong>especialmente ideales</strong> para personas con miopía alta. Al estar directamente sobre la córnea, eliminan la distorsión, el peso, y el efecto óptico que reduce el tamaño de tus ojos. Pero también hay consideraciones específicas que debes conocer.</p>

      <h2>¿Qué se considera miopía alta?</h2>
      <p>En términos clínicos:</p>
      <ul>
        <li><strong>Miopía leve:</strong> hasta -3.00 dioptrías</li>
        <li><strong>Miopía moderada:</strong> de -3.00 a -6.00</li>
        <li><strong>Miopía alta:</strong> de -6.00 a -10.00</li>
        <li><strong>Miopía magna (patológica):</strong> más de -10.00</li>
      </ul>
      <p>Aproximadamente el 15-20% de la población mundial tiene miopía alta o magna. En República Dominicana, es común encontrar pacientes con -8.00 a -12.00 que han venido usando gafas durante décadas sin explorar lentes de contacto — muchas veces porque su óptico no les explicó la opción o creían (incorrectamente) que "no había lentes para esa graduación".</p>

      <h2>El efecto vértice: por qué tu receta cambia</h2>
      <p>Este es el punto clave que confunde a la mayoría de usuarios de miopía alta al pasar a lentes de contacto:</p>
      <p><strong>Tus gafas están a ~12 milímetros del ojo. Los lentes de contacto están sobre la córnea (0 mm).</strong></p>
      <p>Esa diferencia de posición hace que la potencia óptica efectiva cambie. Para graduaciones superiores a ±4.00, el ajuste es significativo:</p>
      <ul>
        <li>Gafas -6.00 → lente de contacto -5.50</li>
        <li>Gafas -8.00 → lente de contacto -7.25</li>
        <li>Gafas -10.00 → lente de contacto -8.75</li>
        <li>Gafas -12.00 → lente de contacto -10.25</li>
        <li>Gafas -15.00 → lente de contacto -12.50</li>
      </ul>
      <p>Si compras lentes con la misma graduación de tus gafas, vas a ver borroso o forzarás demasiado. En ContactGo nuestra <Link href="/receta">calculadora automática</Link> hace la conversión con el ajuste vértice ya incluido.</p>

      <h2>Marcas disponibles en RD para miopía alta</h2>

      <h3>Hasta -8.00 → cualquier marca estándar</h3>
      <p>Todas las marcas líderes cubren rangos hasta -8.00 con sus productos regulares:</p>
      <ul>
        <li><strong>Biofinity</strong> — RD$3,650 (mensual)</li>
        <li><strong>ACUVUE Oasys</strong> — RD$3,350 (mensual)</li>
        <li><strong>Bausch+Lomb Ultra</strong> — RD$3,750 (mensual)</li>
        <li><strong>1-DAY ACUVUE Moist</strong> — RD$3,350 (diario)</li>
      </ul>

      <h3>De -8.00 a -12.00 → versiones XR (Extended Range)</h3>
      <p>Cuando pasas de -8.00, necesitas versiones especiales:</p>
      <ul>
        <li><strong>Biofinity XR</strong> — cubre hasta -15.00 esférico. RD$5,200-5,800. Pedido especial, disponibilidad en 2-3 semanas.</li>
        <li><strong>ACUVUE Oasys 1-Day</strong> en rangos altos — cubre hasta -12.00.</li>
        <li><strong>Air Optix HydraGlyde</strong> — hasta -10.00 estándar.</li>
      </ul>

      <h3>Más de -12.00 → opciones limitadas</h3>
      <p>A partir de -12.00 las opciones se reducen significativamente:</p>
      <ul>
        <li><strong>Biofinity XR</strong> es la principal opción (hasta -15.00, con salto de 0.50 desde -10.00).</li>
        <li><strong>Lentes rígidos permeables (RGP)</strong> — no los vendemos en ContactGo pero un óptico especializado puede recomendarlos para casos extremos.</li>
      </ul>

      <h2>Ventajas de lentes de contacto vs gafas en miopía alta</h2>
      <ul>
        <li><strong>Sin distorsión periférica.</strong> Con gafas de alta graduación, la periferia distorsiona (efecto barril). Los lentes eliminan eso.</li>
        <li><strong>Sin cristales gruesos ni monturas pesadas.</strong> Comodidad extraordinaria.</li>
        <li><strong>Ojos se ven de tamaño normal.</strong> Las gafas de miopía alta minimizan visualmente los ojos.</li>
        <li><strong>Campo visual completo.</strong> No hay marco que limite tu visión.</li>
        <li><strong>Compatible con gafas de sol normales.</strong> No necesitas graduar gafas de sol adicionales.</li>
        <li><strong>Deportes, natación (con protección), fotografía.</strong> Actividades donde las gafas estorban.</li>
      </ul>

      <h2>Precauciones específicas para miopía alta</h2>
      <p>La miopía alta se asocia con córneas más elongadas y mayor riesgo de complicaciones oculares. Recomendaciones especiales:</p>
      <ul>
        <li><strong>Revisión anual con oftalmólogo</strong> (no solo optómetra). Miopía magna requiere seguimiento de retina periférica.</li>
        <li><strong>Prioriza materiales de alta transmisibilidad de oxígeno</strong> (Dk/t alto). Biofinity, ACUVUE Oasys y Air Optix HydraGlyde son los mejores en esto.</li>
        <li><strong>No excedas el tiempo de uso.</strong> Máximo 8-10 horas al día. Alterna con gafas.</li>
        <li><strong>Nunca duermas con lentes que no sean específicamente aprobados para uso nocturno.</strong> Aumenta riesgo de hipoxia corneal.</li>
        <li><strong>Consulta inmediatamente</strong> ante cualquier síntoma: ojo rojo, dolor, visión borrosa, sensibilidad excesiva a la luz.</li>
      </ul>

      <h2>Costo real de usar lentes de contacto con miopía alta</h2>
      <p>Comparativa anual (uso diario con lentes mensuales Biofinity XR):</p>
      <ul>
        <li>6 cajas de 6 lentes/año (2 lentes/mes) × RD$5,500 = <strong>RD$66,000 anuales</strong></li>
        <li>+ solución multipropósito 12 frascos × RD$1,000 = RD$12,000</li>
        <li><strong>Total: RD$78,000 al año</strong></li>
      </ul>
      <p>Comparado con: unas gafas premium de alta graduación con cristales de índice 1.74 + antireflejante Zeiss cuestan RD$18,000-35,000 pero duran 2-3 años. El costo por año es similar (~RD$10-15k anuales en gafas), pero los lentes de contacto ofrecen una experiencia visual y estética muy superior.</p>

      <h2>Cómo pedir tus lentes XR en ContactGo</h2>
      <p>Como los lentes XR no son stock regular, seguimos este proceso:</p>
      <ol>
        <li>Nos contactas por <strong>WhatsApp (809) 694-2268</strong> con tu graduación exacta de gafas.</li>
        <li>Confirmamos disponibilidad en el distribuidor autorizado (CooperVision RD).</li>
        <li>Te confirmamos tiempo estimado (usualmente 2-3 semanas).</li>
        <li>Envías el pago con el 50% de adelanto (política estándar para pedidos especiales).</li>
        <li>Recibes tus lentes con envío gratuito a domicilio.</li>
      </ol>

      <p>Si aún no tienes claro qué graduación de lentes te corresponde a partir de tu receta de gafas, prueba nuestra <Link href="/receta">calculadora gratuita</Link>.</p>
    </BlogArticle>
  )
}
