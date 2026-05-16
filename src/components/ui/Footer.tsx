import Link from 'next/link'
import { Eye } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-500 mt-16">

      {/* Main grid — compacto */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-base">ContactGo</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-500 mb-4">
            Lentes de contacto premium con entrega a domicilio en toda la República Dominicana.
          </p>
          {/* Redes */}
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/contactgord" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-pink-500 flex items-center justify-center transition-colors group">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=1063834443484441" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors group">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://wa.me/18294728328" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors group">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Productos */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Productos</h4>
          <ul className="space-y-2">
            {[
              ['Esféricos', '/catalogo?tipo=esferico'],
              ['Tóricos', '/catalogo?tipo=torico'],
              ['Multifocales', '/catalogo?tipo=multifocal'],
              ['Color', '/catalogo?tipo=color'],
              ['Soluciones', '/catalogo?tipo=solucion'],
              ['Gotas', '/catalogo?tipo=gota'],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="text-xs text-gray-500 hover:text-primary-400 transition-colors">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ayuda */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Ayuda</h4>
          <ul className="space-y-2">
            {[
              ['Centro de ayuda', '/ayuda'],
              ['Envíos', '/ayuda#envios'],
              ['Devoluciones', '/devoluciones'],
              ['Mi Receta', '/receta'],
              ['FAQ', '/faq'],
              ['Blog', '/blog'],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="text-xs text-gray-500 hover:text-primary-400 transition-colors">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-widest">Contacto</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <a href="https://wa.me/18294728328" target="_blank"
                className="text-gray-500 hover:text-primary-400 transition-colors">
                📞 (829) 472-8328
              </a>
            </li>
            <li>
              <a href="mailto:info@contactgo.net"
                className="text-gray-500 hover:text-primary-400 transition-colors">
                ✉️ info@contactgo.net
              </a>
            </li>
            <li className="text-gray-600">
              📍 Santo Domingo, RD
            </li>
          </ul>

          {/* Pagos compacto */}
          <div className="mt-5">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Pagos seguros</p>
            <div className="flex items-center gap-2 flex-wrap">
              <img src="/visa-blue.png" alt="Visa" className="h-5 opacity-60" />
              <img src="/mastercard.png" alt="Mastercard" className="h-5 opacity-80" />
              <span className="text-[9px] text-gray-500 border border-gray-700 px-1.5 py-0.5 rounded">Verified by VISA</span>
              <span className="text-[9px] text-gray-500 border border-gray-700 px-1.5 py-0.5 rounded">Mastercard ID Check</span>
              <span className="text-[9px] text-gray-500 border border-gray-700 px-1.5 py-0.5 rounded">🔒 SSL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — una sola línea */}
      <div className="border-t border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-600">
          <span>© {new Date().getFullYear()} ContactGo — República Dominicana</span>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/privacidad" className="hover:text-gray-400 transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-gray-400 transition-colors">Términos</Link>
            <Link href="/seguridad" className="hover:text-gray-400 transition-colors">Seguridad</Link>
            <Link href="/sobre-nosotros" className="hover:text-gray-400 transition-colors">Nosotros</Link>
            <Link href="/resenas" className="hover:text-gray-400 transition-colors">Reseñas</Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
