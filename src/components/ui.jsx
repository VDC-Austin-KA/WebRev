import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BRAND, FOUNDER } from '../config'
import { useIndicator } from '../transitions'

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
  monitor: 'M3 4h18v12H3zM8 20h8M12 16v4',
  phone: 'M7 2h10a1 1 0 011 1v18a1 1 0 01-1 1H7a1 1 0 01-1-1V3a1 1 0 011-1zM11 18h2',
}

export function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={PATHS[name]} fill={name === 'play' ? 'currentColor' : 'none'} />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-fg">
      <img src="/favicon.svg" alt="" className="h-6 w-6" />
      {BRAND}
    </span>
  )
}

// One button system: consistent height, padding and radius; subtle hover/press.
const BTN = {
  primary: 'bg-accent text-bg hover:bg-accent-hover',
  secondary: 'border border-line bg-raised text-fg hover:border-fg-3',
  quiet: 'text-fg-2 hover:text-fg hover:bg-raised',
}
// min-height (not fixed height) so long labels wrap cleanly on narrow screens.
const SIZE = { sm: 'min-h-8 px-3 py-1 text-[13px]', md: 'min-h-10 px-4 py-2 text-sm', lg: 'min-h-11 px-5 py-2.5 text-[15px]' }

/** Pass `to` to render an in-app link. */
export function Button({ variant = 'primary', size = 'md', className = '', to, ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg text-center font-medium transition-colors duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-40 ${BTN[variant]} ${SIZE[size]} ${className}`
  return to ? <Link to={to} viewTransition className={cls} {...props} /> : <button className={cls} {...props} />
}

/** Native <dialog>: focus trap, Esc, focus restore. Enter/exit animation lives in CSS. */
export function Modal({ open, onClose, title, children, wide = false }) {
  const ref = useRef(null)
  const titleId = useId()
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
      aria-labelledby={titleId}
      className={`m-auto w-[calc(100%-2rem)] ${wide ? 'max-w-3xl' : 'max-w-md'} rounded-xl border border-line bg-surface p-0 text-fg shadow-2xl shadow-black/50`}
    >
      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-fg-2 hover:bg-raised hover:text-fg" aria-label="Close dialog">
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}

export function VideoPlayer({ video }) {
  if (video.embedUrl) {
    return video.embedUrl.endsWith('.mp4') ? (
      <video src={video.embedUrl} controls autoPlay className="aspect-video w-full rounded-lg bg-black" />
    ) : (
      <iframe src={video.embedUrl} title={video.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-lg" />
    )
  }
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-lg border border-line bg-bg p-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-fg-2"><Icon name="play" className="h-5 w-5" /></span>
      <p className="font-medium">{video.title}</p>
      <p className="max-w-sm text-sm text-fg-2">Recording in production. Book a live walkthrough and we'll show you this on a call.</p>
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

export function SpotsBadge() {
  const { left, total } = useFounderSpots()
  return (
    <span role="status" className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1 text-[13px] text-fg-2">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
      <span>Early-Bird Founder Plan: Only <span className="font-medium text-fg">{left} of {total}</span> spots left!</span>
    </span>
  )
}

/** Shared sliding highlight used by tabs and segmented controls. */
const Indicator = ({ style }) => <span aria-hidden="true" className="indicator absolute left-0 top-0 rounded-md bg-raised shadow-sm ring-1 ring-line" style={style} />

// Accessible tabs (WAI-ARIA pattern with arrow-key navigation).
export function Tabs({ tabs, active, onChange, label }) {
  const [ref, style] = useIndicator(active)
  const onKey = (e, i) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    const next = tabs[(i + d + tabs.length) % tabs.length].id
    onChange(next)
    document.getElementById(`tab-${next}`)?.focus()
  }
  return (
    <div ref={ref} role="tablist" aria-label={label} className="relative inline-flex flex-wrap gap-1 rounded-lg border border-line bg-surface p-1">
      <Indicator style={style} />
      {tabs.map((t, i) => (
        <button
          key={t.id} id={`tab-${t.id}`} role="tab" data-active={active === t.id}
          aria-selected={active === t.id} aria-controls={`panel-${t.id}`} tabIndex={active === t.id ? 0 : -1}
          onClick={() => onChange(t.id)} onKeyDown={(e) => onKey(e, i)}
          className={`relative h-8 rounded-md px-3.5 text-sm transition-colors ${active === t.id ? 'text-fg' : 'text-fg-2 hover:text-fg'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/** Toggle-button group (aria-pressed) with the same sliding indicator. */
export function Segmented({ options, value, onChange, label }) {
  const [ref, style] = useIndicator(value)
  return (
    <div ref={ref} role="group" aria-label={label} className="relative inline-flex gap-1 rounded-lg border border-line bg-surface p-1">
      <Indicator style={style} />
      {options.map((o) => (
        <button key={o.value} type="button" data-active={value === o.value} aria-pressed={value === o.value} onClick={() => onChange(o.value)}
          className={`relative flex h-8 items-center gap-1.5 rounded-md px-3 text-sm transition-colors ${value === o.value ? 'text-fg' : 'text-fg-2 hover:text-fg'}`}>
          {o.icon && <Icon name={o.icon} className="h-4 w-4" />}{o.label}
        </button>
      ))}
    </div>
  )
}

/** Native-feeling switch. */
export function Switch({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex items-center gap-2.5 text-sm text-fg-2 hover:text-fg">
      {label}
      <span className={`flex h-6 w-10 items-center rounded-full p-0.5 transition-colors duration-200 ${checked ? 'bg-accent' : 'bg-line'}`}>
        <span className={`h-5 w-5 rounded-full bg-fg shadow transition-transform duration-200 ease-[var(--ease-out)] ${checked ? 'translate-x-4' : ''}`} />
      </span>
    </button>
  )
}

export const fieldCls = 'field h-10 w-full rounded-lg border border-line bg-raised px-3 text-sm text-fg placeholder:text-fg-3 transition-colors hover:border-fg-3 focus:border-accent'
export const labelCls = 'mb-1.5 block text-[13px] font-medium text-fg-2'

/** Labelled native select. */
export function Select({ label, options, ...props }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className={labelCls}>{label}</label>
      <select id={id} className={fieldCls} {...props}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export const card = 'rounded-xl border border-line bg-surface'

export const money = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
