import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://abd80d1a5156109a90e030c28d221f2a@o4511406238203904.ingest.us.sentry.io/4511425062043648",
  tracesSampleRate: 0.1,  // ALTA-5: reducido de 1.0 a 0.1 (10%) — suficiente para detectar problemas sin overhead
  debug: false,
})

export const onRequestError = Sentry.captureRequestError
// ALTA-5: Fix build warning — instrumenta navegaciones del router para tracing
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
