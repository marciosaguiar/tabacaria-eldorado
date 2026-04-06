import Image from 'next/image'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  channel: 'atacado' | 'varejo'
}

export default function ProductCard({ product, channel }: ProductCardProps) {
  const price = channel === 'atacado' ? product.precoAtacado : product.precoVarejo

  const formatPrice = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="group relative bg-dark-card border border-dark-border rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:border-gold/40 hover:shadow-[0_4px_24px_rgba(201,168,76,0.12)] animate-fade-in">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#0d0d0d]">
        {product.imagem ? (
          <Image
            src={product.imagem}
            alt={product.nome}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="font-playfair text-base sm:text-lg text-white group-hover:text-gold-light transition-colors duration-300 line-clamp-1 leading-snug">
          {product.nome}
        </h3>
        {product.descricao && (
          <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2 font-inter leading-relaxed">
            {product.descricao}
          </p>
        )}
        {price !== null && price !== undefined && (
          <p className="text-gold font-inter font-semibold text-base sm:text-lg mt-3 tracking-wide">
            {formatPrice(price)}
          </p>
        )}
      </div>

      {/* Gold accent bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
    </div>
  )
}
