/**
 * compress-images.mjs
 * Converte todas as imagens em public/images/products/ para WebP ≤150KB.
 * Originais são copiados para public/images/products-backup/ antes de qualquer alteração.
 */

import { createRequire } from 'module'
import { readdir, copyFile, writeFile, mkdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')
const SRC  = join(root, 'public', 'images', 'products')
const BKUP = join(root, 'public', 'images', 'products-backup')
const MAX_BYTES = 150 * 1024  // 150KB

const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])

async function main() {
  await mkdir(BKUP, { recursive: true })

  const files = (await readdir(SRC)).filter(f => ALLOWED.has(extname(f).toLowerCase()))
  console.log(`\nEncontradas ${files.length} imagens em ${SRC}\n`)

  let saved = 0
  let totalBefore = 0
  let totalAfter = 0

  for (const file of files) {
    const srcPath  = join(SRC, file)
    const bkupPath = join(BKUP, file)

    // 1. Backup original
    await copyFile(srcPath, bkupPath)

    // 2. Determinar nome de saída (sempre .webp)
    const nameNoExt = basename(file, extname(file))
    const outName   = `${nameNoExt}.webp`
    const outPath   = join(SRC, outName)

    const beforeStat = await stat(srcPath)
    totalBefore += beforeStat.size

    // 3. Comprimir com qualidade adaptativa para ficar ≤150KB
    let quality = 82
    let buf
    do {
      buf = await sharp(srcPath)
        .webp({ quality, effort: 4 })
        .toBuffer()
      if (buf.length > MAX_BYTES && quality > 20) quality -= 8
      else break
    } while (true)

    await writeFile(outPath, buf)
    totalAfter += buf.length

    const kb = (n) => (n / 1024).toFixed(1) + 'KB'
    const pct = (100 * (1 - buf.length / beforeStat.size)).toFixed(0)
    console.log(`  ✓ ${file} → ${outName}  ${kb(beforeStat.size)} → ${kb(buf.length)}  (-${pct}%)  [q=${quality}]`)

    // 4. Se o arquivo original não era .webp, remover o original agora que o backup existe
    if (extname(file).toLowerCase() !== '.webp') {
      const { unlink } = await import('fs/promises')
      await unlink(srcPath)
    }

    saved++
  }

  console.log(`\n✅ ${saved} imagens convertidas`)
  console.log(`   Total antes : ${(totalBefore / 1024 / 1024).toFixed(1)} MB`)
  console.log(`   Total depois: ${(totalAfter  / 1024 / 1024).toFixed(1)} MB`)
  console.log(`   Economia    : ${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%`)
  console.log(`\n   Originais salvos em: public/images/products-backup/\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
