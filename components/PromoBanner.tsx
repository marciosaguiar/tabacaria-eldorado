interface Props {
  ativo: boolean
  texto: string
  cor: string
}

export default function PromoBanner({ ativo, texto, cor }: Props) {
  if (!ativo || !texto.trim()) return null

  // Cor de texto: preto se fundo claro, branco se escuro
  const isLight = (() => {
    const hex = cor.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 128
  })()

  return (
    <div
      className="w-full py-2.5 px-4 text-center font-inter text-sm font-semibold tracking-wide"
      style={{ backgroundColor: cor, color: isLight ? '#000' : '#fff' }}
    >
      {texto}
    </div>
  )
}
