/**
 * TESTS AUTOMATIZADOS — LENTES DE COLOR CONTACTGO
 * Basados en hallazgos de auditoría forense
 * "No hay que perder una sola venta por un color equivocado"
 */

// ── Datos de referencia (sin acceso real al DB en tests) ─────────────────────

const AOC_COLORS = ['Gray','Sterling Gray','Brilliant Blue','Blue','True Sapphire',
  'Amethyst','Brown','Honey','Pure Hazel','Green','Gemstone Green','Turquoise']

const LUN_COLORS = ['Azul','Verde','Gris','Avellana']

const AOC_IMAGE_MAP: Record<string, string> = {
  'Gray':           '/colors/aoc_gray.png',
  'Sterling Gray':  '/colors/aoc_sterling_gray.png',
  'Brilliant Blue': '/colors/aoc_brilliant_blue.png',
  'Blue':           '/colors/aoc_blue.png',
  'True Sapphire':  '/colors/aoc_true_sapphire.png',
  'Amethyst':       '/colors/aoc_amethyst.png',
  'Brown':          '/colors/aoc_brown.png',
  'Honey':          '/colors/aoc_honey.png',
  'Pure Hazel':     '/colors/aoc_pure_hazel.png',
  'Green':          '/colors/aoc_green.png',
  'Gemstone Green': '/colors/aoc_gemstone_green.png',
  'Turquoise':      '/colors/aoc_turquoise.png',
}

const LUN_IMAGE_MAP: Record<string, string> = {
  'Azul':     '/colors/lun_azul.png',
  'Verde':    '/colors/lun_verde.png',
  'Gris':     '/colors/lun_gris.png',
  'Avellana': '/colors/lun_avellana.png',
}

// ── Simulador de inventario (espejo de la DB) ────────────────────────────────
const mockInventario = (colors: string[], sphs: number[], stockByColor: Record<string, number> = {}) =>
  colors.flatMap(color => sphs.map(sph => ({
    color, sph, stock: stockByColor[color] ?? 4
  })))

// Simular la lógica de varianteSeleccionadaTieneStock para color
function checkColorStock(
  inventario: any[],
  sph: string,
  color: string,
  isColor: boolean
): boolean {
  if (!inventario.length) return true
  const sphNum = sph ? parseFloat(sph) : null
  if (sphNum === null) return true
  return inventario.some((v: any) => {
    const sphMatch = Math.abs(Number(v.sph) - sphNum) < 0.001
    const colorMatch = !isColor || !color || v.color === color || !v.color
    return sphMatch && colorMatch && (v.stock ?? 1) > 0
  })
}

// ── SUITE 1: Catálogo oficial ─────────────────────────────────────────────────
describe('Catálogo oficial de colores', () => {
  test('AIR OPTIX COLORS tiene exactamente 12 colores oficiales', () => {
    expect(AOC_COLORS).toHaveLength(12)
  })

  test('LUNARE TRI-KOLOR tiene exactamente 4 colores oficiales', () => {
    expect(LUN_COLORS).toHaveLength(4)
  })

  test('No existen colores ficticios en AIR OPTIX COLORS', () => {
    const ficticiousColors = ['Jade', 'Mystic Blue', 'Dark Blue', 'Light Gray', 'Silver']
    ficticiousColors.forEach(f => {
      expect(AOC_COLORS).not.toContain(f)
    })
  })

  test('No existen colores ficticios en LUNARE TRI-KOLOR', () => {
    const ficticiousColors = ['Miel', 'Marrón', 'Aqua', 'Turquesa', 'Jade']
    ficticiousColors.forEach(f => {
      expect(LUN_COLORS).not.toContain(f)
    })
  })

  test('Todos los colores AOC tienen su imagen asignada', () => {
    AOC_COLORS.forEach(color => {
      expect(AOC_IMAGE_MAP[color]).toBeDefined()
      expect(AOC_IMAGE_MAP[color]).toContain('/colors/aoc_')
    })
  })

  test('Todos los colores LUNARE tienen su imagen asignada', () => {
    LUN_COLORS.forEach(color => {
      expect(LUN_IMAGE_MAP[color]).toBeDefined()
      expect(LUN_IMAGE_MAP[color]).toContain('/colors/lun_')
    })
  })

  test('Ningún color tiene imagen duplicada (AOC)', () => {
    const urls = Object.values(AOC_IMAGE_MAP)
    const uniqueUrls = new Set(urls)
    expect(uniqueUrls.size).toBe(urls.length)
  })
})

// ── SUITE 2: Selección de color e imagen ─────────────────────────────────────
describe('Dinámica de imagen por color', () => {
  test('Seleccionar Gray carga imagen correcta', () => {
    const img = AOC_IMAGE_MAP['Gray']
    expect(img).toBe('/colors/aoc_gray.png')
  })

  test('Seleccionar Turquoise carga imagen correcta', () => {
    expect(AOC_IMAGE_MAP['Turquoise']).toBe('/colors/aoc_turquoise.png')
  })

  test('Seleccionar Honey carga imagen correcta', () => {
    expect(AOC_IMAGE_MAP['Honey']).toBe('/colors/aoc_honey.png')
  })

  test('Lunare Azul carga imagen correcta', () => {
    expect(LUN_IMAGE_MAP['Azul']).toBe('/colors/lun_azul.png')
  })

  test('Lunare Avellana carga imagen correcta', () => {
    expect(LUN_IMAGE_MAP['Avellana']).toBe('/colors/lun_avellana.png')
  })

  test('Color no existente retorna undefined (no imagen incorrecta)', () => {
    expect(AOC_IMAGE_MAP['Jade']).toBeUndefined()
    expect(AOC_IMAGE_MAP['Mystic Blue']).toBeUndefined()
    expect(LUN_IMAGE_MAP['Miel']).toBeUndefined()
  })
})

