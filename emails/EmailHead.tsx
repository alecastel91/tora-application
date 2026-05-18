import { Head } from "@react-email/components";

/**
 * Shared <Head> for all TORA transactional emails.
 *
 * Two layers of dark-mode declaration:
 * 1. `color-scheme: dark` meta tags — the spec-compliant way to tell clients
 *    "render this email dark, do not auto-invert."
 * 2. `<style>` block with !important rules and prefers-color-scheme media
 *    queries — defensive override for clients (e.g. some Gmail iOS configs)
 *    that ignore the meta tag.
 *
 * The light-mode media query intentionally re-asserts dark colors, so even
 * when the recipient is in light mode we keep the design intent.
 */
export function EmailHead() {
  return (
    <Head>
      <meta name="color-scheme" content="dark" />
      <meta name="supported-color-schemes" content="dark" />
      <style>{`
        :root { color-scheme: dark only; supported-color-schemes: dark; }
        /* Force-dark only on the outer page chrome — body + the explicit
           .body-bg marker. Avoid trampling table/td/div so the inline
           dark-grey card backgrounds (rgba(30,30,30,0.6) on <Section>) keep
           rendering correctly. */
        body, .body-bg {
          background-color: #000000 !important;
          color: #FFFFFF !important;
        }
        @media (prefers-color-scheme: light) {
          body, .body-bg {
            background-color: #000000 !important;
            color: #FFFFFF !important;
          }
          /* Force-white only on the heading; don't touch p / span / a so the
             deliberate pink (#FF3366) text and links keep rendering correctly.
             Body color cascades down for everything else by default. */
          h1, h2, h3 { color: #FFFFFF !important; }
        }
        @media (prefers-color-scheme: dark) {
          body, .body-bg {
            background-color: #000000 !important;
            color: #FFFFFF !important;
          }
        }
      `}</style>
    </Head>
  );
}
