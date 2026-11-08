import { useMemo, useState } from 'react'
import { LEAD_ENDPOINT, LEGACY_TOOLS, PLANS } from '../config'
import { Button, Icon, Modal, card, fieldCls, labelCls, money, useFounderSpots } from './ui'

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
    <section id="pricing" className="scroll-mt-14 border-t border-line py-24" aria-labelledby="pricing-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm text-accent">Pricing</p>
          <h2 id="pricing-title" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">One bill replaces all of them.</h2>
          <p className="mt-4 text-fg-2">Website, bookings, storefront, team, payroll overview and CRM. Up to {PLANS.founder.includedSeats} team members, then {money(PLANS.extraSeat)}/member.</p>
        </div>

        {/* Live counter */}
        <div className={`${card} mt-10 max-w-md p-4`}>
          <div className="flex items-baseline justify-between text-sm">
            <p role="status">{soldOut ? 'Founder cohort is full' : <>Only <span className="font-medium text-accent">{left}</span> of {total} founder spots left</>}</p>
            <p className="text-fg-2 tabular-nums">{claimed} claimed</p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-raised" role="progressbar" aria-label="Founder spots claimed" aria-valuemin={0} aria-valuemax={total} aria-valuenow={claimed}>
            <div className="h-full rounded-full bg-accent" style={{ width: `${(claimed / total) * 100}%` }} />
          </div>
        </div>

        {/* Tiers */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
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
        <div className={`${card} mt-16 grid lg:grid-cols-5`}>
          <div className="p-6 sm:p-8 lg:col-span-3">
            <h3 className="text-lg font-semibold">Savings calculator</h3>
            <p className="mt-1 text-sm text-fg-2">Check what you pay for today.</p>
            <fieldset className="mt-6">
              <legend className="sr-only">Tools you currently pay for</legend>
              <ul className="divide-y divide-line border-y border-line">
                {LEGACY_TOOLS.map((t) => (
                  <li key={t.id}>
                    <label className="flex cursor-pointer items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="flex items-center gap-3">
                        <input type="checkbox" checked={tools[t.id]} onChange={(e) => setTools({ ...tools, [t.id]: e.target.checked })} className="h-4 w-4" />
                        <span className={tools[t.id] ? 'text-fg' : 'text-fg-2'}>{t.label}</span>
                      </span>
                      <span className="tabular-nums text-fg-2">{money(t.base + t.perSeat * seats)}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
            <label htmlFor="seats" className="mt-6 flex justify-between text-sm">
              <span className="text-fg-2">Team members</span><span className="tabular-nums">{seats}</span>
            </label>
            <input id="seats" type="range" min="1" max="40" value={seats} onChange={(e) => setSeats(+e.target.value)} className="mt-2 w-full" />
          </div>

          <div className="flex flex-col justify-between border-t border-line bg-raised p-6 sm:p-8 lg:col-span-2 lg:border-l lg:border-t-0">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-fg-2">Separate tools</dt><dd className="tabular-nums text-fg-2 line-through">{money(legacy)}/mo</dd></div>
              <div className="flex justify-between"><dt className="text-fg-2">{soldOut ? 'Standard plan' : 'Founder plan'}</dt><dd className="tabular-nums">{money(ours)}/mo</dd></div>
              <div className="border-t border-line pt-4">
                <dt className="text-fg-2">You save every year</dt>
                <dd className="mt-1 text-4xl font-semibold tracking-tight tabular-nums text-accent" aria-live="polite">{money(yearly)}</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs text-fg-2">*Estimates based on typical list prices for standalone small-business tools. Your costs may vary.</p>
          </div>
        </div>
      </div>
      <ClaimModal plan={claimPlan} onClose={() => setClaimPlan(null)} />
    </section>
  )
}

function Tier({ plan, badge, note, features, cta, onClick, highlight }) {
  return (
    <div className={`flex flex-col rounded-xl border bg-surface p-7 ${highlight ? 'border-accent/60' : 'border-line'}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{plan.name}</h3>
        <span className={`rounded-md px-2 py-0.5 text-xs ${highlight ? 'bg-accent/15 text-accent' : 'bg-raised text-fg-2'}`}>{badge}</span>
      </div>
      <p className="mt-4"><span className="text-4xl font-semibold tracking-tight tabular-nums">${plan.price}</span><span className="text-fg-2"> /month</span></p>
      <p className="mt-1 text-sm text-fg-2">{note}</p>
      <ul className="mt-6 flex-1 space-y-2.5 border-t border-line pt-6 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2.5"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{f}</li>
        ))}
      </ul>
      <Button variant={highlight ? 'primary' : 'secondary'} className="mt-7 w-full" onClick={onClick}>{cta}</Button>
    </div>
  )
}

function ClaimModal({ plan, onClose }) {
  const [state, setState] = useState('idle')
  const close = () => { onClose(); setTimeout(() => setState('idle'), 200) }
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
        <div className="py-2">
          <p className="flex items-start gap-2"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-success" />You're in. We'll reach out within one business day to schedule onboarding.</p>
          <Button variant="secondary" className="mt-6" onClick={close}>Done</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {[['name', 'Your name', 'text', 'name'], ['business', 'Business name', 'text', 'organization'], ['email', 'Email', 'email', 'email']].map(([id, label, type, ac]) => (
            <div key={id}>
              <label htmlFor={`claim-${id}`} className={labelCls}>{label}</label>
              <input id={`claim-${id}`} name={id} type={type} autoComplete={ac} required maxLength={120} className={fieldCls} />
            </div>
          ))}
          {state === 'error' && <p role="alert" className="text-sm text-danger">Something went wrong. Please try again.</p>}
          <Button type="submit" className="w-full" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : title}</Button>
          <p className="text-xs text-fg-2">No credit card required. We'll never share your information.</p>
        </form>
      )}
    </Modal>
  )
}
