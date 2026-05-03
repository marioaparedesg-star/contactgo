import Link from 'next/link'
import { Eye, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">ContactGo</span>
          </div>
          <p className="text-sm">
            Lentes de contacto con entrega rápida en toda República Dominicana.
          </p>
        </div>

        {/* Ayuda */}
        <div>
          <h3 className="text-white font-semibold mb-3">Ayuda</h3>
          <div className="space-y-2">
            <Link href="/receta" className="block hover:text-white">Mi Receta</Link>
            <Link href="/cuenta/pedidos" className="block hover:text-white">Mis Pedidos</Link>
            <Link href="/ayuda/envios" className="block hover:text-white">Envíos y entregas</Link>
            <Link href="/ayuda/devoluciones" className="block hover:text-white">Devoluciones</Link>
            <Link href="/faq" className="block hover:text-white">Preguntas Frecuentes</Link>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <div className="space-y-2">
            <Link href="/privacidad" className="block hover:text-white">Privacidad</Link>
            <Link href="/terminos" className="block hover:text-white">Términos</Link>
          </div>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contacto</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <Phone size={14} /> 829-408-9097
            </p>
            <p className="flex items-center gap-2">
              <Mail size={14} /> info@contactgo.net
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={14} /> Santo Domingo, RD
            </p>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 text-center py-4 text-xs">
        © {new Date().getFullYear()} ContactGo. Todos los derechos reservados.
      </div>
    </footer>
  )
}
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
              ['Mi Receta', '/receta'],
              ['Mis Pedidos', '/cuenta/pedidos'],
              ['Envíos y entregas', '/ayuda/envios'],
              ['Devoluciones', '/ayuda/devoluciones'],
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
              <span>Santo Domingo, República Dominicana</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 px-4 py-5 text-center text-xs flex flex-col md:flex-row items-center justify-center gap-3">
        <span>© {new Date().getFullYear()} ContactGo. Todos los derechos reservados.</span>
        <span className="hidden md:inline text-gray-600">·</span>
        <a href="/privacidad" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</a>
        <span className="hidden md:inline text-gray-600">·</span>
        <a href="/terminos" className="text-gray-400 hover:text-white transition-colors">Términos de Uso</a>
        <span className="hidden md:inline text-gray-600">·</span>
        <a href="/faq" className="text-gray-400 hover:text-white transition-colors">Preguntas Frecuentes</a>
      </div>
    </footer>
  )
}
