'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function AdminDGII() {
  const now = new Date()
  const [mes,   setMes]   = useState(`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2,'0')}`)
  const [datos, setDatos] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [ncfSeq, setNcfSeq] = useState<any[]>([])

  useEffect(() => {
    sb.from('ncf_sequences').select('*').order('serie')
      .then(({ data }) => setNcfSeq(data ?? []))
  }, [])

  const cargar = async () => {
    setLoading(true)
    const res = await fetch(`/api/dgii/607?mes=${mes}&formato=json`)
    const d   = await res.json()
    setDatos(d)
    setLoading(false)
  }

  const descargar = (tipo: '607') => {
    window.open(`/api/dgii/${tipo}?mes=${mes}&formato=txt`, '_blank')
  }

  const mesLabel = () => {
    const y = mes.slice(0,4), m = parseInt(mes.slice(4,6)) - 1
    return `${MESES[m]} ${y}`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-800">📋 Panel DGII</h1>
          <p className="text-gray-500 text-sm mt-1">Reportes fiscales mensuales — Formularios 607</p>
        </div>

        {/* Secuencias NCF */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h2 className="font-bold text-gray-700 mb-3">🔢 Secuencias NCF activas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b">
                  <th className="text-left py-2 pr-4">Serie</th>
                  <th className="text-left py-2 pr-4">Descripción</th>
                  <th className="text-right py-2 pr-4">Último NCF</th>
                  <th className="text-right py-2 pr-4">Disponibles</th>
                  <th className="text-center py-2">Modo</th>
                  <th className="text-center py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ncfSeq.map(s => (
                  <tr key={s.serie} className="border-b border-gray-50">
                    <td className="py-2 pr-4 font-mono font-bold text-blue-700">{s.serie}</td>
                    <td className="py-2 pr-4 text-gray-600">{s.descripcion}</td>
                    <td className="py-2 pr-4 text-right font-mono">
                      {s.ultimo_numero > 0
                        ? `${s.serie}${String(s.ultimo_numero).padStart(8,'0')}`
                        : '—'}
                    </td>
                    <td className="py-2 pr-4 text-right text-gray-500">
                      {(s.hasta - s.ultimo_numero).toLocaleString()}
                    </td>
                    <td className="py-2 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        s.modo === 'prueba'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {s.modo === 'prueba' ? '🧪 PRUEBA' : '✅ PRODUCCIÓN'}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        s.activo ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {s.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-amber-600 mt-3 bg-amber-50 rounded-lg px-3 py-2">
            ⚠️ Series E02/E04 son de <strong>PRUEBA DGII</strong>. Cuando obtengas las secuencias autorizadas (B02/B01), actualízalas aquí y cambia el modo a producción.
          </p>
        </div>

        {/* Selector período + botones */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h2 className="font-bold text-gray-700 mb-4">📅 Generar Reporte 607</h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Período</label>
              <input
                type="month"
                value={`${mes.slice(0,4)}-${mes.slice(4,6)}`}
                onChange={e => setMes(e.target.value.replace('-',''))}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button onClick={cargar} disabled={loading}
              className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Cargando...' : '🔍 Ver resumen'}
            </button>
            <button onClick={() => descargar('607')}
              className="bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-green-700">
              ⬇️ Descargar 607.txt
            </button>
          </div>
        </div>

        {/* Resumen del período */}
        {datos && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-700">📊 Resumen — {mesLabel()}</h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                datos.modo === 'PRUEBA' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
              }`}>
                {datos.modo}
              </span>
            </div>

            {datos.total_registros === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Sin ventas con NCF en este período</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-blue-700">{datos.total_registros}</p>
                    <p className="text-xs text-blue-500 font-medium">Ventas</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-green-700">RD${parseFloat(datos.total_monto).toLocaleString()}</p>
                    <p className="text-xs text-green-500 font-medium">Total facturado</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-gray-500">RD$0</p>
                    <p className="text-xs text-gray-400 font-medium">ITBIS (exento)</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-400 border-b">
                        <th className="text-left py-2 pr-3">NCF</th>
                        <th className="text-left py-2 pr-3">Fecha</th>
                        <th className="text-left py-2 pr-3">Cliente</th>
                        <th className="text-right py-2 pr-3">Monto</th>
                        <th className="text-center py-2">Pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datos.registros.map((r: any, i: number) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-1.5 pr-3 font-mono text-blue-600">{r.ncf}</td>
                          <td className="py-1.5 pr-3 text-gray-500">
                            {r.fecha.slice(0,4)}-{r.fecha.slice(4,6)}-{r.fecha.slice(6,8)}
                          </td>
                          <td className="py-1.5 pr-3 text-gray-600 truncate max-w-[120px]">{r.cliente}</td>
                          <td className="py-1.5 pr-3 text-right font-semibold">RD${parseFloat(r.monto_facturado).toLocaleString()}</td>
                          <td className="py-1.5 text-center text-gray-400 capitalize">{r.metodo_pago?.replace('_',' ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Guía rápida */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 className="font-bold text-blue-800 mb-3">📌 Guía mensual DGII</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>1. Selecciona el mes que vas a declarar</p>
            <p>2. Haz click en <strong>"Ver resumen"</strong> para revisar las ventas</p>
            <p>3. Descarga el <strong>607.txt</strong></p>
            <p>4. Entra a <a href="https://dgii.gov.do" target="_blank" className="underline font-bold">dgii.gov.do</a> → Servicios en Línea → Reporte 607</p>
            <p>5. Sube el archivo antes del <strong>día 20</strong> del mes siguiente</p>
          </div>
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs text-amber-700">⚠️ <strong>Modo PRUEBA activo.</strong> Los NCF E02 no son válidos para la DGII real. Solicita tus secuencias B02 autorizadas en la DGII antes de declarar en producción.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
