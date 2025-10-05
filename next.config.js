/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
