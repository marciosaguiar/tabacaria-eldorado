/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Desativa o otimizador /_next/image — imagens de produto vêm do
    // Vercel Blob CDN (já com cache edge global) e são comprimidas em WebP
    // no momento do upload. Evita o erro 402 por cota esgotada no plano Hobby.
    unoptimized: true,
  },
}

module.exports = nextConfig
