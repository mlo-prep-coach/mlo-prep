const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  // Next.js's App Router streams the RSC/hydration payload to the client via
  // inline <script> tags (self.__next_f.push(...)). Without 'unsafe-inline'
  // here, the browser silently blocks those scripts and React's runtime
  // never executes — the whole app loses interactivity (nothing responds to
  // clicks) while still looking fully rendered, since the static HTML is
  // unaffected. The alternative is a nonce-based CSP, which requires
  // disabling static rendering site-wide; not worth that trade-off here.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  // /api/checkout and /api/billing-portal submit same-origin, then issue a
  // server-side redirect to Stripe — modern Chrome enforces form-action
  // against that final redirect target too, not just the immediate form
  // action, so Stripe's domains must be explicitly allowed here or the
  // redirect gets silently blocked client-side.
  "form-action 'self' https://checkout.stripe.com https://billing.stripe.com",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        // Auth-sensitive API responses should never be cached or stored anywhere.
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
