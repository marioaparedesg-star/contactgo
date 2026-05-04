'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Package, MapPin, Phone, Mail, Edit2, Check, X, Plus, Trash2, LogOut, FileText, CreditCard, Camera, ChevronDown, ShoppingCart, MessageCircle, RefreshCw } from 'lucide-react'

export default function CuentaPage() {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [tab, setTab] = useState('pedidos')
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({ nombre: '', telefono: '' })
  const [direcciones, setDirecciones] = useState([])
  const [nuevaDireccion, setNuevaDireccion] = useState('')
  const [nuevaCiudad, setNuevaCiudad] = useState('Santo Domingo')
  const [agregandoDir, setAgregandoDir] = useState(false)
  const [modo, setModo] = useState('login')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [recetas, setRecetas] = useState([])
  const [agregandoReceta, setAgregandoReceta] = useState(false)
  const [recetaForm, setRecetaForm] = useState({ nombre:'Mi receta', od_sph:'', od_cyl:'', od_axis:'', od_add:'', oi_sph:'', oi_cyl:'', oi_axis:'', oi_add:'' })
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrResult, setOcrResult] = useState('')
  const fileRef = useRef(null)
  const [pagos, setPagos] = useState([])
  const [agregandoPago, setAgregandoPago] = useState(false)
  const [pagoForm, setPagoForm] = useState({ titular:'', ultimos4:'', vencimiento:'', tipo:'tarjeta' })
  const [pedidoDetalle, setPedidoDetalle] = useState(null)

        {tab === 'pedidos' && (
          <div className="space-y-3">
            {pedidoDetalle ? (
              <div className="space-y-3">
                <button onClick={() => setPedidoDetalle(null)} className="flex items-center gap-2 text-sm text-primary-600 font-semibold">Volver a pedidos</button>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Pedido #{pedidoDetalle.id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{new Date(pedidoDetalle.created_at || pedidoDetalle.fecha).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <span className={"px-3 py-1 rounded-full text-xs font-bold " + (ESTADO[pedidoDetalle.estado] || 'bg-gray-50 text-gray-600')}>{pedidoDetalle.estado}</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {pedidoDetalle.order_items?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.nombre}</p>
                          <p className="text-xs text-gray-400">Cant: {item.cantidad}{item.sph ? ` SPH ${item.sph}` : ''}{item.cyl ? ` CYL ${item.cyl}` : ''}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">RD${(item.precio * item.cantidad).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-gray-500">Direccion</span><span className="font-medium text-right text-xs">{pedidoDetalle.direccion_texto}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Pago</span><span className="font-medium capitalize">{(pedidoDetalle.metodo_pago || '').replace('_',' ')}</span></div>
                    <div className="flex justify-between border-t border-gray-200 pt-1 mt-1"><span className="font-bold">Total</span><span className="font-bold text-primary-600">RD${(pedidoDetalle.total || 0).toLocaleString()}</span></div>
                  </div>
                  <button onClick={() => recomprar(pedidoDetalle.order_items)}
                    className="w-full bg-primary-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Recomprar este pedido
                  </button>
                </div>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tienes pedidos aun</p>
                <a href="/catalogo" className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-semibold">Ver catalogo</a>
              </div>
            ) : pedidos.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900">Pedido #{p.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(p.created_at || p.fecha).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={"px-3 py-1 rounded-full text-xs font-bold " + (ESTADO[p.estado] || 'bg-gray-50 text-gray-600')}>{p.estado}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 gap-2">
                  <span className="text-primary-600 font-bold text-lg">RD${(p.total || 0).toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button onClick={() => recomprar(p.order_items)} className="flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg"><RefreshCw className="w-3 h-3" /> Repetir</button>
                    <button onClick={() => setPedidoDetalle(p)} className="flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">Ver detalle</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'recomprar' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 font-medium">Tus productos recientes. Agrega al carrito en un tap.</p>
            {pedidos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <RefreshCw className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">Aun no tienes pedidos</p>
              </div>
            ) : pedidos.flatMap(p => p.order_items || []).filter((item, i, arr) => arr.findIndex(x => x.product_id === item.product_id) === i).slice(0, 8).map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.nombre}</p>
                  <p className="text-xs text-gray-400 mt-0.5">RD${item.precio?.toLocaleString()}{item.sph ? ` SPH ${item.sph}` : ''}</p>
                </div>
                <a href={`/catalogo`} className="flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shrink-0">
                  <ShoppingCart className="w-3.5 h-3.5" /> Agregar
                </a>
              </div>
            ))}
          </div>
        )}

        {tab === 'recetas' && (
          <div className="space-y-3">
            {recetas.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-900">{r.nombre}</p>
                  <button onClick={() => eliminarReceta(r.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[['OD Derecho', r.od_sph, r.od_cyl, r.od_axis, r.od_add], ['OI Izquierdo', r.oi_sph, r.oi_cyl, r.oi_axis, r.oi_add]].map(([label, sph, cyl, axis, add]) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
                      <div className="space-y-1 text-xs">
                        {sph && <p><span className="text-gray-400">SPH:</span> <span className="font-semibold">{sph}</span></p>}
                        {cyl && <p><span className="text-gray-400">CYL:</span> <span className="font-semibold">{cyl}</span></p>}
                        {axis && <p><span className="text-gray-400">EJE:</span> <span className="font-semibold">{axis}</span></p>}
                        {add && <p><span className="text-gray-400">ADD:</span> <span className="font-semibold">{add}</span></p>}
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/catalogo" className="w-full bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors">
                  <ShoppingCart className="w-4 h-4" /> Comprar con esta receta
                </a>
              </div>
            ))}
            {agregandoReceta ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-4">
                <input value={recetaForm.nombre} onChange={e => setRecetaForm(f => ({...f, nombre: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nombre (ej: Receta 2025)" />
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={escanearReceta} className="hidden" />
                <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-primary-200 rounded-xl py-3 flex items-center justify-center gap-2 text-primary-600 text-sm font-semibold hover:bg-primary-50 transition-colors">
                  <Camera className="w-4 h-4" />{ocrLoading ? 'Analizando...' : 'Tomar foto o subir imagen'}
                </button>
                {ocrResult && <p className="text-xs text-center font-medium text-gray-600">{ocrResult}</p>}
                {[['OD Ojo Derecho', 'od'], ['OI Ojo Izquierdo', 'oi']].map(([label, side]) => (
                  <div key={side}>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">{label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div><p className="text-xs text-gray-400 mb-1">SPH</p><Sel value={recetaForm[side+'_sph']} onChange={v => setRecetaForm(f => ({...f, [side+'_sph']: v}))} options={SPH_OPTS} placeholder="Esfera" /></div>
                      <div><p className="text-xs text-gray-400 mb-1">CYL</p><Sel value={recetaForm[side+'_cyl']} onChange={v => setRecetaForm(f => ({...f, [side+'_cyl']: v}))} options={CYL_OPTS} placeholder="Cilindro" /></div>
                      <div><p className="text-xs text-gray-400 mb-1">EJE</p><Sel value={recetaForm[side+'_axis']} onChange={v => setRecetaForm(f => ({...f, [side+'_axis']: v}))} options={AXIS_OPTS} placeholder="Eje" /></div>
                      <div><p className="text-xs text-gray-400 mb-1">ADD</p><Sel value={recetaForm[side+'_add']} onChange={v => setRecetaForm(f => ({...f, [side+'_add']: v}))} options={ADD_OPTS} placeholder="Adicion" /></div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={guardarReceta} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar receta</button>
                  <button onClick={() => setAgregandoReceta(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoReceta(true)} className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors">
                <Plus className="w-5 h-5" /> Agregar receta
              </button>
            )}
          </div>
        )}

        {tab === 'pagos' && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
              <p className="font-semibold mb-1">Solo guardamos referencia</p>
              <p>Ultimos 4 digitos y titular. Nunca el numero completo.</p>
            </div>
            {pagos.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center"><CreditCard className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">XXXX XXXX XXXX {p.ultimos4}</p>
                    <p className="text-xs text-gray-400">{p.titular} Vence {p.vencimiento}</p>
                    {p.principal && <span className="text-xs text-primary-600 font-semibold">Principal</span>}
                  </div>
                </div>
                <button onClick={() => eliminarPago(p.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {agregandoPago ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-3">
                <input value={pagoForm.titular} onChange={e => setPagoForm(f => ({...f, titular: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nombre del titular" />
                <input value={pagoForm.ultimos4} onChange={e => setPagoForm(f => ({...f, ultimos4: e.target.value.slice(0,4)}))} maxLength={4} inputMode="numeric" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ultimos 4 digitos" />
                <input value={pagoForm.vencimiento} onChange={e => setPagoForm(f => ({...f, vencimiento: e.target.value}))} maxLength={5} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="MM/AA" />
                <div className="flex gap-2">
                  <button onClick={guardarPago} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar</button>
                  <button onClick={() => setAgregandoPago(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoPago(true)} className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors">
                <Plus className="w-5 h-5" /> Agregar tarjeta
              </button>
            )}
          </div>
        )}

        {tab === 'perfil' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <h2 className="font-bold text-gray-900">Informacion personal</h2>
                {!editando ? (
                  <button onClick={() => setEditando(true)} className="flex items-center gap-1.5 text-sm text-primary-600 font-semibold bg-primary-50 px-3 py-1.5 rounded-lg"><Edit2 className="w-3.5 h-3.5" /> Editar</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={guardarPerfil} className="flex items-center gap-1 text-sm text-white font-semibold bg-green-500 px-3 py-1.5 rounded-lg"><Check className="w-3.5 h-3.5" /> Guardar</button>
                    <button onClick={() => setEditando(false)} className="flex items-center gap-1 text-sm text-gray-500 font-semibold bg-gray-100 px-3 py-1.5 rounded-lg"><X className="w-3.5 h-3.5" /> Cancelar</button>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Nombre completo</label>
                  {editando ? <input value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))} className="w-full border border-primary-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium" />
                  : <p className="text-gray-900 font-medium py-1">{perfil?.nombre || 'Sin nombre'}</p>}
                </div>
                <div className="flex items-center gap-3 py-1">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <div><p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Email</p><p className="text-gray-700 font-medium">{user.email}</p></div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Telefono</label>
                  {editando ? <input value={form.telefono} onChange={e => setForm(f => ({...f, telefono: e.target.value}))} className="w-full border border-primary-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium" placeholder="809-000-0000" />
                  : <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><p className="text-gray-700 font-medium">{perfil?.telefono || 'Sin telefono'}</p></div>}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Resumen</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-gray-900">{pedidos.length}</p><p className="text-xs text-gray-400 mt-1">Pedidos</p></div>
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-gray-900">{recetas.length}</p><p className="text-xs text-gray-400 mt-1">Recetas</p></div>
                <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-gray-900">{direcciones.length}</p><p className="text-xs text-gray-400 mt-1">Dirs</p></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'direcciones' && (
          <div className="space-y-3">
            {direcciones.map(d => (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={"w-8 h-8 rounded-xl flex items-center justify-center shrink-0 " + (d.principal ? 'bg-primary-100' : 'bg-gray-100')}>
                    <MapPin className={"w-4 h-4 " + (d.principal ? 'text-primary-600' : 'text-gray-400')} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{d.direccion}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{d.ciudad}</p>
                    {d.principal && <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-0.5 rounded-full mt-1 inline-block">Principal</span>}
                  </div>
                </div>
                <button onClick={() => eliminarDireccion(d.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {agregandoDir ? (
              <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-4 space-y-3">
                <input value={nuevaDireccion} onChange={e => setNuevaDireccion(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" placeholder="Calle, numero, sector" />
                <input value={nuevaCiudad} onChange={e => setNuevaCiudad(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" placeholder="Ciudad" />
                <div className="flex gap-2">
                  <button onClick={agregarDireccion} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar</button>
                  <button onClick={() => setAgregandoDir(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAgregandoDir(true)} className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors">
                <Plus className="w-5 h-5" /> Agregar direccion
              </button>
            )}
          </div>
        )}
  )
}
