import { useState } from 'react'
import { BUSINESS_TYPES } from '../data/mock'
import { Icon } from './ui'

// What an end customer sees: storefront + booking page for a client business.
// Used by the showcase sandbox and the dashboard's "Customer view" toggle.
export default function PortalPreview({ name, tagline, type = 'salon', color = '#10b981', device = 'desktop' }) {
  const services = BUSINESS_TYPES[type].services
  const [picked, setPicked] = useState(null)
  const [slot, setSlot] = useState(null)
  const [booked, setBooked] = useState(false)
  const slots = ['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM']
  const mobile = device === 'mobile'

  return (
    <div className={`mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-all ${mobile ? 'max-w-[380px]' : 'w-full'}`}>
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /><span className="h-2.5 w-2.5 rounded-full bg-slate-300" /><span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 truncate rounded bg-white px-2 py-0.5 text-xs text-slate-600">{(name || 'your-business').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webrev.site</span>
      </div>

      <header className="px-6 py-10 text-white" style={{ background: `linear-gradient(135deg, #0f172a, ${color})` }}>
        <p className="text-xs font-semibold uppercase tracking-widest opacity-90">{BUSINESS_TYPES[type].label}</p>
        <h3 className="mt-1 text-3xl font-bold">{name || 'Your Business'}</h3>
        <p className="mt-2 max-w-md text-white/90">{tagline || 'Book online, shop our favorites, and stay in touch.'}</p>
      </header>

      <div className={`grid gap-6 p-6 ${mobile ? '' : 'md:grid-cols-5'}`}>
        <section className="md:col-span-3" aria-label="Services">
          <h4 className="mb-3 font-semibold text-slate-900">1. Choose a service</h4>
          <ul className="space-y-2">
            {services.map(([s, price, dur]) => (
              <li key={s}>
                <button
                  onClick={() => { setPicked(s); setBooked(false) }}
                  aria-pressed={picked === s}
                  className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition hover:bg-slate-50"
                  style={picked === s ? { borderColor: color, boxShadow: `0 0 0 1px ${color}` } : undefined}
                >
                  <span><span className="block font-medium text-slate-900">{s}</span><span className="text-sm text-slate-600">{dur}</span></span>
                  <span className="font-semibold text-slate-900">${price}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="md:col-span-2" aria-label="Book a time">
          <h4 className="mb-3 font-semibold text-slate-900">2. Pick a time <span className="font-normal text-slate-600">(tomorrow)</span></h4>
          <div className="grid grid-cols-2 gap-2">
            {slots.map((t) => (
              <button
                key={t}
                onClick={() => { setSlot(t); setBooked(false) }}
                aria-pressed={slot === t}
                className="rounded-lg border px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                style={slot === t ? { borderColor: color, boxShadow: `0 0 0 1px ${color}` } : undefined}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            disabled={!picked || !slot}
            onClick={() => setBooked(true)}
            className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Confirm booking
          </button>
          <p role="status" className="mt-3 min-h-5 text-sm text-slate-700">
            {booked && <span className="inline-flex items-center gap-1"><Icon name="check" className="h-4 w-4 text-emerald-700" /> {picked} booked for {slot}. Reminder text scheduled.</span>}
          </p>
        </section>
      </div>
    </div>
  )
}
