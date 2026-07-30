export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-de-contacto-y-maquillaje-guia-completa',
  title: 'Lentes de Contacto y Maquillaje: Guía Práctica 2026',
  h1: 'Lentes de contacto y maquillaje: guía práctica para usarlos sin problemas',
  description: 'Cómo aplicar maquillaje correctamente con lentes de contacto. Orden de aplicación, productos que sí puedes usar, cuáles evitar, y trucos para no arruinar tu look ni irritar tus ojos.',
  publishedAt: '2026-07-30',
  readMinutes: 7,
  category: 'Consejos',
  faq: [
    { q: '¿Me pongo los lentes de contacto antes o después del maquillaje?',
      a: 'Siempre ANTES. Ponte los lentes primero, luego maquilla. Al final del día, quítate los lentes primero, luego desmaquíllate. Esto evita que restos de maquillaje toquen la superficie del lente o queden atrapados debajo.' },
    { q: '¿Puedo usar rímel/máscara con lentes de contacto?',
      a: 'Sí, pero elige rímel resistente al agua (waterproof) o específicamente formulado para ojos sensibles. Evita el rímel de fibras que pueden desprenderse y entrar al ojo. Nunca compartas rímel — es uno de los productos que más bacterias acumula.' },
    { q: '¿Qué maquillaje evitar con lentes de contacto?',
      a: 'Evita: (1) sombras con brillos gruesos o glitter que se caigan, (2) delineadores en la línea de agua (contacto directo con el ojo), (3) rímeles de fibras, (4) productos vencidos (mayor a 3 meses de abiertos), (5) aceites desmaquillantes justo antes de ponerte los lentes.' },
    { q: '¿Puedo dormir maquillada con lentes de contacto?',
      a: 'No a ambas cosas por separado y menos combinadas. Los lentes de contacto (excepto los específicamente aprobados para uso nocturno) NO deben usarse durmiendo — aumenta 20 veces el riesgo de infecciones. Y dormir con maquillaje causa irritación adicional. Retira ambos siempre antes de acostarte.' },
  ],
  relatedSlugs: [
    'ojo-rojo-lentes-contacto-que-hacer',
    'ojos-secos-lentes-contacto',
    'como-poner-lentes-de-contacto',
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
  keywords: 'lentes contacto y maquillaje, como maquillarse con lentes contacto, rimel lentes contacto, sombras lentes contacto',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si usas lentes de contacto y te maquillas, seguro te ha pasado: se te va una pizca de sombra al ojo, sientes el rímel raspando, o al final del día tienes una molestia inexplicable. La combinación maquillaje + lentes de contacto <strong>funciona perfectamente</strong> cuando conoces las reglas básicas — y ni te limita el estilo ni te irrita los ojos.</p>

      <p>Aquí la guía completa que hemos armado escuchando a nuestras clientas en República Dominicana durante los últimos años.</p>

      <h2>La regla de oro: orden de aplicación</h2>

      <p>Esta es la más importante y la más ignorada:</p>

      <p><strong>En la mañana:</strong></p>
      <ol>
        <li>Lávate y sécate bien las manos</li>
        <li>Ponte los lentes de contacto <em>primero</em></li>
        <li>Después aplica todo tu maquillaje (base, corrector, sombras, delineador, rímel)</li>
      </ol>

      <p><strong>En la noche:</strong></p>
      <ol>
        <li>Lávate las manos</li>
        <li>Quítate los lentes de contacto <em>primero</em></li>
        <li>Después desmaquíllate con tu producto de siempre</li>
      </ol>

      <p>¿Por qué? Si te maquillas antes de ponerte el lente, restos de base, polvo o partículas de sombra pueden pegarse a tus dedos y luego al lente. Si te desmaquillas antes de quitarte el lente, aceites y limpiadores pueden pasar al lente y quedar atrapados debajo, causando irritación al día siguiente.</p>

      <h2>Productos que puedes usar sin problema</h2>

      <h3>Base y correctores</h3>
      <p>Cualquier base o corrector regular funciona bien. Solo evita aplicarlos con brochas gruesas cerca del ojo — usa esponjas o los dedos con cuidado en la zona del párpado inferior.</p>

      <h3>Sombras</h3>
      <p>Sombras mate o satinadas son 100% seguras. Aplica con cuidado y da golpecitos suaves con una brocha limpia antes de abrir los ojos para eliminar exceso. Evita sombras con glitter grueso que puede caer al ojo.</p>

      <h3>Delineador</h3>
      <p><strong>Sí puedes usar:</strong> delineador líquido, en gel o lápiz, aplicado sobre la línea de las pestañas (por encima).</p>
      <p><strong>NO uses:</strong> delineador en la línea de agua (waterline) — esa zona interior del párpado tiene glándulas de Meibomio que son clave para la lubricación ocular. Bloquearlas empeora el ojo seco con lentes de contacto.</p>

      <h3>Rímel / máscara de pestañas</h3>
      <p><strong>Recomendado:</strong> rímel resistente al agua (waterproof) o específicamente formulado para usuarias de lentes de contacto. Marcas como Clinique, Almay, Neutrogena tienen líneas "gentle" para ojos sensibles.</p>
      <p><strong>Evita:</strong> rímeles de fibras — esas fibrecitas pueden desprenderse durante el día y meterse detrás del lente. Muy incómodo.</p>
      <p><strong>Reemplaza cada 3 meses:</strong> el rímel acumula bacterias rapidísimo. Un rímel de más de 3 meses es un caldo de cultivo.</p>

      <h2>Productos a evitar totalmente</h2>
      <ul>
        <li><strong>Glitter suelto o pigmentos sueltos</strong> — 90% seguro que algo cae al ojo</li>
        <li><strong>Sombras baratas de calidad dudosa</strong> — se caen constantemente</li>
        <li><strong>Aerosoles fijadores muy cerca del ojo</strong> — irritan lentes y párpado</li>
        <li><strong>Pestañas postizas con adhesivos "económicos"</strong> — el pegamento cerca del ojo es problemático</li>
        <li><strong>Cualquier producto vencido</strong> — bacterias, pérdida de textura</li>
      </ul>

      <h2>El caso especial de las pestañas postizas / extensiones</h2>
      <p>Las pestañas postizas de un solo uso están OK si se aplican con pegamento hipoalergénico y se retiran antes de dormir. Las <strong>extensiones semi-permanentes</strong> requieren más precauciones:</p>
      <ul>
        <li>Verifica que la técnica no use vapores del pegamento cerca del ojo abierto (deberías estar con ojos cerrados)</li>
        <li>No mojar el área durante 24-48h después de la aplicación</li>
        <li>Reemplaza tu solución de lentes por una nueva después del procedimiento</li>
        <li>Si sientes irritación, retira los lentes inmediatamente</li>
      </ul>

      <h2>Desmaquillado nocturno correcto</h2>
      <p>Después de quitarte los lentes:</p>
      <ol>
        <li>Usa un desmaquillante suave sin aceite en la zona de los ojos (los aceites pueden pasar a los lentes si te vuelves a colocar sin lavarte bien)</li>
        <li>Preferiblemente producto bifásico (agua + aceite) o micelar</li>
        <li>Nunca frotes fuerte los párpados — pon el algodón sobre el ojo cerrado, presiona 10 segundos, retira suavemente</li>
        <li>Enjuaga bien y aplica tu crema/serum nocturno</li>
      </ol>

      <h2>Si algo entra al ojo con el lente puesto</h2>
      <p>Puede pasar: una pestaña, sombra, polvo. Los pasos:</p>
      <ol>
        <li><strong>No frotes.</strong> Frotar puede raspar la córnea con el lente.</li>
        <li>Parpadea varias veces suavemente</li>
        <li>Aplica gotas humectantes (Systane, Refresh, Blink)</li>
        <li>Si persiste la molestia, retira el lente, límpialo con solución multipropósito, y vuelve a ponerlo</li>
        <li>Si el ojo se pone rojo o duele: quítate el lente por el resto del día y consulta si empeora</li>
      </ol>

      <h2>Kit de emergencia para maquillarse con lentes</h2>
      <p>Ten siempre a mano:</p>
      <ul>
        <li>Gotas humectantes tipo <Link href="/gotas">Refresh Tears o Systane</Link></li>
        <li>Un espejo cerca de tu área de maquillaje (para ver bien)</li>
        <li>Toalla limpia y microfibra para las manos</li>
        <li>Un frasco pequeño de solución multipropósito y estuche para lentes por si tienes que quitarte uno</li>
      </ul>

      <p>Si sufres frecuentemente de ojos secos o irritación con lentes + maquillaje, considera pasar a lentes diarios como <strong>1-DAY ACUVUE Moist</strong>. La higiene diaria elimina buena parte del problema porque cada mañana empiezas con un lente completamente limpio.</p>

      <p>¿Quieres ver los lentes más recomendados para usuarias de maquillaje frecuente? <Link href="/catalogo?tipo=esferico">Explora nuestro catálogo</Link> — te asesoramos por WhatsApp para elegir el ideal para ti.</p>
    </BlogArticle>
  )
}
