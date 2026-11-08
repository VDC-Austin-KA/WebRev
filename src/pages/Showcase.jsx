import { useState } from 'react'
import { BUSINESS_TYPES, CASE_STUDIES, VIDEOS } from '../data/mock'
import { Button, Icon, Modal, Segmented, Select, SpotsBadge, Tabs, VideoPlayer, card, fieldCls, labelCls } from '../components/ui'
import PortalPreview from '../components/PortalPreview'
import { withTransition } from '../transitions'

const TABS = [
  { id: 'videos', label: 'Video demos' },
  { id: 'cases', label: 'Client transformations' },
  { id: 'sandbox', label: 'Preview your portal' },
]
const tabIndex = (id) => TABS.findIndex((t) => t.id === id)

export default function Showcase() {
  const [tab, setTab] = useState('videos')
  const change = (next) => next !== tab && withTransition(tabIndex(next) > tabIndex(tab) ? 'tab-left' : 'tab-right', () => setTab(next))
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-16 sm:px-6">
        <SpotsBadge />
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">See it working.</h1>
        <p className="mt-4 max-w-2xl text-lg text-fg-2">Feature walk-throughs, before-and-after transformations, and a live preview of what your customers will see.</p>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Tabs tabs={TABS} active={tab} onChange={change} label="Showcase sections" />
        <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="vt-panel mt-8">
          {tab === 'videos' && <VideoGallery />}
          {tab === 'cases' && <CaseStudies />}
          {tab === 'sandbox' && <Sandbox />}
        </div>
      </section>
      <section className="mt-16 border-t border-line py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to replace your stack?</h2>
          <Button to="/#pricing">Claim Early Bird Pricing</Button>
        </div>
      </section>
    </>
  )
}

function VideoGallery() {
  const [playing, setPlaying] = useState(null)
  const [last, setLast] = useState(VIDEOS[0])
  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((v) => (
          <li key={v.id}>
            <button onClick={() => { setLast(v); setPlaying(v) }} className={`${card} group block w-full overflow-hidden text-left transition-colors hover:border-fg-3`}>
              <span className="relative flex aspect-video items-center justify-center border-b border-line bg-bg">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg-2 transition-colors group-hover:border-accent group-hover:text-accent"><Icon name="play" className="h-4 w-4" /></span>
                <span className="absolute bottom-2.5 right-2.5 rounded bg-raised px-1.5 py-0.5 text-xs tabular-nums text-fg-2">{v.length}</span>
              </span>
              <span className="block p-4">
                <span className="text-xs text-fg-2">{v.category}</span>
                <span className="mt-0.5 block font-medium">{v.title}</span>
                <span className="mt-1 block text-sm text-fg-2">{v.summary}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Modal open={!!playing} onClose={() => setPlaying(null)} title={last.title} wide>
        {playing && <VideoPlayer video={playing} />}
      </Modal>
    </>
  )
}

function CaseStudies() {
  return (
    <>
      <p className="mb-6 text-sm text-fg-2">Illustrative examples of typical transformations.</p>
      <div className="grid gap-4 lg:grid-cols-3">
        {CASE_STUDIES.map((c) => (
          <article key={c.business} className={`${card} flex flex-col p-6`}>
            <h3 className="font-semibold">{c.business}</h3>
            <p className="text-sm text-fg-2">{c.owner}</p>
            <div className="mt-5 flex-1 space-y-4 text-sm">
              <div>
                <p className="text-[13px] font-medium text-fg-2">Before</p>
                <ul className="mt-2 space-y-1.5 text-fg-2">{c.before.map((b) => <li key={b} className="flex gap-2"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-fg-3" />{b}</li>)}</ul>
              </div>
              <div className="border-t border-line pt-4">
                <p className="text-[13px] font-medium text-fg-2">After</p>
                <ul className="mt-2 space-y-1.5">{c.after.map((a) => <li key={a} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-green" />{a}</li>)}</ul>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-5">
              {c.stats.map((s) => (
                <div key={s.label}><dt className="text-xs text-fg-2">{s.label}</dt><dd className="text-xl font-semibold tabular-nums">{s.value}</dd></div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </>
  )
}

// Muted swatches in the same family as the WebRev palette.
const SWATCHES = [['#9da2da', 'Austin blue'], ['#009f4d', 'Austin green'], ['#8da9b8', 'Slate blue'], ['#c99a82', 'Clay'], ['#c48e9d', 'Rose']]
const TYPE_OPTIONS = Object.entries(BUSINESS_TYPES).map(([value, v]) => ({ value, label: v.label }))

function Sandbox() {
  const [form, setForm] = useState({ name: 'Bloom & Co. Salon', tagline: 'Modern cuts, warm welcomes.', type: 'salon', color: SWATCHES[0][0] })
  const [device, setDevice] = useState('desktop')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form className={`${card} space-y-5 self-start p-6`} onSubmit={(e) => e.preventDefault()} aria-label="Customize preview">
        <h2 className="font-semibold">Make it yours</h2>
        <div>
          <label htmlFor="sb-name" className={labelCls}>Business name</label>
          <input id="sb-name" value={form.name} onChange={set('name')} maxLength={40} className={fieldCls} />
        </div>
        <div>
          <label htmlFor="sb-tag" className={labelCls}>Tagline</label>
          <input id="sb-tag" value={form.tagline} onChange={set('tagline')} maxLength={80} className={fieldCls} />
        </div>
        <Select label="Business type" options={TYPE_OPTIONS} value={form.type} onChange={set('type')} />
        <fieldset>
          <legend className={labelCls}>Brand color</legend>
          <div className="flex gap-2">
            {SWATCHES.map(([c, label]) => (
              <label key={c} className="cursor-pointer">
                <input type="radio" name="color" value={c} checked={form.color === c} onChange={set('color')} className="peer sr-only" />
                <span className="block h-7 w-7 rounded-full ring-offset-2 ring-offset-surface peer-checked:ring-2 peer-checked:ring-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent" style={{ background: c }} />
                <span className="sr-only">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <p className={labelCls}>Device</p>
          <Segmented label="Device" value={device} onChange={(d) => withTransition('resize', () => setDevice(d))} options={[{ value: 'desktop', label: 'Desktop', icon: 'monitor' }, { value: 'mobile', label: 'Mobile', icon: 'phone' }]} />
        </div>
      </form>
      <div className="lg:col-span-2">
        <PortalPreview {...form} device={device} />
      </div>
    </div>
  )
}
