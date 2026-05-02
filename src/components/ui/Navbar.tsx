'use client'
import Link from 'next/link'
import { ShoppingCart, User, Menu, X, Eye } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const itemCount = useCartStore(s => s.itemCount())

  const links = [
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/catalogo?tipo=esferico', label: 'Esféricos' },
    { href: '/catalogo?tipo=torico', label: 'Tóricos' },
    { href: '/catalogo?tipo=color', label: 'Color' },
    { href: '/catalogo?tipo=solucion', label: 'Soluciones' },
    { href: '/receta', label: 'Mi Receta' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-primary-700">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          ContactGo
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
          <Link href="/cuenta"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
            <User className="w-4 h-4" />
            Mi cuenta
          </Link>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl hover:bg-gray-100">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700">
              {l.label}
            </Link>
          ))}
          <Link href="/cuenta" onClick={() => setOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 flex items-center gap-2">
            <User className="w-4 h-4" /> Mi cuenta
          </Link>
        </div>
      )}
    </header>
  )
}
