'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, Users, BarChart2, Repeat, LogOut, ShoppingCart } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin',               icon: LayoutDashboard, label: 'Dashboard'      },
  { href: '/admin/pedidos',       icon: ShoppingBag,     label: 'Pedidos'        },
  { href: '/admin/suscripciones', icon: Repeat,          label: 'Suscripciones'  },
  { href: '/admin/productos',     icon: Package,         label: 'Productos'      },
  { href: '/admin/clientes',      icon: Users,           label: 'Clientes'       },
  { href: '/admin/inventario',    icon: BarChart2,       label: 'Inventario'     },
  { href: '/admin/abandonados',   icon: ShoppingCart,    label: 'Abandonados'    },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const sb       = createClient()

  const logout = async () => {
    await sb.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-gray-900 text-white fixed left-0 top-0 z-40">
        <div className="px-6 py-5 border-b border-gray-700">
          <p className="font-black text-primary-400 text-lg tracking-tight">ContactGo</p>
          <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 py-4 border-t border-gray-700">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all w-full">
            <LogOut className="w-4 h-4 shrink-0" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Spacer desktop */}
      <div className="hidden md:block w-56 shrink-0" />

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-700 flex justify-around px-2 py-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                active ? 'text-primary-400' : 'text-gray-500'
              }`}>
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium leading-none">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
