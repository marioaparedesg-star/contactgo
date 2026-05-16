import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

const POSTS = [
  {
    slug: 'lentes-contacto-ninos-adolescentes-rd',
    titulo: 'Lentes de contacto para adolescentes en RD — ¿A qué edad?',
    descripcion: 'Guía para padres: edad recomendada, los mejores tipos de lentes para jóvenes y las reglas de oro para el uso seguro.',
    imagen: '👶',
    tiempo: '7 min',
    categoria: 'Guías',
  },
  {
    slug: 'cuanto-cuestan-lentes-contacto-rd',
    titulo: '¿Cuánto cuestan los lentes de contacto en RD en 2026?',
    descripcion: 'Compara precios entre ópticas físicas y online. Descubre por qué comprar online puede ahorrarte hasta RD$2,780 al mes.',
    imagen: '💰',
    tiempo: '6 min',
    categoria: 'Precios',
  },
  {
    slug: 'como-leer-receta-optica-rd',
    titulo: 'Cómo leer tu receta óptica — Guía visual completa',
    descripcion: 'SPH, CYL, AXIS, ADD... ¿qué significa todo eso? Explicamos cada término de tu receta en español simple.',
    imagen: '📋',
    tiempo: '5 min',
    categoria: 'Guías',
  },
  {
    slug: 'primeros-pasos-lentes-contacto-rd',
    titulo: 'Primeros pasos con lentes de contacto en República Dominicana',
    descripcion: 'Todo lo que necesitas saber antes de comprar tu primer par de lentes de contacto en RD. Receta, tipos y qué esperar.',
    imagen: '🌟',
    tiempo: '7 min',
    categoria: 'Principiantes',
  },
  {
    slug: 'como-leer-tu-receta',
    titulo: 'Cómo leer tu receta de lentes de contacto',
    descripcion: 'Aprende a interpretar los valores SPH, CYL, EJE y ADD de tu receta óptica para comprar los lentes correctos.',
    imagen: '👁️',
    tiempo: '3 min',
    categoria: 'Guías',
  },
  {
    slug: 'como-poner-lentes-de-contacto',
    titulo: 'Cómo poner y quitar lentes de contacto por primera vez',
    descripcion: 'Guía paso a paso para principiantes. Todo lo que necesitas saber para usar lentes de contacto de forma segura.',
    imagen: '🤲',
    tiempo: '4 min',
    categoria: 'Tutoriales',
  },
  {
    slug: 'tipos-de-lentes-de-contacto',
    titulo: 'Tipos de lentes de contacto: ¿cuál es el correcto para ti?',
    descripcion: 'Diferencias entre lentes esféricos, tóricos, multifocales y de color. Cómo elegir según tu diagnóstico.',
    imagen: '🔍',
    tiempo: '5 min',
    categoria: 'Educación',
  },
  {
    slug: 'lentes-de-contacto-para-astigmatismo-rd',
    titulo: 'Lentes de contacto para astigmatismo en República Dominicana',
    descripcion: 'Guía completa de lentes tóricos en RD. Marcas, precios, tiempos de entrega y cómo elegir el correcto.',
    imagen: '🎯',
    tiempo: '6 min',
    categoria: 'Astigmatismo',
  },
  {
    slug: 'lentes-multifocales-presbicia-rd',
    titulo: 'Lentes multifocales para presbicia: la guía definitiva',
    descripcion: 'Todo sobre lentes de contacto multifocales en RD. Marcas disponibles, adaptación y precios actualizados.',
    imagen: '🔭',
    tiempo: '6 min',
    categoria: 'Presbicia',
  },
  {
    slug: 'biofinity-vs-acuvue-comparacion',
    titulo: 'Biofinity vs ACUVUE: ¿Cuál es mejor en República Dominicana?',
    descripcion: 'Comparación completa entre Biofinity de CooperVision y ACUVUE Oasys de J&J. Precio, comodidad e hidratación.',
    imagen: '⚖️',
    tiempo: '7 min',
    categoria: 'Comparaciones',
  },
  {
    slug: 'ojos-secos-lentes-contacto',
    titulo: 'Ojos secos y lentes de contacto: soluciones reales',
    descripcion: '¿Sientes sequedad con tus lentes? Descubre los mejores lentes y gotas para ojos secos disponibles en RD.',
    imagen: '💧',
    tiempo: '5 min',
    categoria: 'Salud ocular',
  },
  {
    slug: 'lentes-contacto-colores-rd',
    titulo: 'Lentes de contacto de colores en República Dominicana',
    descripcion: 'FreshLook, Air Optix Colors, con y sin graduación. Los colores más populares según tu tono de piel.',
    imagen: '🎨',
    tiempo: '4 min',
    categoria: 'Estética',
  },
  {
    slug: 'cuanto-duran-lentes-contacto',
    titulo: '¿Cuánto duran los lentes de contacto? Guía completa',
    descripcion: 'Diarios, quincenales y mensuales: cuándo cambiarlos, cómo sacarles el máximo y cuándo desecharlos antes.',
    imagen: '📅',
    tiempo: '5 min',
    categoria: 'Guías',
  },
  {
    slug: 'solucion-limpieza-lentes-contacto',
    titulo: 'Cómo elegir la mejor solución para tus lentes de contacto',
    descripcion: 'Opti-Free, ReNu, Prolub — cuál usar según tu tipo de lente y cómo limpiarlos correctamente en RD.',
    imagen: '🧴',
    tiempo: '4 min',
    categoria: 'Cuidado',
  },
]

export const metadata = {
  title: 'Blog — ContactGo | Guías de lentes de contacto en RD',
  description: 'Guías, tutoriales y consejos sobre lentes de contacto en República Dominicana.',
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 pb-24">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Blog ContactGo</h1>
          <p className="text-gray-500">Guías y consejos sobre lentes de contacto en República Dominicana</p>
        </div>
        <div className="space-y-4">
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block bg-white border border-gray-100 rounded-2xl p-5 hover:border-primary-200 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {post.imagen}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{post.categoria}</span>
                    <span className="text-xs text-gray-400">{post.tiempo} lectura</span>
                  </div>
                  <h2 className="font-bold text-gray-900 mb-1">{post.titulo}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{post.descripcion}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
