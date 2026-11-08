import { useState } from 'react'
import { BUSINESS_TYPES } from '../data/mock'
import { Icon } from './ui'

// What an end customer sees: storefront + booking page for a client business.
// Used by the showcase sandbox and the dashboard's "Customer view" toggle.
// The client's own brand color marks selection and identity; everything else stays neutral.
export default function PortalPreview({ name, tagline, type = 'salon', color = '#9da2da', device = 'desktop' }) {
  const services = BUSINESS_TYPES[type].services
  const [picked, setPicked] = useState(null)
  const [slot, setSlot] = useState(null)
  const [booked, setBooked] = useState(false)
  const slots = ['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM']
  const mobile = device === 'mobile'
  const selected = (on) => (on ? { borderColor: color, boxShadow: `inset 0 0 0 1px ${color}` } : undefined)
  const option = 'rounded-lg border border-line bg-raised transition-colors hover:border-fg-3'

  return (
    <div className={`vt-resize mx-auto overflow-hidden rounded-xl border border-line bg-bg ${mobile ? 'max-w-[375px]' : 'w-full'}`}>
      <div className="flex items-center gap-1.5 border-b border-line bg-surface px-3 py-2" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-2 truncate rounded bg-raised px-2 py-0.5 text-xs text-fg-2">{(name || 'your-business').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webrev.site</span>
      </div>

      <header className="border-b border-line px-6 py-8" style={{ borderTop: `3px solid ${color}` }}>
        <p className="flex items-center gap-2 text-[13px] text-fg-2"><span className="h-2 w-2 rounded-full" style={{ background: color }} />{BUSINESS_TYPES[type].label}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{name || 'Your Business'}</h3>
        <p className="mt-1 text-fg-2">{tagline || 'Book online, shop our favorites, and stay in touch.'}</p>
      </header>

      <div className={`grid gap-6 p-6 ${mobile ? '' : 'md:grid-cols-5'}`}>
        <section className={mobile ? '' : 'md:col-span-3'} aria-label="Services">
          <h4 className="mb-3 text-sm font-medium">1. Choose a service</h4>
          <ul className="space-y-2">
            {services.map(([s, price, dur]) => (
              <li key={s}>
                <button onClick={() => { setPicked(s); setBooked(false) }} aria-pressed={picked === s} style={selected(picked === s)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left ${option}`}>
                  <span><span className="block text-sm font-medium">{s}</span><span className="text-[13px] text-fg-2">{dur}</span></span>
                  <span className="text-sm font-medium tabular-nums">${price}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className={mobile ? '' : 'md:col-span-2'} aria-label="Book a time">
          <h4 className="mb-3 text-sm font-medium">2. Pick a time <span className="font-normal text-fg-2">(tomorrow)</span></h4>
          <div className="grid grid-cols-2 gap-2">
            {slots.map((t) => (
              <button key={t} onClick={() => { setSlot(t); setBooked(false) }} aria-pressed={slot === t} style={selected(slot === t)}
                className={`h-9 text-sm tabular-nums ${option}`}>
                {t}
              </button>
            ))}
          </div>
          <button disabled={!picked || !slot} onClick={() => setBooked(true)}
            className="mt-4 h-10 w-full rounded-lg bg-fg text-sm font-medium text-bg transition-opacity disabled:cursor-not-allowed disabled:opacity-30">
            Confirm booking
          </button>
          <p role="status" className="mt-3 min-h-10 text-sm text-fg-2">
            {booked && <span className="flex items-start gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-success" />{picked} booked for {slot}. Reminder text scheduled.</span>}
          </p>
        </section>
      </div>
    </div>
  )
}
