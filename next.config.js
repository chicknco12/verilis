const CORS_ORIGINS = process.env.CORS_ORIGINS

const securityHeaders = [
  // SAMEORIGIN + frame-ancestors 'self' prevents this site (including the lead
  // capture chat form) from being iframed by third-party origins (clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self';" },
]

// Only advertise CORS headers when an explicit allow-list origin is configured.
// A wildcard origin must never be paired with Allow-Credentials: true, so by
// default (no CORS_ORIGINS) we simply omit these headers and rely on same-origin.
const corsHeaders = CORS_ORIGINS
  ? [
      { key: "Access-Control-Allow-Origin", value: CORS_ORIGINS },
      { key: "Access-Control-Allow-Credentials", value: "true" },
      { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
      { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
    ]
  : []

const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
    ],
  },
  // Renamed from experimental.serverComponentsExternalPackages in Next 15
  serverExternalPackages: ['mongodb'],
  webpack(config, { dev }) {
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders, ...corsHeaders],
      },
    ];
  },
};

module.exports = nextConfig;
