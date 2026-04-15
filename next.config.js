/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
    // Impede que @vercel/kv seja incluído no bundle do Edge Runtime (middleware)
    serverExternalPackages: ['@vercel/kv'],
}

module.exports = nextConfig
