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
      <div className="border-t border-gray-800 px-4 py-5 text-center text-xs">
        © {new Date().getFullYear()} ContactGo. Todos los derechos reservados.
      </div>
    </footer>
  )
}
