const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['hkrxeroqgguchwhrclsr.supabase.co', 'res.cloudinary.com'],
  },
};

module.exports = withPWA(nextConfig);
