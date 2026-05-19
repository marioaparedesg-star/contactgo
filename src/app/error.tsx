// app/error.tsx — Página de error global
'use client'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[ContactGo Error]', error)
  }, [error])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-primary-600 mb-4">500</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Algo salió mal
        </h1>
        <p className="text-gray-600 mb-8">
          Tuvimos un problema inesperado. Por favor intenta de nuevo o contáctanos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Volver al inicio
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-6">
          ¿Persiste el error? Escríbenos a{' '}
          <a href="mailto:info@contactgo.net" className="text-primary-600 hover:underline">
            info@contactgo.net
          </a>
        </p>
      </div>
    </main>
  )
}
