export interface Product {
  id: string
  nome: string
  descricao: string
  imagem: string
  precoAtacado: number | null
  precoVarejo: number | null
  visivelAtacado: boolean
  visivelVarejo: boolean
}
