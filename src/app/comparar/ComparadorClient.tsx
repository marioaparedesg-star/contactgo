'use client'
import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { Plus, X, Search, Check, MessageCircle, Droplets, Wind, Sun, Ruler, Layers, Factory, Globe2, ShoppingCart } from 'lucide-react'

type Producto = {
  id: string; nombre: string; descripcion?: string | null; marca: string; tipo: string; reemplazo: string
  precio: number; costo?: number; stock?: number; categoria_id?: number | null
  precio_anterior: number | null; contenido: string | null
  curva_base: string | null; diametro: string | null; material: string | null
  oxígeno: string | null; agua: string | null; proteccion_uv: boolean | null
  horas_uso: string | null; uso_recomendado: string | null
  fabricante_nombre: string | null; pais_origen: string | null
  dias_uso: number | null; pares_por_caja: number | null
  imagen_url: string | null; slug: string; activo?: boolean
  sph_disponibles?: number[]; cyl_disponibles?: number[]
  add_disponibles?: string[]; colores_disponibles?: string[]
  ojo?: string | null; size?: string | null
}

const TIPO_LABEL: Record<string, string> = {
  esferico: 'Esférico', torico: 'Tórico', multifocal: 'Multifocal', color: 'De color',
}

// ═══════════════════════════════════════════════════════════════
// Rediseño estilo Apple "Review & Buy" — spec entregada por Mario.
// Design tokens tomados literal del brief, aislados a esta página
// vía estilos inline / clases arbitrarias de Tailwind, sin tocar el
// tema global del resto del sitio (que usa Plus Jakarta Sans).
// ═══════════════════════════════════════════════════════════════
const MAX_COMPARAR = 3
const FUENTE = `-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", "Segoe UI", sans-serif`

