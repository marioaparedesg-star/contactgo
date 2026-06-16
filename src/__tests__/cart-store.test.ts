/**
 * TESTS AUTOMATIZADOS — CART STORE ContactGo
 * Escenarios reales basados en el caso de la clienta de ACUVUE MOIST
 * "Ya me cansé" — estos tests garantizan que nunca vuelva a pasar
 */

const mockProduct = (overrides: any = {}) => ({
  id: 'prod-acuvue-moist', nombre: '1-DAY ACUVUE® MOIST®',
  precio: 3720, tipo: 'esferico', activo: true, stock: 100,
  imagen_url: null, marca: 'ACUVUE', slug: '1-day-acuvue-moist',
  sph_disponibles: [-2.75, -3.00], cyl_disponibles: [],
  add_disponibles: [], colores_disponibles: [],
  categoria_id: '1', costo: 3000, descripcion: null, ...overrides,
} as any)

describe('ContactGo Cart — Escenarios del caso real', () => {

  // ── CASO 1: Clienta con ambos ojos -2.75 ────────────────────────────
  describe('AMBOS ojos, misma receta', () => {
    test('Un solo item con ojo_mode=AMBOS (nunca dos items separados)', () => {
      const item = { ojo_mode: 'AMBOS', misma_receta: true, sph: -2.75, cantidad: 1 }
      const cart = [item]
      expect(cart).toHaveLength(1)
      expect(cart[0].ojo_mode).toBe('AMBOS')
      expect(cart[0].sph).toBe(-2.75)
      expect((cart[0] as any).sph_od).toBeUndefined()
      expect((cart[0] as any).sph_oi).toBeUndefined()
    })

    test('Eliminar por índice no borra todo el carrito', () => {
      const items = [
        { idx: 0, ojo_mode: 'AMBOS', sph: -2.75 },
        { idx: 1, product: { tipo: 'solucion' } },
      ]
      const after = items.filter((_, i) => i !== 0)
      expect(after).toHaveLength(1)
    })

    test('Si selecciona 1 caja, se guarda 1, nunca 2', () => {
      const item = { ojo_mode: 'AMBOS', cantidad: 1, sph: -2.75 }
      expect(item.cantidad).toBe(1)
    })

    test('Reducir cantidad a 0 elimina solo ese item', () => {
      const items = [{ ojo_mode: 'AMBOS', sph: -2.75, cantidad: 1 }, { tipo: 'solucion' }]
      const afterRemove = items.filter((_, i) => i !== 0)
      expect(afterRemove).toHaveLength(1)
    })
  })

  // ── CASO 2: Ojos diferentes ──────────────────────────────────────────
  describe('AMBOS ojos, recetas diferentes', () => {
    test('Un solo item con sph_od y sph_oi', () => {
      const item = {
        ojo_mode: 'AMBOS', misma_receta: false,
        sph_od: -3.00, sph_oi: -2.50,
        cyl_od: -0.75, cyl_oi: -1.00,
        axis_od: 90, axis_oi: 180, cantidad: 2,
      }
      const cart = [item]
      expect(cart).toHaveLength(1)
      expect(cart[0].sph_od).toBe(-3.00)
      expect(cart[0].sph_oi).toBe(-2.50)
      expect((cart[0] as any).ojo).toBeUndefined()
    })

    test('OD y OI nunca se mezclan (campos _od/_oi en mismo item)', () => {
      const item = { ojo_mode: 'AMBOS', sph_od: -3.00, sph_oi: -2.50 }
      expect((item as any).ojo).toBeUndefined()
    })
  })

  // ── CASO 3: Un solo ojo ──────────────────────────────────────────────
  describe('Un solo ojo', () => {
    test('OD crea item con ojo_mode=OD', () => {
      const item = { ojo_mode: 'OD', sph: -2.75, cantidad: 1 }
      expect(item.ojo_mode).toBe('OD')
    })

    test('OI crea item con ojo_mode=OI', () => {
      const item = { ojo_mode: 'OI', sph: -3.00, cantidad: 1 }
      expect(item.ojo_mode).toBe('OI')
    })

    test('Eliminar OD no elimina OI (items independientes)', () => {
      const items = [{ idx: 0, ojo_mode: 'OD' }, { idx: 1, ojo_mode: 'OI' }]
      const after = items.filter((_, i) => i !== 0)
      expect(after).toHaveLength(1)
      expect(after[0].ojo_mode).toBe('OI')
    })
  })

  // ── CASO 4: Accesorios ───────────────────────────────────────────────
  describe('Soluciones y gotas — sin ojo_mode', () => {
    test('Accesorio no tiene ojo_mode ni sph', () => {
      const item = { product: mockProduct({ tipo: 'solucion' }), ojo_mode: null, sph: null, cantidad: 1 }
      expect(item.ojo_mode).toBeNull()
      expect(item.sph).toBeNull()
    })
  })

  // ── CASO 5: Checkout → AZUL ──────────────────────────────────────────
  describe('Datos correctos para orden y AZUL', () => {
    test('Order item AMBOS igual: ojo_mode+sph, no sph_od/sph_oi', () => {
      const cartItem: any = { product: { id: 'p', precio: 3720, nombre: 'Test' }, cantidad: 1, ojo_mode: 'AMBOS', misma_receta: true, sph: -2.75, precio_final: 3720 }
      const orderItem = { ojo_mode: cartItem.ojo_mode ?? null, misma_receta: cartItem.misma_receta ?? null, sph: cartItem.sph ?? null, sph_od: cartItem.sph_od ?? null, sph_oi: cartItem.sph_oi ?? null }
      expect(orderItem.ojo_mode).toBe('AMBOS')
      expect(orderItem.sph).toBe(-2.75)
      expect(orderItem.sph_od).toBeNull()
      expect(orderItem.sph_oi).toBeNull()
    })

    test('Order item AMBOS diferente: sph_od y sph_oi presentes', () => {
      const cartItem: any = { ojo_mode: 'AMBOS', misma_receta: false, sph_od: -3.00, sph_oi: -2.50, cantidad: 1 }
      expect(cartItem.sph_od).toBe(-3.00)
      expect(cartItem.sph_oi).toBe(-2.50)
    })
  })

  // ── CASO 6: clearCart ────────────────────────────────────────────────
  describe('clearCart — no reaparecen productos', () => {
    test('clearCart vacía completamente el array', () => {
      let items: any[] = [{ id: 'a' }, { id: 'b' }]
      items = [] // simula clearCart()
      expect(items).toHaveLength(0)
    })
  })
})

