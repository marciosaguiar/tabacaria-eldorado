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

export interface CompanySettings {
  nome: string
  slogan: string
  endereco: string
  telefone: string
  whatsapp: string
  email: string
  instagram: string
  facebook: string
  logoUrl: string
}
