import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import { Settings, CreditCard, Mail, Store, Shield, Bell } from 'lucide-react'

export default async function ConfiguracionPage() {
  const sb = createServerSupabaseClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const secciones = [
    {
      icon: Store, label: 'Tienda',
      items: [
        { key: 'NEXT_PUBLIC_SITE_URL',     label: 'URL del sitio',        value: process.env.NEXT_PUBLIC_SITE_URL ?? 'contactgo.net' },
        { key: 'NEXT_PUBLIC_WHATSAPP',     label: 'WhatsApp de contacto', value: process.env.NEXT_PUBLIC_WHATSAPP ?? '—' },
        { key: 'NEXT_PUBLIC_ADMIN_EMAIL',  label: 'Email admin',          value: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '—' },
      ]
    },
    {
      icon: CreditCard, label: 'AZUL / Pagos',
      items: [
        { key: 'AZUL_ENV',              label: 'Ambiente AZUL',      value: process.env.AZUL_ENV ?? 'sandbox' },
        { key: 'AZUL_MERCHANT_ID',      label: 'Merchant ID',        value: process.env.AZUL_MERCHANT_ID ? '••••••' + process.env.AZUL_MERCHANT_ID.slice(-4) : '—' },
        { key: 'AZUL_AUTH_KEY',         label: 'Auth Key',           value: process.env.AZUL_AUTH_KEY ? '••••••••••••' : '❌ No configurado' },
        { key: 'NEXT_PUBLIC_PAYPAL_CLIENT_ID', label: 'PayPal Client ID', value: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? '✅ Configurado' : '❌ No configurado' },
      ]
    },
    {
      icon: Shield, label: 'Supabase',
      items: [
        { key: 'NEXT_PUBLIC_SUPABASE_URL',      label: 'Project URL',     value: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '—' },
        { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', label: 'Anon Key',        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ No configurado' },
        { key: 'SUPABASE_SERVICE_ROLE_KEY',     label: 'Service Role Key', value: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurado' : '❌ No configurado' },
      ]
    },
  ]

  const azulEnv = process.env.AZUL_ENV ?? 'sandbox'
  const azulOk  = !!process.env.AZUL_AUTH_KEY && !!process.env.AZUL_MERCHANT_ID

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-auto pb-24">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900">Configuración</h1>
            <p className="text-gray-400 text-sm mt-0.5">Estado del sistema y variables de entorno</p>
          </div>

          {/* Estado general */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'AZUL Pagos',   ok: azulOk,                                      detail: azulEnv === 'production' ? 'Producción' : 'Sandbox' },
              { label: 'Supabase DB',  ok: !!process.env.NEXT_PUBLIC_SUPABASE_URL,       detail: 'PostgreSQL' },
              { label: 'PayPal',       ok: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,   detail: 'Live' },
              { label: 'App URL',      ok: !!process.env.NEXT_PUBLIC_SITE_URL,           detail: process.env.NEXT_PUBLIC_SITE_URL ?? '—' },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl border p-4 ${s.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`text-xs font-bold mb-1 ${s.ok ? 'text-green-700' : 'text-red-600'}`}>
                  {s.ok ? '✅' : '❌'} {s.label}
                </div>
                <p className="text-xs text-gray-500">{s.detail}</p>
              </div>
            ))}
          </div>

          {/* Secciones */}
          <div className="space-y-6">
            {secciones.map(sec => (
              <div key={sec.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                    <sec.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <h2 className="font-bold text-gray-900">{sec.label}</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {sec.items.map(item => (
                    <div key={item.key} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{item.key}</p>
                      </div>
                      <p className={`text-sm font-mono text-right max-w-[200px] truncate
                        ${item.value.startsWith('❌') ? 'text-red-500' : item.value.startsWith('✅') ? 'text-green-600' : 'text-gray-600'}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Info Vercel */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <p className="text-sm font-bold text-blue-800 mb-1">¿Cómo cambiar estos valores?</p>
            <p className="text-sm text-blue-700">
              Las variables de entorno se configuran en{' '}
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
                className="font-bold underline hover:text-blue-900">
                Vercel Dashboard → contactgo → Settings → Environment Variables
              </a>
              {' '}. Después de guardar, haz un nuevo deploy para que apliquen.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}
