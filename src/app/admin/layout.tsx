'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // /admin/login es pública — no verificar
    if (pathname === '/admin/login') {
      setChecking(false)
      return
    }

    // Verificar sesión para todas las demás rutas /admin/*
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/admin/login')
      } else {
        setChecking(false)
      }
    })
  }, [pathname, router])

  // En /admin/login mostrar directamente sin check
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Mostrar loading mientras verifica auth
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
