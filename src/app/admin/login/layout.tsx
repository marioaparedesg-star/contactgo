// Este layout override el AdminLayout para /admin/login
// Permite acceso sin autenticación
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
