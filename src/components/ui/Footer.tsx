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
              <a href="https://wa.me/18294089097" target="_blank" className="hover:text-primary-400 transition-colors">
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
