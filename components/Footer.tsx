export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-dark mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-center">
        <p className="font-playfair text-2xl text-white mb-1 tracking-wide">
          Tabacaria <span className="text-gold">Eldorado</span>
        </p>
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto my-4" />
        <p className="text-gray-500 text-sm font-inter">
          Produtos premium para os mais exigentes apreciadores
        </p>
        <p className="text-gray-700 text-xs font-inter mt-6">
          © {new Date().getFullYear()} Tabacaria{' '}
          <span className="text-gold/60">Eldorado</span>. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
