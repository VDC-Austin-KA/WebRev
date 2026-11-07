import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LEAD_ENDPOINT, LEGACY_TOOLS, PLANS } from '../config'
import { Button, Icon, Modal, inputCls, money, useFounderSpots } from './ui'
import { AnimatedNumber, Reveal, easeOut, fadeUp, inView, spring, stagger } from '../motion'

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
    <section id="pricing" className="scroll-mt-14 py-28" aria-labelledby="pricing-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-emerald-400">Simple pricing</p>
          <h2 id="pricing-title" className="text-gradient mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">One bill replaces all of them.</h2>
          <p className="mt-5 text-lg text-neutral-400">Website, bookings, storefront, team, payroll overview and CRM. Up to {PLANS.founder.includedSeats} team members, then {money(PLANS.extraSeat)}/member.</p>
        </Reveal>

        {/* Live counter */}
        <Reveal delay={0.1} className="glass mx-auto mt-12 max-w-xl rounded-3xl p-5">
          <div className="flex items-baseline justify-between">
            <p className="font-medium" role="status">{soldOut ? 'Founder cohort is full' : <>Only <span className="text-emerald-400"><AnimatedNumber value={left} /></span> of {total} founder spots left</>}</p>
            <p className="text-sm text-neutral-400">{claimed} claimed</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Founder spots claimed" aria-valuemin={0} aria-valuemax={total} aria-valuenow={claimed}>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
              initial={{ width: 0 }} whileInView={{ width: `${(claimed / total) * 100}%` }} viewport={{ once: true }}
              transition={{ duration: 1.4, ease: easeOut, delay: 0.2 }}
            />
          </div>
        </Reveal>

        {/* Tiers */}
        <motion.div className="mt-12 grid gap-5 lg:grid-cols-2" variants={stagger(0.12)} {...inView}>
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
        </motion.div>

        {/* Savings calculator */}
        <Reveal className="mt-20 grid gap-8 rounded-[2rem] border border-white/10 bg-neutral-950 p-6 sm:p-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h3 className="text-2xl font-semibold tracking-tight">Savings calculator</h3>
            <p className="mt-1 text-neutral-400">Check what you pay for today.</p>
            <fieldset className="mt-6">
              <legend className="sr-only">Tools you currently pay for</legend>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {LEGACY_TOOLS.map((t) => (
                  <motion.label
                    key={t.id} whileTap={{ scale: 0.98 }}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors duration-300 ${tools[t.id] ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}
                  >
                    <span className="flex items-center gap-3">
                      <input type="checkbox" checked={tools[t.id]} onChange={(e) => setTools({ ...tools, [t.id]: e.target.checked })} className="peer sr-only" />
                      <CheckMark on={tools[t.id]} />
                      <span className="text-sm font-medium">{t.label}</span>
                    </span>
                    <span className="text-sm text-neutral-400"><AnimatedNumber value={t.base + t.perSeat * seats} format={money} /></span>
                  </motion.label>
                ))}
              </div>
            </fieldset>
            <label htmlFor="seats" className="mt-7 flex justify-between text-sm font-medium">
              <span>Team members</span><span className="tabular-nums">{seats}</span>
            </label>
            <input id="seats" type="range" min="1" max="40" value={seats} onChange={(e) => setSeats(+e.target.value)} className="mt-3 w-full" />
          </div>

          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-400/15 to-white/[0.02] p-6 ring-1 ring-white/10 lg:col-span-2">
            <dl className="space-y-4">
              <div className="flex justify-between"><dt className="text-neutral-400">Separate tools</dt><dd className="font-semibold text-neutral-300 line-through decoration-rose-400/80"><AnimatedNumber value={legacy} format={money} />/mo</dd></div>
              <div className="flex justify-between"><dt className="text-neutral-400">{soldOut ? 'Standard plan' : 'Founder plan'}</dt><dd className="font-semibold text-emerald-400"><AnimatedNumber value={ours} format={money} />/mo</dd></div>
              <div className="border-t border-white/10 pt-5">
                <dt className="text-sm text-neutral-400">You save every year</dt>
                <dd className="mt-1 text-5xl font-semibold tracking-tight text-white" aria-live="polite"><AnimatedNumber value={yearly} format={money} /></dd>
              </div>
            </dl>
            <p className="mt-6 text-xs text-neutral-400">*Estimates based on typical list prices for standalone small-business tools. Your costs may vary.</p>
          </div>
        </Reveal>
      </div>
      <ClaimModal plan={claimPlan} onClose={() => setClaimPlan(null)} />
    </section>
  )
}

