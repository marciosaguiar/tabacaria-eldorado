export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{
        borderColor: 'rgba(var(--gold-rgb), 0.15)',
        backgroundColor: 'var(--bg-card)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-center">
        <p
          className="font-playfair text-2xl mb-1 tracking-wide"
          style={{ color: 'var(--text-primary)' }}
        >
          Tabacaria{' '}
          <span className="text-gold-shine">Eldorado</span>
        </p>
        <div
          className="h-px w-20 mx-auto my-4"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
        <p
          className="text-sm font-inter"
          style={{ color: 'var(--text-secondary)' }}
        >
          Produtos premium para os mais exigentes apreciadores
        </p>
        <p
          className="text-xs font-inter mt-6"
          style={{ color: 'var(--text-muted)' }}
        >
          © {new Date().getFullYear()} Tabacaria{' '}
          <span style={{ color: 'var(--gold)', opacity: 0.7 }}>Eldorado</span>. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
