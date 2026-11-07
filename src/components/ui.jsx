import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { BRAND, FOUNDER } from '../config'
import { easeOut, spring } from '../motion'

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
  chevron: 'M6 9l6 6 6-6',
}

export function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={PATHS[name]} fill={name === 'play' ? 'currentColor' : 'none'} />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-white">
      <img src="/favicon.svg" alt="" className="h-7 w-7" />
      {BRAND}
    </span>
  )
}

const BTN = {
  primary: 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-[0_0_0_0_rgba(52,211,153,0)] hover:shadow-[0_8px_30px_-6px_rgba(52,211,153,0.55)]',
  white: 'bg-white text-black hover:bg-neutral-200',
  glass: 'glass text-white hover:bg-white/10',
}
const MotionLink = motion.create(Link)

/** Pill button with press feedback. Pass `to` to render a router link. */
export function Button({ variant = 'primary', className = '', to, ...props }) {
  const Comp = to ? MotionLink : motion.button
  return (
    <Comp
      to={to}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium transition-[background-color,box-shadow] duration-300 disabled:pointer-events-none disabled:opacity-40 ${BTN[variant]} ${className}`}
      {...props}
    />
  )
}

// Last pointer position, so dialogs can grow out of whatever was clicked.
let lastPointer = { x: 0, y: 0, t: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', (e) => { lastPointer = { x: e.clientX, y: e.clientY, t: Date.now() } }, true)
}
function originPoint() {
  if (Date.now() - lastPointer.t < 800) return lastPointer
  const r = document.activeElement?.getBoundingClientRect?.()
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: innerWidth / 2, y: innerHeight / 2 }
}

/**
 * Native <dialog> (focus trap, Esc, focus restore) whose panel zooms out of the
 * element that opened it and shrinks back into it on close.
 */
export function Modal({ open, onClose, title, children, wide = false }) {
  const ref = useRef(null)
  const titleId = useId()
  const origin = useRef(null)
  const wasOpen = useRef(false)
  if (open && !wasOpen.current) {
    const p = originPoint()
    origin.current = { x: p.x - innerWidth / 2, y: p.y - innerHeight / 2 }
  }
  useEffect(() => {
    wasOpen.current = open
    if (open && !ref.current.open) ref.current.showModal()
  }, [open])
  const o = origin.current ?? { x: 0, y: 0 }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => { e.preventDefault(); onClose() }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-visible bg-transparent p-0"
    >
      <AnimatePresence onExitComplete={() => ref.current?.close()}>
        {open && (
          <div className="flex h-full items-center justify-center p-4">
            <motion.div
              key="backdrop"
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.4, x: o.x, y: o.y }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
              exit={{ opacity: 0, scale: 0.4, x: o.x, y: o.y, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
              className={`relative w-full ${wide ? 'max-w-4xl' : 'max-w-lg'} max-h-[90dvh] overflow-y-auto rounded-3xl border border-white/10 bg-neutral-900/95 p-6 shadow-2xl shadow-black`}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <h2 id={titleId} className="text-xl font-semibold tracking-tight text-white">{title}</h2>
                <motion.button whileTap={{ scale: 0.9 }} whileHover={{ rotate: 90 }} transition={spring} onClick={onClose} className="rounded-full bg-white/10 p-1.5 text-neutral-300 hover:text-white" aria-label="Close dialog">
                  <Icon name="x" className="h-4 w-4" />
                </motion.button>
              </div>
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </dialog>
  )
}

export function VideoPlayer({ video }) {
  if (video.embedUrl) {
    return video.embedUrl.endsWith('.mp4') ? (
      <video src={video.embedUrl} controls autoPlay className="aspect-video w-full rounded-2xl bg-black" />
    ) : (
      <iframe src={video.embedUrl} title={video.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-2xl" />
    )
  }
  return (
    <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 to-black p-6 text-center">
      <motion.span
        className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black"
        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring, delay: 0.15 }}
      >
        <Icon name="play" className="h-7 w-7" />
      </motion.span>
      <p className="text-lg font-semibold text-white">{video.title}</p>
      <p className="max-w-md text-sm text-neutral-400">Recording in production. Book a live walkthrough and we'll show you this on a call.</p>
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
    <span role="status" className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-emerald-300">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      Early-Bird Founder Plan: Only {left} of {total} spots left!
    </span>
  )
}

/** Shared sliding highlight used by tabs and segmented controls. */
function Pill({ id }) {
  return <motion.span layoutId={id} transition={spring} className="absolute inset-0 rounded-full bg-white/15 shadow-sm ring-1 ring-white/10" />
}

// Accessible tabs (WAI-ARIA pattern with arrow-key navigation) and a gliding indicator.
export function Tabs({ tabs, active, onChange, label }) {
  const pill = useId()
  const onKey = (e, i) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    const next = tabs[(i + d + tabs.length) % tabs.length].id
    onChange(next)
    document.getElementById(`tab-${next}`)?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className="glass inline-flex flex-wrap gap-1 rounded-full p-1">
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
          className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${active === t.id ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
        >
          {active === t.id && <Pill id={pill} />}
          <span className="relative">{t.label}</span>
        </button>
      ))}
    </div>
  )
}

/** Toggle-button group (aria-pressed) with the same gliding indicator. */
export function Segmented({ options, value, onChange, label }) {
  const pill = useId()
  return (
    <div role="group" aria-label={label} className="glass inline-flex gap-1 rounded-full p-1">
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}
          className={`relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${value === o.value ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'}`}>
          {value === o.value && <Pill id={pill} />}
          <span className="relative flex items-center gap-1.5">{o.icon && <Icon name={o.icon} className="h-4 w-4" />}{o.label}</span>
        </button>
      ))}
    </div>
  )
}

