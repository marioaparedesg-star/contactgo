'use client'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingCart, User, Grid3X3 } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

export default function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore(s => s.itemCount())

  const tabs = [
    { href: '/', icon: Home, label: 'Inicio' },
    { href: '/catalogo', icon: Grid3X3, label: 'Catalogo' },
    { href: '/receta', icon: Search, label: 'Receta' },
    { href: '/cart', icon: ShoppingCart, label: 'Carrito', badge: itemCount },
    { href: '/cuenta', icon: User, label: 'Cuenta' },
  ]

  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex items-center justify-around h-16">
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          return (
            <a key={tab.href} href={tab.href}
              className={"flex flex-col items-center gap-0.5 px-3 py-2 relative " + (active ? "text-primary-600" : "text-gray-400")}>
              <div className="relative">
                <Icon className="w-6 h-6" />
                {tab.badge ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {tab.badge > 9 ? "9+" : tab.badge}
                  </span>
                ) : null}
              </div>
              <span className={"text-xs font-medium " + (active ? "text-primary-600" : "text-gray-400")}>{tab.label}</span>
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-600 rounded-full" />}
            </a>
          )
        })}
      </div>
    </nav>
  )
}