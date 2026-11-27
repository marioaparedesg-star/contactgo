'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { trackWhatsappHelp } from '@/lib/analytics'

const links = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/soluciones', label: 'Soluciones' },
  { href: '/receta', label: 'Mi receta' },
  { href: '/comparar', label: 'Comparar' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const itemCount = useCartStore(s => s.itemCount())

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    window.location.href = `/catalogo?q=${encodeURIComponent(query)}`
    setSearchOpen(false)
    setSearchQuery('')
    setOpen(false)
  }

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-gray-100 transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`} role="banner">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center relative shrink-0" aria-label="ContactGo — Ir al inicio">
          <NextImage src="/logo.png" alt="ContactGo" width={200} height={33} className="h-8 sm:h-10 w-auto object-contain" priority />
          <span className="text-[10px] font-semibold text-gray-400 ml-0.5 -mt-4 select-none" aria-hidden="true">®</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-52 xl:w-64">
          <Search className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
          <input aria-label="Buscar productos" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Buscar lentes..." className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full" />
        </form>

        <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="px-2.5 py-2 lg:px-3 rounded-lg text-sm font-semibold text-gray-700 hover:text-primary-700 hover:bg-teal-50 transition-colors whitespace-nowrap">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5" role="navigation" aria-label="Acciones de usuario">
          <a href="https://wa.me/18096942268?text=Hola%20ContactGo%20%F0%9F%91%8B" target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsappHelp('navbar')} className="hidden xl:flex items-center gap-1.5 text-sm text-white bg-[#002455] hover:bg-[#001F4A] transition-colors font-semibold px-3 py-2 rounded-full">
            <span>Escríbenos</span>
          </a>
          <button type="button" onClick={() => setSearchOpen(value => !value)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={searchOpen ? 'Cerrar búsqueda' : 'Buscar productos'} aria-expanded={searchOpen}>
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
          <Link href="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={itemCount > 0 ? `Carrito — ${itemCount} producto${itemCount !== 1 ? 's' : ''}` : 'Carrito de compras'}>
            <ShoppingCart className="w-5 h-5 text-gray-700" aria-hidden="true" />
            {itemCount > 0 && <span className="absolute top-0 right-0 min-w-5 h-5 px-1 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center" aria-hidden="true">{itemCount > 9 ? '9+' : itemCount}</span>}
          </Link>
          <Link href="/cuenta" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm font-semibold text-gray-700 min-h-[44px]" aria-label="Mi cuenta">
            <User className="w-4 h-4" aria-hidden="true" /> Mi cuenta
          </Link>
          <button type="button" onClick={() => setOpen(value => !value)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="mobile-menu">
            {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 shadow-lg z-50">
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
            <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Buscar lentes de contacto..." aria-label="Buscar productos" className="bg-transparent text-gray-700 placeholder-gray-400 outline-none flex-1" style={{ fontSize: '16px' }} />
            <button type="submit" className="text-sm font-bold text-[#002455] px-2 min-h-[40px]">Buscar</button>
          </form>
        </div>
      )}

      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1" role="navigation" aria-label="Menú móvil">
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-teal-50 hover:text-primary-700 min-h-[48px] flex items-center">
              {link.label}
            </Link>
          ))}
          <Link href="/cuenta" onClick={() => setOpen(false)} className="px-3 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-teal-50 flex items-center gap-2 min-h-[48px]">
            <User className="w-4 h-4" aria-hidden="true" /> Mi cuenta
          </Link>
          <a href="https://wa.me/18096942268?text=Hola%20ContactGo" target="_blank" rel="noopener noreferrer" onClick={() => { trackWhatsappHelp('navbar_mobile'); setOpen(false) }} className="px-3 py-3 rounded-lg text-base font-semibold text-[#002455] hover:bg-slate-50 min-h-[48px] flex items-center">
            Contactar por WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}