function CheckMark({ on }) {
  return (
    <span className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-400 ${on ? 'border-emerald-400 bg-emerald-400' : 'border-white/30'}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="black" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M20 6L9 17l-5-5" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.25, ease: easeOut }} />
      </svg>
    </span>
  )
}

function Tier({ plan, badge, note, features, cta, onClick, highlight }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={spring}
      className={`relative flex flex-col overflow-hidden rounded-[2rem] p-8 ${highlight ? 'bg-gradient-to-b from-emerald-400/20 via-neutral-950 to-neutral-950 ring-1 ring-emerald-400/50' : 'bg-neutral-950 ring-1 ring-white/10'}`}
    >
      {highlight && <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-emerald-400/30 blur-3xl" aria-hidden="true" />}
      <span className={`relative self-start rounded-full px-3 py-1 text-xs font-semibold ${highlight ? 'bg-emerald-400 text-black' : 'bg-white/10 text-neutral-200'}`}>{badge}</span>
      <h3 className="relative mt-5 text-xl font-semibold">{plan.name}</h3>
      <p className="relative mt-2"><span className="text-6xl font-semibold tracking-tight">${plan.price}</span><span className="text-neutral-400">/month</span></p>
      <p className="relative mt-1 text-sm text-neutral-400">{note}</p>
      <motion.ul className="relative mt-7 flex-1 space-y-3" variants={stagger(0.05, 0.2)}>
        {features.map((f) => (
          <motion.li key={f} variants={fadeUp} className="flex gap-3 text-neutral-200"><Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />{f}</motion.li>
        ))}
      </motion.ul>
      <Button variant={highlight ? 'primary' : 'glass'} className="relative mt-8 w-full" onClick={onClick}>{cta}</Button>
    </motion.div>
  )
}

function ClaimModal({ plan, onClose }) {
  const [state, setState] = useState('idle')
  const close = () => { onClose(); setTimeout(() => setState('idle'), 300) }
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
      <AnimatePresence mode="wait" initial={false}>
        {state === 'done' ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className="py-4 text-center">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...spring, delay: 0.1 }} className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400 text-black"><Icon name="check" className="h-7 w-7" /></motion.span>
            <p className="mt-5 font-medium text-white">You're in! We'll reach out within one business day to schedule onboarding.</p>
            <Button variant="white" className="mt-6" onClick={close}>Done</Button>
          </motion.div>
        ) : (
          <motion.form key="form" exit={{ opacity: 0, x: -20 }} onSubmit={submit} className="space-y-4">
            {[['name', 'Your name', 'text', 'name'], ['business', 'Business name', 'text', 'organization'], ['email', 'Email', 'email', 'email']].map(([id, label, type, ac]) => (
              <div key={id}>
                <label htmlFor={`claim-${id}`} className="mb-1.5 block text-sm font-medium text-neutral-300">{label}</label>
                <input id={`claim-${id}`} name={id} type={type} autoComplete={ac} required maxLength={120} className={inputCls} />
              </div>
            ))}
            {state === 'error' && <motion.p initial={{ x: -6 }} animate={{ x: [6, -4, 2, 0] }} role="alert" className="text-sm text-rose-400">Something went wrong. Please try again.</motion.p>}
            <Button type="submit" variant="white" className="w-full" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : title}</Button>
            <p className="text-xs text-neutral-400">No credit card required. We'll never share your information.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  )
}
