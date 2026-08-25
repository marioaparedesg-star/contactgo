export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-esclerales-que-son-cuando-necesitas-rd',
  title: 'Lentes Esclerales: Qué Son y Cuándo los Necesitas — RD 2026',
  h1: 'Lentes esclerales: qué son, para quién son y cuándo los recomienda un especialista',
  description: 'Los lentes esclerales son lentes rígidos grandes para casos especiales: queratocono, ojo seco severo, córneas irregulares. Te explicamos cómo funcionan y cuándo se usan en RD.',
  publishedAt: '2026-08-19',
  readMinutes: 7,
  category: 'Guías',
  faq: [
    { q: '¿Los lentes esclerales duelen al ponerlos?',
      a: 'No deberían doler — son más grandes que un lente de contacto convencional (cubren toda la córnea y parte de la esclerótica, la parte blanca del ojo), por lo que muchas personas los sienten incluso más cómodos que los lentes blandos normales una vez colocados, porque no tocan la córnea directamente.' },
    { q: '¿Cualquier persona puede usar lentes esclerales?',
      a: 'No — están indicados principalmente para casos específicos: queratocono, córneas irregulares tras cirugía, ojo seco severo, o astigmatismo muy alto que no se corrige bien con lentes convencionales. No son la primera opción para miopía o astigmatismo simple.' },
    { q: '¿Se pueden comprar lentes esclerales online?',
      a: 'No — requieren evaluación presencial y ajuste personalizado por un especialista, ya que se fabrican a la medida exacta de la forma de tu ojo. No es un producto estándar de catálogo como los lentes blandos convencionales.' },
  ],
  relatedSlugs: [
    'queratocono-lentes-contacto-opciones-rd',
    'lentes-contacto-rgp-rigidos-permeables-gas-rd',
    'lentes-contacto-ojos-secos-republica-dominicana',
    'tipos-de-lentes-de-contacto',
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
  keywords: 'lentes esclerales republica dominicana, lentes esclerales que son, queratocono lentes rd, ojo seco severo lentes contacto',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si un óptico u oftalmólogo te mencionó "lentes esclerales" y no sabes bien qué son, no estás solo — son mucho menos conocidos que los lentes de contacto convencionales, pero para ciertas condiciones oculares son la mejor solución que existe.</p>

      <h2>¿Qué son los lentes esclerales?</h2>

      <p>Son lentes de contacto <strong>rígidos y de diámetro grande</strong> — mucho más grandes que un lente de contacto blando convencional. En vez de apoyarse directamente sobre la córnea (como hacen los lentes normales), los lentes esclerales <strong>"saltan" por encima de toda la córnea</strong> y se apoyan en la esclerótica (la parte blanca del ojo), creando un espacio lleno de lágrima artificial entre el lente y la córnea.</p>

      <p>Ese diseño es justamente lo que los hace tan útiles para ciertos casos difíciles.</p>

      <h2>¿Para qué condiciones se usan?</h2>

      <h3>Queratocono</h3>
      <p>Una condición donde la córnea se adelgaza y toma una forma cónica irregular. Los lentes convencionales no se ajustan bien a esa forma irregular; los esclerales, al no tocar la córnea directamente, sí logran una visión nítida y estable.</p>

      <h3>Ojo seco severo</h3>
      <p>El espacio lleno de líquido entre el lente y la córnea actúa como un reservorio constante de humedad — mucho más efectivo que gotas para casos de sequedad ocular severa que no responden a tratamientos convencionales.</p>

      <h3>Córneas irregulares tras cirugía o trauma</h3>
      <p>Después de un trasplante de córnea, cirugía refractiva complicada, o una lesión ocular, la superficie del ojo puede quedar irregular. Los esclerales "esconden" esa irregularidad creando una superficie óptica nueva y uniforme.</p>

      <h3>Astigmatismo muy alto o irregular</h3>
      <p>Cuando el astigmatismo es tan pronunciado que los lentes tóricos convencionales no logran estabilizarse bien en el ojo.</p>

      <h2>¿Cómo es el proceso de adaptación?</h2>

      <ol>
        <li><strong>Evaluación detallada:</strong> topografía corneal y medición exacta de la forma del ojo — mucho más profunda que una consulta de graduación estándar.</li>
        <li><strong>Prueba de lentes:</strong> se prueban varios diseños para encontrar el ajuste correcto.</li>
        <li><strong>Fabricación a medida:</strong> el lente final se fabrica según las medidas específicas de tu ojo — no existen tallas estándar.</li>
        <li><strong>Entrenamiento de colocación:</strong> requieren una técnica de inserción distinta (se llenan de solución salina antes de ponerlos), así que el especialista te entrena en esto.</li>
      </ol>

      <h2>¿Duele usarlos?</h2>

      <p>Contrario a lo que parece por su tamaño, la mayoría de usuarios los describe como <strong>más cómodos</strong> que lentes convencionales una vez adaptados — precisamente porque no tocan la córnea (que es la parte más sensible del ojo), sino la esclerótica, mucho menos sensible.</p>

      <h2>¿Se consiguen en República Dominicana?</h2>

      <p>Sí, pero a través de <strong>especialistas certificados en contactología especial</strong> — no son un producto que se compre por catálogo o en una farmacia, porque cada lente se fabrica a medida tras una evaluación presencial detallada. Si tu oftalmólogo te refirió para esta opción, es porque tu caso específico lo justifica.</p>

      <p>En ContactGo somos especialistas en lentes de contacto convencionales — diarios, quincenales, mensuales, tóricos y multifocales de las marcas más reconocidas del mundo. No vendemos lentes esclerales por ser un producto médico altamente personalizado, pero si tienes dudas sobre si tu caso podría beneficiarse de lentes convencionales antes de dar ese paso, con gusto te orientamos.</p>

      <p>¿Tu situación es más sencilla — miopía, astigmatismo simple o presbicia? Revisa nuestra <Link href="/blog/tipos-de-lentes-de-contacto">guía completa de tipos de lentes de contacto</Link> o escríbenos por WhatsApp al <strong>(809) 694-2268</strong> para orientarte según tu receta.</p>
    </BlogArticle>
  )
}
