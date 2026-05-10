'use client'
export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/18294728328?text=Hola%20ContactGo%2C%20necesito%20ayuda%20con%20mi%20pedido"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-[#25D366] rounded-full shadow-lg
                 flex items-center justify-center hover:scale-110 transition-transform duration-200
                 hover:shadow-xl group"
      aria-label="WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.619 4.587 1.773 6.56L2.667 29.333l6.907-1.747A13.244 13.244 0 0016.004 29.333c7.363 0 13.333-5.973 13.333-13.333S23.367 2.667 16.004 2.667zm0 24c-2.24 0-4.427-.6-6.347-1.747l-.453-.267-4.1 1.04 1.08-3.96-.293-.48A10.601 10.601 0 015.334 16c0-5.88 4.787-10.667 10.67-10.667 5.88 0 10.666 4.787 10.666 10.667S21.884 26.667 16.004 26.667zm5.84-7.987c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-.96 1.28-.133.213-.267.24-.587.08s-1.147-.427-2.187-1.36c-.8-.72-1.347-1.6-1.507-1.867-.133-.267-.013-.4.107-.547.107-.107.24-.293.373-.427.133-.133.16-.24.24-.4.08-.16.04-.293-.027-.427-.08-.133-.72-1.733-.987-2.373-.267-.64-.547-.547-.72-.547H12.2c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.24 3.413 5.44 4.787.76.32 1.347.52 1.813.667.76.24 1.453.213 2 .133.613-.08 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/>
      </svg>
      <span className="absolute right-16 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Chatea con nosotros
      </span>
    </a>
  )
}
