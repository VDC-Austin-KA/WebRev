import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Button, Icon, Logo } from './ui'
import { BRAND } from '../config'

const NAV = [
  { to: '/#features', label: 'Features' },
  { to: '/#pricing', label: 'Pricing' },
  { to: '/showcase', label: 'Showcase' },
]

export default function SiteLayout() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main">
          <Link to="/" aria-label={`${BRAND} home`}><Logo dark /></Link>
          <div className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className="text-sm font-medium text-slate-300 hover:text-white">{n.label}</NavLink>)}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white">Client login</Link>
            <Button as={Link} to="/#pricing" className="py-2">Claim founder pricing</Button>
          </div>
          <button className="rounded-md p-2 text-white md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Toggle menu">
            <Icon name={open ? 'x' : 'menu'} className="h-6 w-6" />
          </button>
        </nav>
        {open && (
          <div id="mobile-nav" className="border-t border-slate-800 px-4 pb-4 md:hidden">
            {[...NAV, { to: '/dashboard', label: 'Client login' }].map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-3 font-medium text-slate-200">{n.label}</Link>
            ))}
            <Button as={Link} to="/#pricing" onClick={() => setOpen(false)} className="mt-2 w-full">Claim founder pricing</Button>
          </div>
        )}
      </header>
      <main id="main"><Outlet /></main>
      <footer className="bg-slate-950 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Logo dark />
            <p className="mt-2 max-w-sm text-sm">One platform, one monthly bill, total business control.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/showcase" className="hover:text-white">Showcase</Link>
            <Link to="/#pricing" className="hover:text-white">Pricing</Link>
            <Link to="/dashboard" className="hover:text-white">Dashboard demo</Link>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} {BRAND}</p>
        </div>
      </footer>
    </>
  )
}
