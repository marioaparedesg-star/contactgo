import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "https://abd80d1a5156109a90e030c28d221f2a@o4511406238203904.ingest.us.sentry.io/4511425062043648",
  tracesSampleRate: 0.1,
  enabled: process.env.NODE_ENV === "production",
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ChunkLoadError',
    // FIX (2026-09-06): confirmado en Sentry (JAVASCRIPT-NEXTJS-R) — viene de
    // Meta Pixel o Google Ads (gtag) chocando con las protecciones de
    // rastreo entre sitios de iOS/Safari al intentar acceder a un frame de
    // otro origen. No es un bug de la app: existe desde el 8 de agosto,
    // ocurre muy rara vez (2 veces en un mes) y nunca afectó a ningún
    // usuario (0 usuarios impactados) — la página sigue funcionando normal.
    'Blocked a frame with origin',
  ],
})
