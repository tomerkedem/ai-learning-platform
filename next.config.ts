import type { NextConfig } from "next";

// בסיס כותרות שמרני. CSP נדחה בכוונה: הלומדות האחרות טוענות Pyodide/CDN/תמונות חיצוניות,
// ו-CSP שלא נבדק מול כולן עלול לשבור מסלולים קיימים.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
