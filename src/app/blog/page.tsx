export const revalidate = 3600

import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { promises as fs } from 'fs'
import path from 'path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.contactgo.net/blog' },
  title: 'Blog de lentes de contacto en RD — ContactGo',
  description: 'Guías, comparativas, precios y consejos sobre lentes de contacto en República Dominicana. ACUVUE, Biofinity, Air Optix y más.',
  openGraph: {
    title: 'Blog ContactGo — Guías de lentes de contacto en RD',
    description: 'Guías, comparativas y precios de lentes de contacto en República Dominicana.',
    url: 'https://www.contactgo.net/blog',
    siteName: 'ContactGo',
    locale: 'es_DO',
    type: 'website',
  },
}

// ═══════════════════════════════════════════════════════════════════
// REGISTRO COMPLETO DE ARTÍCULOS
// Agregar aquí cada artículo nuevo — el índice se actualiza solo
// ═══════════════════════════════════════════════════════════════════
const POSTS: {
  slug: string
  titulo: string
  descripcion: string
  emoji: string
  categoria: string
  tiempo: string
  fecha: string
  destacado?: boolean
}[] = [
  // ── PRECIOS — INTENCIÓN DE COMPRA ─────────────────────────────────
  {
    slug: 'acuvue-oasys-precio-republica-dominicana',
    titulo: 'ACUVUE Oasys precio en República Dominicana 2026',
    descripcion: 'Precio actual del ACUVUE Oasys en RD. Esférico, Astigmatism y Multifocal. Entrega 24-48h. Originales J&J.',
    emoji: '💰', categoria: 'Precios', tiempo: '5 min', fecha: '2026-06-01', destacado: true,
  },
  {
    slug: 'air-optix-hydraglyde-precio-republica-dominicana',
    titulo: 'Air Optix HydraGlyde precio en RD 2026',
    descripcion: 'Precio del Air Optix plus HydraGlyde en República Dominicana. Desde RD$4,375. Entrega 24-48h. Originales Alcon.',
    emoji: '💰', categoria: 'Precios', tiempo: '6 min', fecha: '2026-06-15', destacado: true,
  },
  {
    slug: 'biofinity-precio-republica-dominicana',
    titulo: 'Biofinity precio en República Dominicana 2026',
    descripcion: 'Todos los precios de la línea Biofinity en RD: Esférico, XR, Toric, XR Toric y Multifocal. CooperVision originales.',
    emoji: '💰', categoria: 'Precios', tiempo: '7 min', fecha: '2026-06-15', destacado: true,
  },
  {
    slug: 'acuvue-oasys-for-astigmatism-precio-rd',
    titulo: 'ACUVUE Oasys for Astigmatism precio RD 2026',
    descripcion: 'Precio de ACUVUE Oasys for Astigmatism y 1-DAY Moist for Astigmatism en RD. Desde RD$6,250. Entrega 24h.',
    emoji: '💰', categoria: 'Precios', tiempo: '6 min', fecha: '2026-06-15', destacado: true,
  },
  {
    slug: 'cuanto-cuestan-lentes-contacto-rd',
    titulo: '¿Cuánto cuestan los lentes de contacto en RD 2026?',
    descripcion: 'Guía completa de precios de todas las marcas en República Dominicana. ACUVUE, Biofinity, Air Optix y más.',
    emoji: '📊', categoria: 'Precios', tiempo: '6 min', fecha: '2026-01-15',
  },
  // ── COMPRA ONLINE ──────────────────────────────────────────────────
  {
    slug: 'comprar-lentes-contacto-online-republica-dominicana',
    titulo: 'Comprar lentes de contacto online en RD — Guía 2026',
    descripcion: 'Cómo comprar lentes de contacto por internet en RD de forma segura. Originales, entrega 24-48h y pago con AZUL.',
    emoji: '🛒', categoria: 'Compra', tiempo: '8 min', fecha: '2026-06-15', destacado: true,
  },
  {
    slug: 'donde-comprar-lentes-contacto-santo-domingo',
    titulo: 'Dónde comprar lentes de contacto en Santo Domingo 2026',
    descripcion: 'Opciones para comprar lentes de contacto originales en Santo Domingo. Entrega a domicilio en 24-48h.',
    emoji: '📍', categoria: 'Compra', tiempo: '8 min', fecha: '2026-06-01',
  },
  // ── COMPARATIVAS ───────────────────────────────────────────────────
  {
    slug: 'biofinity-vs-acuvue-comparacion',
    titulo: 'Biofinity vs ACUVUE Oasys — ¿Cuál es mejor en RD?',
    descripcion: 'Comparativa completa: precio, oxígeno, hidratación y disponibilidad de las dos marcas más vendidas en República Dominicana.',
    emoji: '⚖️', categoria: 'Comparativas', tiempo: '7 min', fecha: '2026-05-10',
  },
  {
    slug: 'lentes-diarios-vs-mensuales',
    titulo: 'Lentes diarios vs mensuales — ¿Cuál elegir en RD 2026?',
    descripcion: 'Comparativa completa: precio por día, higiene, comodidad y cuál tipo conviene según tu estilo de vida.',
    emoji: '🔄', categoria: 'Comparativas', tiempo: '7 min', fecha: '2026-04-20',
  },
  // ── GUÍAS PRINCIPIANTES ────────────────────────────────────────────
  {
    slug: 'que-son-los-lentes-de-contacto',
    titulo: '¿Qué son los lentes de contacto? Guía completa 2026',
    descripcion: 'Todo sobre los lentes de contacto: qué son, tipos, materiales y cómo funcionan. La guía más completa en español.',
    emoji: '👁️', categoria: 'Guías', tiempo: '12 min', fecha: '2026-06-01',
  },
  {
    slug: 'como-usar-lentes-de-contacto-primera-vez',
    titulo: 'Cómo usar lentes de contacto por primera vez — Guía 2026',
    descripcion: 'Guía paso a paso: cómo ponerse, quitarse y cuidar los lentes de contacto la primera vez. Para principiantes.',
    emoji: '🎯', categoria: 'Guías', tiempo: '10 min', fecha: '2026-06-01',
  },
  {
    slug: 'primeros-pasos-lentes-contacto-rd',
    titulo: 'Primeros pasos con lentes de contacto en República Dominicana',
    descripcion: 'Todo lo que necesitas saber antes de comprar tu primer par de lentes de contacto en RD.',
    emoji: '🌟', categoria: 'Guías', tiempo: '7 min', fecha: '2026-03-01',
  },
  {
    slug: 'como-poner-lentes-de-contacto',
    titulo: 'Cómo poner y quitar lentes de contacto paso a paso',
    descripcion: 'Tutorial completo para principiantes. Técnica correcta, errores comunes y consejos de especialistas.',
    emoji: '🤲', categoria: 'Guías', tiempo: '4 min', fecha: '2026-02-15',
  },
  {
    slug: 'tipos-de-lentes-de-contacto',
    titulo: 'Tipos de lentes de contacto — ¿Cuál es el correcto para ti?',
    descripcion: 'Diferencias entre esféricos, tóricos, multifocales y de color. Cómo elegir según tu diagnóstico.',
    emoji: '🔍', categoria: 'Educación', tiempo: '5 min', fecha: '2026-02-01',
  },
  {
    slug: 'como-leer-receta-optica-rd',
    titulo: 'Cómo leer tu receta óptica — Guía visual completa',
    descripcion: 'SPH, CYL, AXIS, ADD, BC, DIA... qué significa cada valor de tu prescripción. En español simple.',
    emoji: '📋', categoria: 'Guías', tiempo: '5 min', fecha: '2026-01-20',
  },
  // ── SALUD OCULAR ───────────────────────────────────────────────────
  {
    slug: 'dormir-con-lentes-de-contacto-riesgos',
    titulo: 'Dormir con lentes de contacto: riesgos reales 2026',
    descripcion: 'Los peligros médicos de dormir con lentes puestos. Qué hacer si se te olvidó quitártelos. Guía médica.',
    emoji: '⚠️', categoria: 'Salud ocular', tiempo: '9 min', fecha: '2026-06-01',
  },
  {
    slug: 'dormir-con-lentes-contacto',
    titulo: '¿Puedo dormir con lentes de contacto? Riesgos reales',
    descripcion: 'Todo sobre los riesgos de dormir con lentes de contacto y qué hacer si te quedaste dormido con ellos.',
    emoji: '😴', categoria: 'Salud ocular', tiempo: '5 min', fecha: '2026-01-10',
  },
  {
    slug: 'ojos-secos-lentes-contacto',
    titulo: 'Ojos secos y lentes de contacto — Soluciones reales',
    descripcion: '¿Sientes sequedad con tus lentes? Los mejores lentes y gotas para ojos secos disponibles en RD.',
    emoji: '💧', categoria: 'Salud ocular', tiempo: '5 min', fecha: '2026-03-15',
  },
  // ── CATEGORÍAS ESPECÍFICAS ─────────────────────────────────────────
  {
    slug: 'lentes-contacto-para-astigmatismo',
    titulo: 'Lentes para astigmatismo en RD — Precios y marcas 2026',
    descripcion: 'Guía completa de lentes tóricos en República Dominicana. ACUVUE, Biofinity Toric, clariti y más con precios.',
    emoji: '🎯', categoria: 'Astigmatismo', tiempo: '8 min', fecha: '2026-05-01',
  },
  {
    slug: 'lentes-de-contacto-para-astigmatismo-rd',
    titulo: 'Lentes de contacto para astigmatismo en República Dominicana',
    descripcion: 'Guía de lentes tóricos en RD: cómo funcionan, marcas disponibles y por qué son diferentes a los normales.',
    emoji: '🎯', categoria: 'Astigmatismo', tiempo: '6 min', fecha: '2026-02-20',
  },
  {
    slug: 'lentes-multifocales-presbicia-rd',
    titulo: 'Lentes multifocales para presbicia en RD — Guía 2026',
    descripcion: 'Todo sobre lentes de contacto multifocales en República Dominicana. Biofinity Multi, ACUVUE Multi, Proclear.',
    emoji: '🔭', categoria: 'Presbicia', tiempo: '6 min', fecha: '2026-03-20',
  },
  {
    slug: 'lentes-contacto-colores-rd',
    titulo: 'Lentes de contacto de colores en República Dominicana',
    descripcion: 'Air Optix Colors, Lunare — con y sin graduación. Los colores más populares y cómo elegir el tuyo.',
    emoji: '🎨', categoria: 'Color', tiempo: '4 min', fecha: '2026-04-01',
  },
  {
    slug: 'lentes-contacto-ninos-adolescentes-rd',
    titulo: 'Lentes de contacto para niños y adolescentes en RD',
    descripcion: 'Guía para padres: edad recomendada, tipos de lentes para jóvenes y reglas de uso seguro.',
    emoji: '👶', categoria: 'Guías', tiempo: '7 min', fecha: '2026-04-15',
  },

  // ── PRECIOS INTENCIÓN DE COMPRA — Sprint 2 ────────────────────────────────
  {
    slug: 'lentes-contacto-colores-precio-republica-dominicana',
    titulo: 'Lentes de contacto de colores precio en RD 2026',
    descripcion: 'Air Optix Colors y Lunare precio en RD. Con y sin graduación. Desde RD$2,250. Entrega 24-48h.',
    emoji: '🎨', categoria: 'Precios', tiempo: '6 min', fecha: '2026-06-20', destacado: true,
  },
  {
    slug: 'lentes-astigmatismo-precio-republica-dominicana',
    titulo: 'Lentes para astigmatismo precio en RD 2026 — Guía completa',
    descripcion: 'Todos los lentes tóricos con precio en RD. ACUVUE, Biofinity Toric, clariti, Avaira. Desde RD$4,000.',
    emoji: '🎯', categoria: 'Astigmatismo', tiempo: '8 min', fecha: '2026-06-20', destacado: true,
  },
  {
    slug: 'lentes-multifocales-precio-republica-dominicana',
    titulo: 'Lentes multifocales precio en República Dominicana 2026',
    descripcion: 'Todos los multifocales con precio en RD. Biofinity, ACUVUE, Air Optix, Proclear. Desde RD$4,100.',
    emoji: '🔭', categoria: 'Presbicia', tiempo: '8 min', fecha: '2026-06-20',
  },
  {
    slug: 'bausch-lomb-ultra-precio-republica-dominicana',
    titulo: 'Bausch+Lomb ULTRA precio en República Dominicana 2026',
    descripcion: 'ULTRA esférico RD$4,500 · Astigmatism RD$4,000 · Presbyopia RD$4,100. Originales B+L. Entrega 24h.',
    emoji: '💰', categoria: 'Precios', tiempo: '6 min', fecha: '2026-06-20',
  },
  {
    slug: 'clariti-1-day-precio-republica-dominicana',
    titulo: 'clariti 1 day precio en República Dominicana 2026',
    descripcion: 'clariti 1 day esférico RD$4,375 · tórico RD$5,750 · multifocal RD$6,000. CooperVision originales.',
    emoji: '💰', categoria: 'Precios', tiempo: '5 min', fecha: '2026-06-20',
  },
  {
    slug: 'acuvue-moist-1-day-precio-republica-dominicana',
    titulo: '1-DAY ACUVUE Moist precio en República Dominicana 2026',
    descripcion: '1-DAY ACUVUE Moist 30u RD$3,875. Moist for Astigmatism RD$6,250. J&J originales. Entrega 24h.',
    emoji: '💰', categoria: 'Precios', tiempo: '5 min', fecha: '2026-06-20',
  },
  {
    slug: 'opti-free-puremoist-precio-republica-dominicana',
    titulo: 'Opti-Free Puremoist precio en República Dominicana 2026',
    descripcion: 'Opti-Free 90ml RD$750 · 300ml RD$1,450. La mejor solución multipropósito. Entrega 24-48h en RD.',
    emoji: '🧴', categoria: 'Soluciones', tiempo: '5 min', fecha: '2026-06-20',
  },
  {
    slug: 'acuvue-oasys-vs-air-optix-hydraglyde',
    titulo: 'ACUVUE Oasys vs Air Optix HydraGlyde — ¿Cuál elegir 2026?',
    descripcion: 'Comparativa completa en RD. Precio, oxígeno, hidratación. Qué comprar según tu uso diario.',
    emoji: '⚖️', categoria: 'Comparativas', tiempo: '8 min', fecha: '2026-06-20', destacado: true,
  },
  // ── SEO LOCAL — 31 CIUDADES/PROVINCIAS ────────────────────────────────────
  {
    slug: 'lentes-contacto-punta-cana-entrega',
    titulo: 'Lentes de contacto en Punta Cana — Entrega a domicilio',
    descripcion: 'Lentes de contacto con entrega en Punta Cana, Bávaro y Cap Cana. 24-48h. Originales.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-santiago-republica-dominicana',
    titulo: 'Lentes de contacto en Santiago — Entrega 24h',
    descripcion: 'Lentes con entrega en Santiago de los Caballeros en 24h. ACUVUE, Biofinity, Air Optix originales.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '5 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-san-pedro-macoris',
    titulo: 'Lentes de contacto en San Pedro de Macorís — Entrega 24-48h',
    descripcion: 'Entrega de lentes de contacto originales en San Pedro de Macorís y provincia. Pago con AZUL.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-la-romana',
    titulo: 'Lentes de contacto en La Romana — Entrega a domicilio',
    descripcion: 'Lentes de contacto con entrega en La Romana y Casa de Campo. ACUVUE, Biofinity originales.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-san-francisco-macoris',
    titulo: 'Lentes de contacto en San Francisco de Macorís',
    descripcion: 'Entrega de lentes originales en San Francisco de Macorís y el Cibao oriental. 24-48h.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-puerto-plata',
    titulo: 'Lentes de contacto en Puerto Plata — Entrega 24-48h',
    descripcion: 'Lentes con entrega en Puerto Plata, Sosúa y Cabarete. ACUVUE, Air Optix originales.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-la-vega',
    titulo: 'Lentes de contacto en La Vega — Entrega a domicilio',
    descripcion: 'Entrega de lentes de contacto en La Vega y Constanza. Originales con pago seguro AZUL.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-higuey',
    titulo: 'Lentes de contacto en Higüey — Entrega 24-48h',
    descripcion: 'Lentes de contacto con entrega en Higüey y La Altagracia. Biofinity, ACUVUE originales.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-bani-peravia',
    titulo: 'Lentes de contacto en Baní — Entrega a domicilio',
    descripcion: 'Entrega de lentes originales en Baní y provincia de Peravia. Sin salir de casa.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-san-cristobal',
    titulo: 'Lentes de contacto en San Cristóbal — Entrega 24-48h',
    descripcion: 'Lentes de contacto con entrega en San Cristóbal y el sur. 100% originales. Pago con AZUL.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-moca-espaillat',
    titulo: 'Lentes de contacto en Moca — Entrega a domicilio',
    descripcion: 'Entrega en Moca y provincia de Espaillat. ACUVUE, Biofinity, Air Optix originales.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-azua',
    titulo: 'Lentes de contacto en Azua — Entrega 24-48h',
    descripcion: 'Lentes de contacto con entrega en Azua de Compostela y el sur occidental.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-barahona',
    titulo: 'Lentes de contacto en Barahona — Entrega a domicilio',
    descripcion: 'Entrega de lentes originales en Barahona y la costa sur dominicana.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-monte-plata',
    titulo: 'Lentes de contacto en Monte Plata — Entrega 24-48h',
    descripcion: 'Lentes de contacto con entrega en Monte Plata y sus municipios. Pago seguro.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-hato-mayor',
    titulo: 'Lentes de contacto en Hato Mayor — Entrega a domicilio',
    descripcion: 'Entrega de lentes originales en Hato Mayor del Rey y alrededores.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-el-seibo',
    titulo: 'Lentes de contacto en El Seibo — Entrega 24-48h',
    descripcion: 'Lentes de contacto con entrega en El Seibo y Santa Cruz del Seibo.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-samana',
    titulo: 'Lentes de contacto en Samaná — Entrega a domicilio',
    descripcion: 'Entrega en Samaná, Las Terrenas y Los Haitises. ACUVUE, Biofinity originales.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-nagua',
    titulo: 'Lentes de contacto en Nagua — Entrega 24-48h',
    descripcion: 'Lentes de contacto con entrega en Nagua y la costa atlántica. Originales.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-bonao',
    titulo: 'Lentes de contacto en Bonao — Entrega a domicilio',
    descripcion: 'Entrega de lentes originales en Bonao y la provincia de Monseñor Nouel.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-cotui',
    titulo: 'Lentes de contacto en Cotuí — Entrega 24-48h',
    descripcion: 'Lentes de contacto con entrega en Cotuí y Sánchez Ramírez.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-san-juan-maguana',
    titulo: 'Lentes de contacto en San Juan de la Maguana',
    descripcion: 'Entrega en San Juan de la Maguana y la región del Valle. Originales. Pago AZUL.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-mao-valverde',
    titulo: 'Lentes de contacto en Mao — Entrega 24-48h',
    descripcion: 'Lentes de contacto con entrega en Mao y la provincia de Valverde.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-monte-cristi',
    titulo: 'Lentes de contacto en Monte Cristi — Entrega a domicilio',
    descripcion: 'Entrega de lentes originales en Monte Cristi y el noroeste dominicano.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-dajabon',
    titulo: 'Lentes de contacto en Dajabón — Entrega 24-48h',
    descripcion: 'Lentes de contacto con entrega en Dajabón y la frontera norte.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-neyba',
    titulo: 'Lentes de contacto en Neyba — Entrega a domicilio',
    descripcion: 'Entrega en Neyba y la provincia de Baoruco. ACUVUE, Biofinity originales.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-jimani',
    titulo: 'Lentes de contacto en Jimaní — Entrega 24-48h',
    descripcion: 'Lentes de contacto con entrega en Jimaní y la provincia de Independencia.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-comendador',
    titulo: 'Lentes de contacto en Comendador — Entrega a domicilio',
    descripcion: 'Entrega en Comendador y la provincia de Elías Piña. Originales garantizados.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-pedernales',
    titulo: 'Lentes de contacto en Pedernales — Entrega 24-48h',
    descripcion: 'Lentes de contacto con entrega en Pedernales y el extremo sur.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-constanza',
    titulo: 'Lentes de contacto en Constanza — Entrega a domicilio',
    descripcion: 'Entrega en Constanza y la cordillera central. ACUVUE, Air Optix originales.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-distrito-nacional',
    titulo: 'Lentes de contacto en el Distrito Nacional — Entrega 24h',
    descripcion: 'Entrega de lentes originales en el Distrito Nacional y Ciudad de Santo Domingo en 24h.',
    emoji: '📍', categoria: 'Entrega por ciudad', tiempo: '4 min', fecha: '2026-06-20',
  },
  {
    slug: 'lentes-contacto-toda-republica-dominicana',
    titulo: 'Lentes de contacto con entrega en toda República Dominicana',
    descripcion: 'Entrega en las 31 provincias de RD. ACUVUE, Biofinity, Air Optix originales. 24-72h.',
    emoji: '🇩🇴', categoria: 'Entrega por ciudad', tiempo: '5 min', fecha: '2026-06-20', destacado: true,
  },

  // ── CUIDADO Y MANTENIMIENTO ────────────────────────────────────────
  {
    slug: 'solucion-limpieza-lentes-contacto',
    titulo: 'Cómo elegir la mejor solución para lentes de contacto',
    descripcion: 'Opti-Free, Dream Eye, Prolub — cuál usar según tu tipo de lente y cómo limpiarlos correctamente.',
    emoji: '🧴', categoria: 'Cuidado', tiempo: '4 min', fecha: '2026-04-10',
  },
  {
    slug: 'cuanto-duran-lentes-contacto',
    titulo: '¿Cuánto duran los lentes de contacto? Guía completa',
    descripcion: 'Diarios, quincenales y mensuales: cuándo cambiarlos y cómo sacarles el máximo provecho.',
    emoji: '📅', categoria: 'Cuidado', tiempo: '5 min', fecha: '2026-03-05',
  },
]

