'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'

// Páginas que aún tienen AdminNav propio (no lo duplicamos)
const PAGES_WITH_OWN_NAV = [
  '/admin/configuracion',
  '/admin/productos',
  '/admin/suscripciones',
  '/admin/cupones',
  '/admin/abandonados',
  '/admin/pedidos',
  '/admin/clientes',
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (pathname === '/admin/login') { setChecking(false); return }
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace('/admin/login')
      else setChecking(false)
    })
  }, [pathname, router])

  if (pathname === '/admin/login') return <>{children}</>

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Si la página ya tiene su propio nav, no lo duplicamos
  const hasOwnNav = PAGES_WITH_OWN_NAV.some(p => pathname.startsWith(p))

  if (hasOwnNav) return <>{children}</>

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
