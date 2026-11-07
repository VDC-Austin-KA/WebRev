import { createContext, useContext, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon, Logo } from '../../components/ui'
import PortalPreview from '../../components/PortalPreview'
import { APPOINTMENTS, PTO_REQUESTS } from '../../data/mock'

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: 'home', end: true },
  { to: '/dashboard/calendar', label: 'Calendar & Bookings', icon: 'calendar' },
  { to: '/dashboard/sales', label: 'Sales & Products', icon: 'store' },
  { to: '/dashboard/team', label: 'Team (HR & PTO)', icon: 'users' },
  { to: '/dashboard/payroll', label: 'Payroll', icon: 'wallet' },
  { to: '/dashboard/settings', label: 'Settings', icon: 'settings' },
]

// Shared demo state so changes (e.g. approving PTO, renaming the business) show everywhere.
const DashCtx = createContext(null)
export const useDash = () => useContext(DashCtx)

export default function DashboardLayout() {
  const [business, setBusiness] = useState({ name: 'Bloom & Co. Salon', tagline: 'Modern cuts, warm welcomes.', type: 'salon', color: '#10b981' })
  const [appointments, setAppointments] = useState(APPOINTMENTS)
  const [pto, setPto] = useState(PTO_REQUESTS)
  const [customerView, setCustomerView] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()
  const current = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))

  return (
    <DashCtx.Provider value={{ business, setBusiness, appointments, setAppointments, pto, setPto }}>
      <a href="#dash-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <div className="flex min-h-screen bg-slate-100">
        {navOpen && <div className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden" onClick={() => setNavOpen(false)} aria-hidden="true" />}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-950 p-4 transition-transform lg:static lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-2 py-2">
            <Link to="/"><Logo dark /></Link>
            <button className="rounded p-1 text-slate-300 lg:hidden" onClick={() => setNavOpen(false)} aria-label="Close menu"><Icon name="x" /></button>
          </div>
          <nav className="mt-8 space-y-1" aria-label="Dashboard">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                onClick={() => { setNavOpen(false); setCustomerView(false) }}
                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-emerald-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon name={n.icon} />{n.label}
              </NavLink>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-slate-900 p-4 text-sm">
            <p className="font-semibold text-white">{business.name}</p>
            <p className="text-slate-400">Founding Member plan</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
            <button className="rounded p-1 text-slate-700 lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open menu" aria-expanded={navOpen}><Icon name="menu" className="h-6 w-6" /></button>
            <h1 className="flex-1 truncate text-lg font-bold text-slate-900">{customerView ? 'Customer portal preview' : current?.label}</h1>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800">
              <Icon name="eye" className="hidden h-4 w-4 sm:block" />
              <span className="hidden sm:inline">Customer view</span>
              <span className="sr-only sm:hidden">Customer view</span>
              <input type="checkbox" role="switch" checked={customerView} onChange={(e) => setCustomerView(e.target.checked)} className="peer sr-only" />
              <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-600 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-500 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
            </label>
          </header>
          <main id="dash-main" className="flex-1 p-4 sm:p-6">
            {customerView ? (
              <div>
                <p className="mb-4 text-sm text-slate-600">This is exactly what your customers see at your public booking & storefront page. Edit branding in <Link to="/dashboard/settings" onClick={() => setCustomerView(false)} className="font-medium text-emerald-800 underline">Settings</Link>.</p>
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
