import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://abd80d1a5156109a90e030c28d221f2a@o4511406238203904.ingest.us.sentry.io/4511425062043648",

  // ── Tracing ────────────────────────────────────────────────────
  tracesSampleRate: 0.1,
  enabled: process.env.NODE_ENV === "production",

  // ── Session Replay ─────────────────────────────────────────────
  // Graba el 10% de sesiones normales (para análisis de UX)
  // Graba el 100% de sesiones donde ocurre un error (para debugging)
  integrations: [
    Sentry.replayIntegration({
      // Privacidad: ocultar datos sensibles del cliente
      maskAllText: true,         // ocultar nombres, correos, direcciones, recetas y demás texto personal
      maskAllInputs: true,       // ocultar TODOS los inputs (recetas, datos personales)
      blockAllMedia: true,       // evitar grabar fotos/documentos que pueda subir el cliente
      // Selectores adicionales para ocultar datos médicos/personales
      mask: [
        '.sph-value',
        '.cyl-value',
        '[data-private]',
        'input[type="password"]',
        'input[name="receta"]',
        '.prescripcion',
      ],
    }),
  ],
  replaysSessionSampleRate: 0.10,  // 10% sesiones normales
  replaysOnErrorSampleRate: 1.0,   // 100% sesiones con error

  // Ignorar errores de terceros conocidos
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ChunkLoadError',
    'Non-Error promise rejection captured',
    'Blocked a frame with origin',
  ],
})
