import Link from 'next/link'
import { Eye, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">ContactGo</span>
          </div>
          <p className="text-sm leading-relaxed">
            Lentes de contacto premium con entrega a domicilio en 24–48h en toda la República Dominicana.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Productos</h4>
          <ul className="space-y-2 text-sm">
            {[
              ['Esféricos', '/catalogo?tipo=esferico'],
              ['Tóricos', '/catalogo?tipo=torico'],
              ['Multifocales', '/catalogo?tipo=multifocal'],
              ['Color', '/catalogo?tipo=color'],
              ['Soluciones', '/catalogo?tipo=solucion'],
              ['Gotas', '/catalogo?tipo=gota'],
            ].map(([l, h]) => (
              <li key={h}><Link href={h} className="hover:text-primary-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Ayuda */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Ayuda</h4>
          <ul className="space-y-2 text-sm">
            {[
              ['Ayuda', '/ayuda'],
              ['Envíos y entregas', '/ayuda#envios'],
              ['Devoluciones', '/ayuda#devoluciones'],
              ['Mi Receta', '/receta'],
              ['Mis Pedidos', '/cuenta'],
              ['ACUVUE®', '/marca/acuvue'],
              ['Air Optix®', '/marca/alcon'],
              ['Biofinity®', '/marca/coopervision'],
            ].map(([l, h]) => (
              <li key={h}><Link href={h} className="hover:text-primary-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary-400 shrink-0" />
              <a href="https://wa.me/18294728328" target="_blank" className="hover:text-primary-400 transition-colors">
                829-408-9097
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-400 shrink-0" />
              <a href="mailto:info@contactgo.net" className="hover:text-primary-400 transition-colors">
                info@contactgo.net
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
              <span>Ensanche Naco, Santo Domingo, DN<br/>República Dominicana</span>
            </li>
          </ul>
        </div>
      </div>
            {/* Logos tarjetas aceptadas + 3D Secure — Requisito AZUL */}
      <div className="border-t border-gray-800 px-4 py-6 flex flex-col items-center gap-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Métodos de pago aceptados</p>
        <div className="flex items-center gap-5 flex-wrap justify-center">
          <img src="/visa_blue.svg" alt="Visa" className="h-7 opacity-80" />
          <img src="/mc_symbol.png" alt="Mastercard" className="h-8 opacity-80" />
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mt-2 mb-1">Seguridad 3D Secure</p>
        <div className="flex items-center gap-5 flex-wrap justify-center">
          <div className="flex items-center gap-1 bg-gray-800 rounded px-3 py-1">
            <img src="/visa_blue.svg" alt="Verified by Visa" className="h-5 opacity-70" />
            <span className="text-xs text-blue-300 font-semibold">SECURE</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-800 rounded px-3 py-1">
            <img src="/mc_symbol.png" alt="Mastercard ID Check" className="h-5 opacity-70" />
            <span className="text-xs text-orange-300 font-semibold">ID Check</span>
          </div>
          <span className="text-xs text-gray-500">🔒 Cifrado SSL · PCI-DSS</span>
        </div>
        <a href="/seguridad" className="text-xs text-gray-500 hover:text-primary-400 transition-colors underline mt-1">Política de Seguridad de Pagos</a>
      </div>
      <div className="border-t border-gray-800 px-4 py-5 text-center text-xs flex flex-col md:flex-row items-center justify-center gap-3">
        {/* Redes sociales */}
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <a href="https://www.instagram.com/contactgord" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-400 hover:text-pink-400 transition-colors font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @contactgord
          </a>
          <a href="https://www.facebook.com/profile.php?id=1063834443484441" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Contact Go
          </a>
        </div>
        <span className="hidden md:inline text-gray-600">·</span>
        <span>© {new Date().getFullYear()} ContactGo. Todos los derechos reservados.</span>
        <span className="hidden md:inline text-gray-600">·</span>
        <a href="/privacidad" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</a>
        <span className="hidden md:inline text-gray-600">·</span>
        <a href="/terminos" className="text-gray-400 hover:text-white transition-colors">Términos de Uso</a>
        <span className="hidden md:inline text-gray-600">·</span>
        <a href="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors">Sobre Nosotros</a>
        <a href="/faq" className="text-gray-400 hover:text-white transition-colors">Preguntas Frecuentes</a>
        <span className="hidden md:inline text-gray-600">·</span>
        <a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a>
      </div>
    </footer>
  )
}
