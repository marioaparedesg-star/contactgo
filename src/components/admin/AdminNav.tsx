'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShoppingBag, Package, Users, BarChart2,
  Repeat, ShoppingCart, TrendingUp, Tag, Gift, Settings, ChevronLeft,
  ChevronRight, LogOut, Menu, X, Bell, ExternalLink, FileText, Scan, AlertTriangle, CheckCircle, DollarSign
} from 'lucide-react'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { href: '/M1Alexander',               icon: LayoutDashboard, label: 'Dashboard',      badge: null },
      { href: '/M1Alexander/pedidos',       icon: ShoppingBag,     label: 'Pedidos',        badge: 'pendientes' },
      { href: '/M1Alexander/venta-whatsapp', icon: WhatsAppIcon,   label: '💰 Venta WhatsApp', badge: null },
      { href: '/M1Alexander/suscripciones', icon: Repeat,          label: 'Suscripciones',  badge: null },
    ]
  },
  {
    label: 'Catálogo',
    items: [
      { href: '/M1Alexander/productos',     icon: Package,         label: 'Productos',      badge: null },
      { href: '/M1Alexander/inventario',    icon: BarChart2,       label: 'Inventario',     badge: 'stock' },
      { href: '/M1Alexander/inventario/escaner', icon: Scan,         label: '⚡ Escáner',      badge: null },
      { href: '/M1Alexander/cupones',       icon: Tag,             label: 'Cupones',        badge: null },
      { href: '/M1Alexander/reabastecimiento', icon: AlertTriangle, label: '⚠️ Reabasto',     badge: null },
      { href: '/M1Alexander/auditoria',      icon: CheckCircle,    label: '🔍 Auditoría',    badge: null },
    ]
  },
  {
    label: 'Clientes',
    items: [
      { href: '/M1Alexander/clientes',      icon: Users,           label: 'Clientes',       badge: null },
      { href: '/M1Alexander/referidos',     icon: Gift,            label: 'Referidos',      badge: null },
      { href: '/M1Alexander/leads',         icon: TrendingUp,      label: '🎯 Leads Calculadora', badge: null },
      { href: '/M1Alexander/registrados',   icon: Users,           label: '👥 Registrados',  badge: null },
      { href: '/M1Alexander/abandonados',   icon: ShoppingCart,    label: 'Abandonados',    badge: null },
      { href: '/M1Alexander/whatsapp',      icon: WhatsAppIcon,    label: '💬 WhatsApp',     badge: 'whatsapp' },
      { href: '/M1Alexander/whatsapp-automation', icon: Repeat,    label: '⚡ Automatización', badge: null },
    ]
  },
  {
    label: 'Análisis',
    items: [
      { href: '/M1Alexander/erp-dashboard',  icon: TrendingUp,  label: '📊 ERP Dashboard',  badge: null },
      { href: '/M1Alexander/compras',        icon: ShoppingBag, label: '🛒 Compras',         badge: null },
      { href: '/M1Alexander/caja',           icon: DollarSign,  label: '💵 Caja',            badge: null },
      { href: '/M1Alexander/dgii',          icon: FileText,        label: 'DGII / 607',     badge: null },
    ]
  },
  {
    label: 'Sistema',
    items: [
      { href: '/M1Alexander/configuracion', icon: Settings,        label: 'Configuración',  badge: null },
    ]
  },
]

