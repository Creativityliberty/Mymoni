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
  // Skip static page generation during build to avoid Prisma errors
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
};

module.exports = nextConfig;
