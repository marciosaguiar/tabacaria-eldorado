/**
 * Gera slug a partir do nome do produto.
 * "San Marino Azul" → "san-marino-azul"
 */
export function toSlug(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')     // caracteres especiais → hífen
    .replace(/^-+|-+$/g, '')         // remove hífens nas bordas
}
