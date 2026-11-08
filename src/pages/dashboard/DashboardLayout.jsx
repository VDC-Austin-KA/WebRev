import { createContext, useContext, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon, Logo, Switch } from '../../components/ui'
import PortalPreview from '../../components/PortalPreview'
import { APPOINTMENTS, PTO_REQUESTS } from '../../data/mock'
import { DASH_NAV, setDirection, useIndicator, withTransition } from '../../transitions'

// Shared demo state so changes (e.g. approving PTO, renaming the business) show everywhere.
const DashCtx = createContext(null)
export const useDash = () => useContext(DashCtx)

export default function DashboardLayout() {
  const [business, setBusiness] = useState({ name: 'Bloom & Co. Salon', tagline: 'Modern cuts, warm welcomes.', type: 'salon', color: '#9da2da' })
  const [appointments, setAppointments] = useState(APPOINTMENTS)
  const [pto, setPto] = useState(PTO_REQUESTS)
  const [customerView, setCustomerView] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()
  const current = DASH_NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to))) ?? DASH_NAV[0]
  const [navRef, indicator] = useIndicator(customerView ? 'none' : pathname, customerView ? null : '[aria-current="page"]')
  const toggleView = (on) => withTransition(on ? 'page-in' : 'page-out', () => setCustomerView(on))

  return (
    <DashCtx.Provider value={{ business, setBusiness, appointments, setAppointments, pto, setPto }}>
      <a href="#dash-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg">Skip to content</a>
      <div className="flex min-h-screen bg-bg text-fg">
        {navOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setNavOpen(false)} aria-hidden="true" />}
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-line bg-surface px-3 py-4 transition-transform duration-300 ease-[var(--ease-out)] lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-2">
            <Link to="/" viewTransition><Logo /></Link>
            <button className="rounded-md p-1 text-fg-2 lg:hidden" onClick={() => setNavOpen(false)} aria-label="Close menu"><Icon name="x" /></button>
          </div>
          <nav ref={navRef} className="relative mt-8 space-y-0.5" aria-label="Dashboard">
            <span aria-hidden="true" className="indicator absolute left-0 top-0 rounded-md bg-raised" style={indicator}>
              <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
            </span>
            {DASH_NAV.map((n) => (
              <NavLink
                key={n.to} to={n.to} end={n.end} viewTransition
                onClick={() => {
                  setNavOpen(false)
                  if (customerView) { setCustomerView(false); setDirection('page-out') }
                }}
                className={({ isActive }) => `relative flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors ${isActive && !customerView ? 'text-fg' : 'text-fg-2 hover:text-fg'}`}
              >
                <Icon name={n.icon} className="h-4 w-4" />{n.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto border-t border-line px-2 pt-4 text-sm">
            <p className="font-medium">{business.name}</p>
            <p className="text-fg-2">Founding Member plan</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-bg px-4 sm:px-6">
            <button className="rounded-md p-1 text-fg-2 lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open menu" aria-expanded={navOpen}><Icon name="menu" className="h-5 w-5" /></button>
            <h1 className="vt-title flex-1 truncate text-[15px] font-semibold">{customerView ? 'Customer portal preview' : current.label}</h1>
            <span className="flex items-center gap-2">
              <Icon name="eye" className="hidden h-4 w-4 text-fg-2 sm:block" />
              <Switch label="Customer view" checked={customerView} onChange={toggleView} />
            </span>
          </header>
          <main id="dash-main" className="vt-page flex-1 p-4 sm:p-6">
            {customerView ? (
              <div className="mx-auto max-w-5xl">
                <p className="mb-4 text-sm text-fg-2">This is exactly what your customers see at your public booking & storefront page. Edit branding in <Link to="/dashboard/settings" viewTransition onClick={() => { setCustomerView(false); setDirection('page-out') }} className="text-accent hover:underline">Settings</Link>.</p>
                <PortalPreview {...business} />
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </DashCtx.Provider>
  )
}
