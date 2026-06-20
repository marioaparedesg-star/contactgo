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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500 font-medium">Cargando tu cuenta...</p>
      </div>
    </div>
  ),
})

export default function CuentaPage() {
  return <CuentaContent />
}
