import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://abd80d1a5156109a90e030c28d221f2a@o4511406238203904.ingest.us.sentry.io/4511425062043648",
  tracesSampleRate: 0.1,
})
