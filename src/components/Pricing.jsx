import { useMemo, useState } from 'react'
import { LEAD_ENDPOINT, LEGACY_TOOLS, PLANS } from '../config'
import { Button, Icon, Modal, money, useFounderSpots } from './ui'

const planCost = (plan, seats) => plan.price + Math.max(0, seats - plan.includedSeats) * PLANS.extraSeat

export default function Pricing() {
  const { claimed, left, total } = useFounderSpots()
  const soldOut = left <= 0
  const [seats, setSeats] = useState(6)
  const [tools, setTools] = useState(() => Object.fromEntries(LEGACY_TOOLS.map((t) => [t.id, true])))
  const [claimPlan, setClaimPlan] = useState(null)

  const legacy = useMemo(
    () => LEGACY_TOOLS.reduce((sum, t) => sum + (tools[t.id] ? t.base + t.perSeat * seats : 0), 0),
    [tools, seats],
  )
  const founder = planCost(PLANS.founder, seats)
  const standard = planCost(PLANS.standard, seats)
  const ours = soldOut ? standard : founder
  const yearly = Math.max(0, (legacy - ours) * 12)

  return (
    <section id="pricing" className="scroll-mt-20 bg-slate-950 py-24 text-white" aria-labelledby="pricing-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-semibold text-emerald-300">Simple pricing</p>
          <h2 id="pricing-title" className="mt-2 text-3xl font-bold sm:text-4xl">One bill replaces all of them</h2>
          <p className="mt-4 text-slate-300">Everything included: website, bookings, storefront, team, payroll overview and CRM. Up to {PLANS.founder.includedSeats} team members, then {money(PLANS.extraSeat)}/member.</p>
        </div>

        {/* Live counter */}
        <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-slate-900 p-5 ring-1 ring-slate-800">
          <div className="flex items-baseline justify-between">
            <p className="font-semibold" role="status">{soldOut ? 'Founder cohort is full' : <>Only <span className="text-emerald-300">{left}</span> of {total} founder spots left</>}</p>
            <p className="text-sm text-slate-400">{claimed} claimed</p>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-label="Founder spots claimed" aria-valuemin={0} aria-valuemax={total} aria-valuenow={claimed}>
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-700" style={{ width: `${(claimed / total) * 100}%` }} />
          </div>
        </div>

        {/* Tiers */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Tier
            highlight
            badge={soldOut ? 'Sold out' : 'First 100 businesses'}
            plan={PLANS.founder}
            note="Locked in for life"
            features={['Grandfathered founder rate — never increases', 'Priority 1-on-1 onboarding with a specialist', 'Zero setup fees', 'We migrate your data from old tools', 'Every current & future module included']}
            cta={soldOut ? 'Join the waitlist' : 'Claim founder spot'}
            onClick={() => setClaimPlan(soldOut ? 'waitlist' : 'founder')}
          />
          <Tier
            plan={PLANS.standard}
            badge="After founder cohort"
            note="Month-to-month, cancel anytime"
            features={['All modules included', 'Guided self-onboarding', 'Email & chat support', `Saves ${money(Math.max(0, legacy - standard))}/mo vs. separate tools*`]}
            cta="Get started"
            onClick={() => setClaimPlan('standard')}
          />
        </div>

        {/* Savings calculator */}
        <div className="mt-16 grid gap-8 rounded-2xl bg-white p-6 text-slate-900 sm:p-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h3 className="text-2xl font-bold">Savings calculator</h3>
            <p className="mt-1 text-slate-600">Check what you pay for today.</p>
            <fieldset className="mt-6">
              <legend className="sr-only">Tools you currently pay for</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {LEGACY_TOOLS.map((t) => (
                  <label key={t.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50">
                    <span className="flex items-center gap-3">
                      <input type="checkbox" checked={tools[t.id]} onChange={(e) => setTools({ ...tools, [t.id]: e.target.checked })} className="h-4 w-4 accent-emerald-700" />
                      <span className="text-sm font-medium">{t.label}</span>
                    </span>
                    <span className="text-sm text-slate-600">{money(t.base + t.perSeat * seats)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label htmlFor="seats" className="mt-6 flex justify-between text-sm font-medium">
              <span>Team members</span><span>{seats}</span>
            </label>
            <input id="seats" type="range" min="1" max="40" value={seats} onChange={(e) => setSeats(+e.target.value)} className="mt-2 w-full accent-emerald-700" />
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-slate-950 p-6 text-white lg:col-span-2" aria-live="polite">
            <dl className="space-y-4">
              <div className="flex justify-between"><dt className="text-slate-300">Separate tools</dt><dd className="font-semibold line-through decoration-rose-400">{money(legacy)}/mo</dd></div>
              <div className="flex justify-between"><dt className="text-slate-300">{soldOut ? 'Standard plan' : 'Founder plan'}</dt><dd className="font-semibold text-emerald-300">{money(ours)}/mo</dd></div>
              <div className="border-t border-slate-800 pt-4">
                <dt className="text-sm text-slate-300">You save every year</dt>
                <dd className="mt-1 text-4xl font-bold text-emerald-300">{money(yearly)}</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs text-slate-400">*Estimates based on typical list prices for standalone small-business tools. Your costs may vary.</p>
          </div>
        </div>
      </div>
      <ClaimModal plan={claimPlan} onClose={() => setClaimPlan(null)} />
    </section>
  )
}

function Tier({ plan, badge, note, features, cta, onClick, highlight }) {
  return (
    <div className={`relative flex flex-col rounded-2xl p-8 ${highlight ? 'bg-gradient-to-b from-emerald-400/15 to-slate-900 ring-2 ring-emerald-400' : 'bg-slate-900 ring-1 ring-slate-800'}`}>
      <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${highlight ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-200'}`}>{badge}</span>
      <h3 className="mt-4 text-xl font-bold">{plan.name}</h3>
      <p className="mt-2"><span className="text-5xl font-bold">${plan.price}</span><span className="text-slate-300">/month</span></p>
      <p className="mt-1 text-sm text-slate-300">{note}</p>
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex gap-3 text-slate-200"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />{f}</li>
        ))}
      </ul>
      <Button variant={highlight ? 'primary' : 'ghostDark'} className="mt-8 w-full" onClick={onClick}>{cta}</Button>
    </div>
  )
}

function ClaimModal({ plan, onClose }) {
  const [state, setState] = useState('idle')
  const close = () => { setState('idle'); onClose() }
  const submit = async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setState('sending')
    try {
      if (LEAD_ENDPOINT) {
        const r = await fetch(LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, plan }) })
        if (!r.ok) throw new Error()
      }
      setState('done')
    } catch {
      setState('error')
    }
  }
  const title = plan === 'founder' ? 'Claim your founder spot' : plan === 'waitlist' ? 'Join the waitlist' : 'Get started'
  return (
    <Modal open={!!plan} onClose={close} title={title}>
      {state === 'done' ? (
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Icon name="check" /></span>
          <p className="mt-4 font-semibold text-slate-900">You're in! We'll reach out within one business day to schedule onboarding.</p>
          <Button variant="dark" className="mt-6" onClick={close}>Done</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4 text-slate-900">
          {[['name', 'Your name', 'text', 'name'], ['business', 'Business name', 'text', 'organization'], ['email', 'Email', 'email', 'email']].map(([id, label, type, ac]) => (
            <div key={id}>
              <label htmlFor={`claim-${id}`} className="block text-sm font-medium">{label}</label>
              <input id={`claim-${id}`} name={id} type={type} autoComplete={ac} required maxLength={120} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
          ))}
          {state === 'error' && <p role="alert" className="text-sm text-rose-700">Something went wrong. Please try again.</p>}
          <Button type="submit" variant="dark" className="w-full" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : title}</Button>
          <p className="text-xs text-slate-600">No credit card required. We'll never share your information.</p>
        </form>
      )}
    </Modal>
  )
}
