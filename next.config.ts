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
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  // *.supabase.co: beta-feedback screenshots and avatars shown in the cockpit live in Supabase Storage.
  "img-src 'self' data: blob: https://*.supabase.co https://resend-attachments.s3.amazonaws.com https://cdn-icons-png.flaticon.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com https://tora-backend-production.up.railway.app https://plausible.io",
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
  async redirects() {
    return [
      // Lean base link + old name both land on the default-language founding page.
      { source: "/founding", destination: "/founding/en", permanent: false },
      { source: "/foundingmembers", destination: "/founding/en", permanent: false },
      // Beta cockpit moved: /admin autocompleted to /admin/beta in the browser.
      { source: "/admin/beta", destination: "/beta-admin", permanent: false },

      // ACCEPTANCE CRITERIA (campaign vanity paths)
      //   G1. Short, retypeable links for press placements where a long UTM
      //       string is impractical: printed in article copy, read aloud, or
      //       pasted by an editor who may strip a query string.
      //   G2. Each lands on the founding page IN THE RIGHT LANGUAGE, carrying
      //       the same utm_* the long-form links use, so the stored attribution
      //       is identical however the visitor arrived.
      //   G3. Point straight at /founding/<lang>, not /founding — that would
      //       bounce through the redirect above and risk losing the query.
      //   G4. temporary (307): a campaign path may be re-pointed later, and a
      //       permanent redirect would be cached in browsers for good.
      //   G5. One path per PLACEMENT is not the goal — these cover the article
      //       placements only. Newsletter, Instagram and email use the full
      //       links in docs/campaign-links.md, which distinguish utm_medium.
      {
        source: "/mixmag",
        destination: "/founding/en?utm_source=mixmag&utm_medium=article&utm_campaign=launch",
        permanent: false,
      },
      {
        // Clubberia is a Japanese publication — its readers get the JA page.
        source: "/clubberia",
        destination: "/founding/jp?utm_source=clubberia&utm_medium=article&utm_campaign=launch",
        permanent: false,
      },
    ];
  },
};

// Tunnel Sentry events through /monitoring to bypass ad-blockers and
// corporate firewalls that drop direct sentry.io calls. Source-map upload is
// enabled (F9-04) ONLY when the Sentry env vars are present (Vercel prod) — so
// landing-page stack traces become readable — and is a no-op without them, so
// local/tokenless builds are unaffected and no extra secret is required there.
const sentryUpload = Boolean(
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT
);

export default withSentryConfig(nextConfig, {
  silent: true,
  tunnelRoute: "/monitoring",
  ...(sentryUpload
    ? {
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: { deleteSourcemapsAfterUpload: true },
      }
    : {}),
});
