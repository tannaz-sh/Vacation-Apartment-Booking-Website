import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
const productionHTTPS = process.env.NODE_ENV === 'production' && process.env.SITE_URL?.startsWith('https://');
const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'X-DNS-Prefetch-Control', value: 'off' },
      ... (productionHTTPS ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }] : []),
      ... (process.env.SITE_INDEXABLE !== 'true' ? [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}] : []),
    ] }];
  },
};
export default withPayload(config);
