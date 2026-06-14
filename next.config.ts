import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 75, 80, 85, 90],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['framer-motion', '@supabase/supabase-js', 'lucide-react'],
    optimizeCss: true,
  },
};

export default nextConfig
