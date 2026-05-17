import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Equipo ContactGo — Especialistas en Salud Visual',
  description: 'Nuestro equipo editorial es revisado por optómetras certificados con experiencia en lentes de contacto en República Dominicana.',
  alternates: { canonical: 'https://contactgo.net/autor/equipo-contactgo' },
}

export default function AutorPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-6">
          <Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-2xl">CG</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Equipo ContactGo</h1>
            <p className="text-gray-500 text-sm mt-1">Especialistas en salud visual · República Dominicana</p>
          </div>
        </div>

        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>El contenido editorial de ContactGo es elaborado por nuestro equipo de especialistas en salud visual, con revisión de optómetras certificados con experiencia en el mercado dominicano de lentes de contacto.</p>

          <p>Nuestros artículos siguen las guías de la <strong>American Academy of Optometry (AAO)</strong>, la <strong>American Optometric Association (AOA)</strong> y las regulaciones de la <strong>Dirección General de Medicamentos, Alimentos y Productos Sanitarios de la República Dominicana (DIGEMAPS)</strong>.</p>

          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mt-6">
            <h2 className="font-bold text-primary-900 mb-3">Proceso editorial</h2>
            <ol className="space-y-2 text-sm text-primary-800 list-decimal list-inside">
              <li>Investigación basada en evidencia científica actualizada</li>
              <li>Redacción por especialista en salud visual</li>
              <li>Revisión por optómetra certificado</li>
              <li>Actualización periódica cada 12 meses o cuando cambian las guías clínicas</li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-4 text-sm text-amber-900">
            <strong>⚠️ Aviso importante:</strong> Todo el contenido de ContactGo es informativo y no sustituye la consulta con un profesional óptico u oftalmólogo. Los lentes de contacto son productos sanitarios que requieren prescripción vigente de un profesional certificado.
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-8">
          <h2 className="font-bold text-gray-900 mb-4">Artículos del equipo</h2>
          <div className="grid gap-3">
            {[
              ['Cómo leer tu receta óptica', '/blog/como-leer-receta-optica-rd'],
              ['Lentes esféricos vs tóricos: ¿cuál necesito?', '/blog/tipos-de-lentes-de-contacto'],
              ['Lentes de contacto para astigmatismo en RD', '/blog/lentes-de-contacto-para-astigmatismo-rd'],
              ['Biofinity vs ACUVUE: comparación completa', '/blog/biofinity-vs-acuvue-comparacion'],
            ].map(([title, href]) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-sm font-semibold text-gray-900">{title}</span>
                <span className="ml-auto text-primary-600 text-sm">→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