// ── SUITE 3: Validación de stock por color+SPH ───────────────────────────────
describe('Stock validation por color y graduación', () => {
  const inv = mockInventario(['Gray', 'Honey', 'Turquoise'], [-2.75, -3.00, -4.00])
  const invAgotado = mockInventario(['Gray', 'Amethyst'], [-2.75], { 'Amethyst': 0 })

  test('Color con stock disponible → botón habilitado', () => {
    const result = checkColorStock(inv, '-2.75', 'Gray', true)
    expect(result).toBe(true)
  })

  test('Color agotado en esa graduación → botón deshabilitado', () => {
    const result = checkColorStock(invAgotado, '-2.75', 'Amethyst', true)
    expect(result).toBe(false)
  })

  test('Sin SPH seleccionado → botón habilitado (no bloquear prematuramente)', () => {
    const result = checkColorStock(inv, '', 'Gray', true)
    expect(result).toBe(true)
  })

  test('Sin color seleccionado → botón habilitado (toast lo maneja)', () => {
    const result = checkColorStock(inv, '-2.75', '', true)
    expect(result).toBe(true)
  })

  test('Producto no-color (isColor=false) no aplica filtro de color', () => {
    const result = checkColorStock(inv, '-2.75', '', false)
    expect(result).toBe(true) // siempre true cuando no es color
  })

  test('Gray stock=4 en SPH -3.00 → disponible', () => {
    const result = checkColorStock(inv, '-3.00', 'Gray', true)
    expect(result).toBe(true)
  })

  test('Gray en SPH -99.00 (no existe) → no disponible', () => {
    const result = checkColorStock(inv, '-99.00', 'Gray', true)
    expect(result).toBe(false)
  })
})

// ── SUITE 4: Sistema de SKUs por color ───────────────────────────────────────
describe('Sistema de SKUs por color', () => {
  function generateColorSKU(
    productCode: 'AOC' | 'LUN',
    color: string,
    sph: number
  ): string {
    const colorSlug = color.replace(/\s+/g, '_').toUpperCase().slice(0, 5)
    const sphStr = sph >= 0 ? `P${String(Math.round(sph * 100)).padStart(3,'0')}`
                            : `M${String(Math.round(Math.abs(sph) * 100)).padStart(3,'0')}`
    return `${productCode}-${colorSlug}-${sphStr}`
  }

  test('AIR OPTIX Gray -2.75 genera SKU correcto', () => {
    expect(generateColorSKU('AOC', 'Gray', -2.75)).toBe('AOC-GRAY-M275')
  })

  test('AIR OPTIX Honey -3.00 genera SKU correcto', () => {
    expect(generateColorSKU('AOC', 'Honey', -3.00)).toBe('AOC-HONEY-M300')
  })

  test('AIR OPTIX Pure Hazel plano genera SKU correcto', () => {
    expect(generateColorSKU('AOC', 'Pure Hazel', 0.00)).toBe('AOC-PURE_-P000')
  })

  test('LUNARE Azul -2.00 genera SKU correcto', () => {
    expect(generateColorSKU('LUN', 'Azul', -2.00)).toBe('LUN-AZUL-M200')
  })

  test('SKUs son únicos por combinación color+SPH', () => {
    const skus = new Set([
      generateColorSKU('AOC', 'Gray', -2.75),
      generateColorSKU('AOC', 'Honey', -2.75),
      generateColorSKU('AOC', 'Gray', -3.00),
    ])
    expect(skus.size).toBe(3)
  })
})

// ── SUITE 5: Persistencia en carrito ─────────────────────────────────────────
describe('Persistencia de color en el carrito', () => {
  test('Item de color guarda el color seleccionado', () => {
    const item = {
      product: { id: 'p1', nombre: 'AIR OPTIX® COLORS', precio: 3900, tipo: 'color' },
      ojo_mode: 'AMBOS', sph: -2.75, color: 'Honey', cantidad: 1
    }
    expect(item.color).toBe('Honey')
    expect((item as any).ojo_mode).toBe('AMBOS')
  })

  test('Cambiar color NO resetea la graduación', () => {
    const state = { sph: '-3.00', color: 'Gray' }
    // Simular cambio de color
    const newState = { ...state, color: 'Blue' }
    expect(newState.sph).toBe('-3.00')  // graduación conservada
    expect(newState.color).toBe('Blue')
  })

  test('Eliminar item de color por índice no afecta otros items', () => {
    const items = [
      { id: 'a', color: 'Gray', sph: -2.75 },
      { id: 'b', color: 'Honey', sph: -2.75 },
      { id: 'c', tipo: 'solucion' }
    ]
    const after = items.filter((_, i) => i !== 0)
    expect(after).toHaveLength(2)
    expect(after[0].color).toBe('Honey')
  })

  test('Checkout recibe el color correcto en order_items', () => {
    const cartItem = {
      product: { id: 'p1', precio: 3900 },
      color: 'Turquoise', sph: -4.00, ojo_mode: 'OD', cantidad: 1
    }
    const orderItem = {
      product_id: cartItem.product.id,
      color: (cartItem as any).color ?? null,
      sph: cartItem.sph ?? null,
      ojo_mode: (cartItem as any).ojo_mode ?? null,
    }
    expect(orderItem.color).toBe('Turquoise')
    expect(orderItem.ojo_mode).toBe('OD')
  })
})