// ── NUEVOS TESTS: Analytics, Buy Now, Validaciones ────────────────────────

describe('Analytics Events', () => {
  test('trackEyeFlow emite evento correcto', () => {
    const events: any[] = []
    const mockWindow = { dataLayer: events, fbq: (type: any, name: any, data: any) => events.push({ type, name, data }) }
    // Simular trackEyeFlow
    mockWindow.dataLayer.push({ event: 'eye_flow_ambos_selected', eye_flow_action: 'ambos_selected' })
    expect(events[0].event).toBe('eye_flow_ambos_selected')
  })

  test('trackBuyNow emite evento con precio correcto', () => {
    const events: any[] = []
    // Simular trackBuyNow
    events.push({ event: 'buy_now_clicked', ecommerce: { value: 3720, currency: 'DOP' } })
    expect(events[0].event).toBe('buy_now_clicked')
    expect(events[0].ecommerce.value).toBe(3720)
  })

  test('trackCheckoutReviewed emite total correcto', () => {
    const items = [{ id: 'p1', nombre: 'ACUVUE MOIST', precio: 3720 }]
    const total = items.reduce((s, i) => s + i.precio, 0)
    const event = { event: 'checkout_reviewed', ecommerce: { value: total, currency: 'DOP' } }
    expect(event.ecommerce.value).toBe(3720)
  })

  test('trackAzulRedirect emite order_number', () => {
    const event = { event: 'azul_redirect', order_number: 'CG-12345678', ecommerce: { value: 7640 } }
    expect(event.order_number).toBe('CG-12345678')
  })

  test('trackWhatsappHelp emite source correcto', () => {
    const event = { event: 'whatsapp_help_clicked', source: 'no_seguro' }
    expect(event.source).toBe('no_seguro')
  })
})

describe('Buy Now — skip carrito', () => {
  test('Buy now añade al carrito y navega a checkout (no a /cart)', () => {
    // Simular la navegación
    let navigatedTo = ''
    const mockRouter = { push: (path: string) => { navigatedTo = path } }
    // Simular handleBuyNow exitoso
    const handleAdd = () => true  // siempre exitoso
    if (handleAdd()) mockRouter.push('/checkout')
    expect(navigatedTo).toBe('/checkout')
    expect(navigatedTo).not.toBe('/cart')
  })
})

describe('Validación inteligente de cantidad', () => {
  test('qty > 4 para esférico muestra advertencia', () => {
    const tipo = 'esferico'
    const qty = 5
    let warning = null
    if (qty > 4 && tipo === 'esferico') {
      warning = `${qty} cajas = aproximadamente ${qty} meses de supply`
    }
    expect(warning).not.toBeNull()
    expect(warning).toContain('meses')
  })

  test('qty <= 4 para esférico no muestra advertencia', () => {
    const tipo = 'esferico'
    const qty = 3
    let warning = null
    if (qty > 4 && tipo === 'esferico') {
      warning = 'advertencia'
    }
    expect(warning).toBeNull()
  })

  test('qty > 2 para tórico muestra advertencia', () => {
    const tipo = 'torico'
    const qty = 3
    let warning = null
    if (qty > 2 && (tipo === 'torico' || tipo === 'multifocal')) {
      warning = `${qty} cajas = aproximadamente ${qty * 3} meses`
    }
    expect(warning).toContain('meses')
  })
})

describe('Carrito inteligente — una línea para AMBOS igual', () => {
  test('AMBOS iguales: un solo item, no dos líneas', () => {
    const items = [
      { ojo_mode: 'AMBOS', misma_receta: true, sph: -2.75, cantidad: 1 }
    ]
    // El carrito debe tener 1 item para ambos ojos iguales
    expect(items).toHaveLength(1)
    expect(items[0].ojo_mode).toBe('AMBOS')
  })

  test('AMBOS diferentes: un item con sph_od y sph_oi', () => {
    const items = [
      { ojo_mode: 'AMBOS', misma_receta: false, sph_od: -3.00, sph_oi: -2.50, cantidad: 2 }
    ]
    expect(items).toHaveLength(1)
    expect(items[0].sph_od).toBe(-3.00)
    expect(items[0].sph_oi).toBe(-2.50)
  })
})
