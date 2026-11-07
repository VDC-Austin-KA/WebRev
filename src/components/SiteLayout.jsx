import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { Button, Icon, Logo } from './ui'
import { BRAND } from '../config'
import { FrozenOutlet, Page, easeOut, spring, useFlow, useRouteLocation } from '../motion'

const NAV = [
  { to: '/#features', id: 'features', label: 'Features' },
  { to: '/#pricing', id: 'pricing', label: 'Pricing' },
  { to: '/showcase', id: 'showcase', label: 'Showcase' },
]
const pageIndex = (p) => (p === '/' ? 0 : 1)

/** Which landing section is on screen, so the nav pill can follow scrolling. */
function useSection(enabled) {
  const [id, setId] = useState(null)
  useEffect(() => {
    if (!enabled) return setId(null)
    let io, raf
    // The landing page mounts only after the previous page finishes exiting, so wait for it.
    const attach = () => {
      const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean)
      if (!els.length) { raf = requestAnimationFrame(attach); return }
      // Re-evaluate every section on each change so large scroll jumps stay accurate.
      const mid = () => innerHeight / 2
      io = new IntersectionObserver(
        () => setId(els.find((el) => { const r = el.getBoundingClientRect(); return r.top <= mid() && r.bottom > mid() })?.id ?? null),
        { rootMargin: '-45% 0px -50% 0px' },
      )
      els.forEach((el) => io.observe(el))
    }
    attach()
    return () => { cancelAnimationFrame(raf); io?.disconnect() }
  }, [enabled])
  return id
}

export default function SiteLayout() {
  const location = useRouteLocation()
  const { hash } = useLocation()
  const [open, setOpen] = useState(false)
  const flowDir = useFlow(location.pathname, pageIndex(location.pathname), 'x')
  const section = useSection(location.pathname === '/')
  const active = location.pathname === '/' ? section : 'showcase'
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  // Same-page anchor links glide to their section.
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }) }, [hash])

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl backdrop-saturate-150">
        <motion.div className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-emerald-400 to-emerald-200" style={{ scaleX: progress }} aria-hidden="true" />
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
          <Link to="/" aria-label={`${BRAND} home`}><Logo /></Link>
          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} aria-current={active === n.id ? 'location' : undefined} className={`relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-300 ${active === n.id ? 'text-white' : 'text-neutral-400 hover:text-white'}`}>
                {active === n.id && <motion.span layoutId="nav-pill" transition={spring} className="absolute inset-0 rounded-full bg-white/10" />}
                <span className="relative">{n.label}</span>
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Link to="/dashboard" className="text-[13px] font-medium text-neutral-400 transition-colors hover:text-white">Client login</Link>
            <Button to="/#pricing" className="px-4 py-1.5 text-[13px]">Claim founder pricing</Button>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} className="rounded-full p-2 text-white md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Toggle menu">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={open ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} className="block">
                <Icon name={open ? 'x' : 'menu'} className="h-6 w-6" />
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="overflow-hidden border-t border-white/10 md:hidden"
            >
              <motion.div className="px-4 pb-5 pt-2" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}>
                {[...NAV, { to: '/dashboard', label: 'Client login' }].map((n) => (
                  <motion.div key={n.to} variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>
                    <Link to={n.to} onClick={() => setOpen(false)} className="block border-b border-white/5 py-3.5 text-lg font-medium text-neutral-100">{n.label}</Link>
                  </motion.div>
                ))}
                <motion.div variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}>
                  <Button to="/#pricing" onClick={() => setOpen(false)} className="mt-4 w-full">Claim founder pricing</Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="main" className="overflow-x-clip">
        <AnimatePresence mode="wait" custom={flowDir}>
          <Page key={location.pathname} custom={flowDir}>
            <FrozenOutlet />
          </Page>
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/10 text-neutral-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Logo />
            <p className="mt-2 max-w-sm text-sm">One platform, one monthly bill, total business control.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/showcase" className="transition-colors hover:text-white">Showcase</Link>
            <Link to="/#pricing" className="transition-colors hover:text-white">Pricing</Link>
            <Link to="/dashboard" className="transition-colors hover:text-white">Dashboard demo</Link>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} {BRAND}</p>
        </div>
      </footer>
    </div>
  )
}
