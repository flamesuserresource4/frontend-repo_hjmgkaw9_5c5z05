export default function ListingCard({ item }) {
  return (
    <div className="group bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 hover:border-blue-400/40 transition-colors">
      <div className="aspect-video bg-slate-700/50 rounded-lg mb-3 overflow-hidden">
        {item.images?.[0] ? (
          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-blue-300/60 text-sm">No image</div>
        )}
      </div>
      <h3 className="text-white font-semibold mb-1 truncate">{item.title}</h3>
      <p className="text-blue-200/80 text-sm line-clamp-2 mb-3">{item.description || '—'}</p>
      <div className="flex items-center justify-between">
        <span className="text-blue-300">{item.brand || 'Generic'} • {item.product_type}</span>
        <span className="text-white font-bold">${Number(item.price).toLocaleString()}</span>
      </div>
    </div>
  )
}
