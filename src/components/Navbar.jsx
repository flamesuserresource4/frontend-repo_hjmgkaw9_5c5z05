export default function Navbar({ current, onNavigate }) {
  const tabs = [
    { key: 'listings', label: 'Shop Solar' },
    { key: 'lead', label: 'Get a Quote' },
    { key: 'installers', label: 'Find Installers' },
    { key: 'quotes', label: 'Quotes' },
  ]

  return (
    <div className="w-full sticky top-0 z-20 bg-slate-900/80 backdrop-blur border-b border-blue-500/20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <span className="text-white font-semibold tracking-tight">Solar Marketplace</span>
        </div>
        <div className="flex items-center gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => onNavigate(t.key)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                current === t.key ? 'bg-blue-500 text-white' : 'text-blue-200 hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
          <a href="/test" className="ml-2 text-xs text-blue-300 hover:text-white">Status</a>
        </div>
      </div>
    </div>
  )
}
