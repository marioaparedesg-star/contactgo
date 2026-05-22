// Este layout override el AdminLayout para /admin/login
// Permite acceso sin autenticación
import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