/** iOS-style switch. */
export function Switch({ checked, onChange, label, showLabel = true }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex items-center gap-2.5 text-sm font-medium text-neutral-200">
      <span className={showLabel ? '' : 'sr-only'}>{label}</span>
      <span className={`flex h-[30px] w-[50px] rounded-full p-[2px] transition-colors duration-300 ${checked ? 'justify-end bg-emerald-500' : 'justify-start bg-white/15'}`}>
        <motion.span layout transition={spring} className="h-[26px] w-[26px] rounded-full bg-white shadow-md" />
      </span>
    </button>
  )
}

/**
 * Animated, accessible select (button + listbox). Controlled via value/onChange,
 * or uncontrolled via defaultValue; `name` submits the value with a form.
 */
export function Select({ label, options, value, defaultValue, onChange, name }) {
  const id = useId()
  const [inner, setInner] = useState(defaultValue ?? options[0].value)
  const current = value ?? inner
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const btn = useRef(null)
  const list = useRef(null)
  const root = useRef(null)
  const idx = Math.max(0, options.findIndex((o) => o.value === current))

  const choose = (v) => { setInner(v); onChange?.(v); setOpen(false); btn.current?.focus() }
  const show = () => { setActive(idx); setOpen(true) }

  useEffect(() => {
    if (!open) return
    list.current?.focus()
    const away = (e) => !root.current?.contains(e.target) && setOpen(false)
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  const onListKey = (e) => {
    const n = options.length
    const map = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: n - 1 }
    if (e.key in map) { e.preventDefault(); setActive((map[e.key] + n) % n) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(options[active].value) }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); btn.current?.focus() }
    else if (e.key === 'Tab') setOpen(false)
  }

  return (
    <div ref={root} className="relative">
      <span id={`${id}-l`} className="mb-1.5 block text-sm font-medium text-neutral-300">{label}</span>
      {name && <input type="hidden" name={name} value={current} />}
      <motion.button
        ref={btn} type="button" whileTap={{ scale: 0.98 }}
        aria-haspopup="listbox" aria-expanded={open} aria-labelledby={`${id}-l ${id}-b`} id={`${id}-b`}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={(e) => ['ArrowDown', 'ArrowUp'].includes(e.key) && (e.preventDefault(), show())}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-left text-white transition-colors hover:bg-white/10"
      >
        {options[idx].label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring}><Icon name="chevron" className="h-4 w-4 text-neutral-400" /></motion.span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={list} role="listbox" tabIndex={-1} aria-labelledby={`${id}-l`}
            aria-activedescendant={`${id}-o${active}`} onKeyDown={onListKey}
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: easeOut } }}
            exit={{ opacity: 0, scale: 0.97, y: -4, transition: { duration: 0.14 } }}
            style={{ transformOrigin: 'top center' }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/95 p-1.5 shadow-2xl shadow-black backdrop-blur-xl outline-none"
          >
            {options.map((o, i) => (
              <motion.li
                key={o.value} id={`${id}-o${i}`} role="option" aria-selected={o.value === current}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.03 * i } }}
                onPointerMove={() => setActive(i)} onClick={() => choose(o.value)}
                className="relative flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-200"
              >
                {i === active && <motion.span layoutId={`${id}-hl`} transition={spring} className="absolute inset-0 rounded-xl bg-white/10" />}
                <span className="relative">{o.label}</span>
                {o.value === current && <Icon name="check" className="relative h-4 w-4 text-emerald-400" />}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export const inputCls = 'w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-white placeholder:text-neutral-500 transition-colors hover:bg-white/10 focus:bg-white/10'

export const money = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
