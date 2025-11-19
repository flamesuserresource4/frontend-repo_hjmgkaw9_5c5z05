import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function QuotesView() {
  const [quotes, setQuotes] = useState([])
  const [leads, setLeads] = useState([])
  const [installers, setInstallers] = useState([])
  const [form, setForm] = useState({ lead_id: '', installer_id: '', price_usd: '', timeline_weeks: '', warranty_years: '', message: '' })

  const loadAll = async () => {
    const [q, l, i] = await Promise.all([
      fetch(`${API_BASE}/quotes`).then(r=>r.json()),
      fetch(`${API_BASE}/leads`).then(r=>r.json()),
      fetch(`${API_BASE}/installers`).then(r=>r.json()),
    ])
    setQuotes(q)
    setLeads(l)
    setInstallers(i)
  }

  useEffect(() => { loadAll() }, [])

  const submit = async (e) => {
    e.preventDefault()
    const payload = {
      lead_id: form.lead_id || leads[0]?._id,
      installer_id: form.installer_id || installers[0]?.user_id || 'demo-installer',
      price_usd: Number(form.price_usd) || 15000,
      timeline_weeks: form.timeline_weeks ? Number(form.timeline_weeks) : undefined,
      warranty_years: form.warranty_years ? Number(form.warranty_years) : undefined,
      message: form.message || 'We would love to work on your project',
      status: 'sent'
    }
    await fetch(`${API_BASE}/quotes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    await loadAll()
    setForm({ lead_id: '', installer_id: '', price_usd: '', timeline_weeks: '', warranty_years: '', message: '' })
  }

  const seed = async () => {
    await fetch(`${API_BASE}/seed`, { method: 'POST' })
    await loadAll()
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Quotes</h2>
          <p className="text-blue-200/80">Send quotes in response to leads and review existing offers</p>
        </div>
        <button onClick={seed} className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm">Seed mock data</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            {quotes.map(q => (
              <div key={q._id} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-semibold">${q.price_usd?.toLocaleString?.() || q.price_usd}</div>
                  <span className="text-xs px-2 py-1 rounded bg-slate-900/60 text-blue-200">{q.status}</span>
                </div>
                <div className="text-blue-200/80 text-sm">Lead: {q.lead_id?.slice?.(0,6)}</div>
                <div className="text-blue-200/80 text-sm">Installer: {q.installer_id?.slice?.(0,6)}</div>
                {q.timeline_weeks && <div className="text-blue-200/80 text-sm">Timeline: {q.timeline_weeks} weeks</div>}
                {q.warranty_years && <div className="text-blue-200/80 text-sm">Warranty: {q.warranty_years} years</div>}
                {q.message && <p className="text-blue-100/80 text-sm mt-2">{q.message}</p>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Send a Quote</h3>
          <form onSubmit={submit} className="space-y-2 bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
            <select className="w-full bg-slate-900/60 text-white px-3 py-2 rounded" value={form.lead_id} onChange={e=>setForm({...form,lead_id:e.target.value})}>
              <option value="">Select lead</option>
              {leads.map(l => <option key={l._id} value={l._id}>{l.buyer_name} • {l.city || l.state || ''}</option>)}
            </select>
            <select className="w-full bg-slate-900/60 text-white px-3 py-2 rounded" value={form.installer_id} onChange={e=>setForm({...form,installer_id:e.target.value})}>
              <option value="">Select installer</option>
              {installers.map(i => <option key={i._id} value={i.user_id}>Installer {i.user_id?.slice(0,6)} • {i.areas?.[0] || ''}</option>)}
            </select>
            <input className="w-full bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="Price (USD)" value={form.price_usd} onChange={e=>setForm({...form,price_usd:e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
              <input className="bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="Timeline (weeks)" value={form.timeline_weeks} onChange={e=>setForm({...form,timeline_weeks:e.target.value})} />
              <input className="bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="Warranty (years)" value={form.warranty_years} onChange={e=>setForm({...form,warranty_years:e.target.value})} />
            </div>
            <textarea className="w-full bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="Message" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">Send</button>
          </form>

          <div className="mt-4 text-blue-300/70 text-xs">
            Tip: Use "Seed mock data" to populate users, listings, installers, leads and quotes.
          </div>
        </div>
      </div>
    </div>
  )
}
