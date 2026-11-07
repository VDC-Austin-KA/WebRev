import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BRAND, DEMO_VIDEO } from '../config'
import { Button, Icon, Modal, SpotsBadge, VideoPlayer } from '../components/ui'
import Pricing from '../components/Pricing'

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

export default function Landing() {
  const [demo, setDemo] = useState(false)
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <SpotsBadge dark />
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Modernize Your Small Business — <span className="text-emerald-300">Replace Fragmented Software</span> with One Simple Platform.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">Cut overhead, manage scheduling, HR, and sales, and give your customers a modern digital experience.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/#pricing" className="text-base">Claim Early Bird Pricing (First 100 Businesses)</Button>
              <Button variant="ghostDark" className="text-base" onClick={() => setDemo(true)}><Icon name="play" className="h-4 w-4" /> Watch 2-Min Demo</Button>
            </div>
            <p className="mt-6 text-sm text-slate-400">No setup fees · Free data migration · Cancel anytime</p>
          </div>
          <HeroMock />
        </div>
      </section>

      {/* Core message */}
      <section className="border-b border-slate-200 bg-white py-10">
        <p className="mx-auto max-w-4xl px-4 text-center text-xl font-semibold text-slate-900 sm:text-2xl">
          Stop juggling 5+ subscriptions. <span className="text-emerald-700">One platform, one monthly bill, total business control.</span>
        </p>
      </section>

      {/* Problem vs solution */}
      <section className="bg-slate-50 py-24" aria-labelledby="compare-title">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 id="compare-title" className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">The old way vs. the {BRAND} way</h2>
          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left">
              <caption className="sr-only">Comparison of separate tools versus {BRAND}</caption>
              <thead>
                <tr className="text-sm">
                  <th scope="col" className="hidden p-4 sm:table-cell"><span className="sr-only">Category</span></th>
                  <th scope="col" className="bg-rose-50 p-4 font-semibold text-rose-800">The Old Way</th>
                  <th scope="col" className="bg-emerald-50 p-4 font-semibold text-emerald-800">The {BRAND} Way</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([cat, old, ours]) => (
                  <tr key={cat} className="border-t border-slate-200 align-top">
                    <th scope="row" className="hidden p-4 text-sm font-semibold text-slate-900 sm:table-cell">{cat}</th>
                    <td className="p-4 text-slate-700"><span className="flex gap-2"><Icon name="x" className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" /><span><span className="block text-xs font-semibold text-slate-500 sm:hidden">{cat}</span>{old}</span></span></td>
                    <td className="p-4 font-medium text-slate-900"><span className="flex gap-2"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />{ours}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 bg-white py-24" aria-labelledby="features-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-emerald-700">Everything in one place</p>
            <h2 id="features-title" className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">The tools you need. None of the juggling.</h2>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <li key={f.title} className="group rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-emerald-300 transition group-hover:bg-emerald-400 group-hover:text-slate-950"><Icon name={f.icon} className="h-6 w-6" /></span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-slate-600">{f.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <Button as={Link} to="/showcase" variant="dark">See it in action <Icon name="arrow" className="h-4 w-4" /></Button>
          </div>
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
      <div className="rounded-2xl bg-slate-900 p-4 shadow-2xl ring-1 ring-slate-700">
        <div className="flex gap-4">
          <div className="hidden w-32 shrink-0 space-y-2 sm:block">
            {['Overview', 'Calendar', 'Sales', 'Team', 'Payroll'].map((l, i) => (
              <div key={l} className={`rounded-md px-3 py-2 text-xs ${i === 0 ? 'bg-emerald-400 font-semibold text-slate-950' : 'text-slate-400'}`}>{l}</div>
            ))}
          </div>
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {stats.map(([l, v]) => (
                <div key={l} className="rounded-lg bg-slate-800 p-3"><p className="text-[11px] text-slate-400">{l}</p><p className="text-xl font-bold">{v}</p></div>
              ))}
            </div>
            <div className="flex h-28 items-end gap-2 rounded-lg bg-slate-800 p-3">
              {[40, 32, 50, 64, 80, 95, 20].map((h, i) => <div key={i} className="flex-1 rounded-t bg-emerald-400/80" style={{ height: `${h}%` }} />)}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 hidden rounded-xl bg-white p-4 text-slate-900 shadow-xl sm:block">
        <p className="text-xs text-slate-500">New booking</p>
        <p className="font-semibold">Maria L. · Cut & style · 9:00</p>
      </div>
    </div>
  )
}
