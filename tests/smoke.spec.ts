/**
 * Smoke tests — ContactGo
 * Validan que las páginas críticas cargan correctamente en producción.
 * No tocan pagos. No modifican datos.
 */
import { test, expect } from '@playwright/test'

// ── Páginas públicas ───────────────────────────────────────────────────────
test.describe('Páginas públicas', () => {
  test('Homepage carga y tiene CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/ContactGo|Lentes de Contacto/)
    // Existe al menos un link al catálogo
    await expect(page.locator('a[href*="catalogo"]').first()).toBeVisible()
  })

  test('Catálogo muestra productos', async ({ page }) => {
    await page.goto('/catalogo')
    // Hay al menos 1 producto visible
    await expect(page.locator('[data-testid="product-card"], a[href*="/producto/"]').first())
      .toBeVisible({ timeout: 10_000 })
  })

  test('PDP carga con precio', async ({ page }) => {
    // Navegar al primer producto desde el catálogo
    await page.goto('/catalogo')
    const firstProduct = page.locator('a[href*="/producto/"]').first()
    await firstProduct.click()
    await expect(page).toHaveURL(/\/producto\//)
    // El precio debe estar visible
    await expect(page.locator('text=/RD\\$|DOP/').first()).toBeVisible({ timeout: 8_000 })
  })

  test('Blog index carga', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('Sobre Nosotros carga', async ({ page }) => {
    await page.goto('/sobre-nosotros')
    await expect(page).toHaveTitle(/ContactGo|Sobre/)
  })
})

// ── SEO crítico ───────────────────────────────────────────────────────────
test.describe('SEO', () => {
  test('Homepage tiene meta description', async ({ page }) => {
    await page.goto('/')
    const desc = await page.locator('meta[name="description"]').getAttribute('content')
    expect(desc).toBeTruthy()
    expect(desc!.length).toBeGreaterThan(50)
  })

  test('Sitemap devuelve XML válido', async ({ page }) => {
    const res = await page.request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain('<urlset')
    expect(body).toContain('contactgo.net')
  })

  test('Robots.txt bloquea /admin', async ({ page }) => {
    const res = await page.request.get('/robots.txt')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain('Disallow: /admin')
  })

  test('Google Shopping feed devuelve XML', async ({ page }) => {
    const res = await page.request.get('/api/feed/google')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain('<rss')
    expect(body).toContain('www.contactgo.net')
  })
})

// ── Seguridad básica ──────────────────────────────────────────────────────
test.describe('Seguridad', () => {
  test('/admin redirige a login sin sesión', async ({ page }) => {
    await page.goto('/admin')
    // Debe terminar en /admin/login o mostrar login
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 8_000 })
  })

  test('/api/orders/items rechaza orden inválida', async ({ page }) => {
    const res = await page.request.post('/api/orders/items', {
      data: { order_id: '00000000-0000-0000-0000-000000000000', items: [{ nombre: 'test', precio: 100, cantidad: 1 }] },
    })
    // Debe rechazar la orden fantasma
    expect([400, 403, 429]).toContain(res.status())
  })

  test('Headers de seguridad presentes', async ({ page }) => {
    const res = await page.request.get('/')
    expect(res.headers()['x-frame-options']).toBe('DENY')
    expect(res.headers()['x-content-type-options']).toBe('nosniff')
  })
})

// ── Health ────────────────────────────────────────────────────────────────
test.describe('Infraestructura', () => {
  test('/api/health devuelve ok', async ({ page }) => {
    const res = await page.request.get('/api/health')
    expect(res.status()).toBe(200)
    const json = await res.json()
    expect(json.status).toBe('ok')
    expect(json.services.supabase).toBe('ok')
  })

  test('Cupón inválido devuelve error', async ({ page }) => {
    const res = await page.request.post('/api/validate-coupon', {
      data: { codigo: 'CUPON_INEXISTENTE_XYZ', subtotal: 5000 },
    })
    expect(res.status()).toBe(200)
    const json = await res.json()
    expect(json.valido).toBe(false)
  })

  test('Cupón válido CONTACTGO15 funciona', async ({ page }) => {
    const res = await page.request.post('/api/validate-coupon', {
      data: { codigo: 'CONTACTGO15', subtotal: 5000 },
    })
    expect(res.status()).toBe(200)
    const json = await res.json()
    expect(json.valido).toBe(true)
    expect(json.descuento).toBe(750) // 15% de 5000
  })
})
