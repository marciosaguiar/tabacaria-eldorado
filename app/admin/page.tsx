'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'

const EMPTY_FORM = {
  nome: '',
  descricao: '',
  precoAtacado: '',
  precoVarejo: '',
  visivelAtacado: true,
  visivelVarejo: true,
  imagem: '',
  categoria: '',
  tipo: 'produto' as 'produto' | 'combo',
  ativo: true,
}

type FormData = typeof EMPTY_FORM

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-sm border shadow-xl animate-slide-up font-inter text-sm max-w-sm
        ${type === 'success'
          ? 'bg-dark-card border-gold/30 text-gold'
          : 'bg-dark-card border-red-500/30 text-red-400'
        }
      `}
    >
      <span>{type === 'success' ? '✓' : '⚠'}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity text-lg leading-none">
        ×
      </button>
    </div>
  )
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  productName,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  productName: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black/85 z-[90] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-dark-card border border-red-500/20 rounded-sm p-8 max-w-sm w-full shadow-2xl">
        <div className="text-center">
          <div className="w-12 h-12 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="font-playfair text-lg text-white mb-2">Excluir Produto</h3>
          <p className="text-gray-400 text-sm font-inter mb-1">Tem certeza que deseja excluir:</p>
          <p className="text-white font-inter font-medium text-sm mb-6 line-clamp-2">"{productName}"</p>
          <p className="text-gray-600 text-xs font-inter mb-6">Esta ação não pode ser desfeita.</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 py-2.5 border border-dark-border text-gray-400 hover:border-gray-500 hover:text-white rounded-sm transition-all duration-300 text-sm font-inter"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-sm transition-all duration-300 text-sm font-inter font-medium disabled:opacity-50"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Product Form Modal ───────────────────────────────────────────────────────
function ProductFormModal({
  editingProduct,
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  imageFile,
  setImageFile,
  isSubmitting,
  onSubmit,
  onCancel,
  categorias,
}: {
  editingProduct: Product | null
  formData: FormData
  setFormData: (d: FormData) => void
  imagePreview: string | null
  setImagePreview: (s: string | null) => void
  imageFile: File | null
  setImageFile: (f: File | null) => void
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  categorias: string[]
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  const currentImage = imagePreview || formData.imagem

  return (
    <div className="fixed inset-0 bg-black/85 z-[80] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-dark-card border border-gold/20 rounded-sm w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-[0_0_60px_rgba(0,0,0,0.9)]">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-playfair font-bold text-xl text-white">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <div className="h-px w-12 bg-gold/40 mt-2" />
            </div>
            <button
              onClick={onCancel}
              className="w-8 h-8 flex items-center justify-center border border-dark-border hover:border-gray-600 rounded-sm text-gray-500 hover:text-white transition-all duration-300 text-lg leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label className="block text-[10px] text-gold/60 tracking-[0.2em] uppercase mb-2 font-inter">
                Nome do Produto *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full bg-dark border border-dark-border rounded-sm px-4 py-3 text-white placeholder-gray-700 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 font-inter text-sm"
                placeholder="Ex: Charuto Premium Cohiba"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-[10px] text-gold/60 tracking-[0.2em] uppercase mb-2 font-inter">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
                className="w-full bg-dark border border-dark-border rounded-sm px-4 py-3 text-white placeholder-gray-700 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 font-inter text-sm resize-none"
                placeholder="Descrição breve do produto..."
              />
            </div>

            {/* Categoria + Tipo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gold/60 tracking-[0.2em] uppercase mb-2 font-inter">
                  Categoria
                </label>
                <input
                  type="text"
                  list="categorias-list"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full bg-dark border border-dark-border rounded-sm px-4 py-3 text-white placeholder-gray-700 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 font-inter text-sm"
                  placeholder="Ex: Charutos"
                />
                <datalist id="categorias-list">
                  {categorias.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-[10px] text-gold/60 tracking-[0.2em] uppercase mb-2 font-inter">
                  Tipo
                </label>
                <div className="flex h-[46px] border border-dark-border rounded-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: 'produto' })}
                    className="flex-1 text-xs font-inter font-medium transition-all duration-200"
                    style={{
                      background: formData.tipo !== 'combo' ? 'rgba(201,168,76,0.15)' : 'transparent',
                      color: formData.tipo !== 'combo' ? '#C9A84C' : '#6b7280',
                      borderRight: '0.5px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    Produto
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: 'combo' })}
                    className="flex-1 text-xs font-inter font-medium transition-all duration-200"
                    style={{
                      background: formData.tipo === 'combo' ? 'rgba(201,168,76,0.15)' : 'transparent',
                      color: formData.tipo === 'combo' ? '#C9A84C' : '#6b7280',
                    }}
                  >
                    Combo
                  </button>
                </div>
              </div>
            </div>

            {/* Preços */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gold/60 tracking-[0.2em] uppercase mb-2 font-inter">
                  Preço Atacado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoAtacado}
                  onChange={(e) => setFormData({ ...formData, precoAtacado: e.target.value })}
                  className="w-full bg-dark border border-dark-border rounded-sm px-4 py-3 text-white placeholder-gray-700 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 font-inter text-sm"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gold/60 tracking-[0.2em] uppercase mb-2 font-inter">
                  Preço Varejo (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoVarejo}
                  onChange={(e) => setFormData({ ...formData, precoVarejo: e.target.value })}
                  className="w-full bg-dark border border-dark-border rounded-sm px-4 py-3 text-white placeholder-gray-700 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 font-inter text-sm"
                  placeholder="0,00"
                />
              </div>
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-[10px] text-gold/60 tracking-[0.2em] uppercase mb-2 font-inter">
                Imagem do Produto
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border border-dashed border-dark-border hover:border-gold/40 rounded-sm p-4 cursor-pointer transition-all duration-300 text-center group"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600 group-hover:text-gold/50 mx-auto mb-2 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600 text-xs font-inter group-hover:text-gray-400 transition-colors duration-300">
                      {imageFile ? imageFile.name : 'Clique para selecionar imagem'}
                    </p>
                    <p className="text-gray-700 text-[10px] font-inter mt-1">JPG, PNG, WEBP</p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {currentImage && (
                  <div className="relative w-20 h-20 border border-gold/20 rounded-sm overflow-hidden flex-shrink-0">
                    <Image
                      src={currentImage}
                      alt="Preview"
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized={!!imagePreview}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setImageFile(null)
                        setFormData({ ...formData, imagem: '' })
                        if (fileRef.current) fileRef.current.value = ''
                      }}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/80 hover:bg-red-500/80 text-white rounded-full text-xs flex items-center justify-center transition-colors duration-300 leading-none"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Visibilidade */}
            <div>
              <label className="block text-[10px] text-gold/60 tracking-[0.2em] uppercase mb-3 font-inter">
                Visibilidade nos Catálogos
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.visivelAtacado}
                      onChange={(e) => setFormData({ ...formData, visivelAtacado: e.target.checked })}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-all duration-300 ${
                        formData.visivelAtacado
                          ? 'bg-gold border-gold'
                          : 'border-dark-border group-hover:border-gray-500'
                      }`}
                    >
                      {formData.visivelAtacado && (
                        <svg className="w-3 h-3 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-inter transition-colors duration-300 ${formData.visivelAtacado ? 'text-gold' : 'text-gray-500'}`}>
                    Atacado
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.visivelVarejo}
                      onChange={(e) => setFormData({ ...formData, visivelVarejo: e.target.checked })}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-all duration-300 ${
                        formData.visivelVarejo
                          ? 'bg-gold border-gold'
                          : 'border-dark-border group-hover:border-gray-500'
                      }`}
                    >
                      {formData.visivelVarejo && (
                        <svg className="w-3 h-3 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-inter transition-colors duration-300 ${formData.visivelVarejo ? 'text-gold' : 'text-gray-500'}`}>
                    Varejo
                  </span>
                </label>
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="flex items-center justify-between py-3 px-4 rounded-sm border transition-colors"
              style={{ borderColor: formData.ativo ? 'rgba(201,168,76,0.2)' : 'rgba(220,38,38,0.3)', backgroundColor: formData.ativo ? 'transparent' : 'rgba(220,38,38,0.06)' }}>
              <div>
                <p className="font-inter text-sm font-medium" style={{ color: formData.ativo ? 'inherit' : '#f87171' }}>
                  {formData.ativo ? '✓ Produto disponível' : '⚠ Produto em falta'}
                </p>
                <p className="font-inter text-xs mt-0.5 text-gray-500">
                  {formData.ativo ? 'Visível normalmente no catálogo' : 'Aparece apagado (indisponível) para clientes'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, ativo: !formData.ativo })}
                style={{
                  position: 'relative',
                  width: '48px',
                  height: '26px',
                  borderRadius: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginLeft: '16px',
                  backgroundColor: formData.ativo ? '#C9A84C' : '#dc2626',
                  transition: 'background-color 0.2s',
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: '3px',
                  left: formData.ativo ? '23px' : '3px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'left 0.2s',
                  display: 'block',
                }} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1 py-3 border border-dark-border text-gray-400 hover:border-gray-500 hover:text-white rounded-sm transition-all duration-300 text-sm font-inter"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-gold hover:bg-gold-light text-dark font-inter font-semibold rounded-sm transition-all duration-300 text-sm disabled:opacity-50 shadow-[0_0_20px_rgba(201,168,76,0.2)] hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Admin Product Card ───────────────────────────────────────────────────────
function AdminProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product
  onEdit: (p: Product) => void
  onDelete: (id: string, name: string) => void
}) {
  return (
    <div className="bg-dark-card border border-dark-border hover:border-gold/25 rounded-sm overflow-hidden transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-square bg-dark overflow-hidden">
        {product.imagem ? (
          <Image
            src={product.imagem}
            alt={product.nome}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            style={{
              objectFit: 'cover',
              filter: product.ativo === false ? 'grayscale(100%) brightness(0.4)' : undefined,
            }}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.ativo === false && (
          <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
            <span className="text-[9px] font-inter font-bold uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(220,38,38,0.75)', color: '#fff' }}>
              Em falta
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-playfair text-sm text-white line-clamp-1 mb-1">{product.nome}</h3>
        {(product.categoria || product.tipo === 'combo') && (
          <div className="flex gap-1 mb-2 flex-wrap">
            {product.tipo === 'combo' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-inter font-bold tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/20">
                COMBO
              </span>
            )}
            {product.categoria && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-inter tracking-wide text-gray-500 border border-dark-border">
                {product.categoria}
              </span>
            )}
          </div>
        )}

        {/* Prices */}
        <div className="space-y-0.5 mb-2">
          {product.precoAtacado !== null && product.precoAtacado !== undefined && (
            <p className="text-[11px] text-gray-500 font-inter">
              <span className="text-gold/50">AT</span>{' '}
              <span className="text-gray-400">{formatPrice(product.precoAtacado)}</span>
            </p>
          )}
          {product.precoVarejo !== null && product.precoVarejo !== undefined && (
            <p className="text-[11px] text-gray-500 font-inter">
              <span className="text-gold/50">VR</span>{' '}
              <span className="text-gray-400">{formatPrice(product.precoVarejo)}</span>
            </p>
          )}
        </div>

        {/* Visibility badges */}
        <div className="flex gap-1 mb-3">
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded-sm font-inter font-medium tracking-wide transition-all duration-300 ${
              product.visivelAtacado
                ? 'bg-gold/15 text-gold border border-gold/20'
                : 'bg-gray-900 text-gray-600 border border-dark-border'
            }`}
          >
            Atacado
          </span>
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded-sm font-inter font-medium tracking-wide transition-all duration-300 ${
              product.visivelVarejo
                ? 'bg-gold/15 text-gold border border-gold/20'
                : 'bg-gray-900 text-gray-600 border border-dark-border'
            }`}
          >
            Varejo
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 text-[11px] py-1.5 border border-gold/25 text-gold/70 hover:bg-gold hover:text-dark hover:border-gold rounded-sm transition-all duration-300 font-inter font-medium"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(product.id, product.nome)}
            className="flex-1 text-[11px] py-1.5 border border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-sm transition-all duration-300 font-inter font-medium"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
type AnalyticsResult = {
  pages: Record<string, number>
  topProducts: Array<{ id: string; name: string; views: number }>
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<'atacado' | 'varejo'>('atacado')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<FormData>({ ...EMPTY_FORM })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [copyLabel, setCopyLabel] = useState<'atacado' | 'varejo' | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }, [])

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics', { cache: 'no-store' })
      if (res.ok) setAnalytics(await res.json())
    } catch { /* silent */ }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch {
      showToast('Erro ao carregar produtos.', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    const token = localStorage.getItem('eldorado_admin_token')
    if (token !== 'authenticated') {
      router.replace('/admin/login')
    } else {
      setIsAuthenticated(true)
      fetchProducts()
      fetchAnalytics()
    }
  }, [router, fetchProducts, fetchAnalytics])

  const handleLogout = () => {
    localStorage.removeItem('eldorado_admin_token')
    router.replace('/admin/login')
  }

  const openAddForm = () => {
    setEditingProduct(null)
    setFormData({ ...EMPTY_FORM })
    setImageFile(null)
    setImagePreview(null)
    setIsFormOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      nome: product.nome,
      descricao: product.descricao || '',
      precoAtacado: product.precoAtacado !== null && product.precoAtacado !== undefined ? String(product.precoAtacado) : '',
      precoVarejo: product.precoVarejo !== null && product.precoVarejo !== undefined ? String(product.precoVarejo) : '',
      visivelAtacado: product.visivelAtacado,
      visivelVarejo: product.visivelVarejo,
      imagem: product.imagem || '',
      categoria: product.categoria || '',
      tipo: (product.tipo as 'produto' | 'combo') || 'produto',
      ativo: product.ativo !== false,
    })
    setImageFile(null)
    setImagePreview(null)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
    setFormData({ ...EMPTY_FORM })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imagePath = formData.imagem

      // Upload image if new file selected
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!uploadRes.ok) throw new Error('Falha no upload da imagem')
        const uploadData = await uploadRes.json()
        imagePath = uploadData.path
      }

      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        imagem: imagePath,
        precoAtacado: formData.precoAtacado !== '' ? parseFloat(formData.precoAtacado) : null,
        precoVarejo: formData.precoVarejo !== '' ? parseFloat(formData.precoVarejo) : null,
        visivelAtacado: formData.visivelAtacado,
        visivelVarejo: formData.visivelVarejo,
        categoria: formData.categoria,
        tipo: formData.tipo,
        ativo: formData.ativo,
      }

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Falha ao atualizar produto')
        showToast('Produto atualizado com sucesso!', 'success')
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Falha ao criar produto')
        showToast('Produto adicionado com sucesso!', 'success')
      }

      await fetchProducts()
      handleCancel()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao salvar produto.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao excluir')
      await fetchProducts()
      showToast('Produto excluído.', 'success')
      setDeleteTarget(null)
    } catch {
      showToast('Erro ao excluir produto.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const copyLink = async (channel: 'atacado' | 'varejo') => {
    const url = `${window.location.origin}/${channel}`
    try {
      await navigator.clipboard.writeText(url)
      setCopyLabel(channel)
      setTimeout(() => setCopyLabel(null), 2000)
      showToast(`Link do ${channel} copiado!`, 'success')
    } catch {
      showToast('Não foi possível copiar.', 'error')
    }
  }

  const filteredProducts = products.filter((p) =>
    activeTab === 'atacado' ? p.visivelAtacado : p.visivelVarejo
  )
  const allTabProducts = products

  const allCategorias = Array.from(new Set(products.map(p => p.categoria).filter(Boolean))) as string[]

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-dark">
      {/* Nav */}
      <nav className="border-b border-gold/15 bg-dark-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-32 sm:h-12 sm:w-40">
              <Image
                src="/images/logo.png"
                alt="Tabacaria Eldorado"
                fill
                style={{ objectFit: 'contain', objectPosition: 'left center' }}
                priority
              />
            </div>
            <span className="hidden sm:block text-dark-border">|</span>
            <span className="hidden sm:block text-gray-500 text-xs font-inter tracking-widest uppercase">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/configuracoes"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border font-inter text-xs transition-all duration-300"
              style={{ borderColor: 'rgba(var(--gold-rgb),0.3)', color: 'var(--text-secondary)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurações
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-white border border-dark-border hover:border-gray-600 px-3 py-1.5 rounded-sm transition-all duration-300 text-xs font-inter"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Links de compartilhamento */}
        <div className="mb-8 p-5 bg-dark-card border border-gold/15 rounded-sm">
          <p className="text-[10px] text-gold/50 tracking-[0.2em] uppercase font-inter mb-3">
            Links dos Catálogos
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => copyLink('atacado')}
              className="flex-1 flex items-center justify-between gap-3 px-4 py-3 border border-gold/20 hover:border-gold/40 rounded-sm transition-all duration-300 group"
            >
              <div className="text-left">
                <p className="text-[10px] text-gold/40 font-inter uppercase tracking-widest mb-0.5">Atacado</p>
                <p className="text-gray-400 text-xs font-inter group-hover:text-gray-300 transition-colors duration-300">
                  {typeof window !== 'undefined' ? `${window.location.origin}/atacado` : '/atacado'}
                </p>
              </div>
              <span className={`text-xs font-inter px-3 py-1 rounded-sm transition-all duration-300 ${
                copyLabel === 'atacado'
                  ? 'bg-gold text-dark font-medium'
                  : 'text-gold/60 border border-gold/20 group-hover:border-gold/40 group-hover:text-gold'
              }`}>
                {copyLabel === 'atacado' ? '✓ Copiado' : 'Copiar'}
              </span>
            </button>

            <button
              onClick={() => copyLink('varejo')}
              className="flex-1 flex items-center justify-between gap-3 px-4 py-3 border border-gold/20 hover:border-gold/40 rounded-sm transition-all duration-300 group"
            >
              <div className="text-left">
                <p className="text-[10px] text-gold/40 font-inter uppercase tracking-widest mb-0.5">Varejo</p>
                <p className="text-gray-400 text-xs font-inter group-hover:text-gray-300 transition-colors duration-300">
                  {typeof window !== 'undefined' ? `${window.location.origin}/varejo` : '/varejo'}
                </p>
              </div>
              <span className={`text-xs font-inter px-3 py-1 rounded-sm transition-all duration-300 ${
                copyLabel === 'varejo'
                  ? 'bg-gold text-dark font-medium'
                  : 'text-gold/60 border border-gold/20 group-hover:border-gold/40 group-hover:text-gold'
              }`}>
                {copyLabel === 'varejo' ? '✓ Copiado' : 'Copiar'}
              </span>
            </button>
          </div>
        </div>

        {/* Analytics Panel */}
        {analytics && (
          <div className="mb-8 p-5 bg-dark-card border border-gold/15 rounded-sm">
            <p className="text-[10px] text-gold/50 tracking-[0.2em] uppercase font-inter mb-4">
              Visualizações do Site
            </p>

            {/* Page view stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Início', key: 'home', icon: '🏠' },
                { label: 'Varejo', key: 'varejo', icon: '🛍' },
                { label: 'Atacado', key: 'atacado', icon: '📦' },
              ].map(item => (
                <div
                  key={item.key}
                  className="flex flex-col items-center justify-center py-3 px-2 border border-gold/10 rounded-sm text-center"
                  style={{ background: 'rgba(201,168,76,0.04)' }}
                >
                  <span className="text-xl mb-1">{item.icon}</span>
                  <span className="font-playfair text-xl text-gold font-bold leading-none">
                    {(analytics.pages[item.key] ?? 0).toLocaleString('pt-BR')}
                  </span>
                  <span className="font-inter text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Top products */}
            {analytics.topProducts.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-600 tracking-[0.15em] uppercase font-inter mb-2">
                  Produtos mais visualizados
                </p>
                <div className="space-y-1.5">
                  {analytics.topProducts.slice(0, 7).map((p, i) => {
                    const max = analytics.topProducts[0]?.views || 1
                    const pct = Math.round((p.views / max) * 100)
                    return (
                      <div key={p.id} className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-600 font-inter w-4 text-right flex-shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-inter text-xs text-gray-300 truncate mr-2">{p.name}</span>
                            <span className="font-inter text-[11px] text-gold/70 flex-shrink-0">{p.views}×</span>
                          </div>
                          <div className="h-1 rounded-full bg-dark-border overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: 'linear-gradient(90deg, #C9A84C, #FFD966)',
                                transition: 'width 0.6s ease',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {analytics.topProducts.length === 0 && (analytics.pages['home'] ?? 0) === 0 && (
              <p className="text-xs text-gray-600 font-inter text-center py-2">
                Nenhuma visita registrada ainda. As estatísticas aparecem assim que clientes acessarem o catálogo.
              </p>
            )}

            <button
              onClick={fetchAnalytics}
              className="mt-4 text-[10px] text-gold/40 hover:text-gold/70 font-inter transition-colors duration-200 flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Atualizar dados
            </button>
          </div>
        )}

        {/* Tab bar + Add button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex border-b border-dark-border">
            {(['atacado', 'varejo'] as const).map((tab) => {
              const count = products.filter((p) =>
                tab === 'atacado' ? p.visivelAtacado : p.visivelVarejo
              ).length
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 text-sm font-inter transition-all duration-300 relative capitalize ${
                    activeTab === tab
                      ? 'text-gold'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="ml-2 text-[10px] text-gray-600">{count}</span>
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-gold hover:bg-gold-light text-dark font-inter font-semibold px-4 py-2 rounded-sm transition-all duration-300 text-sm shadow-[0_0_15px_rgba(201,168,76,0.2)] hover:shadow-[0_0_25px_rgba(201,168,76,0.35)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Novo Produto</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-dark-card border border-dark-border rounded-sm overflow-hidden">
                <div className="aspect-square bg-dark-hover animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-dark-hover rounded animate-pulse" />
                  <div className="h-2 bg-dark-hover rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-dark-border rounded-sm">
            <div className="w-12 h-12 border border-dark-border rounded-full flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm font-inter mb-4">
              Nenhum produto no catálogo de {activeTab}.
            </p>
            <button
              onClick={openAddForm}
              className="text-gold/70 hover:text-gold border border-gold/20 hover:border-gold/40 px-4 py-2 rounded-sm text-sm font-inter transition-all duration-300"
            >
              Adicionar primeiro produto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={(id, name) => setDeleteTarget({ id, name })}
              />
            ))}
          </div>
        )}

        {/* Produtos not visible in current tab */}
        {!isLoading && (() => {
          const hidden = allTabProducts.filter((p) =>
            activeTab === 'atacado' ? !p.visivelAtacado : !p.visivelVarejo
          )
          if (hidden.length === 0) return null
          return (
            <div className="mt-10">
              <p className="text-[10px] text-gray-600 tracking-[0.2em] uppercase font-inter mb-3">
                Ocultos no {activeTab} ({hidden.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 opacity-40">
                {hidden.map((product) => (
                  <AdminProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEdit}
                    onDelete={(id, name) => setDeleteTarget({ id, name })}
                  />
                ))}
              </div>
            </div>
          )
        })()}
      </div>

      {/* Modals */}
      {isFormOpen && (
        <ProductFormModal
          editingProduct={editingProduct}
          formData={formData}
          setFormData={setFormData}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          imageFile={imageFile}
          setImageFile={setImageFile}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          categorias={allCategorias}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          productName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
