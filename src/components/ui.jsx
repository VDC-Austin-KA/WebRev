import { useEffect, useRef, useState } from 'react'
import { BRAND, FOUNDER } from '../config'

// Minimal inline icon set (stroke icons, 24x24).
const PATHS = {
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  store: 'M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6',
  users: 'M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 11a4 4 0 100-8 4 4 0 000 8zM21 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  wallet: 'M3 7h18v13H3zM3 7l3-4h12l3 4M16 13.5h2',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z',
  home: 'M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  play: 'M8 5v14l11-7z',
  menu: 'M3 6h18M3 12h18M3 18h18',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  arrow: 'M5 12h14M13 5l7 7-7 7',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
  monitor: 'M3 4h18v12H3zM8 20h8M12 16v4',
  phone: 'M7 2h10a1 1 0 011 1v18a1 1 0 01-1 1H7a1 1 0 01-1-1V3a1 1 0 011-1zM11 18h2',
}

export function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={PATHS[name]} fill={name === 'play' ? 'currentColor' : 'none'} />
    </svg>
  )
}

export function Logo({ dark = false }) {
  return (
    <span className="flex items-center gap-2 font-bold text-lg tracking-tight">
      <img src="/favicon.svg" alt="" className="h-8 w-8" />
      <span className={dark ? 'text-white' : 'text-slate-900'}>{BRAND}</span>
    </span>
  )
}

const BTN = {
  primary: 'bg-emerald-400 text-slate-950 hover:bg-emerald-300',
  dark: 'bg-slate-900 text-white hover:bg-slate-800',
  ghost: 'border border-slate-300 text-slate-900 hover:bg-slate-100',
  ghostDark: 'border border-slate-600 text-white hover:bg-slate-800',
}
export function Button({ variant = 'primary', className = '', as: Tag = 'button', ...props }) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${BTN[variant]} ${className}`}
      {...props}
    />
  )
}

// Native <dialog>: built-in focus trapping, Esc to close, and focus restore.
export function Modal({ open, onClose, title, children, wide = false }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="modal-title"
      className={`m-auto w-[calc(100%-2rem)] ${wide ? 'max-w-4xl' : 'max-w-lg'} rounded-2xl bg-white p-0 shadow-2xl`}
    >
      {open && (
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id="modal-title" className="text-xl font-bold text-slate-900">{title}</h2>
            <button onClick={onClose} className="rounded-md p-1 text-slate-600 hover:bg-slate-100" aria-label="Close dialog">
              <Icon name="x" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}

export function VideoPlayer({ video }) {
  if (video.embedUrl) {
    return video.embedUrl.endsWith('.mp4') ? (
      <video src={video.embedUrl} controls autoPlay className="aspect-video w-full rounded-xl bg-black" />
    ) : (
      <iframe src={video.embedUrl} title={video.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-xl" />
    )
  }
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-center text-white">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400 text-slate-950"><Icon name="play" className="h-7 w-7" /></span>
      <p className="text-lg font-semibold">{video.title}</p>
      <p className="max-w-md text-sm text-slate-300">Recording in production. Book a live walkthrough and we'll show you this on a call.</p>
    </div>
  )
}

// Founder-spot counter. Uses the live endpoint when configured, else the config fallback.
export function useFounderSpots() {
  const [claimed, setClaimed] = useState(FOUNDER.claimedSpots)
  useEffect(() => {
    if (!FOUNDER.endpoint) return
    const ctrl = new AbortController()
    const load = () =>
      fetch(FOUNDER.endpoint, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => Number.isFinite(d.claimed) && setClaimed(Math.min(d.claimed, FOUNDER.totalSpots)))
        .catch(() => {})
    load()
    const t = setInterval(load, 30000)
    return () => { ctrl.abort(); clearInterval(t) }
  }, [])
  return { claimed, left: FOUNDER.totalSpots - claimed, total: FOUNDER.totalSpots }
}

export function SpotsBadge({ dark = false }) {
  const { left, total } = useFounderSpots()
  return (
    <span
      role="status"
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${dark ? 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30' : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Early-Bird Founder Plan: Only {left} of {total} spots left!
    </span>
  )
}

// Accessible tabs (WAI-ARIA pattern with arrow-key navigation).
export function Tabs({ tabs, active, onChange, label }) {
  const onKey = (e, i) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    const next = tabs[(i + d + tabs.length) % tabs.length].id
    onChange(next)
    document.getElementById(`tab-${next}`)?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
      {tabs.map((t, i) => (
        <button
          key={t.id}
          id={`tab-${t.id}`}
          role="tab"
          aria-selected={active === t.id}
          aria-controls={`panel-${t.id}`}
          tabIndex={active === t.id ? 0 : -1}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => onKey(e, i)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${active === t.id ? 'bg-white text-slate-900 shadow' : 'text-slate-700 hover:text-slate-900'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export const money = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
