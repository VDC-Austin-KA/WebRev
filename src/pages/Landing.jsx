import { useState } from 'react'
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
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div>
          <SpotsBadge />
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Modernize Your Small Business — Replace Fragmented Software with One Simple Platform.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-fg-2">Cut overhead, manage scheduling, HR, and sales, and give your customers a modern digital experience.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/#pricing" size="lg">Claim Early Bird Pricing (First 100 Businesses)</Button>
            <Button variant="secondary" size="lg" onClick={() => setDemo(true)}><Icon name="play" className="h-3.5 w-3.5" /> Watch 2-Min Demo</Button>
          </div>
          <p className="mt-5 text-sm text-fg-2">No setup fees · Free data migration · Cancel anytime</p>
        </div>
        <HeroMock />
      </section>

      {/* Core message */}
      <section className="border-y border-line bg-surface py-12">
        <p className="mx-auto max-w-4xl px-4 text-center text-xl font-medium tracking-tight sm:text-2xl">
          <span className="text-fg-2">Stop juggling 5+ subscriptions.</span> One platform, one monthly bill, total business control.
        </p>
      </section>

      {/* Problem vs solution */}
      <section className="py-24" aria-labelledby="compare-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="compare-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">The old way vs. the {BRAND} way.</h2>
          <div className="mt-10 overflow-hidden rounded-xl border border-line">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Comparison of separate tools versus {BRAND}</caption>
              <thead className="bg-surface">
                <tr>
                  <th scope="col" className="hidden w-1/4 px-5 py-3 font-medium text-fg-2 sm:table-cell"><span className="sr-only">Category</span></th>
                  <th scope="col" className="px-5 py-3 font-medium text-fg-2">The Old Way</th>
                  <th scope="col" className="px-5 py-3 font-medium text-accent">The {BRAND} Way</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {COMPARE.map(([cat, old, ours]) => (
                  <tr key={cat} className="align-top">
                    <th scope="row" className="hidden px-5 py-4 font-medium sm:table-cell">{cat}</th>
                    <td className="px-5 py-4 text-fg-2"><span className="flex gap-2.5"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-fg-3" /><span><span className="block text-xs text-fg-2 sm:hidden">{cat}</span>{old}</span></span></td>
                    <td className="px-5 py-4"><span className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{ours}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features: one surface divided into cells, not six floating cards */}
      <section id="features" className="scroll-mt-14 border-t border-line py-24" aria-labelledby="features-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm text-accent">Everything in one place</p>
            <h2 id="features-title" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">The tools you need. None of the juggling.</h2>
          </div>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <li key={f.title} className="bg-surface p-6">
                <Icon name={f.icon} className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-medium">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{f.body}</p>
              </li>
            ))}
          </ul>
          <Button to="/showcase" variant="secondary" className="mt-8">See it in action <Icon name="arrow" className="h-4 w-4" /></Button>
        </div>
      </section>

      <Pricing />

      <Modal open={demo} onClose={() => setDemo(false)} title={DEMO_VIDEO.title} wide>
        {demo && <VideoPlayer video={DEMO_VIDEO} />}
      </Modal>
    </>
  )
}

function HeroMock() {
  const stats = [['Appointments', '12'], ['Revenue today', '$1,460'], ['On shift', '3'], ['PTO pending', '2']]
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/40" aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" />
      </div>
      <div className="flex">
        <div className="hidden w-32 shrink-0 space-y-0.5 border-r border-line p-2 sm:block">
          {['Overview', 'Calendar', 'Sales', 'Team', 'Payroll'].map((l, i) => (
            <div key={l} className={`rounded-md px-2.5 py-1.5 text-xs ${i === 0 ? 'bg-raised text-fg' : 'text-fg-2'}`}>{l}</div>
          ))}
        </div>
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 divide-line rounded-lg border border-line md:grid-cols-4 md:divide-x">
            {stats.map(([l, v]) => (
              <div key={l} className="p-3"><p className="text-[11px] text-fg-2">{l}</p><p className="text-lg font-semibold tabular-nums">{v}</p></div>
            ))}
          </div>
          <div className="mt-3 flex h-32 items-end gap-2 rounded-lg border border-line p-3">
            {[40, 32, 50, 64, 80, 95, 20].map((h, i) => <div key={i} className={`flex-1 rounded-sm ${i === 5 ? 'bg-accent' : 'bg-accent/40'}`} style={{ height: `${h}%` }} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
