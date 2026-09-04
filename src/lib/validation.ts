// Validación compartida de "nombre completo" (nombre + apellido).
// Se usa tanto en frontend (formularios) como en backend (APIs) para que
// ningún cliente quede registrado con un solo nombre — necesario para
// facturación, envíos, y para que el equipo pueda identificar clientes
// con certeza (varios "Marías" o "Juanes" sin apellido son imposibles
// de diferenciar en el admin).

/**
 * true si el nombre trae al menos 2 palabras, cada una con 2+ letras.
 * Ej: "María Rodríguez" ✅ · "María" ❌ · "María R" ❌ (apellido de 1 letra) · "Ana María Pérez" ✅
 */
export function tieneNombreYApellido(nombre: string | null | undefined): boolean {
  if (!nombre) return false
  const partes = nombre.trim().split(/\s+/).filter(p => p.length >= 2)
  return partes.length >= 2
}

/** Mensaje de error estándar para mostrar cuando falla la validación. */
export const ERROR_NOMBRE_INCOMPLETO = 'Escribe tu nombre y apellido completos'