export default function ComparadorClient({ productos }: { productos: Producto[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addItem = useCartStore(s => s.addItem)
  const [seleccionados, setSeleccionados] = useState<string[]>([])
  const [buscando, setBuscando] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const p = searchParams.get('p')
    if (p) {
      const slugs = p.split(',')
      const ids = slugs.map(s => productos.find(pr => pr.slug === s)?.id).filter(Boolean) as string[]
      if (ids.length) setSeleccionados(ids.slice(0, MAX_COMPARAR))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const agregar = (id: string) => {
    if (seleccionados.includes(id) || seleccionados.length >= MAX_COMPARAR) return
    const nuevos = [...seleccionados, id]
    setSeleccionados(nuevos)
    actualizarUrl(nuevos)
    setBuscando(false); setQuery('')
  }
  const quitar = (id: string) => {
    const nuevos = seleccionados.filter(s => s !== id)
    setSeleccionados(nuevos)
    actualizarUrl(nuevos)
  }
  const actualizarUrl = (ids: string[]) => {
    const slugs = ids.map(id => productos.find(p => p.id === id)?.slug).filter(Boolean)
    router.replace(slugs.length ? `/comparar?p=${slugs.join(',')}` : '/comparar', { scroll: false })
  }

  const productosSeleccionados = useMemo(
    () => seleccionados.map(id => productos.find(p => p.id === id)!).filter(Boolean),
    [seleccionados, productos]
  )

  const resultados = useMemo(() => {
    if (!query.trim()) return productos.slice(0, 8)
    const q = query.toLowerCase()
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [query, productos])

  type Fila = { label: string; icon: any; get: (p: Producto) => string | null; menorEsMejor?: boolean; num?: (v: string) => number | null }
  const filas: Fila[] = [
    { label: 'Precio por caja', icon: Factory, get: p => `RD$${p.precio.toLocaleString()}`, menorEsMejor: true, num: v => Number(v.replace(/[^\d]/g, '')) },
    { label: 'Marca', icon: Factory, get: p => p.marca },
    { label: 'Tipo', icon: Layers, get: p => TIPO_LABEL[p.tipo] ?? p.tipo },
    { label: 'Reemplazo (duración)', icon: Layers, get: p => p.reemplazo },
    { label: 'Contenido', icon: Layers, get: p => p.contenido },
    { label: 'Curva base', icon: Ruler, get: p => p.curva_base ? `${p.curva_base} mm` : null },
    { label: 'Diámetro', icon: Ruler, get: p => p.diametro ? `${p.diametro} mm` : null },
    { label: 'Material', icon: Layers, get: p => p.material },
    { label: 'Contenido de agua', icon: Droplets, get: p => p.agua, menorEsMejor: false, num: v => parseFloat(v) || null },
    { label: 'Transmisión de oxígeno (Dk/t)', icon: Wind, get: p => p.oxígeno, menorEsMejor: false, num: v => parseFloat(v) || null },
    { label: 'Protección UV', icon: Sun, get: p => p.proteccion_uv === true ? 'Sí' : p.proteccion_uv === false ? 'No' : null },
    { label: 'Uso recomendado', icon: Sun, get: p => p.horas_uso ?? p.uso_recomendado },
    { label: 'País de origen', icon: Globe2, get: p => p.pais_origen },
    { label: 'Fabricante', icon: Factory, get: p => p.fabricante_nombre },
  ]

  const filasConDatos = filas.filter(f => productosSeleccionados.some(p => f.get(p)))

  // Producto "recomendado" para el CTA final: el que gane más filas "Mejor".
  const recomendado = useMemo(() => {
    if (productosSeleccionados.length < 2) return productosSeleccionados[0]
    const puntos: Record<string, number> = {}
    productosSeleccionados.forEach(p => { puntos[p.id] = 0 })
    filasConDatos.forEach(fila => {
      if (!fila.num) return
      const valores = productosSeleccionados.map(p => ({ id: p.id, v: fila.get(p) }))
        .filter(x => x.v).map(x => ({ id: x.id, n: fila.num!(x.v!) })).filter(x => x.n !== null) as { id: string; n: number }[]
      if (valores.length < 2) return
      const mejorValor = fila.menorEsMejor ? Math.min(...valores.map(v => v.n)) : Math.max(...valores.map(v => v.n))
      const ganadores = valores.filter(v => v.n === mejorValor)
      if (ganadores.length === 1) puntos[ganadores[0].id]++
    })
    return productosSeleccionados.reduce((mejor, p) => puntos[p.id] > (puntos[mejor?.id ?? ''] ?? -1) ? p : mejor, productosSeleccionados[0])
  }, [productosSeleccionados, filasConDatos])

  const esMejorEnFila = (fila: Fila, p: Producto): boolean => {
    if (!fila.num || productosSeleccionados.length < 2) return false
    const v = fila.get(p)
    if (!v) return false
    const n = fila.num(v)
    if (n === null) return false
    const todos = productosSeleccionados.map(pp => { const vv = fila.get(pp); return vv ? fila.num!(vv) : null }).filter(x => x !== null) as number[]
    if (new Set(todos).size < 2) return false
    const mejorValor = fila.menorEsMejor ? Math.min(...todos) : Math.max(...todos)
    return n === mejorValor
  }

  const verEnCarrito = () => {
    productosSeleccionados.forEach(p => {
      addItem(p as unknown as import('@/types').Product, { cantidad: 1 })
    })
    router.push('/cart')
  }

  return (
    <div style={{ fontFamily: FUENTE, background: '#F5F5F7', minHeight: '100vh' }}>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: '72px 24px 56px', textAlign: 'center' }}>
        <p style={{ color: '#0071E3', fontSize: 13, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 }}>
          ContactGo · Comparador
        </p>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 600, letterSpacing: '-1.2px',
          color: '#1D1D1F', margin: '0 auto 16px', maxWidth: 700, lineHeight: 1.1,
        }}>
          Compara. Elige. Listo.
        </h1>
        <p style={{ fontSize: 19, fontWeight: 400, color: '#6E6E73', maxWidth: 560, margin: '0 auto', lineHeight: 1.5 }}>
          Selecciona hasta 3 lentes y descubre de un vistazo cuál se adapta mejor a ti. Datos reales del fabricante.
        </p>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 96px' }}>

        {/* ═══ SELECTOR DE PRODUCTOS ═══ */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 21, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.3px' }}>Tus opciones</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 56 }}>
          {[0, 1, 2].map(i => {
            const p = productosSeleccionados[i]
            if (p) return (
              <div key={p.id} className="group" style={{
                background: '#FFFFFF', borderRadius: 20, padding: 24, position: 'relative',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)', transition: 'box-shadow .22s ease',
              }}>
                <button onClick={() => quitar(p.id)}
                  className="opacity-0 group-hover:opacity-100"
                  style={{
                    position: 'absolute', top: 14, right: 14, width: 26, height: 26, borderRadius: '50%',
                    background: '#F5F5F7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'opacity .2s ease',
                  }}>
                  <X size={14} color="#6E6E73" />
                </button>
                <div style={{ width: 96, height: 96, margin: '0 auto 16px', position: 'relative' }}>
                  {p.imagen_url && <Image src={p.imagen_url} alt={p.nombre} fill className="object-contain" unoptimized />}
                </div>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6E6E73', textTransform: 'uppercase', letterSpacing: 0.6, textAlign: 'center', marginBottom: 4 }}>
                  {p.marca}
                </p>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F', textAlign: 'center', marginBottom: 12, lineHeight: 1.3 }}>
                  {p.nombre}
                </p>
                <div style={{ textAlign: 'center' }}>
                  {p.precio_anterior && p.precio_anterior > p.precio && (
                    <span style={{ fontSize: 13, color: '#6E6E73', textDecoration: 'line-through', marginRight: 6 }}>
                      RD${p.precio_anterior.toLocaleString()}
                    </span>
                  )}
                  <span style={{ fontSize: 17, fontWeight: 600, color: '#1D1D1F' }}>RD${p.precio.toLocaleString()}</span>
                </div>
              </div>
            )
            return (
              <button key={i} onClick={() => setBuscando(true)} style={{
                border: '1.5px dashed #D2D2D7', borderRadius: 20, padding: 24, minHeight: 220,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', cursor: 'pointer', transition: 'border-color .2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#0071E3')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#D2D2D7')}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: '#F5F5F7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                }}>
                  <Plus size={20} color="#0071E3" />
                </div>
                <span style={{ fontSize: 14, color: '#6E6E73', fontWeight: 500 }}>
                  {i === 0 ? 'Agregar lente' : i === 1 ? 'Agregar segundo lente' : 'Agregar tercer lente'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Buscador (drawer simple) */}
        {buscando && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '10vh 20px',
          }} onClick={() => setBuscando(false)}>
            <div style={{
              background: '#FFFFFF', borderRadius: 20, width: '100%', maxWidth: 480,
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid #D2D2D7' }}>
                <Search size={18} color="#6E6E73" />
                <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar por nombre o marca..."
                  style={{ border: 'none', outline: 'none', fontSize: 15, width: '100%', fontFamily: FUENTE }} />
                <button onClick={() => setBuscando(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={18} color="#6E6E73" />
                </button>
              </div>
              <div style={{ maxHeight: 360, overflowY: 'auto', padding: 8 }}>
                {resultados.map(p => (
                  <button key={p.id} onClick={() => agregar(p.id)} disabled={seleccionados.includes(p.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                      border: 'none', background: 'transparent', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                      opacity: seleccionados.includes(p.id) ? 0.4 : 1,
                    }}
                    onMouseEnter={e => !seleccionados.includes(p.id) && (e.currentTarget.style.background = '#F5F5F7')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 36, height: 36, background: '#F5F5F7', borderRadius: 10, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                      {p.imagen_url && <Image src={p.imagen_url} alt="" fill className="object-contain p-1" unoptimized />}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</p>
                      <p style={{ fontSize: 12, color: '#6E6E73', margin: 0 }}>{p.marca} · RD${p.precio.toLocaleString()}</p>
                    </div>
                    {seleccionados.includes(p.id) && <Check size={16} color="#0071E3" />}
                  </button>
                ))}
                {resultados.length === 0 && <p style={{ fontSize: 13, color: '#6E6E73', textAlign: 'center', padding: 24 }}>Sin resultados</p>}
              </div>
            </div>
          </div>
        )}

        {/* ═══ TABLA DE COMPARACIÓN ═══ */}
        {productosSeleccionados.length < 2 ? (
          <div style={{
            background: '#FFFFFF', borderRadius: 24, padding: 64, textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}>
            <Layers size={32} color="#D2D2D7" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 15, color: '#6E6E73' }}>
              {productosSeleccionados.length === 0
                ? 'Agrega 2 o más lentes arriba para empezar a comparar.'
                : 'Agrega al menos un lente más para ver la comparación.'}
            </p>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 40 }}>
            <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <h3 style={{ fontSize: 19, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.3px', margin: 0 }}>Comparación detallada</h3>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1E7A34', background: 'rgba(52,199,89,0.12)', padding: '5px 12px', borderRadius: 980 }}>
                ✓ Datos del fabricante
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {filasConDatos.map((fila, i) => {
                    const Icon = fila.icon
                    return (
                      <tr key={fila.label} style={{ background: i % 2 === 0 ? '#FAFAFC' : '#FFFFFF' }}>
                        <td style={{ padding: '16px 20px', width: 200, borderTop: '1px solid #F0F0F2' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: '#6E6E73' }}>
                            <Icon size={14} color="#A1A1A6" style={{ flexShrink: 0 }} />
                            {fila.label}
                          </div>
                        </td>
                        {productosSeleccionados.map(p => {
                          const valor = fila.get(p)
                          const esMejor = esMejorEnFila(fila, p)
                          return (
                            <td key={p.id} style={{ padding: '16px 20px', textAlign: 'center', minWidth: 160, borderTop: '1px solid #F0F0F2', background: esMejor ? '#F8F9FF' : 'transparent' }}>
                              <span style={{ fontSize: 14, fontWeight: esMejor ? 600 : 500, color: esMejor ? '#0071E3' : '#1D1D1F' }}>
                                {valor ?? '—'}
                              </span>
                              {esMejor && (
                                <span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#1E7A34', marginTop: 3, letterSpacing: 0.4 }}>
                                  MEJOR
                                </span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ CTA FINAL ═══ */}
        {productosSeleccionados.length >= 2 && recomendado && (
          <div style={{
            background: 'linear-gradient(180deg, #1D1D1F 0%, #2C2C2E 100%)',
            borderRadius: 24, padding: '40px 36px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 32, flexWrap: 'wrap',
          }}>
            <div style={{ flex: '1 1 320px' }}>
              <h3 style={{ fontSize: 26, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.5px', margin: '0 0 8px' }}>
                ¿Ya tienes claro cuál quieres?
              </h3>
              <p style={{ fontSize: 15, color: '#A1A1A6', margin: 0, lineHeight: 1.5, maxWidth: 420 }}>
                Elige el lente que mejor se adapta a tu estilo de vida y completa tu pedido en menos de un minuto.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
              <Link href={`/producto/${recomendado.slug}`} style={{
                background: '#0071E3', color: '#FFFFFF', fontSize: 15, fontWeight: 600,
                borderRadius: 980, padding: '13px 24px', textAlign: 'center', textDecoration: 'none',
                transition: 'background .2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0077ED')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0071E3')}
              >
                Comprar {recomendado.nombre}
              </Link>
              <button onClick={verEnCarrito} style={{
                background: 'transparent', color: '#FFFFFF', fontSize: 15, fontWeight: 600,
                borderRadius: 980, padding: '13px 24px', border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <ShoppingCart size={16} /> Ver {productosSeleccionados.length === 2 ? 'ambos' : 'todos'} en carrito
              </button>
              <a href={`https://wa.me/18096942268?text=${encodeURIComponent(`Hola, quiero cotizar: ${productosSeleccionados.map(p=>p.nombre).join(', ')}`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, color: '#A1A1A6', textAlign: 'center', textDecoration: 'none', marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <MessageCircle size={13} /> O pregúntanos por WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ═══ FOOTER MÍNIMO ═══ */}
      <div style={{ borderTop: '1px solid #D2D2D7', padding: '28px 24px 100px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#6E6E73', margin: 0 }}>
          ContactGo · Lentes certificados · Entrega 24-48h en RD ·{' '}
          <Link href="/privacidad" style={{ color: '#6E6E73', textDecoration: 'underline' }}>Política de privacidad</Link>
        </p>
      </div>
    </div>
  )
}
