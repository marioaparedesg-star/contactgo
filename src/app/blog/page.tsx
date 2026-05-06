import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

const POSTS = [
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
