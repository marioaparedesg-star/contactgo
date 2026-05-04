'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, Users, BarChart3, Eye, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/pedidos',    icon: ShoppingBag,     label: 'Pedidos' },
  { href: '/admin/productos',  icon: Package,         label: 'Productos' },
  { href: '/admin/clientes',   icon: Users,           label: 'Clientes' },
  { href: '/admin/inventario', icon: BarChart3,       label: 'Inventario' },
]

export default function AdminNav() {
  const path = usePathname()
  const router = useRouter()

  const logout = async () => {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <>
      {/* Sidebar — solo desktop */}
      <aside className="hidden md:flex w-60 bg-gray-900 min-h-screen flex-col shrink-0">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">ContactGo</p>
              <p className="text-gray-400 text-xs">Panel admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = path === href || (href !== '/admin' && path.startsWith(href))
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 w-full transition-all">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Top bar — solo móvil */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <p className="text-white font-bold text-sm">ContactGo Admin</p>
        </div>
        <button onClick={logout} className="text-gray-400 hover:text-white">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom nav — solo móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 flex">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== '/admin' && path.startsWith(href))
          return (
            <Link key={href} href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-all
                ${active ? 'text-primary-400' : 'text-gray-500 hover:text-gray-300'}`}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
