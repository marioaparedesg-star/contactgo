import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cómo leer tu receta óptica para lentes de contacto — Guía visual RD',
  description: 'Aprende a leer tu receta óptica en República Dominicana. Qué significa SPH, CYL, AXIS, ADD y BC. Guía paso a paso para entender tu graduación y comprar los lentes correctos.',
  alternates: { canonical: 'https://contactgo.net/blog/como-leer-receta-optica-rd' },
  openGraph: {
    title: 'Cómo leer tu receta óptica — Guía para comprar lentes de contacto en RD',
    description: 'Guía visual para entender tu receta óptica: SPH, CYL, AXIS, ADD y BC explicados en español.',
    url: 'https://contactgo.net/blog/como-leer-receta-optica-rd',
    locale: 'es_DO', siteName: 'ContactGo', type: 'article',
  },
}

const terminos = [
  { sigla: 'SPH', nombre: 'Esfera (Sphere)', desc: 'Tu graduación principal. Negativo (-) = miopía (no ves de lejos). Positivo (+) = hipermetropía (no ves de cerca). Ejemplo: -3.25 o +1.50' },
  { sigla: 'CYL', nombre: 'Cilindro (Cylinder)', desc: 'Indica astigmatismo. Si tienes este valor, necesitas lentes tóricos. Ejemplo: -0.75 o -1.25' },
  { sigla: 'AXIS', nombre: 'Eje (Axis)', desc: 'El ángulo del astigmatismo, en grados de 1 a 180. Solo aplica si tienes CYL. Ejemplo: 90° o 180°' },
  { sigla: 'ADD', nombre: 'Adición (Addition)', desc: 'Para presbicia (vista cansada). Si tienes este valor, necesitas lentes multifocales. Ejemplo: +1.75 o +2.00' },
  { sigla: 'BC', nombre: 'Curva Base (Base Curve)', desc: 'La curvatura del lente. Típicamente 8.4 o 8.6. Generalmente ya viene incluido en el lente que seleccionas.' },
  { sigla: 'DIA', nombre: 'Diámetro (Diameter)', desc: 'El tamaño del lente en mm. Suele ser 14.0–14.5mm para lentes blandos. No necesitas seleccionarlo.' },
  { sigla: 'OD', nombre: 'Ojo Derecho (Oculus Dexter)', desc: 'La prescripción de tu ojo derecho. En inglés también puede aparecer como "R" o "Right".' },
  { sigla: 'OS', nombre: 'Ojo Izquierdo (Oculus Sinister)', desc: 'La prescripción de tu ojo izquierdo. También puede aparecer como "L" o "Left".' },
]

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 pb-32">
      <div className="mb-6">
        <Link href="/blog" className="text-xs text-primary-600 font-semibold hover:underline">← Blog</Link>
      </div>
      <h1 className="font-display text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">
        Cómo leer tu receta óptica para lentes de contacto en RD
      </h1>
      <p className="text-gray-500 text-sm mb-8">Guía visual · 5 min de lectura</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p>¿Tienes tu receta óptica en la mano pero no entiendes los números y siglas? No te preocupes — es más sencillo de lo que parece. En esta guía explicamos cada término para que puedas comprar tus lentes de contacto con confianza.</p>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900 text-lg mb-1">Ejemplo de receta típica</h2>
          <p className="text-xs text-gray-500 mb-4">Así luce una receta real de lentes de contacto:</p>
          <div className="bg-white rounded-xl border border-blue-100 p-4 font-mono text-sm">
            <div className="grid grid-cols-6 gap-2 text-center">
              <div className="font-bold text-gray-500 text-xs">Ojo</div>
              <div className="font-bold text-gray-500 text-xs">SPH</div>
              <div className="font-bold text-gray-500 text-xs">CYL</div>
              <div className="font-bold text-gray-500 text-xs">AXIS</div>
              <div className="font-bold text-gray-500 text-xs">ADD</div>
              <div className="font-bold text-gray-500 text-xs">BC</div>
              <div className="font-bold text-blue-700">OD</div>
              <div>-3.25</div><div>-0.75</div><div>90°</div><div>—</div><div>8.6</div>
              <div className="font-bold text-teal-700">OS</div>
              <div>-2.50</div><div>—</div><div>—</div><div>—</div><div>8.6</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Glosario completo de tu receta</h2>
          <div className="space-y-3">
            {terminos.map(t => (
              <div key={t.sigla} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-12 h-12 bg-primary-50 text-primary-700 rounded-xl flex items-center justify-center font-black text-sm">{t.sigla}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.nombre}</p>
                    <p className="text-sm text-gray-600 mt-1">{t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3">¿Qué lentes necesitas según tu receta?</h2>
          <div className="space-y-2">
            {[
              { condicion: 'Solo tienes SPH (sin CYL)', tipo: 'Lentes esféricos', href: '/esfericos', color: 'bg-blue-50 border-blue-100' },
              { condicion: 'Tienes SPH y CYL (con astigmatismo)', tipo: 'Lentes tóricos', href: '/toricos', color: 'bg-orange-50 border-orange-100' },
              { condicion: 'Tienes ADD (presbicia/vista cansada)', tipo: 'Lentes multifocales', href: '/multifocales', color: 'bg-purple-50 border-purple-100' },
              { condicion: 'Solo quieres cambiar el color de tus ojos', tipo: 'Lentes de color', href: '/color', color: 'bg-pink-50 border-pink-100' },
            ].map(c => (
              <Link key={c.condicion} href={c.href} className={`flex items-center justify-between p-4 rounded-2xl border ${c.color} hover:shadow-sm transition-shadow`}>
                <div>
                  <p className="text-xs text-gray-500">{c.condicion}</p>
                  <p className="font-bold text-gray-900 text-sm">{c.tipo}</p>
                </div>
                <span className="text-primary-600 font-bold text-sm">Ver →</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">¿No estás seguro? Usa nuestra calculadora</h2>
          <p className="text-sm text-gray-700 mb-4">Ingresa los datos de tu receta y te decimos exactamente qué lentes necesitas. Gratis y sin registro.</p>
          <Link href="/receta" className="bg-primary-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm inline-block">
            Usar calculadora de receta →
          </Link>
        </div>
      </div>
    </main>
  )
}
