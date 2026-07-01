import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Content Security Policy. Rationale per directive:
// - script-src needs 'unsafe-inline' + 'unsafe-eval' because Next.js inlines
//   hydration scripts and Framer Motion uses eval. To eliminate, we'd need
//   to wire up per-request nonces — significant refactor for marginal gain.
// - style-src needs 'unsafe-inline' because Next.js + react-email styles
//   are inlined in <style> tags.
// - connect-src whitelists every external API the browser may call.
// - frame-ancestors 'none' prevents clickjacking (no one can iframe us).
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://resend-attachments.s3.amazonaws.com https://cdn-icons-png.flaticon.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com https://tora-backend-production.up.railway.app",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  // all-the-cities reads its data from a bundled cities.pbf via fs at load time;
  // keep it external so the bundler doesn't rewrite that path and break the read.
  serverExternalPackages: ["all-the-cities"],
  // Force the data file into the /api/cities serverless function on Vercel
  // (static tracing can miss data files loaded via fs).
  outputFileTracingIncludes: {
    "/api/cities": ["./node_modules/all-the-cities/cities.pbf"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: cspDirectives },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

// Tunnel Sentry events through /monitoring to bypass ad-blockers and
// corporate firewalls that drop direct sentry.io calls. Source-map upload
// is intentionally not configured — requires SENTRY_AUTH_TOKEN, accept
// minified stack traces in exchange for one less secret to manage.
export default withSentryConfig(nextConfig, {
  silent: true,
  tunnelRoute: "/monitoring",
});
