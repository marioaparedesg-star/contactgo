'use client'
import { usePathname } from 'next/navigation'

export default function WhatsAppButton() {
  const pathname = usePathname()

  // Ocultar en checkout y páginas admin
  if (pathname?.includes('/checkout') || pathname?.includes('/admin') || pathname?.includes('/login')) return null

  const getMessage = () => {
    if (pathname?.includes('/producto/')) return encodeURIComponent('Hola ContactGo 👋 tengo una pregunta sobre este producto')
    if (pathname?.includes('/receta')) return encodeURIComponent('Hola ContactGo 👋 necesito ayuda con mi receta')
    if (pathname?.includes('/cart')) return encodeURIComponent('Hola ContactGo 👋 necesito ayuda con mi pedido')
    return encodeURIComponent('Hola ContactGo 👋 quiero información sobre lentes de contacto')
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-3 md:right-4 z-50 group">
      {/* Tooltip */}
      <div className="absolute bottom-14 right-0 bg-white rounded-2xl rounded-br-sm shadow-lg border border-gray-100 px-3 py-2 w-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <p className="text-[11px] text-gray-500 font-semibold mb-0.5">ContactGo</p>
        <p className="text-xs text-gray-800 leading-snug">¿Necesitas ayuda? 💬</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-gray-400">En línea ahora</span>
        </div>
      </div>

      {/* Botón WhatsApp — siempre visible */}
      <a
        href={`https://wa.me/18294728328?text=${getMessage()}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative w-12 h-12 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white relative z-10">
          <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.619 4.587 1.773 6.56L2.667 29.333l6.907-1.747A13.244 13.244 0 0016.004 29.333c7.363 0 13.333-5.973 13.333-13.333S23.367 2.667 16.004 2.667zm5.84 15.013c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-.96 1.28-.133.213-.267.24-.587.08s-1.147-.427-2.187-1.36c-.8-.72-1.347-1.6-1.507-1.867-.133-.267-.013-.4.107-.547.107-.107.24-.293.373-.427.133-.133.16-.24.24-.4.08-.16.04-.293-.027-.427-.08-.133-.72-1.733-.987-2.373-.267-.64-.547-.547-.72-.547H12.2c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.24 3.413 5.44 4.787.76.32 1.347.52 1.813.667.76.24 1.453.213 2 .133.613-.08 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/>
        </svg>
      </a>
    </div>
  )
}
