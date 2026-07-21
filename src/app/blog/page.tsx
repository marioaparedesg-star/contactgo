export const revalidate = 3600

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog de lentes de contacto en RD — ContactGo',
  description: 'Guías, precios, comparativas y consejos sobre lentes de contacto en República Dominicana. ACUVUE, Biofinity, Air Optix y más. Actualizado 2026.',
  alternates: { canonical: 'https://www.contactgo.net/blog' },
  openGraph: {
    type: 'website',
    title: 'Blog ContactGo — Lentes de contacto en República Dominicana',
    description: 'La mayor biblioteca de artículos sobre lentes de contacto en RD. Precios, guías, comparativas y consejos especializados.',
    url: 'https://www.contactgo.net/blog',
    siteName: 'ContactGo',
    locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/og-blog.webp', width: 1200, height: 630, alt: 'Blog ContactGo — Lentes de contacto en RD' }],
  },
}

// ═══════════════════════════════════════════════════════════
// REGISTRO COMPLETO DE ARTÍCULOS
// Añadir cada artículo nuevo aquí → aparece automático
// ═══════════════════════════════════════════════════════════
const POSTS = [
  // ── INTENCIÓN DE COMPRA — PRECIOS ─────────────────────────────────────────
  { slug: 'acuvue-oasys-precio-republica-dominicana', titulo: 'ACUVUE Oasys precio en República Dominicana 2026', desc: 'Precio actualizado de ACUVUE Oasys, Astigmatism y Multifocal en RD. Desde RD$3,875. Entrega 24-48h.', emoji: '💰', cat: 'Precios', mins: 5, fecha: '2026-06-01', hot: true },
  { slug: 'air-optix-hydraglyde-precio-republica-dominicana', titulo: 'Air Optix HydraGlyde precio en RD 2026', desc: 'Precio actual de Air Optix plus HydraGlyde en RD. Desde RD$4,375. Originales Alcon. Entrega 24-48h.', emoji: '💰', cat: 'Precios', mins: 6, fecha: '2026-06-15', hot: true },
  { slug: 'biofinity-precio-republica-dominicana', titulo: 'Biofinity precio en República Dominicana 2026', desc: 'Toda la línea Biofinity en RD: Esférico, Toric, XR, Multifocal. Desde RD$4,750. CooperVision certificados.', emoji: '💰', cat: 'Precios', mins: 7, fecha: '2026-06-15', hot: true },
  { slug: 'acuvue-oasys-for-astigmatism-precio-rd', titulo: 'ACUVUE Oasys for Astigmatism precio RD 2026', desc: 'RD$6,250 la caja de 6. También 1-DAY Moist for Astigmatism disponible. J&J certificados. Entrega 24h.', emoji: '💰', cat: 'Precios', mins: 6, fecha: '2026-06-15', hot: true },
  { slug: 'lentes-astigmatismo-precio-republica-dominicana', titulo: 'Lentes para astigmatismo — Todos los precios en RD 2026', desc: 'Comparativa de precios de todos los lentes tóricos disponibles en RD. ACUVUE, Biofinity, clariti, Avaira.', emoji: '🎯', cat: 'Precios', mins: 8, fecha: '2026-06-20', hot: true },
  { slug: 'lentes-multifocales-precio-republica-dominicana', titulo: 'Lentes multifocales precio en República Dominicana 2026', desc: 'Todos los multifocales disponibles en RD con precio. Biofinity, ACUVUE, Air Optix, Proclear. Desde RD$4,100.', emoji: '🔭', cat: 'Precios', mins: 8, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-colores-precio-republica-dominicana', titulo: 'Lentes de colores precio en RD 2026', desc: 'Air Optix Colors y Lunare precio en RD. Con y sin graduación. Desde RD$2,250. 12 colores disponibles.', emoji: '🎨', cat: 'Precios', mins: 6, fecha: '2026-06-20', hot: true },
  { slug: 'bausch-lomb-ultra-precio-republica-dominicana', titulo: 'Bausch+Lomb ULTRA precio en RD 2026', desc: 'BL ULTRA esférico RD$4,500 · Astigmatism RD$4,000 · Presbyopia RD$4,100. Biotrue ONEday RD$3,500.', emoji: '💰', cat: 'Precios', mins: 6, fecha: '2026-06-20' },
  { slug: 'clariti-1-day-precio-republica-dominicana', titulo: 'clariti 1 day precio en República Dominicana 2026', desc: 'clariti 1 day esférico RD$4,375 · tórico RD$5,750 · multifocal RD$6,000. CooperVision. Entrega 24-48h.', emoji: '💰', cat: 'Precios', mins: 5, fecha: '2026-06-20' },
  { slug: 'acuvue-moist-1-day-precio-republica-dominicana', titulo: '1-DAY ACUVUE Moist precio en RD 2026', desc: '1-DAY ACUVUE Moist 30u RD$3,875. Moist for Astigmatism RD$6,250. J&J certificados. Entrega en 24h.', emoji: '💰', cat: 'Precios', mins: 5, fecha: '2026-06-20' },
  { slug: 'opti-free-puremoist-precio-republica-dominicana', titulo: 'Opti-Free Puremoist precio en RD 2026', desc: 'Opti-Free 90ml RD$750 · 300ml RD$1,450. La solución multipropósito de Alcon. Entrega 24-48h.', emoji: '🧴', cat: 'Soluciones', mins: 5, fecha: '2026-06-20' },
  { slug: 'cuanto-cuestan-lentes-contacto-rd', titulo: '¿Cuánto cuestan los lentes de contacto en RD? Guía 2026', desc: 'Guía completa de precios de todas las marcas en República Dominicana. ACUVUE, Biofinity, Air Optix y más.', emoji: '📊', cat: 'Precios', mins: 6, fecha: '2026-01-15' },

  // ── COMPRA ONLINE ──────────────────────────────────────────────────────────
  { slug: 'comprar-lentes-contacto-online-republica-dominicana', titulo: 'Comprar lentes de contacto online en RD — Guía segura 2026', desc: 'Cómo comprar lentes de contacto por internet en RD con seguridad. Originales, entrega 24-48h y pago con AZUL.', emoji: '🛒', cat: 'Compra', mins: 8, fecha: '2026-06-15', hot: true },
  { slug: 'donde-comprar-lentes-contacto-santo-domingo', titulo: 'Dónde comprar lentes de contacto en Santo Domingo 2026', desc: 'Opciones para comprar lentes certificados en Santo Domingo. Entrega a domicilio en 24-48h.', emoji: '📍', cat: 'Compra', mins: 8, fecha: '2026-06-01' },

  // ── COMPARATIVAS ───────────────────────────────────────────────────────────
  { slug: 'acuvue-oasys-vs-air-optix-hydraglyde', titulo: 'ACUVUE Oasys vs Air Optix HydraGlyde — ¿Cuál elegir?', desc: 'Comparativa completa. Precio, oxígeno, hidratación. La guía definitiva para elegir entre los dos más populares.', emoji: '⚖️', cat: 'Comparativas', mins: 8, fecha: '2026-06-20', hot: true },
  { slug: 'biofinity-vs-acuvue-comparacion', titulo: 'Biofinity vs ACUVUE Oasys — ¿Cuál es mejor en RD?', desc: 'Comparativa completa: precio, oxígeno, hidratación y disponibilidad de los dos más vendidos en RD.', emoji: '⚖️', cat: 'Comparativas', mins: 7, fecha: '2026-05-10' },
  { slug: 'lentes-diarios-vs-mensuales', titulo: 'Lentes diarios vs mensuales — ¿Cuál elegir en RD 2026?', desc: 'Comparativa completa: precio por día, higiene, comodidad. Cuál conviene según tu estilo de vida.', emoji: '🔄', cat: 'Comparativas', mins: 7, fecha: '2026-04-20' },

  // ── GUÍAS PRINCIPIANTES ────────────────────────────────────────────────────
  { slug: 'que-son-los-lentes-de-contacto', titulo: '¿Qué son los lentes de contacto? Guía completa 2026', desc: 'Todo sobre lentes de contacto: qué son, tipos, materiales y cómo funcionan. La guía más completa en español.', emoji: '👁️', cat: 'Guías', mins: 12, fecha: '2026-06-01' },
  { slug: 'como-usar-lentes-de-contacto-primera-vez', titulo: 'Cómo usar lentes de contacto por primera vez', desc: 'Guía paso a paso para principiantes: ponerse, quitarse y cuidar lentes de contacto. Con consejos de especialistas.', emoji: '🎯', cat: 'Guías', mins: 10, fecha: '2026-06-01' },
  { slug: 'primeros-pasos-lentes-contacto-rd', titulo: 'Primeros pasos con lentes de contacto en República Dominicana', desc: 'Todo lo que necesitas saber antes de comprar tu primer par de lentes en RD.', emoji: '🌟', cat: 'Guías', mins: 7, fecha: '2026-03-01' },
  { slug: 'como-poner-lentes-de-contacto', titulo: 'Cómo poner y quitar lentes de contacto paso a paso', desc: 'Tutorial completo para principiantes. Técnica correcta, errores comunes y consejos prácticos.', emoji: '🤲', cat: 'Guías', mins: 4, fecha: '2026-02-15' },
  { slug: 'tipos-de-lentes-de-contacto', titulo: 'Tipos de lentes de contacto — ¿Cuál es el correcto para ti?', desc: 'Diferencias entre esféricos, tóricos, multifocales y de color. Cómo elegir según tu diagnóstico.', emoji: '🔍', cat: 'Educación', mins: 5, fecha: '2026-02-01' },
  { slug: 'como-leer-receta-optica-rd', titulo: 'Cómo leer tu receta óptica — Guía visual completa', desc: 'SPH, CYL, AXIS, ADD, BC, DIA — qué significa cada valor de tu prescripción. En español simple.', emoji: '📋', cat: 'Guías', mins: 5, fecha: '2026-01-20' },

  // ── SALUD OCULAR ───────────────────────────────────────────────────────────
  { slug: 'dormir-con-lentes-de-contacto-riesgos', titulo: '¿Qué pasa si duermes con lentes de contacto? Riesgos reales', desc: 'Los peligros médicos de dormir con lentes puestos y qué hacer si se te olvidó quitártelos.', emoji: '⚠️', cat: 'Salud ocular', mins: 9, fecha: '2026-06-01' },
  { slug: 'dormir-con-lentes-contacto', titulo: '¿Puedo dormir con lentes de contacto? La verdad médica', desc: 'Todo sobre los riesgos de dormir con lentes y qué hacer si te quedaste dormido con ellos puestos.', emoji: '😴', cat: 'Salud ocular', mins: 5, fecha: '2026-01-10' },
  { slug: 'ojos-secos-lentes-contacto', titulo: 'Ojos secos y lentes de contacto — Soluciones reales', desc: '¿Sientes sequedad con tus lentes? Los mejores lentes y gotas para ojos secos disponibles en RD.', emoji: '💧', cat: 'Salud ocular', mins: 5, fecha: '2026-03-15' },
  { slug: 'cuanto-duran-lentes-contacto', titulo: '¿Cuánto duran los lentes de contacto? Guía completa', desc: 'Diarios, quincenales y mensuales: cuándo cambiarlos y cómo sacarles el máximo provecho.', emoji: '📅', cat: 'Cuidado', mins: 5, fecha: '2026-03-05' },

  // ── CATEGORÍAS ESPECÍFICAS ─────────────────────────────────────────────────
  { slug: 'lentes-contacto-para-astigmatismo', titulo: 'Lentes para astigmatismo en RD — Precios y marcas 2026', desc: 'Guía completa de lentes tóricos en RD. ACUVUE, Biofinity Toric, clariti y más con precios actualizados.', emoji: '🎯', cat: 'Astigmatismo', mins: 8, fecha: '2026-05-01' },
  { slug: 'lentes-de-contacto-para-astigmatismo-rd', titulo: 'Lentes de contacto para astigmatismo en República Dominicana', desc: 'Guía de lentes tóricos en RD: cómo funcionan, marcas disponibles y por qué son diferentes a los normales.', emoji: '🎯', cat: 'Astigmatismo', mins: 6, fecha: '2026-02-20' },
  { slug: 'lentes-multifocales-presbicia-rd', titulo: 'Lentes multifocales para presbicia en RD — Guía 2026', desc: 'Todo sobre lentes de contacto multifocales en RD. Biofinity Multi, ACUVUE Multi, Proclear y más.', emoji: '🔭', cat: 'Presbicia', mins: 6, fecha: '2026-03-20' },
  { slug: 'lentes-contacto-colores-rd', titulo: 'Lentes de contacto de colores en República Dominicana', desc: 'Air Optix Colors y Lunare — con y sin graduación. Los colores más populares y cómo elegirlos.', emoji: '🎨', cat: 'Color', mins: 4, fecha: '2026-04-01' },
  { slug: 'lentes-contacto-ninos-adolescentes-rd', titulo: 'Lentes de contacto para niños y adolescentes en RD', desc: 'Guía para padres: edad recomendada, tipos de lentes para jóvenes y reglas de uso seguro.', emoji: '👶', cat: 'Guías', mins: 7, fecha: '2026-04-15' },

  // ── CUIDADO Y MANTENIMIENTO ────────────────────────────────────────────────
  { slug: 'solucion-limpieza-lentes-contacto', titulo: 'Cómo elegir la mejor solución para lentes de contacto', desc: 'Opti-Free, Dream Eye, Prolub — cuál usar según tu tipo de lente y cómo limpiarlos correctamente.', emoji: '🧴', cat: 'Cuidado', mins: 4, fecha: '2026-04-10' },


  // ── SPRINT 3 — 15 ARTÍCULOS DE INTENCIÓN DE BÚSQUEDA ─────────────────────
  // Gotas oculares
  { slug: 'refresh-optive-precio-republica-dominicana', titulo: 'Refresh Optive precio en República Dominicana 2026', desc: 'Refresh Optive Lubricant RD$900 · Advanced RD$1,000. Para ojos secos. Compatible con lentes. Entrega 24-48h.', emoji: '💧', cat: 'Precios', mins: 7, fecha: '2026-06-28', hot: true },
  { slug: 'refresh-tears-precio-republica-dominicana', titulo: 'Refresh Tears precio en República Dominicana 2026', desc: 'Refresh Tears Lubricant Eye Drops en RD: RD$800. Lágrimas artificiales Allergan. Compatible con lentes. Entrega 24h.', emoji: '💧', cat: 'Precios', mins: 6, fecha: '2026-06-28' },
  { slug: 'manzanilla-sophia-precio-republica-dominicana', titulo: 'Manzanilla Sophia precio en República Dominicana 2026', desc: 'Precio de Manzanilla Sophia en RD: RD$600. Para qué sirve y si es compatible con lentes de contacto.', emoji: '🌿', cat: 'Precios', mins: 6, fecha: '2026-06-28' },
  { slug: 'gotas-para-ojos-secos-republica-dominicana', titulo: 'Las mejores gotas para ojos secos en RD 2026', desc: 'Comparativa completa de todas las gotas para ojo seco disponibles en RD. Refresh Optive, Tears, Prolub, Manzanilla Sophia.', emoji: '💧', cat: 'Salud ocular', mins: 9, fecha: '2026-06-28', hot: true },
  // Lentes especializados
  { slug: 'avaira-vitality-precio-republica-dominicana', titulo: 'Avaira Vitality precio en República Dominicana 2026', desc: 'Avaira Vitality esférico RD$3,690 · tórico RD$4,875. El mensual más económico de CooperVision en RD.', emoji: '💰', cat: 'Precios', mins: 6, fecha: '2026-06-28' },
  { slug: 'lentes-contacto-ojos-secos-republica-dominicana', titulo: 'Los mejores lentes de contacto para ojos secos en RD 2026', desc: 'Air Optix HydraGlyde, ACUVUE Oasys, Biofinity, BL ULTRA — los 5 mejores para sequedad ocular con ranking y precios.', emoji: '💧', cat: 'Salud ocular', mins: 9, fecha: '2026-06-28', hot: true },
  { slug: 'biotrue-oneday-precio-republica-dominicana', titulo: 'Biotrue ONEday precio en República Dominicana 2026', desc: 'Biotrue ONEday Bausch+Lomb en RD: RD$3,500 caja de 30. Lente diario con HyperGel 78% agua. Entrega 24-48h.', emoji: '💰', cat: 'Precios', mins: 6, fecha: '2026-06-28' },
  { slug: 'proclear-multifocal-precio-republica-dominicana', titulo: 'Proclear Multifocal precio en República Dominicana 2026', desc: 'Proclear Multifocal RD$7,250 · XR RD$18,500 · Toric RD$20,000. CooperVision para presbicia. Entrega 24-48h.', emoji: '💰', cat: 'Precios', mins: 6, fecha: '2026-06-28' },
  // Para turistas
  { slug: 'contact-lenses-dominican-republic', titulo: 'Contact Lenses in Dominican Republic — Same Day Delivery', desc: 'Buy ACUVUE, Biofinity, Air Optix contact lenses in DR with delivery to your hotel in 24-48 hours. Punta Cana, Santo Domingo.', emoji: '🇺🇸', cat: 'Para turistas', mins: 8, fecha: '2026-06-28', hot: true },
  { slug: 'forgot-contact-lenses-punta-cana', titulo: 'Forgot Your Contact Lenses in Punta Cana? We Deliver', desc: 'Emergency contact lens delivery to your hotel in Punta Cana, Bávaro and Cap Cana in 24-48 hours. Order online or WhatsApp.', emoji: '🚨', cat: 'Para turistas', mins: 6, fecha: '2026-06-28', hot: true },
  // Salud y embarazo
  { slug: 'lentes-contacto-embarazo-republica-dominicana', titulo: '¿Puedo usar lentes de contacto en el embarazo?', desc: 'Los cambios oculares durante el embarazo, qué lentes son más cómodos y cuándo consultar al médico. Guía médica 2026.', emoji: '🤰', cat: 'Salud ocular', mins: 8, fecha: '2026-06-28' },
  { slug: 'cuantas-horas-usar-lentes-contacto', titulo: '¿Cuántas horas al día puedo usar lentes de contacto?', desc: 'Límites de uso por tipo de lente, señales de alarma y cómo extender el tiempo de uso cómodamente. Guía médica.', emoji: '⏱️', cat: 'Salud ocular', mins: 8, fecha: '2026-06-28' },
  // Comparativas
  { slug: 'biofinity-toric-vs-acuvue-oasys-astigmatism', titulo: 'Biofinity Toric vs ACUVUE Oasys for Astigmatism — ¿Cuál elegir?', desc: 'Comparativa completa: precio, oxígeno, estabilización y cuál es mejor para tu astigmatismo en RD.', emoji: '⚖️', cat: 'Comparativas', mins: 9, fecha: '2026-06-28', hot: true },
  // Guías de uso
  { slug: 'lentes-contacto-deporte-actividad-fisica', titulo: 'Lentes de contacto para deporte y actividad física', desc: 'Qué lentes elegir para gym, running, fútbol y cada deporte. Lo que nunca debes hacer (nadar con lentes).', emoji: '🏃', cat: 'Guías', mins: 8, fecha: '2026-06-28' },
  { slug: 'lentes-contacto-computadora-pantallas', titulo: 'Lentes de contacto para trabajar con computadora', desc: 'Los mejores lentes para reducir la fatiga ocular digital. Regla 20-20-20, gotas lubricantes y consejos prácticos.', emoji: '💻', cat: 'Guías', mins: 8, fecha: '2026-06-28' },

  // ── ENTREGA POR CIUDAD ─────────────────────────────────────────────────────
  { slug: 'lentes-contacto-toda-republica-dominicana', titulo: 'Lentes de contacto con entrega en toda República Dominicana', desc: 'Entrega en las 31 provincias de RD. ACUVUE, Biofinity, Air Optix certificados. 24-72h donde estés.', emoji: '🇩🇴', cat: 'Entrega', mins: 5, fecha: '2026-06-20', hot: true },
  { slug: 'lentes-contacto-punta-cana-entrega', titulo: 'Lentes de contacto en Punta Cana — Entrega a domicilio', desc: 'Entrega en Punta Cana, Bávaro y Cap Cana en 24-48h. ACUVUE, Biofinity, Air Optix certificados.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-santiago-republica-dominicana', titulo: 'Lentes de contacto en Santiago — Entrega 24h', desc: 'Entrega en Santiago de los Caballeros en 24 horas. Originales con pago seguro AZUL.', emoji: '📍', cat: 'Entrega', mins: 5, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-san-pedro-macoris', titulo: 'Lentes de contacto en San Pedro de Macorís', desc: 'Entrega de lentes certificados en San Pedro de Macorís en 24-48h.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-la-romana', titulo: 'Lentes de contacto en La Romana — Entrega a domicilio', desc: 'Lentes de contacto con entrega en La Romana y Casa de Campo en 24-48h.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-san-francisco-macoris', titulo: 'Lentes de contacto en San Francisco de Macorís', desc: 'Entrega en San Francisco de Macorís y el Cibao oriental en 24-48h.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-puerto-plata', titulo: 'Lentes de contacto en Puerto Plata — Entrega 24-48h', desc: 'Entrega en Puerto Plata, Sosúa y Cabarete. ACUVUE, Air Optix certificados.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-la-vega', titulo: 'Lentes de contacto en La Vega — Entrega a domicilio', desc: 'Entrega de lentes certificados en La Vega y Constanza en 24-48h.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-higuey', titulo: 'Lentes de contacto en Higüey — Entrega 24-48h', desc: 'Lentes con entrega en Higüey y La Altagracia. Biofinity, ACUVUE certificados.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-bani-peravia', titulo: 'Lentes de contacto en Baní — Entrega a domicilio', desc: 'Entrega de lentes certificados en Baní y provincia de Peravia en 24-48h.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-san-cristobal', titulo: 'Lentes de contacto en San Cristóbal — Entrega 24-48h', desc: 'Lentes con entrega en San Cristóbal y el sur. sellados de fábrica. Pago con AZUL.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-moca-espaillat', titulo: 'Lentes de contacto en Moca — Entrega a domicilio', desc: 'Entrega en Moca y provincia de Espaillat. ACUVUE, Biofinity, Air Optix certificados.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-azua', titulo: 'Lentes de contacto en Azua — Entrega 24-48h', desc: 'Lentes con entrega en Azua de Compostela y el sur occidental.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-barahona', titulo: 'Lentes de contacto en Barahona — Entrega a domicilio', desc: 'Entrega de lentes certificados en Barahona y la costa sur dominicana.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-monte-plata', titulo: 'Lentes de contacto en Monte Plata — Entrega 24-48h', desc: 'Lentes con entrega en Monte Plata y sus municipios.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-hato-mayor', titulo: 'Lentes de contacto en Hato Mayor — Entrega a domicilio', desc: 'Entrega de lentes certificados en Hato Mayor del Rey y alrededores.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-el-seibo', titulo: 'Lentes de contacto en El Seibo — Entrega 24-48h', desc: 'Lentes con entrega en El Seibo y Santa Cruz del Seibo.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-samana', titulo: 'Lentes de contacto en Samaná — Entrega a domicilio', desc: 'Entrega en Samaná, Las Terrenas y Los Haitises. Originales con AZUL.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-nagua', titulo: 'Lentes de contacto en Nagua — Entrega 24-48h', desc: 'Lentes con entrega en Nagua y la costa atlántica. Originales garantizados.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-bonao', titulo: 'Lentes de contacto en Bonao — Entrega a domicilio', desc: 'Entrega de lentes certificados en Bonao y la provincia de Monseñor Nouel.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-cotui', titulo: 'Lentes de contacto en Cotuí — Entrega 24-48h', desc: 'Lentes con entrega en Cotuí y Sánchez Ramírez.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-san-juan-maguana', titulo: 'Lentes de contacto en San Juan de la Maguana', desc: 'Entrega en San Juan de la Maguana y la región del Valle.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-mao-valverde', titulo: 'Lentes de contacto en Mao — Entrega 24-48h', desc: 'Lentes con entrega en Mao y la provincia de Valverde.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-monte-cristi', titulo: 'Lentes de contacto en Monte Cristi — Entrega a domicilio', desc: 'Entrega de lentes certificados en Monte Cristi y el noroeste.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-dajabon', titulo: 'Lentes de contacto en Dajabón — Entrega 24-48h', desc: 'Lentes con entrega en Dajabón y la frontera norte.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-neyba', titulo: 'Lentes de contacto en Neyba — Entrega a domicilio', desc: 'Entrega en Neyba y la provincia de Baoruco.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-jimani', titulo: 'Lentes de contacto en Jimaní — Entrega 24-48h', desc: 'Lentes con entrega en Jimaní y la provincia de Independencia.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-comendador', titulo: 'Lentes de contacto en Comendador — Entrega a domicilio', desc: 'Entrega en Comendador y la provincia de Elías Piña.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-pedernales', titulo: 'Lentes de contacto en Pedernales — Entrega 24-48h', desc: 'Lentes con entrega en Pedernales y el extremo sur.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-constanza', titulo: 'Lentes de contacto en Constanza — Entrega a domicilio', desc: 'Entrega en Constanza y la cordillera central.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
  { slug: 'lentes-contacto-distrito-nacional', titulo: 'Lentes de contacto en el Distrito Nacional — Entrega 24h', desc: 'Entrega en el Distrito Nacional y Ciudad de Santo Domingo en 24h.', emoji: '📍', cat: 'Entrega', mins: 4, fecha: '2026-06-20' },
] as const

type Post = typeof POSTS[number]

const CATS = ['Todos', 'Precios', 'Compra', 'Comparativas', 'Astigmatismo', 'Presbicia', 'Color', 'Guías', 'Salud ocular', 'Cuidado', 'Soluciones', 'Educación', 'Entrega']

export default function BlogPage({ searchParams }: { searchParams?: { categoria?: string } }) {
  const catActiva = searchParams?.categoria ?? 'Todos'
  const posts: readonly Post[] = catActiva === 'Todos' ? POSTS : POSTS.filter(p => p.cat === catActiva)
  const destacados = POSTS.filter(p => (p as any).hot)
  const articulosFeatured = POSTS.filter(p => p.cat !== 'Entrega' && (p as any).hot).slice(0, 3)
  const porCiudad = POSTS.filter(p => p.cat === 'Entrega')

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10 pb-24">

        {/* ── HEADER PREMIUM ── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-6 bg-primary-600 rounded-full inline-block" />
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">ContactGo Blog</span>
          </div>
          <h1 className="font-display text-4xl font-black text-gray-900 leading-tight mb-3">
            Guías de lentes de<br className="hidden sm:block" /> contacto en República Dominicana
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            {POSTS.filter(p => p.cat !== 'Entrega').length} artículos especializados · Precios actualizados junio 2026 · Entrega en toda RD
          </p>
        </div>

        {/* ── FEATURED — solo cuando catActiva=Todos ── */}
        {catActiva === 'Todos' && (
          <div className="mb-10">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Más buscados ahora</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {articulosFeatured.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="group relative bg-gradient-to-br from-primary-600 to-teal-600 rounded-2xl p-4 hover:from-primary-700 hover:to-teal-700 transition-all overflow-hidden">
                  <div className="absolute top-0 right-0 text-6xl opacity-10 -mt-2 -mr-2">{post.emoji}</div>
                  <span className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">{post.cat}</span>
                  <h2 className="text-white font-bold text-sm leading-tight mt-1 mb-2 line-clamp-2">{post.titulo}</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="text-primary-200 text-[11px]">⏱ {post.mins} min</span>
                    <span className="text-primary-300">·</span>
                    <span className="text-primary-200 text-[11px] group-hover:text-white transition-colors">Leer →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── FILTROS DE CATEGORÍA ── */}
        <div className="mb-6 overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 pb-1" style={{minWidth: 'max-content'}}>
            {CATS.map(cat => (
              <Link key={cat} href={cat === 'Todos' ? '/blog' : `/blog?categoria=${encodeURIComponent(cat)}`}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  catActiva === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* ── ARTÍCULOS DE CONTENIDO (no ciudades) ── */}
        {(catActiva === 'Todos' || catActiva !== 'Entrega') && (
          <>
            {catActiva === 'Todos' && (
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                Todos los artículos ({posts.filter(p => p.cat !== 'Entrega').length})
              </p>
            )}
            <div className="space-y-2 mb-8">
              {posts.filter(p => p.cat !== 'Entrega').map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                  <div className="w-10 h-10 bg-gray-50 group-hover:bg-white rounded-xl flex items-center justify-center text-xl shrink-0 border border-gray-100 group-hover:border-gray-200 transition-all">
                    {post.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{post.cat}</span>
                      {'hot' in post && (post as any).hot && (
                        <span className="text-[9px] font-black text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full">★ TOP</span>
                      )}
                    </div>
                    <h2 className="font-semibold text-gray-900 text-sm leading-snug mb-0.5 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {post.titulo}
                    </h2>
                    <p className="text-xs text-gray-400 line-clamp-1">{post.desc}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className="text-[11px] text-gray-300">{post.mins}m</span>
                    <svg className="w-4 h-4 text-gray-200 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ── SECCIÓN CIUDADES ── */}
        {(catActiva === 'Todos' || catActiva === 'Entrega') && (
          <div className="mt-4">
            <div className="border-t border-gray-100 pt-8 mb-5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Entrega en toda República Dominicana</p>
              <p className="text-sm text-gray-500">Lentes de contacto certificados con entrega a domicilio en las 31 provincias</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {porCiudad.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                  <span className="text-base">{post.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 group-hover:text-primary-600 transition-colors truncate">
                      {post.titulo.replace('Lentes de contacto en ', '').replace(' — Entrega 24-48h', '').replace(' — Entrega a domicilio', '').replace(' — Entrega 24h', '').replace('Lentes de contacto con entrega en ', '')}
                    </p>
                    <p className="text-[10px] text-gray-400">Entrega 24-48h</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA FINAL ── */}
        <div className="mt-12 bg-gray-900 rounded-2xl p-6 text-center">
          <p className="text-white font-bold text-lg mb-1">¿Listo para comprar?</p>
          <p className="text-gray-400 text-sm mb-4">35+ lentes certificados · Entrega 24-48h · Pago con AZUL</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/catalogo" className="bg-white text-gray-900 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-100 transition-colors">
              Ver catálogo →
            </Link>
            <Link href="/receta" className="bg-primary-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-primary-700 transition-colors">
              Calcular mi receta gratis
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
