import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { BRAND, DEMO_VIDEO } from '../config'
import { Button, Icon, Modal, SpotsBadge, VideoPlayer } from '../components/ui'
import Pricing from '../components/Pricing'
import { Reveal, easeOut, fadeUp, inView, stagger } from '../motion'

const FEATURES = [
  { icon: 'calendar', title: 'Customer Booking & Scheduling', body: 'Automated appointment scheduling, calendar sync, and text/email reminders that cut no-shows.' },
  { icon: 'store', title: 'Product & Service Storefront', body: 'A simple catalog to sell services and products online, with built-in card payments.' },
  { icon: 'users', title: 'HR, PTO & Scheduling', body: 'Build shift schedules, approve time-off requests, and keep basic HR records in one place.' },
  { icon: 'wallet', title: 'Payroll Overview', body: 'Track hours and wages, and see clear expense distribution reports every pay period.' },
  { icon: 'inbox', title: 'All-in-One CRM', body: 'A unified inbox and a client profile for every customer — history, notes, and purchases.' },
  { icon: 'chart', title: 'One Dashboard', body: 'Today’s appointments, revenue, team and approvals at a glance. One login, one bill.' },
]

const COMPARE = [
  ['Logins', '5+ separate apps & passwords', 'One login, one dashboard'],
  ['Billing', 'Piecemeal SaaS bills that add up', 'One predictable monthly bill'],
  ['Customer experience', 'Clunky links to different sites', 'One branded site to book & buy'],
  ['Data', 'Customer info scattered everywhere', 'Every client in one profile'],
  ['Support', 'Five help desks, none know your setup', 'One team that knows your business'],
]

const words = (text, cls = 'text-gradient') => text.split(' ').map((w, i) => (
  <motion.span key={i} className={`inline-block ${cls}`} variants={{ hidden: { opacity: 0, y: 24, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: easeOut } } }}>
    {w}&nbsp;
  </motion.span>
))

