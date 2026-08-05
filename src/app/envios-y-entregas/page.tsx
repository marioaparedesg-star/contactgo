export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import AzulLogo from '@/components/ui/AzulLogo'
import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

// canonical agregado
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.contactgo.net/envios-y-entregas' },
  title: 'Envíos y Entregas | ContactGo — Lentes de Contacto RD',
  description: 'Información sobre envíos y entregas de lentes de contacto en República Dominicana. Esféricos en 24-48 horas, multifocales en 2-6 días, tóricos en 25-40 días — a todo el país.',
}

export default function EnviosPage() {
  return (
    <>
      <Navbar />
      <main className="pb-20">
        <section className="bg-gradient-to-br from-primary-700 to-teal-600 text-white py-14 px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Envíos y Entregas</h1>
          <p className="text-primary-100 max-w-xl mx-auto">Entregamos tus lentes de contacto en toda la República Dominicana de forma rápida y segura.</p>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-14 space-y-10">

          {/* Tiempos */}
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">⏱️ Tiempos de entrega por tipo de lente</h2>
            <p className="text-gray-500 text-sm mb-4">Aplican a toda la República Dominicana — el tiempo depende del tipo de lente, no de tu zona.</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="font-bold text-green-800 text-lg mb-1">🚀 24 a 48 horas</p>
                <p className="text-green-700 text-sm font-semibold mb-2">Lentes esféricos</p>
                <p className="text-gray-600 text-sm">Miopía o hipermetropía simple. Alta disponibilidad, procesamiento y despacho inmediato.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="font-bold text-amber-800 text-lg mb-1">📦 2 a 6 días</p>
                <p className="text-amber-700 text-sm font-semibold mb-2">Lentes multifocales</p>
                <p className="text-gray-600 text-sm">Presbicia / vista cansada. Se piden al distribuidor según tu graduación exacta.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="font-bold text-amber-800 text-lg mb-1">⏱️ 25 a 40 días</p>
                <p className="text-amber-700 text-sm font-semibold mb-2">Lentes tóricos</p>
                <p className="text-gray-600 text-sm">Astigmatismo. Fabricados a medida (cilindro + eje exactos) — por eso el plazo es mayor.</p>
              </div>
            </div>
          </div>

          {/* Zonas */}
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">📍 Costo de envío por zona</h2>
            <p className="text-gray-500 text-sm mb-4">El tiempo de entrega no varía por zona (ver tiempos por tipo de lente arriba) — esto es solo el costo del envío.</p>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {[
                { zona: 'Santo Domingo y Gran Santo Domingo', costo: 'RD$200' },
                { zona: 'Santiago de los Caballeros', costo: 'RD$350' },
                { zona: 'La Romana / San Pedro de Macorís', costo: 'RD$350' },
                { zona: 'Punta Cana / Bávaro', costo: 'RD$350' },
                { zona: 'Puerto Plata', costo: 'RD$350' },
                { zona: 'Otras provincias', costo: 'RD$350' },
              ].map((z, i) => (
                <div key={i} className={`flex items-center justify-between px-5 py-4 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <p className="font-semibold text-gray-900 text-sm">{z.zona}</p>
                  <p className="font-bold text-primary-600 text-sm">{z.costo}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">* Los costos son estimados y pueden variar según disponibilidad del courier.</p>
          </div>

          {/* Proceso */}
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">📦 ¿Cómo funciona?</h2>
            <div className="space-y-3">
              {[
                { paso: '1', titulo: 'Haces tu pedido', desc: 'Seleccionas tus lentes, tu graduación y completas el checkout.' },
                { paso: '2', titulo: 'Confirmamos', desc: 'Verificamos tu pedido y te enviamos confirmación por WhatsApp o email.' },
                { paso: '3', titulo: 'Preparamos', desc: 'Empacamos tus lentes con cuidado para garantizar que lleguen en perfectas condiciones.' },
                { paso: '4', titulo: 'Despachamos', desc: 'Entregamos al courier y te enviamos el tracking de tu pedido.' },
                { paso: '5', titulo: 'Recibes', desc: 'Tu pedido llega a la dirección indicada en el tiempo estimado.' },
              ].map((s, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">{s.paso}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{s.titulo}</p>
                    <p className="text-gray-500 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Métodos de pago */}
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Métodos de pago</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
                <div className="flex justify-center mb-2">
                  <AzulLogo size="xl" />
                </div>
                <p className="font-bold text-gray-900 text-sm mb-1">Tarjeta con AZUL</p>
                <p className="text-gray-500 text-xs">Pago con tarjeta de crédito/débito Visa y Mastercard vía AZUL — Banco Popular.</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
                <ShieldCheck className="w-10 h-10 text-primary-600 mx-auto mb-2" strokeWidth={1.8} />
                <p className="font-bold text-gray-900 text-sm mb-1">Pago 100% seguro</p>
                <p className="text-gray-500 text-xs">Tecnología 3D Secure. ContactGo no almacena datos de tu tarjeta.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
            <p className="font-bold text-gray-900 mb-2">¿Tienes alguna pregunta?</p>
            <p className="text-gray-500 text-sm mb-4">Nuestro equipo está disponible por WhatsApp para ayudarte.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors">
                WhatsApp
              </a>
              <Link href="/catalogo" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
                Ver catálogo
              </Link>
            </div>
          </div>

        </section>
      </main>
      <Footer />
    </>
  )
}
