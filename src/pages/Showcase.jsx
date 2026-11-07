import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BUSINESS_TYPES, CASE_STUDIES, VIDEOS } from '../data/mock'
import { Button, Icon, Modal, SpotsBadge, Tabs, VideoPlayer } from '../components/ui'
import PortalPreview from '../components/PortalPreview'

const TABS = [
  { id: 'videos', label: 'Video demos' },
  { id: 'cases', label: 'Client transformations' },
  { id: 'sandbox', label: 'Preview your portal' },
]

export default function Showcase() {
  const [tab, setTab] = useState('videos')
  return (
    <>
      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SpotsBadge dark />
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">See it working before you switch</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">Feature walk-throughs, before-and-after transformations, and a live preview of what your customers will see.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Tabs tabs={TABS} active={tab} onChange={setTab} label="Showcase sections" />
        <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-10">
          {tab === 'videos' && <VideoGallery />}
          {tab === 'cases' && <CaseStudies />}
          {tab === 'sandbox' && <Sandbox />}
        </div>
      </section>
      <section className="bg-slate-50 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Ready to replace your stack?</h2>
        <Button as={Link} to="/#pricing" className="mt-6">Claim Early Bird Pricing</Button>
      </section>
    </>
  )
}

function VideoGallery() {
  const [playing, setPlaying] = useState(null)
  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((v) => (
          <li key={v.id}>
            <button onClick={() => setPlaying(v)} className="group block w-full overflow-hidden rounded-2xl border border-slate-200 text-left transition hover:shadow-lg">
              <span className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400 text-slate-950 transition group-hover:scale-110"><Icon name="play" className="h-6 w-6" /></span>
                <span className="absolute bottom-3 right-3 rounded bg-slate-950/80 px-2 py-0.5 text-xs font-medium text-white">{v.length}</span>
                <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-900">{v.category}</span>
              </span>
              <span className="block p-5">
                <span className="block font-bold text-slate-900">{v.title}</span>
                <span className="mt-1 block text-sm text-slate-600">{v.summary}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Modal open={!!playing} onClose={() => setPlaying(null)} title={playing?.title ?? ''} wide>
        {playing && <VideoPlayer video={playing} />}
      </Modal>
    </>
  )
}

function CaseStudies() {
  return (
    <>
      <p className="mb-6 text-sm text-slate-600">Illustrative examples of typical transformations.</p>
      <div className="grid gap-6 lg:grid-cols-3">
        {CASE_STUDIES.map((c) => (
          <article key={c.business} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">{c.business}</h3>
            <p className="text-sm text-slate-600">{c.owner}</p>
            <div className="mt-5 grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-xl bg-rose-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-rose-800">Before</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-800">{c.before.map((b) => <li key={b} className="flex gap-2"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />{b}</li>)}</ul>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">After</p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-800">{c.after.map((a) => <li key={a} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />{a}</li>)}</ul>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5">
              {c.stats.map((s) => (
                <div key={s.label}><dt className="text-xs text-slate-600">{s.label}</dt><dd className="text-2xl font-bold text-slate-900">{s.value}</dd></div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </>
  )
}

const SWATCHES = ['#10b981', '#6366f1', '#e11d48', '#f59e0b', '#0ea5e9']

function Sandbox() {
  const [form, setForm] = useState({ name: 'Bloom & Co. Salon', tagline: 'Modern cuts, warm welcomes.', type: 'salon', color: SWATCHES[0] })
  const [device, setDevice] = useState('desktop')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <form className="space-y-5 rounded-2xl border border-slate-200 p-6" onSubmit={(e) => e.preventDefault()} aria-label="Customize preview">
        <h2 className="text-lg font-bold text-slate-900">Make it yours</h2>
        <div>
          <label htmlFor="sb-name" className="block text-sm font-medium text-slate-900">Business name</label>
          <input id="sb-name" value={form.name} onChange={set('name')} maxLength={40} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label htmlFor="sb-tag" className="block text-sm font-medium text-slate-900">Tagline</label>
          <input id="sb-tag" value={form.tagline} onChange={set('tagline')} maxLength={80} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label htmlFor="sb-type" className="block text-sm font-medium text-slate-900">Business type</label>
          <select id="sb-type" value={form.type} onChange={set('type')} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
            {Object.entries(BUSINESS_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <fieldset>
          <legend className="text-sm font-medium text-slate-900">Brand color</legend>
          <div className="mt-2 flex gap-2">
            {SWATCHES.map((c) => (
              <label key={c} className="cursor-pointer">
                <input type="radio" name="color" value={c} checked={form.color === c} onChange={set('color')} className="peer sr-only" />
                <span className="block h-9 w-9 rounded-full ring-offset-2 peer-checked:ring-2 peer-checked:ring-slate-900 peer-focus-visible:outline-3 peer-focus-visible:outline-emerald-500" style={{ background: c }} />
                <span className="sr-only">{c}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium text-slate-900">Device</legend>
          <div className="mt-2 inline-flex rounded-lg bg-slate-100 p-1">
            {[['desktop', 'monitor'], ['mobile', 'phone']].map(([d, icon]) => (
              <button key={d} type="button" onClick={() => setDevice(d)} aria-pressed={device === d} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium capitalize ${device === d ? 'bg-white shadow' : 'text-slate-700'}`}>
                <Icon name={icon} className="h-4 w-4" />{d}
              </button>
            ))}
          </div>
        </fieldset>
      </form>
      <div className="lg:col-span-2">
        <PortalPreview {...form} device={device} />
      </div>
    </div>
  )
}
