import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      ... (process.env.SITE_INDEXABLE !== 'true' ? [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}] : []),
    ] }];
  },
};
export default withPayload(config);
