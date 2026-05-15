'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function WhatsAppButton() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 2000)
    const t2 = setTimeout(() => setShowBubble(true), 4000)
    const t3 = setTimeout(() => setShowBubble(false), 7000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const getMessage = () => {
    if (pathname?.includes('/producto/')) return encodeURIComponent('Hola ContactGo 👋 tengo una pregunta sobre este producto')
    if (pathname?.includes('/receta')) return encodeURIComponent('Hola ContactGo 👋 necesito ayuda con mi receta')
    if (pathname?.includes('/carrito') || pathname?.includes('/checkout')) return encodeURIComponent('Hola ContactGo 👋 necesito ayuda con mi pedido')
    return encodeURIComponent('Hola ContactGo 👋 quiero información sobre lentes de contacto')
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-20 right-3 z-50 flex flex-col items-end gap-2">

      {/* Burbuja compacta */}
      {showBubble && (
        <div className="bg-white rounded-2xl rounded-br-sm shadow-lg border border-gray-100 px-3 py-2 max-w-[170px] relative">
          <button
            onClick={() => setShowBubble(false)}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-[10px] hover:bg-gray-300"
            aria-label="Cerrar"
          >✕</button>
          <p className="text-[11px] text-gray-500 font-semibold mb-0.5">ContactGo</p>
          <p className="text-xs text-gray-800 leading-snug">¿Necesitas ayuda? 💬</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-gray-400">En línea</span>
          </div>
        </div>
      )}

      {/* Botón WhatsApp */}
      <a
        href={`https://wa.me/18294728328?text=${getMessage()}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="relative w-12 h-12 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white relative z-10">
          <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.619 4.587 1.773 6.56L2.667 29.333l6.907-1.747A13.244 13.244 0 0016.004 29.333c7.363 0 13.333-5.973 13.333-13.333S23.367 2.667 16.004 2.667zm5.84 15.013c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-.96 1.28-.133.213-.267.24-.587.08s-1.147-.427-2.187-1.36c-.8-.72-1.347-1.6-1.507-1.867-.133-.267-.013-.4.107-.547.107-.107.24-.293.373-.427.133-.133.16-.24.24-.4.08-.16.04-.293-.027-.427-.08-.133-.72-1.733-.987-2.373-.267-.64-.547-.547-.72-.547H12.2c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.24 3.413 5.44 4.787.76.32 1.347.52 1.813.667.76.24 1.453.213 2 .133.613-.08 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/>
        </svg>
      </a>
    </div>
  )
}
