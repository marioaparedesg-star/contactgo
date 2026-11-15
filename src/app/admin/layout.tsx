'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AdminNav from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (pathname === '/M1Alexander/login' || pathname === '/admin/login') {
      setChecking(false)
      setAuthorized(false)
      return
    }
    let cancelled = false
    const sb = createClient()
    const timeout = setTimeout(() => { if (!cancelled) router.replace('/M1Alexander/login') }, 10000)
    const verify = async () => {
      try {
        const { data: { user }, error: authError } = await sb.auth.getUser()
        if (authError || !user) { router.replace('/M1Alexander/login'); return }
        const { data: profile, error } = await sb.from('profiles')
          .select('id, role, activo').eq('id', user.id).single()
        const primaryAdminId = process.env.NEXT_PUBLIC_CONTACTGO_PRIMARY_ADMIN_ID ?? '0ae25176-4cb9-45da-bd19-5b1b5806c4ef'
        if (error || !profile || profile.role !== 'admin' || profile.activo !== true || profile.id !== primaryAdminId) {
          await sb.auth.signOut()
          router.replace('/M1Alexander/login')
          return
        }
        if (!cancelled) setAuthorized(true)
      } catch (error) {
        console.error('[admin/layout] Error verificando acceso:', error)
        router.replace('/M1Alexander/login')
      } finally {
        clearTimeout(timeout)
        if (!cancelled) setChecking(false)
      }
    }
    setChecking(true)
    setAuthorized(false)
    verify()
    return () => { cancelled = true; clearTimeout(timeout) }
  }, [pathname, router])

  if (pathname === '/M1Alexander/login' || pathname === '/admin/login') return <>{children}</>
  if (checking) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!authorized) return null
  return <div className="flex min-h-screen bg-gray-50"><AdminNav /><main className="flex-1 overflow-auto pb-24 p-4 pt-20 md:pt-6 md:p-6">{children}</main></div>
}
