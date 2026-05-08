import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
};

// Tunnel Sentry events through /monitoring to bypass ad-blockers and
// corporate firewalls that drop direct sentry.io calls. Source-map upload
// is intentionally not configured — requires SENTRY_AUTH_TOKEN, accept
// minified stack traces in exchange for one less secret to manage.
export default withSentryConfig(nextConfig, {
  silent: true,
  tunnelRoute: "/monitoring",
});
