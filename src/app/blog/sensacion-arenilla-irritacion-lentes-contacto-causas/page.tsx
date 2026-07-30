export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'sensacion-arenilla-irritacion-lentes-contacto-causas',
  title: 'Sensación de Arenilla o Irritación con Lentes de Contacto: Causas y Solución',
  h1: 'Sensación de arenilla o irritación con lentes de contacto: causas y qué hacer',
  description: 'Sientes como si tuvieras arena o polvo en el ojo con los lentes puestos. Las 8 causas más comunes en RD y cómo resolver cada una. Guía práctica de un usuario a otro.',
  publishedAt: '2026-07-30',
  readMinutes: 6,
  category: 'Salud',
  faq: [
    { q: '¿Por qué siento como que tengo arena en el ojo con los lentes de contacto?',
      a: 'Las 3 causas más frecuentes son: (1) ojo seco por poca lubricación —el 60% de casos, (2) el lente puesto al revés, o (3) una impureza pequeña atrapada. Empieza descartando estas: aplica gotas humectantes, verifica orientación del lente, si persiste retíralo y enjuágalo con solución.' },
    { q: '¿Es normal sentir el lente de contacto durante las primeras semanas?',
      a: 'Sí. Los primeros 3-7 días de uso puedes sentir el lente como una pestaña incómoda. Es normal mientras el ojo se adapta. Después de 2 semanas ya no deberías sentirlo. Si a las 3 semanas sigues muy consciente del lente, puede ser que necesites otra marca o rango.' },
    { q: '¿Qué gotas humectantes son compatibles con lentes de contacto?',
      a: 'Busca gotas específicamente etiquetadas como "compatible con lentes de contacto" o "para lentes blandos". Las mejores disponibles en RD: Systane Ultra, Refresh Contacts, Blink Contacts. Evita gotas que dicen "para ojos rojos" con vasoconstrictor — esas no son compatibles con lentes.' },
    { q: '¿Cuándo la sensación de arenilla es señal de algo grave?',
      a: 'Consulta inmediatamente si la sensación se acompaña de: dolor real (no molestia), ojo muy rojo, sensibilidad extrema a la luz, secreción amarilla o verde, o visión borrosa persistente al quitarse el lente. Puede ser infección, úlcera corneal o queratitis — condiciones que requieren atención médica urgente.' },
  ],
  relatedSlugs: [
    'ojo-rojo-lentes-contacto-que-hacer',
    'ojos-secos-lentes-contacto',
    'lentes-contacto-alergia-conjuntivitis',
    'gotas-para-ojos-secos-republica-dominicana',
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
  keywords: 'sensacion arenilla lentes contacto, molestia lentes contacto, irritacion lentes contacto, siento algo en el ojo con lentes',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Es una de las molestias más comunes que reportan usuarios de lentes de contacto: <strong>la sensación de tener arena o polvo en el ojo</strong>, aunque revises y no haya nada visible. Puede aparecer al ponerte los lentes, durante el día, o al final de la tarde.</p>

      <p>La buena noticia: en el 90% de los casos tiene solución simple. Aquí las 8 causas más frecuentes y qué hacer con cada una.</p>

      <h2>Causa 1: Ojo seco por falta de lubricación (la más común)</h2>
      <p>Aproximadamente el 60% de las molestias con lentes de contacto vienen de aquí. El aire acondicionado, las pantallas, el clima seco o el envejecimiento reducen tu producción natural de lágrimas.</p>
      <p><strong>Solución:</strong></p>
      <ul>
        <li>Aplica gotas humectantes compatibles con lentes: <strong>Systane Ultra, Refresh Contacts, Blink Contacts</strong> — 1 gota por ojo cada 3-4 horas.</li>
        <li>Aléjate del aire acondicionado directo si puedes.</li>
        <li>Toma más agua (2-3 litros al día).</li>
        <li>Considera cambiar a lentes de material más humectante como <Link href="/producto/dailies-total-1">DAILIES Total1</Link> o <Link href="/producto/bausch-lomb-ultra">Bausch+Lomb Ultra</Link>.</li>
      </ul>

      <h2>Causa 2: El lente está al revés</h2>
      <p>Suena tonto pero pasa mucho, especialmente a principiantes. Un lente al revés no calza bien sobre la córnea y se mueve más, causando fricción constante.</p>
      <p><strong>Cómo verificar:</strong> pon el lente en la yema de tu dedo. Debe verse como una tacita perfecta con los bordes hacia arriba. Si los bordes están volteados hacia afuera (como plato de sopa), está al revés.</p>
      <p><strong>Solución:</strong> retíralo, ponlo derecho, vuélvelo a colocar.</p>

      <h2>Causa 3: Impureza atrapada bajo el lente</h2>
      <p>Puede ser una pestaña, mota de polvo, o microscópica partícula que se quedó adherida al lente al ponértelo.</p>
      <p><strong>Solución:</strong></p>
      <ol>
        <li>No frotes el ojo (podrías raspar la córnea).</li>
        <li>Aplica gotas humectantes y parpadea varias veces suavemente.</li>
        <li>Si persiste, retira el lente, enjuágalo bien con solución multipropósito, y vuelve a ponerlo.</li>
      </ol>

      <h2>Causa 4: El lente lleva más días de los que debería</h2>
      <p>Los lentes mensuales duran <strong>máximo 30 días de uso diario</strong>. Los quincenales, 14 días. Después empiezan a acumular depósitos de proteínas y lípidos que causan molestia constante.</p>
      <p><strong>Solución:</strong> marca la fecha en que abres cada caja. Si no te acuerdas, apps como "Timer lentes" pueden ayudar. Nunca extiendas la vida útil "para ahorrar" — el ojo te va a cobrar la factura.</p>

      <h2>Causa 5: La solución multipropósito está causando reacción</h2>
      <p>Algunas personas desarrollan sensibilidad a los conservantes de ciertas soluciones. Los síntomas: molestia constante que empeora después de días de uso.</p>
      <p><strong>Solución:</strong></p>
      <ul>
        <li>Cambia a una solución diferente. Si usabas Opti-Free, prueba Renu MultiPlus o Biotrue.</li>
        <li>Considera soluciones sin conservantes (más caras pero mejor para ojos sensibles).</li>
        <li>En casos extremos, cambia a lentes diarios y elimina la solución de la ecuación.</li>
      </ul>

      <h2>Causa 6: Marca o material no compatible con tu ojo</h2>
      <p>No todas las marcas funcionan para todos. La forma de tu ojo (curvatura), tu producción de lágrimas y tu estilo de vida hacen que unas marcas se sientan bien y otras no.</p>
      <p><strong>Solución:</strong> si llevas más de 3 semanas con molestia constante usando una marca, probablemente no es la ideal para ti. Cambia. Consulta con un óptico o escríbenos por WhatsApp — te sugerimos alternativas según tu caso.</p>

      <h2>Causa 7: Alergia (temporal o crónica)</h2>
      <p>Especialmente frecuente en RD durante la estación seca (diciembre a marzo). El polvo suspendido en el aire, el polen, y los ácaros disparan reacciones alérgicas oculares. Los lentes atrapan alergenos en su superficie y empeoran los síntomas.</p>
      <p><strong>Solución:</strong></p>
      <ul>
        <li>Enjuaga los lentes con solución nueva antes de ponerlos cada mañana.</li>
        <li>Considera cambiar a lentes diarios durante temporada de alergia.</li>
        <li>Usa gotas antialérgicas compatibles con lentes.</li>
        <li>Si es severo, consulta con oftalmólogo — puede prescribirte antihistamínicos.</li>
      </ul>

      <h2>Causa 8: El agua tocó tus lentes</h2>
      <p>El agua del grifo, la piscina o el mar contiene microorganismos que se adhieren a los lentes y causan irritación (y en casos graves, queratitis por Acanthamoeba — una infección peligrosa).</p>
      <p><strong>Solución:</strong> descarta el lente inmediatamente y usa uno nuevo. Nunca "enjuagues" un lente con agua para reutilizarlo. Si tuviste contacto con agua, cambia el lente por completo.</p>

      <h2>Cuándo consultar con un profesional (urgente)</h2>
      <p>La sensación de arenilla es normal en la mayoría de casos. Pero es señal de alarma si va acompañada de:</p>
      <ul>
        <li>❌ Dolor real (no molestia)</li>
        <li>❌ Ojo muy rojo que no se calma en 24 horas</li>
        <li>❌ Sensibilidad extrema a la luz</li>
        <li>❌ Visión borrosa que persiste al quitarse el lente</li>
        <li>❌ Secreción amarilla o verde</li>
        <li>❌ Sensación de "algo picándome" muy fuerte</li>
      </ul>
      <p>En estos casos: retira el lente inmediatamente, no vuelvas a usarlo, y consulta con un oftalmólogo. Puede ser una úlcera corneal o infección que requiere tratamiento urgente.</p>

      <h2>Prevención: rutina para minimizar molestias</h2>
      <ul>
        <li>Lávate y seca bien las manos antes de tocar los lentes.</li>
        <li>Frota suavemente cada lente con solución 20 segundos antes de guardarlo (aunque tu solución diga "no rub").</li>
        <li>Cambia la solución del estuche cada vez (nunca "rellenes").</li>
        <li>Cambia tu estuche cada 3 meses.</li>
        <li>Ten siempre gotas humectantes contigo.</li>
        <li>No excedas 10 horas de uso diario los primeros meses.</li>
      </ul>

      <p>Si buscas gotas humectantes compatibles con lentes de contacto, revisa nuestra <Link href="/gotas">selección de gotas oftálmicas</Link>. Si sospechas que tu marca actual no es la ideal para ti, escríbenos por WhatsApp <strong>(809) 694-2268</strong> y te asesoramos con opciones específicas para tu caso.</p>
    </BlogArticle>
  )
}