export default function AdminNav() {
  const pathname  = usePathname()
  const activePath = pathname.startsWith('/admin') ? pathname.replace(/^\\/admin/, '/M1Alexander') : pathname
  const router    = useRouter()
  const sb        = createClient()
  // En tablet (md: pero no lg:) el sidebar arranca colapsado para maximizar espacio
  const [collapsed, setCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth < 1024 && window.innerWidth >= 768
  )
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pendientes, setPendientes] = useState(0)
  const [stockAlerts, setStockAlerts] = useState(0)
  const [waUnread, setWaUnread] = useState(0)

  useEffect(() => {
    // Si estamos en /admin/pedidos, marcar como vistos y no mostrar badge
    const enPedidos = activePath === '/M1Alexander/pedidos'
    if (enPedidos) {
      // Guardar timestamp de última visita para calcular nuevos desde entonces
      localStorage.setItem('admin_pedidos_last_seen', new Date().toISOString())
      setPendientes(0)
    } else {
      // Contar pedidos creados DESPUÉS de la última visita a pedidos
      const lastSeen = localStorage.getItem('admin_pedidos_last_seen')
      const desde = lastSeen ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      sb.from('orders').select('*', { count: 'exact', head: true })
        .in('estado', ['pendiente', 'confirmado', 'recibido', 'preparando', 'fabricante', 'transito'])
        .not('pago_estado', 'eq', 'declinado')
        .not('numero_orden', 'like', 'CG-TEST%')
        .gte('created_at', desde)
        .then(({ count }) => setPendientes(count ?? 0))
    }
    sb.from('products').select('*', { count: 'exact', head: true }).eq('activo', true).lte('stock', 3)
      .then(({ count }) => setStockAlerts(count ?? 0))
    sb.from('whatsapp_messages').select('*', { count: 'exact', head: true })
      .eq('direction', 'inbound').eq('read', false)
      .then(({ count }) => setWaUnread(count ?? 0))
  }, [pathname])

  const getBadge = (key: string | null) => {
    if (key === 'pendientes') return pendientes
    if (key === 'stock') return stockAlerts
    if (key === 'whatsapp') return waUnread
    return 0
  }

  const logout = async () => {
    await sb.auth.signOut()
    router.push('/M1Alexander/login')
  }

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? 'w-72' : collapsed ? 'w-16' : 'w-60'} bg-gray-950 text-white transition-all duration-200`}>
      {/* Logo */}
      <div className={`flex items-center border-b border-gray-800 ${collapsed && !mobile ? 'justify-center p-4' : 'px-5 py-4 justify-between'}`}>
        {(!collapsed || mobile) && (
          <div>
            <p className="font-black text-white text-base tracking-tight">ContactGo</p>
            <p className="text-[10px] text-gray-500 font-medium">Panel de Administración</p>
          </div>
        )}
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1">
        {NAV_SECTIONS.map(section => (
          <div key={section.label} className="mb-2">
            {(!collapsed || mobile) && (
              <p className="px-4 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                {section.label}
              </p>
            )}
            {section.items.map(({ href, icon: Icon, label, badge }) => {
              const active = activePath === href || (href !== '/M1Alexander' && activePath.startsWith(href))
              const badgeCount = getBadge(badge)
              return (
                <Link key={href} href={href}
                  onClick={() => mobile && setMobileOpen(false)}
                  className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-xl text-sm font-medium transition-all relative
                    ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {(!collapsed || mobile) && <span className="flex-1">{label}</span>}
                  {(!collapsed || mobile) && badgeCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {badgeCount}
                    </span>
                  )}
                  {collapsed && !mobile && badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-3 space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold bg-teal-500/20 text-primary-400 hover:bg-teal-500/30 hover:text-primary-300 transition-all border border-primary-600/30 ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <ExternalLink className="w-4 h-4 shrink-0 text-primary-400" />
          {(!collapsed || mobile) && <span className="text-primary-300">Ir a la tienda</span>}
        </a>
        <button onClick={logout}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all w-full ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-0 h-full z-40 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'}`}>
        <NavContent />
      </aside>
      <div className={`hidden md:block shrink-0 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'}`} />

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 py-3">
        <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
        <p className="font-black text-white text-sm">ContactGo Admin</p>
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-400" />
          {pendientes > 0 && <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full" />}
        </div>
      </div>
      <div className="md:hidden h-12" />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative flex h-full">
            <NavContent mobile />
          </div>
        </div>
      )}
    </>
  )
}
