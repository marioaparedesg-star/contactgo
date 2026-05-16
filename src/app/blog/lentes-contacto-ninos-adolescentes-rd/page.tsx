import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lentes de Contacto para Niños y Adolescentes en RD — ¿A qué edad? — ContactGo',
  description: '¿Tu hijo puede usar lentes de contacto? Descubre la edad recomendada, los mejores tipos para jóvenes y cómo hacer la transición segura en República Dominicana.',
  alternates: { canonical: 'https://contactgo.net/blog/lentes-contacto-ninos-adolescentes-rd' },
  openGraph: {
    title: 'Lentes de contacto para adolescentes en RD — ¿Cuándo empezar?',
    description: 'Guía para padres: edad, tipos de lentes y consejos para que tu hijo use lentes de contacto de forma segura en RD.',
    url: 'https://contactgo.net/blog/lentes-contacto-ninos-adolescentes-rd',
    locale: 'es_DO', siteName: 'ContactGo', type: 'article',
  },
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 pb-32">
      <div className="mb-6">
        <Link href="/blog" className="text-xs text-primary-600 font-semibold hover:underline">← Blog</Link>
      </div>
      <h1 className="font-display text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">
        Lentes de contacto para niños y adolescentes en RD — ¿A qué edad se pueden usar?
      </h1>
      <p className="text-gray-500 text-sm mb-8">Guía para padres · 7 min de lectura</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <p>Una de las preguntas más comunes que recibimos de padres dominicanos es: <strong>"¿mi hijo puede usar lentes de contacto?"</strong> La respuesta depende más de la madurez del niño que de su edad, pero hay guías claras que podemos seguir.</p>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900 text-lg mb-3">La edad recomendada</h2>
          <p>La Academia Americana de Oftalmología no establece una edad mínima rígida, pero la mayoría de especialistas en RD y LATAM coinciden en:</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2"><span className="text-blue-600 font-bold mt-0.5">•</span><span><strong>8-11 años:</strong> Posible en casos especiales (deportes de contacto, anisometropía severa), siempre con supervisión estricta.</span></li>
            <li className="flex items-start gap-2"><span className="text-blue-600 font-bold mt-0.5">•</span><span><strong>12-14 años:</strong> Aceptable si el niño es responsable y entiende el cuidado requerido.</span></li>
            <li className="flex items-start gap-2"><span className="text-blue-600 font-bold mt-0.5">•</span><span><strong>15+ años:</strong> Ideal. El adolescente puede manejar el cuidado de forma independiente.</span></li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-4">¿Cómo saber si mi hijo está listo?</h2>
          <div className="space-y-2">
            {[
              { q: '¿Se lava las manos sin que se lo recuerden?', si: 'Buena señal', no: 'Espera un poco más' },
              { q: '¿Cuida sus pertenencias (celular, mochila)?', si: 'Buena señal', no: 'Todavía no' },
              { q: '¿Sigue instrucciones médicas sin supervisión?', si: 'Listo', no: 'Supervisión constante' },
              { q: '¿Entiende que los lentes son un dispositivo médico?', si: 'Listo', no: 'Educar primero' },
            ].map(item => (
              <div key={item.q} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="font-semibold text-gray-900 text-sm mb-2">{item.q}</p>
                <div className="flex gap-3">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-semibold">✓ Sí → {item.si}</span>
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg font-semibold">✗ No → {item.no}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3">El mejor tipo de lente para adolescentes</h2>
          <p>Para jóvenes que empiezan, siempre recomendamos <strong>lentes diarios</strong>. La razón es simple: no requieren limpieza ni mantenimiento. Se usan y se descartan. El riesgo de infección es mínimo y la higiene está garantizada.</p>
          <div className="mt-4 space-y-3">
            <Link href="/producto/1-day-acuvue-moist-lentes-contacto-diarios-dominicana" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-lg">👁️</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">1-DAY ACUVUE® MOIST®</p>
                <p className="text-xs text-gray-500">Diario · El más recomendado para principiantes · RD$3,720</p>
              </div>
              <span className="ml-auto text-primary-600 font-bold text-sm">Ver →</span>
            </Link>
            <Link href="/producto/1-day-acuvue-moist-for-astigmatism-lentes-toricos-diarios-dominicana" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg">🎯</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">1-DAY ACUVUE® MOIST® for Astigmatism</p>
                <p className="text-xs text-gray-500">Diario · Para astigmatismo · RD$5,940</p>
              </div>
              <span className="ml-auto text-primary-600 font-bold text-sm">Ver →</span>
            </Link>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">⚠️ Reglas de oro para adolescentes</h2>
          <ul className="text-sm space-y-1.5">
            <li>• Nunca dormir con los lentes puestos</li>
            <li>• Lavarse las manos SIEMPRE antes de tocar los lentes</li>
            <li>• Nunca usar lentes con los ojos rojos o irritados</li>
            <li>• No compartir lentes con nadie, jamás</li>
            <li>• Llevar los espejuelos de backup siempre</li>
            <li>• Visitar al oftalmólogo cada 12 meses</li>
          </ul>
        </div>

        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900 mb-2">¿Listo para empezar?</h2>
          <p className="text-sm text-gray-700 mb-4">Consulta nuestro catálogo de lentes diarios, perfectos para adolescentes que empiezan. Envío a domicilio en todo RD.</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/esfericos" className="bg-primary-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm">Ver lentes esféricos</Link>
            <Link href="/receta" className="border border-primary-300 text-primary-700 px-4 py-2.5 rounded-xl font-bold text-sm">Usar mi receta</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
