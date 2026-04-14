export interface Product {
  id: string
  nome: string
  descricao: string
  imagem: string
  precoAtacado: number | null
  precoVarejo: number | null
  visivelAtacado: boolean
  visivelVarejo: boolean
  categoria: string
  tipo?: 'produto' | 'combo'   // undefined = produto normal
  ativo?: boolean              // undefined = ativo (padrão). false = indisponível
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CompanySettings {
  // Identidade
  nome: string
  slogan: string
  footerPhrase: string        // Frase de impacto no rodapé

  // Contato
  endereco: string
  telefone: string
  whatsapp: string
  email: string

  // Redes sociais
  instagram: string
  facebook: string

  // Mídia
  logoUrl: string
  mapsUrl: string              // Link do Google Maps da empresa

  // Catálogo
  categorias: string[]        // Lista de categorias disponíveis
  catalogOrdem: 'cadastro' | 'nome' | 'preco-asc' | 'preco-desc' | 'categoria'
  mostrarPrecoSemValor: boolean  // Exibir card mesmo sem preço cadastrado

  // Banner promocional
  bannerAtivo: boolean
  bannerTexto: string
  bannerCor: string            // hex, ex: '#C9A84C'

  // Aviso de retirada no local
  pickupNotice?: boolean
}
