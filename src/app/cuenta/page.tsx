// /cuenta — Página de cuenta del cliente
// SSR deshabilitado: es una página de autenticación, no necesita pre-render
// Esto elimina cualquier crash por hydration mismatch o APIs de browser en server
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi cuenta — ContactGo',
  description: 'Gestiona tus pedidos, recetas, direcciones y más.',
  robots: { index: false, follow: false },
}

// dynamic + ssr: false → el componente NUNCA corre en el servidor
// Elimina 100% de hydration mismatches, localStorage crashes, y WebAuthn errors en SSR
const CuentaContent = dynamic(() => import('./CuentaContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar skeleton */}
      <div className="h-14 bg-white border-b border-gray-100" />
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="w-40 h-5 bg-gray-200 rounded-xl animate-pulse" />
            <div className="w-28 h-3 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 space-y-2 border border-gray-100">
              <div className="w-8 h-8 bg-gray-200 rounded-xl animate-pulse" />
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-10 h-3 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
        {/* Content */}
        <div className="bg-white rounded-2xl p-5 space-y-3 border border-gray-100">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-3 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
})

export default function CuentaPage() {
  return <CuentaContent />
}
