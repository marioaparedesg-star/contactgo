'use client'
import { useState } from 'react'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', tipo: 'Consulta sobre lentes', mensaje: '' })
  const [estado, setEstado] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  const tipos = [
    'Consulta sobre lentes',
    'Ayuda con mi pedido',
    'Información de precios',
    'Problema con mi cuenta',
    'Quiero saber mi graduación',
    'Otro',
  ]

  async function handleSubmit() {
    if (!form.nombre || !form.mensaje) return
    setEstado('loading')
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setEstado('ok')
      else setEstado('error')
    } catch {
      setEstado('error')
    }
  }

  return (
    <><Navbar />
    <main className="max-w-xl mx-auto px-4 py-12 pb-24">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <a href="/" className="hover:text-primary-600">Inicio</a>
        <span>/</span>
        <span className="text-gray-600">Contacto</span>
      </div>

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Contáctanos</h1>
      <p className="text-gray-500 mb-8">Especialistas en lentes de contacto — te respondemos lo antes posible.</p>

      {/* Canales rápidos */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <a href="tel:+18294728328" className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:border-primary-200 hover:bg-primary-50/20 transition-all">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Llamar</p>
            <p className="text-sm font-bold text-gray-900">829-472-8328</p>
          </div>
        </a>
        <a href="mailto:info@contactgo.net" className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:border-primary-200 hover:bg-primary-50/20 transition-all">
          <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-bold text-gray-900">info@contactgo.net</p>
          </div>
        </a>
      </div>

      {/* Formulario */}
      {estado === 'ok' ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 className="font-bold text-gray-900 text-xl mb-2">¡Mensaje recibido!</h2>
          <p className="text-gray-600 text-sm mb-6">Te responderemos lo antes posible. Si dejaste tu email, también te enviamos una confirmación.</p>
          <a href="/catalogo" className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo de lentes →</a>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900">Envíanos un mensaje</h2>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              placeholder="Tu nombre completo"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
            />
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="tu@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={form.telefono}
                onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                placeholder="809-000-0000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          {/* Tipo de consulta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">¿En qué podemos ayudarte?</label>
            <select
              value={form.tipo}
              onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
            >
              {tipos.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
            <textarea
              value={form.mensaje}
              onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
              placeholder="Cuéntanos en qué podemos ayudarte..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
            />
          </div>

          {estado === 'error' && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">Hubo un error al enviar. Intenta de nuevo o escríbenos al email.</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={estado === 'loading' || !form.nombre || !form.mensaje}
            className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {estado === 'loading' ? 'Enviando...' : 'Enviar mensaje →'}
          </button>

          <p className="text-xs text-gray-400 text-center">Te respondemos en menos de 24 horas en días hábiles</p>
        </div>
      )}

      {/* CTA catálogo */}
      <div className="mt-8 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
        <p className="font-bold text-gray-900 mb-1">¿Buscas lentes de contacto?</p>
        <p className="text-sm text-gray-500 mb-4">Entrega 24-48h en toda República Dominicana · Pago seguro con AZUL</p>
        <a href="/catalogo" className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo completo →</a>
      </div>

    </main>
    <Footer /></>
  )
}
