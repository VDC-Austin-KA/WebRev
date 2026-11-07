import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BUSINESS_TYPES, CASE_STUDIES, VIDEOS } from '../data/mock'
import { Button, Icon, Modal, Segmented, Select, SpotsBadge, Tabs, VideoPlayer, inputCls } from '../components/ui'
import PortalPreview from '../components/PortalPreview'
import { Reveal, easeOut, fadeUp, flow, spring, stagger, useFlow } from '../motion'

const TABS = [
  { id: 'videos', label: 'Video demos' },
  { id: 'cases', label: 'Client transformations' },
  { id: 'sandbox', label: 'Preview your portal' },
]

export default function Showcase() {
  const [tab, setTab] = useState('videos')
  const dir = useFlow(tab, TABS.findIndex((t) => t.id === tab), 'x')
  return (
    <>
      <section className="relative overflow-hidden pb-6 pt-20 text-center">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(52,211,153,0.18),transparent)]" aria-hidden="true" />
        <motion.div className="relative mx-auto max-w-6xl px-4 sm:px-6" initial="hidden" animate="show" variants={stagger(0.1)}>
          <motion.div variants={fadeUp}><SpotsBadge /></motion.div>
          <motion.h1 variants={fadeUp} className="text-gradient mt-6 text-5xl font-semibold tracking-tight sm:text-7xl">See it working.</motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-lg text-neutral-400">Feature walk-throughs, before-and-after transformations, and a live preview of what your customers will see.</motion.p>
        </motion.div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex justify-center"><Tabs tabs={TABS} active={tab} onChange={setTab} label="Showcase sections" /></div>
        <div className="mt-12">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={tab} custom={dir} variants={flow} initial="initial" animate="animate" exit="exit" id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
              {tab === 'videos' && <VideoGallery />}
              {tab === 'cases' && <CaseStudies />}
              {tab === 'sandbox' && <Sandbox />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      <section className="py-28 text-center">
        <Reveal>
          <h2 className="text-gradient text-4xl font-semibold tracking-tight sm:text-5xl">Ready to replace your stack?</h2>
          <Button to="/#pricing" className="mt-8">Claim Early Bird Pricing</Button>
        </Reveal>
      </section>
    </>
  )
}

function VideoGallery() {
  const [playing, setPlaying] = useState(null)
  return (
    <>
      <motion.ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" variants={stagger(0.06)} initial="hidden" animate="show">
        {VIDEOS.map((v) => (
          <motion.li key={v.id} variants={fadeUp}>
            <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} transition={spring} onClick={() => setPlaying(v)} className="group block w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-neutral-950 text-left">
              <span className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-800 to-black">
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.25),transparent_60%)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-125" aria-hidden="true" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-black shadow-xl transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110"><Icon name="play" className="h-6 w-6" /></span>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">{v.length}</span>
                <span className="glass absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium text-white">{v.category}</span>
              </span>
              <span className="block p-5">
                <span className="block font-semibold text-white">{v.title}</span>
                <span className="mt-1 block text-sm text-neutral-400">{v.summary}</span>
              </span>
            </motion.button>
          </motion.li>
        ))}
      </motion.ul>
      <Modal open={!!playing} onClose={() => setPlaying(null)} title={playing?.title ?? ''} wide>
        {playing && <VideoPlayer video={playing} />}
      </Modal>
    </>
  )
}

function CaseStudies() {
  return (
    <>
      <p className="mb-6 text-center text-sm text-neutral-400">Illustrative examples of typical transformations.</p>
      <motion.div className="grid gap-5 lg:grid-cols-3" variants={stagger(0.1)} initial="hidden" animate="show">
        {CASE_STUDIES.map((c) => (
          <motion.article key={c.business} variants={fadeUp} className="flex flex-col rounded-[1.75rem] border border-white/10 bg-neutral-950 p-6">
            <h3 className="text-xl font-semibold">{c.business}</h3>
            <p className="text-sm text-neutral-400">{c.owner}</p>
            <div className="mt-5 flex-1 space-y-3">
              <div className="rounded-2xl bg-rose-400/[0.07] p-4 ring-1 ring-rose-400/15">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">Before</p>
                <ul className="mt-2 space-y-1.5 text-sm text-neutral-300">{c.before.map((b) => <li key={b} className="flex gap-2"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />{b}</li>)}</ul>
              </div>
              <div className="flex justify-center text-neutral-500" aria-hidden="true"><Icon name="chevron" className="h-5 w-5" /></div>
              <div className="rounded-2xl bg-emerald-400/[0.07] p-4 ring-1 ring-emerald-400/20">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">After</p>
                <ul className="mt-2 space-y-1.5 text-sm text-neutral-200">{c.after.map((a) => <li key={a} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{a}</li>)}</ul>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
              {c.stats.map((s) => (
                <div key={s.label}><dt className="text-xs text-neutral-400">{s.label}</dt><dd className="text-2xl font-semibold tracking-tight">{s.value}</dd></div>
              ))}
            </dl>
          </motion.article>
        ))}
      </motion.div>
    </>
  )
}

const SWATCHES = [['#10b981', 'Emerald'], ['#6366f1', 'Indigo'], ['#e11d48', 'Rose'], ['#f59e0b', 'Amber'], ['#0ea5e9', 'Sky']]
const TYPE_OPTIONS = Object.entries(BUSINESS_TYPES).map(([value, v]) => ({ value, label: v.label }))

function Sandbox() {
  const [form, setForm] = useState({ name: 'Bloom & Co. Salon', tagline: 'Modern cuts, warm welcomes.', type: 'salon', color: SWATCHES[0][0] })
  const [device, setDevice] = useState('desktop')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <motion.form
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: easeOut }}
        className="space-y-5 self-start rounded-[1.75rem] border border-white/10 bg-neutral-950 p-6" onSubmit={(e) => e.preventDefault()} aria-label="Customize preview"
      >
        <h2 className="text-lg font-semibold">Make it yours</h2>
        <div>
          <label htmlFor="sb-name" className="mb-1.5 block text-sm font-medium text-neutral-300">Business name</label>
          <input id="sb-name" value={form.name} onChange={set('name')} maxLength={40} className={inputCls} />
        </div>
        <div>
          <label htmlFor="sb-tag" className="mb-1.5 block text-sm font-medium text-neutral-300">Tagline</label>
          <input id="sb-tag" value={form.tagline} onChange={set('tagline')} maxLength={80} className={inputCls} />
        </div>
        <Select label="Business type" options={TYPE_OPTIONS} value={form.type} onChange={(type) => setForm({ ...form, type })} />
        <fieldset>
          <legend className="text-sm font-medium text-neutral-300">Brand color</legend>
          <div className="mt-2 flex gap-2.5">
            {SWATCHES.map(([c, label]) => (
              <label key={c} className="relative cursor-pointer">
                <input type="radio" name="color" value={c} checked={form.color === c} onChange={set('color')} className="peer sr-only" />
                <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="block h-9 w-9 rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-emerald-400" style={{ background: c }} />
                {form.color === c && <motion.span layoutId="swatch-ring" transition={spring} className="pointer-events-none absolute -inset-1 rounded-full ring-2 ring-white" />}
                <span className="sr-only">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-300">Device</p>
          <Segmented label="Device" value={device} onChange={setDevice} options={[{ value: 'desktop', label: 'Desktop', icon: 'monitor' }, { value: 'mobile', label: 'Mobile', icon: 'phone' }]} />
        </div>
      </motion.form>
      <div className="lg:col-span-2">
        <PortalPreview {...form} device={device} />
      </div>
    </div>
  )
}
