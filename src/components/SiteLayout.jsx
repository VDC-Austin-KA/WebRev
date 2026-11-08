import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button, Icon, Logo } from './ui'
import { BRAND } from '../config'
import { useIndicator } from '../transitions'

const NAV = [
  { to: '/#features', id: 'features', label: 'Features' },
  { to: '/#pricing', id: 'pricing', label: 'Pricing' },
  { to: '/showcase', id: 'showcase', label: 'Showcase' },
]

/** Which landing section crosses the middle of the viewport, so the nav indicator follows scrolling. */
function useSection(enabled) {
  const [id, setId] = useState(null)
  useEffect(() => {
    if (!enabled) return setId(null)
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean)
    const pick = () => setId(els.find((el) => { const r = el.getBoundingClientRect(); return r.top <= innerHeight / 2 && r.bottom > innerHeight / 2 })?.id ?? null)
    const io = new IntersectionObserver(pick, { rootMargin: '-45% 0px -50% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [enabled])
  return id
}

export default function SiteLayout() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const section = useSection(pathname === '/')
  const active = pathname === '/' ? section : 'showcase'
  const [navRef, indicator] = useIndicator(active)

  return (
    <div className="min-h-screen bg-bg text-fg">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
          <Link to="/" viewTransition aria-label={`${BRAND} home`}><Logo /></Link>
          <div ref={navRef} className="relative hidden items-center gap-1 md:flex">
            <span aria-hidden="true" className="indicator absolute left-0 top-0 rounded-md bg-raised" style={indicator} />
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} viewTransition data-active={active === n.id} aria-current={active === n.id ? 'location' : undefined}
                className={`relative rounded-md px-3 py-1.5 text-[13px] transition-colors ${active === n.id ? 'text-fg' : 'text-fg-2 hover:text-fg'}`}>
                {n.label}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Button to="/dashboard" variant="quiet" size="sm">Client login</Button>
            <Button to="/#pricing" size="sm">Claim founder pricing</Button>
          </div>
          <button className="rounded-md p-2 text-fg md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Toggle menu">
            <Icon name={open ? 'x' : 'menu'} className="h-5 w-5" />
          </button>
        </nav>
        {/* Height animates via grid rows: no JS measuring. */}
        <div id="mobile-nav" className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out)] md:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} inert={!open}>
          <div className="overflow-hidden">
            <div className="border-t border-line px-4 pb-4 pt-1">
              {[...NAV, { to: '/dashboard', label: 'Client login' }].map((n) => (
                <Link key={n.to} to={n.to} viewTransition onClick={() => setOpen(false)} className="block border-b border-line py-3 text-[15px] text-fg">{n.label}</Link>
              ))}
              <Button to="/#pricing" onClick={() => setOpen(false)} className="mt-4 w-full">Claim founder pricing</Button>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="vt-page">
        <Outlet />
      </main>

      <footer className="border-t border-line text-fg-2">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Logo />
            <p className="mt-2 max-w-sm">One platform, one monthly bill, total business control.</p>
          </div>
          <div className="flex gap-6">
            <Link to="/showcase" viewTransition className="hover:text-fg">Showcase</Link>
            <Link to="/#pricing" viewTransition className="hover:text-fg">Pricing</Link>
            <Link to="/dashboard" viewTransition className="hover:text-fg">Dashboard demo</Link>
          </div>
          <p>© {new Date().getFullYear()} {BRAND}</p>
        </div>
      </footer>
    </div>
  )
}
