/**
 * Image storage abstraction:
 * - Production (Vercel): uses @vercel/blob
 * - Local development: saves to public/images/products/
 *
 * Todas as imagens são comprimidas para WebP ≤ 300 KB antes do upload.
 * Isso evita o erro 402 (cota de otimização Next.js) e acelera o carregamento.
 */

function useBlob() {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

/** Comprime a imagem para WebP com qualidade adaptativa (≤ 300 KB). */
async function toWebP(buffer: Buffer): Promise<Buffer> {
  try {
    const sharp = (await import('sharp')).default
    const MAX_BYTES = 300 * 1024 // 300 KB

    // Começa com qualidade 82 e reduz até caber
    for (const quality of [82, 72, 60, 48, 36]) {
      const out = await sharp(buffer)
        .rotate()               // corrige orientação EXIF
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality })
        .toBuffer()
      if (out.length <= MAX_BYTES || quality === 36) return out
    }
    // fallback improvável
    return sharp(buffer).webp({ quality: 36 }).toBuffer()
  } catch {
    // Se sharp não estiver disponível, retorna o buffer original
    return buffer
  }
}

export async function uploadImage(file: File): Promise<string> {
  const rawBuffer = Buffer.from(await file.arrayBuffer())
  const webpBuffer = await toWebP(rawBuffer)
  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`

  if (useBlob()) {
    const { put } = await import('@vercel/blob')
    const blob = await put(filename, webpBuffer, {
      access: 'public',
      contentType: 'image/webp',
    })
    return blob.url
  }

  // Local: save to public/images/products/
  const { writeFile, mkdir } = await import('fs/promises')
  const path = await import('path')
  const uploadsDir = path.join(process.cwd(), 'public', 'images', 'products')
  await mkdir(uploadsDir, { recursive: true })
  const localFilename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
  const filepath = path.join(uploadsDir, localFilename)
  await writeFile(filepath, webpBuffer)
  return `/images/products/${localFilename}`
}
