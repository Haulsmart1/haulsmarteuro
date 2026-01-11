/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ Crucial for SSR and dynamic routes on Vercel

  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