// Agrupar por categoría para la navegación
const CATEGORIAS = [...new Set(POSTS.map(p => p.categoria))]

export default function BlogPage({
  searchParams,
}: {
  searchParams?: { categoria?: string }
}) {
  const categoriaActiva = searchParams?.categoria || 'Todos'
  const postsFiltrados = categoriaActiva === 'Todos'
    ? POSTS
    : POSTS.filter(p => p.categoria === categoriaActiva)

  const destacados = POSTS.filter(p => p.destacado)

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 pb-24">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Blog de lentes de contacto
          </h1>
          <p className="text-gray-500">
            Guías, precios y comparativas para República Dominicana · {POSTS.length} artículos
          </p>
        </div>

        {/* Destacados */}
        {categoriaActiva === 'Todos' && (
          <div className="mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">⭐ Artículos más buscados</p>
            <div className="grid grid-cols-2 gap-2">
              {destacados.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="bg-primary-50 border border-primary-100 rounded-xl p-3 hover:border-primary-300 hover:shadow-sm transition-all">
                  <p className="text-xs font-bold text-primary-700 leading-tight">{post.titulo}</p>
                  <p className="text-[10px] text-primary-500 mt-1">{post.categoria} · {post.tiempo}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filtros de categoría */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['Todos', ...CATEGORIAS].map(cat => (
            <Link
              key={cat}
              href={cat === 'Todos' ? '/blog' : `/blog?categoria=${cat}`}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                categoriaActiva === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Lista de artículos */}
        <div className="space-y-3">
          {postsFiltrados.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:border-primary-200 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:bg-primary-100 transition-colors">
                {post.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full shrink-0">
                    {post.categoria}
                  </span>
                  <span className="text-[10px] text-gray-400">{post.tiempo} lectura</span>
                </div>
                <h2 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-primary-600 transition-colors">
                  {post.titulo}
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {post.descripcion}
                </p>
              </div>
              <svg className="w-4 h-4 text-gray-300 shrink-0 mt-1 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* CTA al final */}
        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <p className="font-bold text-gray-900 mb-1">¿Listo para comprar?</p>
          <p className="text-sm text-gray-500 mb-4">35+ lentes de contacto originales con entrega en 24-48h en toda República Dominicana</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/catalogo" className="bg-primary-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-primary-700 transition-colors">
              Ver catálogo completo →
            </Link>
            <Link href="/receta" className="bg-white border border-primary-200 text-primary-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-primary-50 transition-colors">
              Calcular mi receta gratis
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
