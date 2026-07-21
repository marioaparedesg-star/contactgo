'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { Copy, Check, Share2, Users, DollarSign, Gift } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReferidosPage() {
  const [user, setUser] = useState<any>(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const refCode = user?.id?.slice(0, 8).toUpperCase() ?? 'XXXXXXXX'
  const refLink = `https://www.contactgo.net/?ref=${refCode}`

  const copiar = () => {
    navigator.clipboard.writeText(refLink)
    setCopiado(true)
    toast.success('¡Enlace copiado!')
    setTimeout(() => setCopiado(false), 2000)
  }

  const compartir = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ContactGo — Lentes de contacto en RD',
        text: '¡Compra tus lentes de contacto en ContactGo! Usa mi enlace y obtienes RD$300 de descuento en tu primera compra.',
        url: refLink
      })
    } else copiar()
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-2xl mx-auto px-4 py-10 pb-24">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Programa de Referidos</h1>
          <p className="text-gray-500 text-sm">Comparte ContactGo y gana RD$300 por cada amigo que compre</p>
        </div>

        {/* Cómo funciona */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Share2, n: '1', title: 'Comparte tu link', desc: 'Envía tu enlace único a amigos y familia' },
            { icon: Users, n: '2', title: 'Tu amigo compra', desc: 'Hace su primera compra en ContactGo' },
            { icon: DollarSign, n: '3', title: 'Ganan los dos', desc: 'Tú RD$300, tu amigo RD$150 de descuento' },
          ].map(s => (
            <div key={s.n} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-black mx-auto mb-2">{s.n}</div>
              <p className="text-xs font-bold text-gray-900 mb-1">{s.title}</p>
              <p className="text-[10px] text-gray-500 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Link de referido */}
        {user ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
            <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Tu enlace único</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-700 font-mono truncate">
                {refLink}
              </div>
              <button onClick={copiar} className="shrink-0 w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 transition-colors">
                {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={compartir} className="w-full mt-3 btn-primary py-3 flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" /> Compartir por WhatsApp
            </button>
          </div>
        ) : (
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 text-center mb-6">
            <p className="text-sm text-primary-800 font-semibold mb-3">Inicia sesión para ver tu enlace de referido</p>
            <a href="/cuenta" className="btn-primary px-6 py-2.5 text-sm">Iniciar sesión</a>
          </div>
        )}

        {/* Términos */}
        <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500 leading-relaxed">
          <p className="font-semibold text-gray-700 mb-1">Condiciones del programa:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>El descuento RD$300 aplica en tu próxima compra cuando tu referido complete su primera orden</li>
            <li>Tu amigo recibe RD$150 de descuento en su primera compra</li>
            <li>El referido debe ser una persona nueva en ContactGo</li>
            <li>No aplica acumulación con otros descuentos</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}
