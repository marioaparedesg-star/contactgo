import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://abd80d1a5156109a90e030c28d221f2a@o4511406238203904.ingest.us.sentry.io/4511425062043648",

  // Tracing
  tracesSampleRate: 0.1,
  enabled: process.env.NODE_ENV === "production",

  // Do not attach default user-identifying data to client events.
  sendDefaultPii: false,

  // Session Replay: mask all text and inputs, and block uploaded media.
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
      mask: [
        ".sph-value",
        ".cyl-value",
        "[data-private]",
        'input[type="password"]',
        'input[name="receta"]',
        ".prescripcion",
      ],
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "ChunkLoadError",
    "Non-Error promise rejection captured",
    "Blocked a frame with origin",
  ],
})
