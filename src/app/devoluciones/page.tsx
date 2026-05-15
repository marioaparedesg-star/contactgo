import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'Política de Devoluciones y Reembolsos | ContactGo',
  description: 'Política clara de devoluciones, reembolsos y cancelaciones de ContactGo.',
}

export default function DevolucionesPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10 pb-24">
        <h1 className="font-display text-3xl font-black text-gray-900 mb-2">Política de Devoluciones y Reembolsos</h1>
        <p className="text-gray-500 text-sm mb-8">Última actualización: Mayo 2026 · ContactGo — Santo Domingo, República Dominicana</p>

        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="font-bold text-green-900 mb-1">Garantía de satisfacción</p>
            <p className="text-green-800">En ContactGo queremos que estés 100% satisfecho con tu compra. Si hay algún problema con tu pedido, estamos aquí para resolverlo.</p>
          </div>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3 pb-2 border-b border-gray-100">1. Devoluciones — Productos defectuosos o incorrectos</h2>
            <p className="mb-3">Aceptamos devoluciones en los siguientes casos:</p>
            <ul className="space-y-2">
              {['El producto llegó defectuoso o dañado durante el envío','Recibiste un producto diferente al que ordenaste (marca, tipo o graduación incorrecta)','El empaque llegó abierto, roto o con signos de manipulación','El producto tiene fecha de vencimiento expirada al momento de la entrega'].map((item,i)=>(
                <li key={i} className="flex items-start gap-2"><span className="text-green-500">✓</span>{item}</li>
              ))}
            </ul>
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-semibold text-amber-900 mb-1">Plazo</p>
              <p className="text-amber-800">Notifícanos dentro de los <strong>5 días hábiles</strong> de recibir tu pedido.</p>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3 pb-2 border-b border-gray-100">2. Productos NO sujetos a devolución</h2>
            <p className="mb-3">Por razones de salud e higiene, no se aceptan devoluciones de:</p>
            <ul className="space-y-2">
              {['Lentes de contacto que han sido abiertos o usados','Gotas oculares o soluciones abiertas','Productos alterados o modificados por el cliente','Lentes tóricos o especiales fabricados a medida (salvo defecto del fabricante)'].map((item,i)=>(
                <li key={i} className="flex items-start gap-2"><span className="text-red-400">✕</span>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3 pb-2 border-b border-gray-100">3. Proceso de devolución</h2>
            <ol className="space-y-3">
              {[
                {paso:'Contáctanos',desc:'Escríbenos a info@contactgo.net o por WhatsApp al (829) 472-8328 dentro de los 5 días hábiles.'},
                {paso:'Documentación',desc:'Envíanos fotos del producto y tu número de orden. Respondemos en 24-48 horas.'},
                {paso:'Aprobación',desc:'Si la devolución es aprobada, te indicaremos cómo proceder.'},
                {paso:'Reembolso o reposición',desc:'Procesamos el reembolso o te enviamos el producto correcto sin costo adicional.'},
              ].map((s,i)=>(
                <li key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i+1}</span>
                  <div><p className="font-semibold text-gray-900">{s.paso}</p><p>{s.desc}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3 pb-2 border-b border-gray-100">4. Reembolsos</h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                <span>💳</span>
                <div><p className="font-semibold">Tarjeta de crédito/débito</p><p className="text-xs text-gray-500">Reembolso en 5-10 días hábiles a la misma tarjeta</p></div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                <span>💵</span>
                <div><p className="font-semibold">Contra entrega (efectivo)</p><p className="text-xs text-gray-500">Transferencia bancaria en 2-3 días hábiles</p></div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3 pb-2 border-b border-gray-100">5. Cancelaciones</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><span className="text-green-500">✓</span>Cancela dentro de las primeras <strong>2 horas</strong> para reembolso completo sin cargos</li>
              <li className="flex items-start gap-2"><span className="text-amber-500">⚠️</span>Los lentes tóricos fabricados a medida no pueden cancelarse una vez iniciada la fabricación</li>
              <li className="flex items-start gap-2"><span className="text-red-400">✕</span>No se pueden cancelar pedidos que ya han sido enviados</li>
            </ul>
          </section>

          <div className="bg-primary-600 rounded-2xl p-5 text-white">
            <h3 className="font-bold text-lg mb-2">¿Problema con tu pedido?</h3>
            <p className="text-white/80 text-sm mb-3">Respondemos en menos de 24 horas.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <a href="mailto:info@contactgo.net" className="bg-white text-primary-700 font-bold px-4 py-2.5 rounded-2xl text-sm text-center">📧 info@contactgo.net</a>
              <a href="https://wa.me/18294728328" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white font-bold px-4 py-2.5 rounded-2xl text-sm text-center">💬 (829) 472-8328</a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
