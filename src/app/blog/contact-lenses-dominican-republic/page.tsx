export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Contact Lenses in Dominican Republic — Same Day Delivery | ContactGo', description: 'Buy contact lenses in the Dominican Republic with same-day delivery in Santo Domingo and Punta Cana. ACUVUE, Biofinity, Air Optix direct from manufacturer. Secure payment. Fast shipping.',
  alternates: { canonical: 'https://www.contactgo.net/blog/contact-lenses-dominican-republic' },
  openGraph: { type: 'article', title: 'Contact Lenses in the Dominican Republic — Fast Delivery to Your Hotel', description: 'Buy contact lenses in the Dominican Republic with same-day delivery in Santo Domingo and Punta Cana. ACUVUE, Biofinity, Air Optix direct from manufacturer. Secure payment. Fast shipping.', url: 'https://www.contactgo.net/blog/contact-lenses-dominican-republic', siteName: 'ContactGo', locale: 'es_DO', images: [{ url: 'https://www.contactgo.net/blog/contact-lenses-dominican-republic.webp', width: 1200, height: 630, alt: 'Contact Lenses in the Dominican Republic — Fast Delivery to Your Hotel' }] },
}
export default function Page() {
  return (
    <>
      <Navbar /><main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {"@context":"https://schema.org","@type":"Article","headline":"Contact Lenses in the Dominican Republic — Fast Delivery to Your Hotel","description":"Buy contact lenses in the Dominican Republic with same-day delivery in Santo Domingo and Punta Cana. ACUVUE, Biofinity, Air Optix direct from manufacturer. Secure payment. Fast shipping.","author":{"@type":"Organization","name":"Equipo ContactGo"},"publisher":{"@type":"Organization","name":"ContactGo","url":"https://www.contactgo.net","logo":{"@type":"ImageObject","url":"https://www.contactgo.net/logo.png"}},"datePublished":"2026-06-28","dateModified":"2026-06-28","url":"https://www.contactgo.net/blog/contact-lenses-dominican-republic","inLanguage":"es-DO"},
          {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":'Can I buy contact lenses in the Dominican Republic?',"acceptedAnswer":{"@type":"Answer","text":'Yes. ContactGo is the only specialized online contact lens store in the DR, offering directo del fabricante lenses (ACUVUE, Biofinity, Air Optix, Bausch+Lomb) with delivery to hotels and homes throughout the country in 24-48 hours.'}},{"@type":"Question","name":'How fast can I get contact lenses delivered in Punta Cana?',"acceptedAnswer":{"@type":"Answer","text":'ContactGo delivers to Punta Cana, Bávaro, Cap Cana and the entire La Altagracia province in 24-48 hours. Place your order before 3pm for next-day delivery.'}},{"@type":"Question","name":'Do I need a prescription to buy contact lenses in Dominican Republic?',"acceptedAnswer":{"@type":"Answer","text":'Yes, for prescription lenses you need your SPH value (and CYL/AXIS if you have astigmatism). Non-prescription color lenses (zero power) do not require a prescription. You can use our free prescription calculator.'}},{"@type":"Question","name":'Do you deliver to hotels in Punta Cana?',"acceptedAnswer":{"@type":"Answer","text":'Yes. We deliver to hotel addresses throughout Punta Cana, Bávaro, Cap Cana and all major tourist areas. Provide the hotel name and your room number in the delivery address.'}},{"@type":"Question","name":'What payment methods do you accept?',"acceptedAnswer":{"@type":"Answer","text":'We accept Visa and Mastercard through AZUL/Banco Popular, the most trusted payment processor in the Dominican Republic. International cards are accepted.'}}]},
          {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://www.contactgo.net"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://www.contactgo.net/blog"},{"@type":"ListItem","position":3,"name":"Contact Lenses in the Dominican Republic — Fast De","item":"https://www.contactgo.net/blog/contact-lenses-dominican-republic"}]}
        ]) }} />
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-primary-600">Inicio</a><span>/</span><a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span><span className="text-gray-600 truncate">Contact Lenses in the Dominican Republic</span>
        </div>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">🇺🇸 For Tourists · English</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Contact Lenses in the Dominican Republic — Fast Delivery to Your Hotel</h1>
        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
          <div><p className="text-sm font-bold text-gray-900">Equipo ContactGo</p><p className="text-xs text-gray-500">Especialistas en salud visual · ⏱ 8 min · Junio 2026</p></div>
        </div>
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Need contact lenses in the <strong>Dominican Republic</strong>? ContactGo is the only specialized online contact lens store in the country, offering delivery to hotels, resorts, and homes in <strong>Santo Domingo, Punta Cana, Bávaro, La Romana, and throughout the entire country</strong> in 24-48 hours.</p>
        <section id="how-it-works">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">How to Order Contact Lenses in Dominican Republic</h2>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Browse our catalog', desc: 'We carry ACUVUE (Johnson & Johnson), Air Optix (Alcon), Biofinity (CooperVision), Bausch+Lomb and more — all directo del fabricante, direct from manufacturer.' },
              { step: '2', title: 'Enter your prescription', desc: 'You need your SPH value (and CYL/AXIS if you have astigmatism). You can also use our free prescription calculator to find compatible lenses.' },
              { step: '3', title: 'Pay securely', desc: 'We accept Visa and Mastercard through AZUL/Banco Popular — the most trusted payment processor in the Dominican Republic.' },
              { step: '4', title: 'Receive at your hotel or home', desc: 'Delivery to Santo Domingo and Santiago in 24 hours. Punta Cana, La Romana and other areas: 24-48 hours.' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">{s.step}</div>
                <div><p className="font-bold text-gray-900 text-sm">{s.title}</p><p className="text-xs text-gray-600 mt-0.5">{s.desc}</p></div>
              </div>
            ))}
          </div>
        </section>
        <section id="brands">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Available Brands</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { brand: 'ACUVUE®', mfr: 'Johnson & Johnson', products: 'Oasys, 1-DAY Moist, Astigmatism, Multifocal', link: '/marca/acuvue' },
              { brand: 'AIR OPTIX®', mfr: 'Alcon', products: 'HydraGlyde, Colors, Multifocal', link: '/marca/alcon' },
              { brand: 'Biofinity®', mfr: 'CooperVision', products: 'Sphere, Toric, Multifocal, XR', link: '/marca/coopervision' },
              { brand: 'Bausch+Lomb', mfr: 'Bausch+Lomb', products: 'ULTRA, ULTRA Astig, Biotrue ONEday', link: '/marca/bausch-lomb' },
            ].map(b => (
              <a key={b.brand} href={b.link} className="border border-gray-100 rounded-xl p-3 hover:border-indigo-200 hover:shadow-sm transition-all">
                <p className="font-bold text-gray-900 text-sm">{b.brand}</p>
                <p className="text-[11px] text-gray-400">{b.mfr}</p>
                <p className="text-xs text-gray-600 mt-1">{b.products}</p>
              </a>
            ))}
          </div>
        </section>
        <section id="delivery">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Delivery Zones</h2>
          <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50"><th className="p-3 text-left border border-gray-100 font-bold">Area</th><th className="p-3 text-center border border-gray-100 font-bold">Delivery Time</th></tr></thead>
            <tbody>
              {[['Santo Domingo & Greater SD','24 hours'],['Punta Cana, Bávaro, Cap Cana','24-48 hours'],['La Romana, San Pedro','24-48 hours'],['Santiago de los Caballeros','24 hours'],['Puerto Plata, Sosúa','24-72 hours'],['All other provinces','24-72 hours']].map(([area,time],i) => (
                <tr key={i} className={i%2===0?'bg-white':'bg-gray-50'}><td className="p-3 border border-gray-100">{area}</td><td className="p-3 border border-gray-100 text-center font-bold text-indigo-600">{time}</td></tr>
              ))}
            </tbody>
          </table></div>
        </section>
          <section id="productos"><h2 className="font-display text-xl font-bold text-gray-900 mb-4">Disponibles en ContactGo</h2>
            <div className="space-y-2">
            <a href="/producto/acuvue-oasys-hydraclear-plus-lentes-contacto-quincenal-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">ACUVUE® Oasys® 6u</p><p className="text-xs text-gray-500">Bi-weekly · J&J original</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$3,875</span></a>
            <a href="/producto/air-optix-plus-hydraglyde-lentes-contacto-mensuales-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Air Optix® HydraGlyde® 6u</p><p className="text-xs text-gray-500">Monthly · Alcon original</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$4,375</span></a>
            <a href="/producto/biofinity-lentes-contacto-mensuales-coopervision-dominicana" className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/20 transition-all group"><div><p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">Biofinity® 6u</p><p className="text-xs text-gray-500">Monthly · CooperVision original</p></div><span className="font-black text-gray-900 text-sm shrink-0 ml-3">RD$4,750</span></a>
            </div><a href="/catalogo" className="mt-3 inline-block text-sm text-primary-600 font-semibold hover:underline">Ver catálogo completo →</a>
          </section>
          <section id="faq"><h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
            <div className="space-y-3">          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">Can I buy contact lenses in the Dominican Republic?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Yes. ContactGo is the only specialized online contact lens store in the DR, offering directo del fabricante lenses (ACUVUE, Biofinity, Air Optix, Bausch+Lomb) with delivery to hotels and homes throughout the country in 24-48 hours.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">How fast can I get contact lenses delivered in Punta Cana?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">ContactGo delivers to Punta Cana, Bávaro, Cap Cana and the entire La Altagracia province in 24-48 hours. Place your order before 3pm for next-day delivery.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">Do I need a prescription to buy contact lenses in Dominican Republic?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Yes, for prescription lenses you need your SPH value (and CYL/AXIS if you have astigmatism). Non-prescription color lenses (zero power) do not require a prescription. You can use our free prescription calculator.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">Do you deliver to hotels in Punta Cana?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Yes. We deliver to hotel addresses throughout Punta Cana, Bávaro, Cap Cana and all major tourist areas. Provide the hotel name and your room number in the delivery address.</p></details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">What payment methods do you accept?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg></summary><p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">We accept Visa and Mastercard through AZUL/Banco Popular, the most trusted payment processor in the Dominican Republic. International cards are accepted.</p></details></div>
          </section>
          <div className="grid gap-2"><h3 className="font-bold text-gray-900 text-lg">Artículos relacionados</h3>            <a href="/blog/forgot-contact-lenses-punta-cana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Forgot your contact lenses in Punta Cana?</p><p className="text-xs text-gray-500 mt-0.5">Emergency delivery guide for tourists</p></a>
            <a href="/blog/lentes-contacto-punta-cana-entrega" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Lentes en Punta Cana — entrega a domicilio</p><p className="text-xs text-gray-500 mt-0.5">Delivery guide for La Altagracia</p></a>
            <a href="/blog/comprar-lentes-contacto-online-republica-dominicana" className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all"><p className="text-sm font-semibold text-primary-600">→ Cómo comprar lentes online en RD</p><p className="text-xs text-gray-500 mt-0.5">Complete purchasing guide in Spanish</p></a></div>
        </div>
        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6"><p className="font-bold text-gray-900 text-sm">Información verificada · Equipo ContactGo · Junio 2026</p></div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6 text-sm text-amber-900"><strong>⚠️ Aviso médico:</strong> Este artículo es informativo. Consulta a tu especialista ante cualquier duda médica.</div>
        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe en toda República Dominicana en 24-48h</h3>
          <p className="text-sm text-gray-500 mb-4">directo del fabricante · Pago seguro con AZUL/Banco Popular</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta</a>
            <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
          </div>
        </div>
      </main><Footer />
    </>
  )
}
