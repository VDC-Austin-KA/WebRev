import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BUSINESS_TYPES } from '../data/mock'
import { Icon } from './ui'
import { easeOut, spring, stagger } from '../motion'

const item = { hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: easeOut } } }

// What an end customer sees: storefront + booking page for a client business.
// Used by the showcase sandbox and the dashboard's "Customer view" toggle.
export default function PortalPreview({ name, tagline, type = 'salon', color = '#10b981', device = 'desktop' }) {
  const services = BUSINESS_TYPES[type].services
  const ring = useId()
  const [picked, setPicked] = useState(null)
  const [slot, setSlot] = useState(null)
  const [booked, setBooked] = useState(false)
  const slots = ['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM']
  const mobile = device === 'mobile'
  const ringEl = (id) => <motion.span layoutId={id} transition={spring} className="absolute inset-0 rounded-xl" style={{ boxShadow: `inset 0 0 0 2px ${color}` }} />

  return (
    <motion.div
      layout
      transition={spring}
      className={`mx-auto overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl shadow-black ${mobile ? 'max-w-[380px] rounded-[2.5rem]' : 'w-full rounded-3xl'}`}
    >
      <motion.div layout="position" className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-4 py-2.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate rounded-md bg-white/5 px-2 py-0.5 text-xs text-neutral-400">{(name || 'your-business').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webrev.site</span>
      </motion.div>

      <motion.header layout="position" className="relative overflow-hidden px-6 py-12">
        <div className="absolute inset-0 opacity-70 transition-[background-color] duration-700" style={{ backgroundColor: color, maskImage: 'linear-gradient(120deg, transparent 10%, black 120%)', WebkitMaskImage: 'linear-gradient(120deg, transparent 10%, black 120%)' }} />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{BUSINESS_TYPES[type].label}</p>
          <h3 className="mt-1 text-3xl font-semibold tracking-tight text-white">{name || 'Your Business'}</h3>
          <p className="mt-2 max-w-md text-white/80">{tagline || 'Book online, shop our favorites, and stay in touch.'}</p>
        </div>
      </motion.header>

      <motion.div layout="position" className={`grid gap-6 p-6 ${mobile ? '' : 'md:grid-cols-5'}`}>
        <section className={mobile ? '' : 'md:col-span-3'} aria-label="Services">
          <h4 className="mb-3 text-sm font-semibold text-neutral-200">1. Choose a service</h4>
          <AnimatePresence mode="wait">
            <motion.ul key={type} variants={stagger(0.05)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.15 } }} className="space-y-2">
              {services.map(([s, price, dur]) => (
                <motion.li key={s} variants={item}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setPicked(s); setBooked(false) }}
                    aria-pressed={picked === s}
                    className="relative flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-left transition-colors hover:bg-white/10"
                  >
                    {picked === s && ringEl(`${ring}-svc`)}
                    <span><span className="block font-medium text-white">{s}</span><span className="text-sm text-neutral-400">{dur}</span></span>
                    <span className="font-semibold text-white">${price}</span>
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </section>

        <section className={mobile ? '' : 'md:col-span-2'} aria-label="Book a time">
          <h4 className="mb-3 text-sm font-semibold text-neutral-200">2. Pick a time <span className="font-normal text-neutral-400">(tomorrow)</span></h4>
          <div className="grid grid-cols-2 gap-2">
            {slots.map((t) => (
              <motion.button
                key={t}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSlot(t); setBooked(false) }}
                aria-pressed={slot === t}
                className="relative rounded-xl bg-white/5 px-3 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/10"
              >
                {slot === t && ringEl(`${ring}-slot`)}
                <span className="relative">{t}</span>
              </motion.button>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!picked || !slot}
            onClick={() => setBooked(true)}
            className="mt-4 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            Confirm booking
          </motion.button>
          <div role="status" className="mt-3 min-h-10 text-sm text-neutral-300">
            <AnimatePresence>
              {booked && (
                <motion.p initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={spring} className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-black"><Icon name="check" className="h-3 w-3" /></span>
                  {picked} booked for {slot}. Reminder text scheduled.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </section>
      </motion.div>
    </motion.div>
  )
}
