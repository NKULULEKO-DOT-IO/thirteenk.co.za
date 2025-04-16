import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/thirteenk-thumbnails/**',
        search: '',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "upgrade-insecure-requests; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://storage.googleapis.com blob: data:; connect-src 'self' http://localhost:8000 http://thirteenkapi-service-hii3wfspiq-uc.a.run.app https://thirteenkapi-service-hii3wfspiq-uc.a.run.app http://api.thirteenk.co.za https://api.thirteenk.co.za;"
          }
        ]
      }
    ]
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
