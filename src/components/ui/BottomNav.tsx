'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, ShoppingCart, User, Grid3X3, Search } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

export default function BottomNav() {
  const pathname  = usePathname()
  const itemCount = useCartStore(s => s.itemCount())

  if (pathname.startsWith('/admin')) return null

  const tabs = [
    { href: '/',        icon: Home,         label: 'Inicio'   },
    { href: '/catalogo',icon: Grid3X3,      label: 'Catálogo' },
    { href: '/receta',  icon: Search,       label: 'Receta'   },
    { href: '/cart',    icon: ShoppingCart, label: 'Carrito', badge: itemCount },
    { href: '/cuenta',  icon: User,         label: 'Cuenta'   },
  ]

  return (
    <nav aria-label="Navegación" className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-40 safe-area-bottom shadow-lg shadow-black/5">
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          return (
            <Link key={tab.href} href={tab.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 relative group"
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}>
              {/* Indicador activo */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary-600 rounded-full" />
              )}
              {/* Ícono con fondo activo */}
              <div className={`relative flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200 ${
                active ? 'bg-primary-50' : 'group-hover:bg-gray-50'
              }`}>
                <Icon className={`w-5 h-5 transition-colors ${
                  active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} strokeWidth={active ? 2.5 : 1.5} />
                {/* Badge del carrito */}
                {tab.badge ? (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 leading-none">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                ) : null}
              </div>
              {/* Label */}
              <span className={`text-[10px] font-semibold transition-colors leading-none ${
                active ? 'text-primary-600' : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
