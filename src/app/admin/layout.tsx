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
    sb.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace('/admin/login')
        return
      }
      // Verificar rol admin
      const { data: profile } = await sb
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (!profile || profile.role !== 'admin') {
        router.replace('/admin/login')
        return
      }
      setAuthorized(true)
      setChecking(false)
    })
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
