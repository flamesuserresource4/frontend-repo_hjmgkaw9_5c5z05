import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import ListingCard from './components/ListingCard'
import QuotesView from './components/QuotesView'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function ListingsView() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/listings`)
        const data = await res.json()
        setItems(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Shop Solar</h2>
          <p className="text-blue-200/80">Panels, inverters, batteries and turnkey packages</p>
        </div>
        <div className="flex gap-2">
          <button onClick={async ()=>{
            const sample = {
              title: '450W Mono PERC Panel',
              description: 'High-efficiency Tier-1 module ideal for residential rooftops',
              product_type: 'panel',
              brand: 'SunPeak',
              wattage: 450,
              price: 219.0,
              images: ['https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1200&auto=format&fit=crop']
            }
            await fetch(`${API_BASE}/listings`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(sample)})
            const res = await fetch(`${API_BASE}/listings`)
            setItems(await res.json())
          }} className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">Add sample</button>
          <button onClick={async ()=>{
            await fetch(`${API_BASE}/seed`, { method: 'POST' })
            const res = await fetch(`${API_BASE}/listings`)
            setItems(await res.json())
          }} className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm">Seed all mock data</button>
        </div>
      </div>
      {loading ? (
        <div className="text-blue-200">Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(it => (
            <ListingCard key={it._id} item={it} />
          ))}
        </div>
      )}
    </div>
  )
}

function LeadForm() {
  const [form, setForm] = useState({ buyer_name: '', buyer_email: '', city: '', state: '' })
  const [status, setStatus] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setStatus('Submitting...')
    try {
      const res = await fetch(`${API_BASE}/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) setStatus('Request sent! We\'ll connect you with installers.')
      else setStatus(data.detail || 'Error creating request')
    } catch (e) {
      setStatus(e.message)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Get a Quote</h2>
      <form onSubmit={submit} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6 grid md:grid-cols-2 gap-4">
        <input className="bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="Your name" value={form.buyer_name} onChange={e=>setForm({...form,buyer_name:e.target.value})} />
        <input type="email" className="bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="Email" value={form.buyer_email} onChange={e=>setForm({...form,buyer_email:e.target.value})} />
        <input className="bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
        <input className="bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="State" value={form.state} onChange={e=>setForm({...form,state:e.target.value})} />
        <input className="bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="Avg monthly bill (USD)" onChange={e=>setForm({...form,avg_monthly_bill_usd:Number(e.target.value)||undefined})} />
        <textarea className="md:col-span-2 bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="Notes" value={form.notes||''} onChange={e=>setForm({...form,notes:e.target.value})} />
        <button className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">Submit</button>
        {status && <div className="md:col-span-2 text-blue-200 mt-2">{status}</div>}
      </form>
    </div>
  )
}

function InstallersView() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ user_id: '', services: '', areas: '' })

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_BASE}/installers`)
      setItems(await res.json())
    }
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const payload = {
      user_id: form.user_id || 'demo-user-id',
      services: form.services ? form.services.split(',').map(s=>s.trim()) : ['residential', 'maintenance'],
      areas: form.areas ? form.areas.split(',').map(s=>s.trim()) : ['NYC'],
    }
    await fetch(`${API_BASE}/installers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const res = await fetch(`${API_BASE}/installers`)
    setItems(await res.json())
    setForm({ user_id: '', services: '', areas: '' })
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Find Installers</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((it) => (
              <div key={it._id} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
                <div className="text-white font-semibold">Installer {it.user_id?.slice(0,6)}</div>
                <div className="text-blue-200/80 text-sm">Services: {it.services?.join(', ')}</div>
                <div className="text-blue-200/80 text-sm">Areas: {it.areas?.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">List your services</h3>
          <form onSubmit={submit} className="space-y-2 bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
            <input className="w-full bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="User ID (optional)" value={form.user_id} onChange={e=>setForm({...form,user_id:e.target.value})} />
            <input className="w-full bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="Services (comma separated)" value={form.services} onChange={e=>setForm({...form,services:e.target.value})} />
            <input className="w-full bg-slate-900/60 text-white px-3 py-2 rounded" placeholder="Areas (comma separated)" value={form.areas} onChange={e=>setForm({...form,areas:e.target.value})} />
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">Save</button>
          </form>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [tab, setTab] = useState('listings')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      <Navbar current={tab} onNavigate={setTab} />
      {tab === 'listings' && <ListingsView />}
      {tab === 'lead' && <LeadForm />}
      {tab === 'installers' && <InstallersView />}
      {tab === 'quotes' && <QuotesView />}
      <footer className="py-10 text-center text-blue-300/60">Powered by Flames</footer>
    </div>
  )
}

export default App
