'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const itemCount = useCartStore(s => s.itemCount())

  const links = [
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/esfericos', label: 'Esféricos' },
    { href: '/toricos', label: 'Tóricos' },
    { href: '/multifocales', label: 'Multifocales' },
    { href: '/catalogo?tipo=color', label: 'Color' },
    { href: '/soluciones', label: 'Soluciones' },
    { href: '/receta', label: 'Mi Receta' },
  ]


  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/catalogo?q=${encodeURIComponent(searchQuery.trim())}`
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-gray-100 transition-shadow duration-200 ${scrolled ? "shadow-md" : "shadow-sm"}`} role="banner">
      {/* Skip to main — accesibilidad teclado */}
      <a href="#main-content" className="skip-link">Ir al contenido principal</a>

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="ContactGo — Ir al inicio">
          <NextImage src="/logo.png" alt="ContactGo" width={140} height={50} className="h-10 w-auto object-contain" />
        </Link>

        {/* Nav desktop */}
          {/* Búsqueda — desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-48 lg:w-64 hover:border-gray-300 transition-colors">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar lentes..."
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
            />
          </form>
                  <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="px-2 py-2 lg:px-3 rounded-lg text-xs lg:text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors whitespace-nowrap">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2" role="navigation" aria-label="Acciones de usuario">
          {/* WhatsApp button visible en desktop */}
          <a href="https://wa.me/18295430580?text=Hola%20ContactGo%20%F0%9F%91%8B"
            target="_blank" rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-[12px] text-white bg-[#25D366] hover:bg-[#20ba58] transition-colors font-semibold px-3 py-1.5 rounded-full">
            <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white" aria-hidden="true"><path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.619 4.587 1.773 6.56L2.667 29.333l6.907-1.747A13.244 13.244 0 0016.004 29.333c7.363 0 13.333-5.973 13.333-13.333S23.367 2.667 16.004 2.667zm5.84 15.013c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-.96 1.28-.133.213-.267.24-.587.08s-1.147-.427-2.187-1.36c-.8-.72-1.347-1.6-1.507-1.867-.133-.267-.013-.4.107-.547.107-.107.24-.293.373-.427.133-.133.16-.24.24-.4.08-.16.04-.293-.027-.427-.08-.133-.72-1.733-.987-2.373-.267-.64-.547-.547-.72-.547H12.2c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.24 3.413 5.44 4.787.76.32 1.347.52 1.813.667.76.24 1.453.213 2 .133.613-.08 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/></svg>
            <span>Escríbenos</span>
          </a>
          <Link href="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label={itemCount > 0 ? `Carrito — ${itemCount} producto${itemCount !== 1 ? 's' : ''}` : 'Carrito de compras'}>
            <ShoppingCart className="w-5 h-5 text-gray-700" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                aria-hidden="true">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
          <Link href="/cuenta"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
            aria-label="Mi cuenta">
            <User className="w-4 h-4" aria-hidden="true" />
            Mi cuenta
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-menu">
            {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1"
          role="navigation" aria-label="Menú móvil">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 min-h-[44px] flex items-center">
              {l.label}
            </Link>
          ))}
          <Link href="/cuenta" onClick={() => setOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 flex items-center gap-2 min-h-[44px]">
            <User className="w-4 h-4" aria-hidden="true" /> Mi cuenta
          </Link>
        </div>
      )}
    
        {searchOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 shadow-lg z-50">
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar lentes de contacto..." style={{ fontSize: '16px' }}
                className="bg-transparent text-gray-700 placeholder-gray-400 outline-none flex-1" />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
</header>
  )
}
