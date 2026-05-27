export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import AdminNav from '@/components/admin/AdminNav'

// Server Component — auth verificado ANTES de renderizar
// La página de login está excluida del matcher de middleware,
// por lo que este layout NUNCA recibe requests de /admin/login
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()

  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}, // Server Component: no setea cookies en este contexto
      },
    }
  )

  const { data: { user } } = await sb.auth.getUser()

  // Sin sesión → redirect al login (server-side, no flash de contenido)
  if (!user) {
    redirect('/admin/login')
  }

  // Verificar rol admin en profiles
  const { data: profile } = await sb
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
