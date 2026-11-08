import { useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

// Route order drives transition direction (see the View Transitions block in index.css).
export const SITE_ORDER = ['/', '/showcase']
export const DASH_NAV = [
  { to: '/dashboard', label: 'Overview', icon: 'home', end: true },
  { to: '/dashboard/calendar', label: 'Calendar & Bookings', icon: 'calendar' },
  { to: '/dashboard/sales', label: 'Sales & Products', icon: 'store' },
  { to: '/dashboard/team', label: 'Team (HR & PTO)', icon: 'users' },
  { to: '/dashboard/payroll', label: 'Payroll', icon: 'wallet' },
  { to: '/dashboard/settings', label: 'Settings', icon: 'settings' },
]

const isDash = (p) => p.startsWith('/dashboard')
const sitePos = (p) => Math.max(0, SITE_ORDER.indexOf(p === '/examples' ? '/showcase' : p))
const dashPos = (p) => Math.max(0, DASH_NAV.findIndex((n) => (n.end ? p === n.to : p.startsWith(n.to))))

export function directionFor(from, to) {
  if (from === to) return 'none'
  if (isDash(from) !== isDash(to)) return isDash(to) ? 'root-in' : 'root-out'
  if (isDash(to)) return dashPos(to) >= dashPos(from) ? 'page-up' : 'page-down'
  return sitePos(to) >= sitePos(from) ? 'page-left' : 'page-right'
}

export const setDirection = (dir) => { document.documentElement.dataset.vt = dir }

/** Tag every in-app link click with its direction before the router starts the transition. */
export function installLinkDirections() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]')
    if (!a || a.origin !== location.origin) return
    setDirection(directionFor(location.pathname, new URL(a.href).pathname))
  }, true)
}

/** Run a state change inside a view transition (no-op wrapper where unsupported). */
export function withTransition(dir, update) {
  if (!document.startViewTransition) return update()
  setDirection(dir)
  document.startViewTransition(() => flushSync(update))
}

/** Positions a sliding indicator under the element matching `selector` inside the returned ref. */
export function useIndicator(key, selector = '[data-active="true"]') {
  const ref = useRef(null)
  const ready = useRef(false)
  const [style, setStyle] = useState({ opacity: 0 })
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const measure = () => {
      const el = selector && root.querySelector(selector)
      if (!el) return setStyle((s) => ({ ...s, opacity: 0 }))
      setStyle({
        width: el.offsetWidth, height: el.offsetHeight, opacity: 1,
        transform: `translate(${el.offsetLeft}px, ${el.offsetTop}px)`,
        transition: ready.current ? undefined : 'none',
      })
      ready.current = true
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => ro.disconnect()
  }, [key, selector])
  return [ref, style]
}
