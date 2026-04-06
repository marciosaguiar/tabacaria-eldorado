/**
 * Image storage abstraction:
 * - Production (Vercel): uses @vercel/blob
 * - Local development: saves to public/images/products/
 */

function useBlob() {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

export async function uploadImage(file: File): Promise<string> {
  if (useBlob()) {
    const { put } = await import('@vercel/blob')
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const blob = await put(filename, file, { access: 'public' })
    return blob.url
  }

  // Local: save to public/images/products/
  const { writeFile, mkdir } = await import('fs/promises')
  const path = await import('path')
  const uploadsDir = path.join(process.cwd(), 'public', 'images', 'products')
  await mkdir(uploadsDir, { recursive: true })
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filepath = path.join(uploadsDir, filename)
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filepath, buffer)
  return `/images/products/${filename}`
}
