// ╔══════════════════════════════════════════════════════════════╗
// ║  PRECIOS CENTRALIZADOS — Fuente única de verdad del blog    ║
// ║  Se generan en build time desde Supabase (revalidate=86400) ║
// ║  Para actualizar: cambiar en Supabase → re-deploy           ║
// ╚══════════════════════════════════════════════════════════════╝

export const PRECIOS_BLOG = {
  // ── ESFÉRICOS ─────────────────────────────────────────────────
  "ACUVUE_OASYS":        3875,
  "ACUVUE_2":            3600,
  "1DAY_MOIST":          3875,
  "AIR_OPTIX_HG":        4375,
  "AVAIRA_VITALITY":     3690,
  "BL_ULTRA":            4500,
  "BIOFINITY":           4750,
  "BIOFINITY_XR":        5500,
  "BIOTRUE_ONEDAY":      3500,
  "CLARITI_1DAY":        4375,
  "PROCLEAR_SPHERE":     3200,
  // ── TÓRICOS ───────────────────────────────────────────────────
  "ACUVUE_OASYS_ASTIG":  6250,
  "1DAY_MOIST_ASTIG":    6250,
  "AVAIRA_VITALITY_TOR": 4875,
  "BL_ULTRA_ASTIG":      4000,
  "BIOFINITY_TORIC":     5750,
  "BIOFINITY_XR_TORIC":  12000,
  "CLARITI_1DAY_TORIC":  5750,
  // ── MULTIFOCALES ──────────────────────────────────────────────
  "ACUVUE_OASYS_MULTI":  8200,
  "AIR_OPTIX_HG_MULTI":  7250,
  "BL_ULTRA_PRESBY":     4100,
  "BIOFINITY_MULTI":     9500,
  "CLARITI_1DAY_MULTI":  6000,
  "PROCLEAR_MULTI":      7250,
  "PROCLEAR_MULTI_XR":   18500,
  "PROCLEAR_MULTI_TOR":  20000,
  // ── COLOR ─────────────────────────────────────────────────────
  "AIR_OPTIX_COLORS":    2625,
  "LUNARE":              2250,
  // ── SOLUCIONES ────────────────────────────────────────────────
  "OPTI_FREE_90ML":      750,
  "OPTI_FREE_300ML":     1450,
  "DREAM_EYE_80ML":      750,
  "PROLUB_60ML":         900,
} as const

// Helper para formatear precio
export function formatPrecio(precio: number): string {
  return `RD$${precio.toLocaleString('es-DO')}`
}

// Tipos
export type ProductoPrecio = keyof typeof PRECIOS_BLOG
