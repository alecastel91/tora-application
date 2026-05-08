import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
};

// Sentry build-time options. tunnelRoute proxies Sentry events through our
// own /monitoring path so ad-blockers and corporate firewalls don't drop
// them. silent + disableLogger keep build output clean. Source-map upload
// is intentionally disabled (requires an auth token) — line numbers in
// stack traces will be from compiled code, which is acceptable trade-off.
export default withSentryConfig(nextConfig, {
  silent: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
});
