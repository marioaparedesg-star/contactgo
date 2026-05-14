import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Primeros pasos con lentes de contacto en RD — ContactGo',
  description: 'Guía completa para quienes quieren empezar a usar lentes de contacto en República Dominicana. Qué necesitas, cómo empezar y qué esperar.',
  keywords: 'empezar usar lentes contacto RD, primera vez lentes contacto dominicana, guia principiantes lentes',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Principiantes</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Primeros pasos con lentes de contacto en República Dominicana</h1>
        <p className="text-gray-400 text-sm mb-8">7 min lectura · ContactGo</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Cada semana decenas de dominicanos se plantean pasar de las gafas a los lentes de contacto. Si estás en ese grupo, esta guía es para ti. Aquí va todo lo que necesitas saber antes de hacer tu primera compra.</p>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Paso 1: Visita a un optometrista</h2>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="text-sm text-blue-800">Antes de comprar cualquier lente de contacto, necesitas una <strong>adaptación de lentes de contacto</strong> con un optometrista o oftalmólogo. Esto es diferente a tu receta de gafas — el profesional medirá la curvatura de tu córnea (BC), el diámetro de tu ojo y evaluará si eres candidato a usar lentes de contacto.</p>
              <p className="text-sm text-blue-800 mt-2">Esta consulta toma 20-30 minutos y deja una receta específica para lentes de contacto con los parámetros BC (curva base) y DIA (diámetro).</p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Paso 2: Entiende tu receta de lentes de contacto</h2>
            <div className="bg-gray-50 rounded-2xl p-4 font-mono text-sm mb-3">
              <p className="font-sans font-bold text-gray-700 mb-2">Ejemplo de receta:</p>
              <p>OD: SPH -2.75 / BC 8.6 / DIA 14.0</p>
              <p>OS: SPH -3.00 / CYL -0.75 / AXIS 180 / BC 8.7 / DIA 14.2</p>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { sigla: 'SPH', desc: 'Esférico — tu graduación principal. Negativo = miopía, positivo = hipermetropía' },
                { sigla: 'CYL', desc: 'Cilindro — corrección para astigmatismo. Si tienes este valor, necesitas lentes tóricos' },
                { sigla: 'AXIS', desc: 'Eje — dirección del astigmatismo. Va de 0° a 180°' },
                { sigla: 'BC', desc: 'Curva base — curvatura del lente que se adapta a tu córnea' },
                { sigla: 'DIA', desc: 'Diámetro — tamaño total del lente' },
                { sigla: 'ADD', desc: 'Adición — corrección extra para ver de cerca. Solo en multifocales' },
              ].map(s => (
                <div key={s.sigla} className="flex items-start gap-2">
                  <span className="font-bold text-primary-600 w-12 shrink-0">{s.sigla}</span>
                  <span className="text-gray-600">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Paso 3: Elige el tipo de lente correcto</h2>
            <div className="space-y-3">
              {[
                { tipo: 'Lentes diarios — recomendados para principiantes', desc: 'Sin mantenimiento, sin riesgo de errores de limpieza. Los mejores para empezar.', href: '/catalogo?tipo=esferico', badge: '⭐ Mejor para empezar' },
                { tipo: 'Lentes mensuales — si usarás lentes todos los días', desc: 'Más económicos a largo plazo. Requieren disciplina en la limpieza.', href: '/catalogo?tipo=esferico', badge: '💰 Más económico' },
              ].map(t => (
                <div key={t.tipo} className="bg-white border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{t.tipo}</h3>
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full shrink-0">{t.badge}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{t.desc}</p>
                  <Link href={t.href} className="text-xs text-primary-600 font-semibold">Ver opciones →</Link>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Paso 4: Qué comprar además de los lentes</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { item: 'Solución multipropósito', desc: 'Para limpiar y almacenar', href: '/catalogo?tipo=solucion', emoji: '🧴' },
                { item: 'Gotas lubricantes', desc: 'Para cuando sientas sequedad', href: '/catalogo?tipo=gota', emoji: '💧' },
              ].map(i => (
                <Link key={i.item} href={i.href} className="bg-gray-50 rounded-2xl p-4 text-center hover:bg-primary-50 transition-all">
                  <span className="text-2xl block mb-1">{i.emoji}</span>
                  <p className="font-semibold text-sm text-gray-900">{i.item}</p>
                  <p className="text-xs text-gray-500">{i.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Qué esperar las primeras semanas</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Es normal sentir el lente los primeros días — tu ojo se adapta en 1-2 semanas',
                'Empieza usando los lentes 4-6 horas diarias y aumenta gradualmente',
                'Si sientes ardor intenso, visión borrosa o enrojecimiento — quítatelos y descansa',
                'La sensación de "algo en el ojo" desaparece completamente con la adaptación',
                'Si en 2-3 semanas sigues con molestias, regresa al optometrista — puede ser un ajuste de parámetros',
              ].map((p, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary-500">→</span>{p}</li>)}
            </ul>
          </div>

          <div className="bg-primary-600 rounded-2xl p-5 text-white">
            <h3 className="font-bold text-lg mb-2">¿Listo para tu primera compra?</h3>
            <p className="text-sm text-white/80 mb-3">En ContactGo tenemos soporte por WhatsApp para ayudarte a elegir el primer lente correcto según tu receta.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/receta" className="bg-white text-primary-700 font-bold px-4 py-2.5 rounded-2xl text-sm text-center hover:bg-gray-50 transition-all">
                Buscar con mi receta
              </Link>
              <a href="https://wa.me/18294728328?text=Hola%2C%20soy%20nuevo%20usando%20lentes%20y%20necesito%20ayuda%20para%20elegir"
                target="_blank" rel="noopener noreferrer"
                className="border-2 border-white/50 text-white font-bold px-4 py-2.5 rounded-2xl text-sm text-center hover:bg-white/10 transition-all">
                💬 Hablar con asesor
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
