// ============================================================
// ContactGo — Descripciones "ad-safe" para feeds de catálogo
// (Meta Commerce Manager + X Ads)
//
// Meta rechazó 12 productos por la política de "Atributos Personales"
// (Personalized Attributes / Personal Health): un anuncio no puede
// afirmar ni implicar que el espectador tiene una condición de salud
// específica. Frases como "diseñado para pacientes con astigmatismo",
// "recomendado para ojos secos" o "para personas con presbicia" caen
// directamente en esa categoría, aunque sean 100% ciertas del producto.
//
// La descripción del SITIO (tabla products.descripcion) se queda igual
// — ahí es información útil para un cliente que YA está buscando
// "lentes para astigmatismo" a propósito, no un anuncio no solicitado.
// Estas descripciones alternativas SOLO se usan en los feeds de
// catálogo (Meta + X), describiendo las especificaciones técnicas del
// LENTE (cilindro, eje, ADD, tecnología) sin dirigirse a una condición
// del espectador.
//
// Aplica a: tóricos, multifocales, y cualquier esférico que mencione
// una condición (ej. ojo seco) en su descripción de sitio.
// ============================================================

export const DESCRIPCION_AD_SAFE: Record<string, string> = {
  // ── Esféricos con mención de condición ──────────────────────────────────
  'ACUVUE® OASYS® with HYDRACLEAR® Plus':
    'Lente de contacto quincenal con tecnología HYDRACLEAR® Plus — agente humectante integrado en el material para sensación suave durante todo el día. Bloqueo UV Clase 1. Ideal para uso prolongado frente a pantallas.',
  'Proclear® Sphere':
    'Lente de contacto mensual con PC Technology® — tecnología de hidratación avanzada que mantiene el confort durante todo el día. Caja de 6 lentes.',
  'Biofinity® XR':
    'Lente esférico de rango extendido con tecnología Aquaform®, cubriendo graduaciones positivas de +8.50 a +15.00 y negativas de -12.50 a -20.00. Alta transmisión de oxígeno.',

  // ── Multifocales ─────────────────────────────────────────────────────────
  'ACUVUE® OASYS® Multifocal':
    'Lente multifocal quincenal con tecnología PUPIL OPTIMIZED DESIGN™ que se adapta a diferentes condiciones de iluminación. Tres niveles de ADD disponibles: Low (+0.75 a +1.25), Mid (+1.50 a +1.75), High (+2.00 a +2.50). Con HYDRACLEAR® Plus.',
  'AIR OPTIX® plus HydraGlyde® Multifocal':
    'Lente multifocal mensual con óptica PRECISION PROFILE® para visión nítida a todas las distancias. HydraGlyde® Moisture Matrix para superficie húmeda todo el mes. SmartShield® Technology. ADD: LOW, MID, HIGH.',
  'Bausch+Lomb ULTRA® for Presbyopia':
    'Lente multifocal mensual con tecnología MoistureSeal® y diseño 3-Zone Progressive para visión en múltiples distancias. Caja de 6 lentes.',
  'Biofinity® Multifocal':
    'Lente multifocal mensual con Balanced Progressive™ Technology para transición suave entre distancias. Aquaform® Technology. ADD disponible: +1.00, +1.50, +2.00, +2.50. Diseño D (dominante) y N (no dominante).',
  'clariti® 1 day multifocal':
    'Lente multifocal diario de silicona hidrogel con visión en múltiples distancias. WetLoc® technology para superficie húmeda permanente. Lente fresco cada día. ADD: LOW, MED, HIGH.',
  'Proclear® Multifocal':
    'Lente multifocal mensual con PC Technology™ — retiene 4 veces más agua que lentes convencionales para mayor comodidad. ADD: +1.00, +1.50, +2.00, +2.50.',
  'Proclear® Multifocal Toric':
    'Lente multifocal-tórico especializado de CooperVision: combina corrección multifocal y tórica en un solo lente. PC Technology™ con máxima hidratación. Cilindros: -2.75 a -5.75. ADD: +1.00 a +4.00.',
  'Proclear® Multifocal XR':
    'Lente multifocal de rango extendido, cubre graduaciones esféricas de +20.00 a -20.00. PC Technology™ para máxima hidratación. ADD disponible hasta +4.00.',

  // ── Tóricos ──────────────────────────────────────────────────────────────
  '1-DAY ACUVUE® MOIST® for Astigmatism':
    'Lente diario con corrección de cilindro y eje. BLINK STABILIZED® Design se orienta automáticamente con el parpadeo natural del ojo. Máxima higiene, sin necesidad de solución limpiadora.',
  'ACUVUE® OASYS® for Astigmatism':
    'Lente quincenal con tecnología HYDRACLEAR® Plus y sistema de estabilización BLINK STABILIZED®. Corrección de cilindro y eje con visión nítida y estable. Cilindros: -0.75, -1.25, -1.75, -2.25. Ejes en incrementos de 10°.',
  'Avaira Vitality® Toric':
    'Lente tórico mensual de silicona hidrogel con tecnología Aquaform®. Sistema de estabilización Optimized Toric Lens Geometry™ mantiene el lente en posición. Cilindros: -0.75, -1.25, -1.75, -2.25.',
  'Bausch+Lomb ULTRA® for Astigmatism':
    'Lente tórico mensual con tecnología MoistureSeal® y estabilización STABILIX® para visión nítida y estable durante todo el día. Caja de 6 lentes.',
  'Biofinity® Toric':
    'Lente tórico mensual con Aquaform® Technology y Optimized Toric Lens Geometry™. Naturalmente húmedo. Cilindros disponibles: -0.75, -1.25, -1.75, -2.25. Ejes en incrementos de 10°.',
  'Biofinity® XR Toric':
    'Lente tórico de rango extendido, cubre graduaciones esféricas de +20.00 a -20.00 con cilindros de -2.75 a -5.75 en incrementos de 0.50.',
  'clariti® 1 day toric':
    'Lente tórico diario de silicona hidrogel a precio accesible. WetLoc® technology mantiene la humedad permanente. Diseño de estabilización para visión nítida. Cilindros: -0.75, -1.25, -1.75, -2.25.',
}

/**
 * Devuelve la descripción segura para feeds de anuncios si existe una
 * versión alternativa registrada; si no, devuelve la descripción original
 * del producto sin modificar (la mayoría de esféricos y de color no
 * mencionan ninguna condición de salud, así que no necesitan reemplazo).
 */
export function descripcionParaFeed(nombreProducto: string, descripcionOriginal: string | null | undefined): string {
  return DESCRIPCION_AD_SAFE[nombreProducto] ?? (descripcionOriginal ?? '')
}
