'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false)
      return
    }
    const sb = createClient()

    // FIX (2026-08-19): Mario reportó que el admin a veces se queda "pensando"
    // sin entrar nunca. Causa real: esta verificación de sesión usaba
    // .then() SIN .catch() — si sb.auth.getUser() o la consulta de
    // profiles fallaban por cualquier motivo (hipo de red, token vencido,
    // lo que sea), la promesa rechazada quedaba sin manejar, setChecking(false)
    // nunca se ejecutaba, y la pantalla se quedaba con el círculo girando
    // para siempre — sin error visible, sin redirección, sin nada.
    //
    // También se agrega un timeout de respaldo: si la verificación tarda
    // más de 10 segundos por cualquier razón, se manda a login en vez de
    // dejar a la persona esperando indefinidamente.
    let resuelto = false
    const timeoutRespaldo = setTimeout(() => {
      if (!resuelto) {
        console.error('[admin/layout] Verificación de sesión tardó demasiado — mandando a login')
        router.replace('/admin/login')
      }
    }, 10000)

    sb.auth.getUser()
      .then(async ({ data: { user }, error: userError }) => {
        if (userError || !user) {
          router.replace('/admin/login')
          return
        }
        const { data: profile, error: profileError } = await sb
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profileError || !profile || profile.role !== 'admin') {
          router.replace('/admin/login')
          return
        }
        setAuthorized(true)
        setChecking(false)
      })
      .catch((err) => {
        console.error('[admin/layout] Error verificando sesión:', err)
        router.replace('/admin/login')
      })
      .finally(() => {
        resuelto = true
        clearTimeout(timeoutRespaldo)
      })

    return () => clearTimeout(timeoutRespaldo)
  }, [pathname, router])

  if (pathname === '/admin/login') return <>{children}</>

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!authorized) return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
