export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'presbicia-despues-40-lentes-contacto-multifocales-vs-gafas',
  title: 'Presbicia después de los 40: Lentes de Contacto Multifocales vs Gafas',
  h1: 'Presbicia después de los 40: lentes de contacto multifocales o gafas de lectura',
  description: 'Ya no puedes leer el celular sin estirar el brazo. Guía completa de opciones para presbicia: lentes multifocales, mono-vision, o gafas de lectura. Comparativa honesta para RD 2026.',
  publishedAt: '2026-07-30',
  readMinutes: 8,
  category: 'Salud',
  faq: [
    { q: '¿Puedo usar lentes de contacto multifocales si ya uso lentes para miopía?',
      a: 'Sí — es exactamente para lo que están diseñados. Los multifocales combinan tu graduación de lejos (miopía o hipermetropía) con la potencia adicional para cerca (ADD). Cambias tus lentes esféricos actuales por multifocales y ya. La adaptación toma 1-3 semanas hasta que el cerebro aprende a usar ambas zonas de forma automática.' },
    { q: '¿Los lentes multifocales dan visión perfecta a todas las distancias?',
      a: 'Casi. Ofrecen buena visión en cerca, media y lejos, pero puede haber ligera reducción de nitidez comparado con gafas específicas para una distancia. Para leer letras muy pequeñas (medicamentos, etiquetas), algunos usuarios aún necesitan gafas de lectura ocasionales. Pero para 95% de actividades diarias son excelentes.' },
    { q: '¿Es mejor mono-vision (un ojo cerca, otro lejos) o multifocales?',
      a: 'Multifocales para la mayoría. Mono-vision funciona pero sacrifica visión 3D y estereoscópica — mala idea si manejas de noche o haces deportes. Los multifocales modernos (Biofinity Multifocal, Air Optix Multifocal) son claramente superiores en calidad visual global.' },
    { q: '¿Cuánto cuestan los lentes multifocales en RD?',
      a: 'Biofinity Multifocal cuesta RD$8,900 la caja de 6 (3 meses de uso). Bausch+Lomb Ultra for Presbyopia cuesta RD$5,400. Air Optix Multifocal cuesta RD$7,800. Son más caros que esféricos regulares por la complejidad óptica pero al año siguen siendo más económicos que gafas progresivas premium.' },
  ],
  relatedSlugs: [
    'lentes-multifocales-presbicia-rd',
    'lentes-multifocales-precio-republica-dominicana',
    'bausch-lomb-ultra-presbyopia-adaptacion-guia',
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
  keywords: 'presbicia 40 años, lentes contacto multifocales RD, vista cansada lentes contacto, presbicia gafas lectura vs lentes',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Pasaste los 40 años y de pronto no puedes leer tu celular a la distancia normal. Te encuentras estirando el brazo, buscando mejor luz, entrecerrando los ojos. Bienvenido al club de la <strong>presbicia</strong> — le pasa al 100% de las personas eventualmente, generalmente entre los 42 y 48 años.</p>

      <p>La pregunta no es si te va a pasar, sino qué haces cuando pasa. Las 3 opciones principales: <strong>gafas de lectura, lentes de contacto multifocales, o mono-vision</strong>. Aquí la comparativa honesta.</p>

      <h2>¿Qué es la presbicia exactamente?</h2>
      <p>Con la edad, el cristalino del ojo (la "lente natural") pierde flexibilidad. Ya no puede cambiar de forma tan fácilmente para enfocar objetos cercanos. Resultado: la visión de lejos se mantiene bien, pero la de cerca se vuelve borrosa.</p>

      <p>Los síntomas típicos:</p>
      <ul>
        <li>Necesitas alejar el celular, libros o menú del restaurante</li>
        <li>Te cuesta leer en luz tenue</li>
        <li>Dolor de cabeza al leer o coser</li>
        <li>Vista cansada al final del día</li>
      </ul>

      <p>La presbicia se mide como una potencia adicional llamada <strong>ADD</strong>, que va desde +0.75 (leve, típico a los 42-45 años) hasta +2.50 o más (avanzada, típico a partir de los 55-60).</p>

      <h2>Opción 1: Gafas de lectura</h2>

      <h3>Ventajas:</h3>
      <ul>
        <li>Baratas (RD$500-3,000 en cualquier farmacia o BC Optical)</li>
        <li>Compras varias y dejas una en cada lugar (auto, oficina, mesa de noche)</li>
        <li>Solo te las pones cuando necesitas leer</li>
      </ul>

      <h3>Desventajas:</h3>
      <ul>
        <li>Tienes que estar poniendo y quitando constantemente</li>
        <li>Si eres miope también, necesitas dos pares o gafas bifocales (que se ven "viejas")</li>
        <li>Se te olvidan, se te pierden</li>
        <li>Poco prácticas para trabajos que cambian entre cerca y lejos frecuentemente (chef, doctor, mecánico)</li>
      </ul>

      <h2>Opción 2: Gafas progresivas</h2>

      <h3>Ventajas:</h3>
      <ul>
        <li>Una sola gafa para todo</li>
        <li>Correcciones para cerca, media y lejos en un solo cristal</li>
        <li>Se ven como gafas normales</li>
      </ul>

      <h3>Desventajas:</h3>
      <ul>
        <li>Caras: RD$18,000-45,000 en RD por unas de calidad</li>
        <li>Requieren adaptación de 2-4 semanas al inicio</li>
        <li>Zonas laterales distorsionadas</li>
        <li>Difíciles al bajar escaleras o hacer deportes</li>
      </ul>

      <h2>Opción 3: Lentes de contacto multifocales (la mejor para muchos)</h2>

      <h3>Ventajas:</h3>
      <ul>
        <li>Sin gafas encima. Vision completa en todas las distancias.</li>
        <li>Ideal para trabajo (cambias entre pantalla, papeles y clientes sin quitarte nada).</li>
        <li>Perfectos para actividades sociales, deportes, viajes.</li>
        <li>Compatibles con gafas de sol normales encima.</li>
        <li>Estéticamente invisibles.</li>
      </ul>

      <h3>Desventajas:</h3>
      <ul>
        <li>Adaptación de 1-3 semanas al inicio (el cerebro debe aprender a usar las zonas).</li>
        <li>Ligera reducción de nitidez comparado con gafas específicas.</li>
        <li>Costo mayor que lentes regulares.</li>
        <li>No sirven para todos — funcionan mejor con presbicia leve a moderada (ADD hasta +2.50).</li>
      </ul>

      <h2>Opción 4: Mono-vision (menos recomendado)</h2>
      <p>Consiste en usar un lente de contacto para lejos en tu ojo dominante, y otro para cerca en tu ojo no dominante. El cerebro elige la información según lo que estés viendo.</p>

      <h3>Ventajas:</h3>
      <ul>
        <li>Más barato (usa lentes esféricos normales de dos graduaciones)</li>
        <li>Adaptación relativamente rápida</li>
      </ul>

      <h3>Desventajas:</h3>
      <ul>
        <li>Pierdes visión 3D / estereoscópica (mala idea si manejas de noche o haces deportes)</li>
        <li>Dolor de cabeza en algunos usuarios</li>
        <li>No funciona para todos (25% de usuarios no logran adaptarse)</li>
      </ul>

      <h2>Comparación anual de costos</h2>
      <ul>
        <li><strong>Gafas de lectura simples:</strong> RD$1,500/año (compras 2-3 pares baratos)</li>
        <li><strong>Gafas progresivas premium:</strong> RD$25,000 dividido en 2 años = RD$12,500/año</li>
        <li><strong>Lentes de contacto multifocales Biofinity:</strong> RD$36,000/año (4 cajas × RD$8,900) + solución RD$12,000 = <strong>RD$48,000/año</strong></li>
        <li><strong>Lentes multifocales Bausch+Lomb Ultra:</strong> RD$21,600/año (4 cajas × RD$5,400) + solución = <strong>RD$33,600/año</strong></li>
      </ul>

      <h2>Nuestra recomendación según tu perfil</h2>

      <h3>Si tu trabajo es 90% en pantalla + escritorio</h3>
      <p>Gafas progresivas de trabajo (llamadas también "computer glasses") o multifocales de contacto. Ambas opciones son válidas.</p>

      <h3>Si trabajas con clientes cara a cara, das clases o eres profesional de la salud</h3>
      <p><strong>Multifocales de contacto</strong> son claramente superiores. Nada de "quitarme las gafas para ver al cliente y ponérmelas para leer papeles".</p>

      <h3>Si eres muy activo (deportes, viajes, socializar)</h3>
      <p><strong>Multifocales de contacto</strong>, sin duda. Comodidad y estética.</p>

      <h3>Si tienes presbicia severa (ADD +2.50 o más)</h3>
      <p>Gafas progresivas dan mejor calidad óptica en presbicia avanzada. Los multifocales tienen limitaciones a esas graduaciones.</p>

      <h3>Si es tu primera vez con presbicia y quieres empezar barato</h3>
      <p>Empieza con gafas de lectura baratas mientras exploras si vas a usar contactos. Después de 6 meses ya sabes qué necesitas realmente.</p>

      <h2>¿Puedo combinar ambas opciones?</h2>
      <p>Sí, y muchos usuarios lo hacen:</p>
      <ul>
        <li>Multifocales de contacto durante el día (trabajo, socializar, deportes)</li>
        <li>Gafas progresivas para tareas de precisión (leer letras pequeñas, coser, trabajo detallado)</li>
        <li>Gafas de sol graduadas para actividades al aire libre</li>
      </ul>

      <h2>Marcas disponibles en RD (2026)</h2>
      <p>Los mejores lentes multifocales para presbicia disponibles con distribución oficial:</p>
      <ul>
        <li><strong>Biofinity Multifocal</strong> (CooperVision) — el más recomendado. RD$8,900</li>
        <li><strong>Air Optix Multifocal</strong> (Alcon) — excelente para ojo seco. RD$7,800</li>
        <li><strong>Bausch+Lomb Ultra for Presbyopia</strong> — el más económico. RD$5,400</li>
        <li><strong>Proclear Multifocal</strong> (CooperVision) — para ojos muy secos. RD$6,800</li>
      </ul>

      <h2>Cómo empezar</h2>
      <ol>
        <li>Visita un óptico y actualiza tu receta óptica. Necesitas ADD medido correctamente.</li>
        <li>Pide un lente de prueba (muchos ópticos los tienen gratis para adaptación).</li>
        <li>Úsalo 1 semana para ver adaptación.</li>
        <li>Si te va bien, pide tu caja completa. En ContactGo entregamos en 24-48h en toda RD.</li>
      </ol>

      <p>Si ya tienes tu receta con ADD y quieres saber qué multifocal te queda mejor, escríbenos por <strong>WhatsApp (809) 694-2268</strong> o mira nuestro <Link href="/multifocales">catálogo de lentes multifocales</Link>. Somos especialistas en presbicia y podemos guiarte.</p>
    </BlogArticle>
  )
}
