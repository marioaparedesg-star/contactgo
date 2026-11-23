import * as Sentry from "@sentry/nextjs";

/**
 * Initialize Sentry independently for each Next.js server runtime.
 * Client-side initialization lives in instrumentation-client.ts.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  } else if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

/**
 * Capture unhandled errors from Route Handlers, Server Components,
 * Server Actions, and middleware/proxy request handling.
 */
export const onRequestError = Sentry.captureRequestError;
