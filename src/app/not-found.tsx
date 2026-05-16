import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página no encontrada — ContactGo',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 pb-32">
      <div className="text-center max-w-sm">
        <p className="text-6xl mb-4">👁️</p>
        <h1 className="font-display text-2xl font-black text-gray-900 mb-2">
          Página no encontrada
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/catalogo" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold text-sm">
            Ver catálogo de lentes
          </Link>
          <Link href="/" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm">
            Ir al inicio
          </Link>
          <a href="https://wa.me/18294728328?text=Hola, necesito ayuda" target="_blank" rel="noopener noreferrer"
            className="text-sm text-primary-600 font-semibold">
            💬 ¿Necesitas ayuda? WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
