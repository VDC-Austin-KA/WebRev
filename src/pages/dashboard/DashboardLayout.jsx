import { createContext, useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Icon, Logo, Switch } from '../../components/ui'
import PortalPreview from '../../components/PortalPreview'
import { APPOINTMENTS, PTO_REQUESTS } from '../../data/mock'
import { FrozenOutlet, Page, spring, useFlow, useRouteLocation } from '../../motion'

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
  const { pathname } = useRouteLocation()
  const idx = Math.max(0, NAV.findIndex((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to))))
  const key = customerView ? 'customer' : pathname
  // Sidebar is vertical → pages move along y. Customer view is a layer "inside" → zoom.
  const dir = useFlow(key, customerView ? NAV.length : idx, (a, b) => (a === 'customer' || b === 'customer' ? 'z' : 'y'))
  const title = customerView ? 'Customer portal preview' : NAV[idx].label

  return (
    <DashCtx.Provider value={{ business, setBusiness, appointments, setAppointments, pto, setPto }}>
      <a href="#dash-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
      <div className="flex min-h-screen bg-black text-neutral-100">
        <AnimatePresence>
          {navOpen && <motion.div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNavOpen(false)} aria-hidden="true" />}
        </AnimatePresence>
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-neutral-950/95 p-4 backdrop-blur-xl transition-transform duration-500 ease-[var(--ease-apple)] lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-2 py-2">
            <Link to="/"><Logo /></Link>
            <button className="rounded-full p-1 text-neutral-400 lg:hidden" onClick={() => setNavOpen(false)} aria-label="Close menu"><Icon name="x" /></button>
          </div>
          <nav className="mt-8 space-y-1" aria-label="Dashboard">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                onClick={() => { setNavOpen(false); setCustomerView(false) }}
                className={({ isActive }) => `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300 ${isActive && !customerView ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && !customerView && (
                      <motion.span layoutId="sidebar-pill" transition={spring} className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-white/10">
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-emerald-400" />
                      </motion.span>
                    )}
                    <span className="relative"><Icon name={n.icon} /></span>
                    <span className="relative">{n.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="glass mt-auto rounded-2xl p-4 text-sm">
            <p className="font-medium text-white">{business.name}</p>
            <p className="text-neutral-400">Founding Member plan</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-black/70 px-4 backdrop-blur-xl sm:px-6">
            <button className="rounded-full p-1 text-neutral-300 lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open menu" aria-expanded={navOpen}><Icon name="menu" className="h-6 w-6" /></button>
            <div className="relative h-7 flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={dir}>
                <motion.h1
                  key={title} custom={dir}
                  variants={{
                    initial: ({ axis, d }) => ({ opacity: 0, y: axis === 'z' ? 0 : d * 20, scale: axis === 'z' ? 0.9 : 1 }),
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: ({ axis, d }) => ({ opacity: 0, y: axis === 'z' ? 0 : -d * 20, scale: axis === 'z' ? 1.1 : 1 }),
                  }}
                  initial="initial" animate="animate" exit="exit" transition={spring}
                  className="absolute inset-0 origin-left truncate text-lg font-semibold tracking-tight"
                >
                  {title}
                </motion.h1>
              </AnimatePresence>
            </div>
            <span className="flex items-center gap-2">
              <Icon name="eye" className="hidden h-4 w-4 text-neutral-400 sm:block" />
              <Switch label="Customer view" checked={customerView} onChange={setCustomerView} />
            </span>
          </header>
          <main id="dash-main" className="flex-1 overflow-x-clip p-4 sm:p-6">
            <AnimatePresence mode="wait" custom={dir}>
              <Page key={key} custom={dir}>
                {customerView ? (
                  <div>
                    <p className="mb-5 text-sm text-neutral-400">This is exactly what your customers see at your public booking & storefront page. Edit branding in <Link to="/dashboard/settings" onClick={() => setCustomerView(false)} className="font-medium text-emerald-400 underline-offset-4 hover:underline">Settings</Link>.</p>
                    <PortalPreview {...business} />
                  </div>
                ) : (
                  <FrozenOutlet />
                )}
              </Page>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </DashCtx.Provider>
  )
}
