import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Leer la ruta actual desde el header x-pathname que Next.js expone
  const headersList = headers()
  const referer = headersList.get('referer') ?? ''
  const invokedPath = headersList.get('x-invoke-path') ?? 
                      headersList.get('x-pathname') ??
                      headersList.get('x-url') ?? ''
  
  // Detectar si estamos en /admin/login a través de la cookie de sesión
  // En /admin/login NO hay sesión (es el punto de entrada de login)
  // Todos los demás /admin/* requieren sesión válida
  
  // Verificar la sesión
  const sb = createServerSupabaseClient()
  const { data: { user }, error } = await sb.auth.getUser()
  
  // Si no hay usuario, redirigir a login
  // PERO: /admin/login se renderiza SIN el layout de admin gracias al
  // archivo src/app/admin/login/layout.tsx que hace override
  if (!user) {
    redirect('/admin/login')
  }
  
  // Verificar rol admin
  const { data: profile } = await sb
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (!profile || !['admin','operaciones','ventas','soporte'].includes(profile.role ?? '')) {
    redirect('/')
  }
  
  return <>{children}</>
}