export default function Landing() {
  const [demo, setDemo] = useState(false)
  const hero = useRef(null)
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const mockY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const mockRotate = useTransform(scrollYProgress, [0, 1], [8, 0])
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <>
      {/* Hero */}
      <section ref={hero} className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-48 left-1/2 h-[640px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(52,211,153,0.22),transparent)]" aria-hidden="true" />
        <motion.div style={{ opacity: heroFade }} className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:px-6 lg:pt-28">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOut }}><SpotsBadge /></motion.div>
          <motion.h1 className="mx-auto mt-8 max-w-5xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl" initial="hidden" animate="show" variants={stagger(0.045, 0.1)}>
            {words('Modernize Your Small Business —')}
            {words('Replace Fragmented Software', 'text-emerald-400')}
            {words('with One Simple Platform.')}
          </motion.h1>
          <motion.div initial="hidden" animate="show" variants={stagger(0.1, 0.7)}>
            <motion.p variants={fadeUp} className="mx-auto mt-7 max-w-2xl text-lg text-neutral-400 sm:text-xl">Cut overhead, manage scheduling, HR, and sales, and give your customers a modern digital experience.</motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/#pricing" className="text-base">Claim Early Bird Pricing (First 100 Businesses)</Button>
              <Button variant="glass" className="text-base" onClick={() => setDemo(true)}><Icon name="play" className="h-4 w-4" /> Watch 2-Min Demo</Button>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-6 text-sm text-neutral-400">No setup fees · Free data migration · Cancel anytime</motion.p>
          </motion.div>
        </motion.div>
        <div className="relative mx-auto max-w-5xl px-4 pb-24 [perspective:1600px] sm:px-6">
          <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: easeOut, delay: 0.9 }}>
            <motion.div style={{ y: mockY, rotateX: mockRotate }}>
              <HeroMock />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core message */}
      <section className="border-y border-white/10 py-16">
        <Reveal as="p" className="mx-auto max-w-4xl px-4 text-center text-2xl font-semibold tracking-tight sm:text-4xl">
          <span className="text-neutral-400">Stop juggling 5+ subscriptions.</span> <span className="text-white">One platform, one monthly bill, total business control.</span>
        </Reveal>
      </section>

      {/* Problem vs solution */}
      <section className="py-28" aria-labelledby="compare-title">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal as="h2" id="compare-title" className="text-gradient text-center text-4xl font-semibold tracking-tight sm:text-6xl">The old way vs. the {BRAND} way.</Reveal>
          <Reveal delay={0.1} className="mt-14 overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950">
            <table className="w-full text-left">
              <caption className="sr-only">Comparison of separate tools versus {BRAND}</caption>
              <thead>
                <tr className="text-sm">
                  <th scope="col" className="hidden p-5 sm:table-cell"><span className="sr-only">Category</span></th>
                  <th scope="col" className="p-5 font-semibold text-rose-300">The Old Way</th>
                  <th scope="col" className="bg-emerald-400/[0.06] p-5 font-semibold text-emerald-300">The {BRAND} Way</th>
                </tr>
              </thead>
              <motion.tbody variants={stagger(0.08)} {...inView}>
                {COMPARE.map(([cat, old, ours]) => (
                  <motion.tr key={cat} variants={fadeUp} className="border-t border-white/10 align-top">
                    <th scope="row" className="hidden p-5 text-sm font-semibold text-neutral-200 sm:table-cell">{cat}</th>
                    <td className="p-5 text-neutral-400"><span className="flex gap-2.5"><Icon name="x" className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" /><span><span className="block text-xs font-semibold text-neutral-400 sm:hidden">{cat}</span>{old}</span></span></td>
                    <td className="bg-emerald-400/[0.06] p-5 font-medium text-white"><span className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />{ours}</span></td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-14 py-28" aria-labelledby="features-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-emerald-400">Everything in one place</p>
            <h2 id="features-title" className="text-gradient mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">The tools you need. None of the juggling.</h2>
          </Reveal>
          <motion.ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={stagger(0.08)} {...inView}>
            {FEATURES.map((f) => (
              <motion.li
                key={f.title} variants={fadeUp} whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-neutral-950 p-7 transition-colors duration-500 hover:border-emerald-400/40"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/0 blur-2xl transition-colors duration-500 group-hover:bg-emerald-400/20" aria-hidden="true" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-emerald-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-400 group-hover:text-black"><Icon name={f.icon} className="h-6 w-6" /></span>
                <h3 className="relative mt-6 text-lg font-semibold">{f.title}</h3>
                <p className="relative mt-2 leading-relaxed text-neutral-400">{f.body}</p>
              </motion.li>
            ))}
          </motion.ul>
          <Reveal className="mt-14 text-center">
            <Button to="/showcase" variant="white">See it in action <Icon name="arrow" className="h-4 w-4" /></Button>
          </Reveal>
        </div>
      </section>

      <Pricing />

      <Modal open={demo} onClose={() => setDemo(false)} title={DEMO_VIDEO.title} wide>
        <VideoPlayer video={DEMO_VIDEO} />
      </Modal>
    </>
  )
}

function HeroMock() {
  const stats = [['Today’s appointments', '12'], ['Revenue today', '$1,460'], ['Team on shift', '3'], ['PTO requests', '2']]
  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-white/20 to-transparent" />
      <div className="relative rounded-[2rem] bg-neutral-950 p-3 shadow-[0_40px_120px_-20px_rgba(52,211,153,0.25)] sm:p-4">
        <div className="flex gap-4 rounded-[1.4rem] bg-black p-4">
          <div className="hidden w-36 shrink-0 space-y-1 sm:block">
            {['Overview', 'Calendar', 'Sales', 'Team', 'Payroll'].map((l, i) => (
              <div key={l} className={`rounded-lg px-3 py-2 text-xs ${i === 0 ? 'bg-white/10 font-medium text-white' : 'text-neutral-500'}`}>{l}</div>
            ))}
          </div>
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map(([l, v]) => (
                <div key={l} className="rounded-xl bg-white/[0.05] p-3 text-left"><p className="text-[11px] text-neutral-400">{l}</p><p className="text-xl font-semibold text-white">{v}</p></div>
              ))}
            </div>
            <div className="flex h-36 items-end gap-2 rounded-xl bg-white/[0.05] p-3">
              {[40, 32, 50, 64, 80, 95, 20].map((h, i) => (
                <motion.div key={i} className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300" style={{ height: `${h}%` }}
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, ease: easeOut, delay: 1.4 + i * 0.06 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -20, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 2 }}
        className="glass absolute -bottom-6 -left-2 hidden rounded-2xl p-4 text-left shadow-2xl sm:block"
      >
        <p className="text-xs text-neutral-400">New booking</p>
        <p className="font-medium text-white">Maria L. · Cut & style · 9:00</p>
      </motion.div>
    </div>
  )
}
