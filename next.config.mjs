/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['172.20.10.2:3000', '172.20.10.2', 'localhost:3000', '127.0.0.1:3000'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
