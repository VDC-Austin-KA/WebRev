import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Button, Icon, Modal, Select, inputCls, money } from '../../components/ui'
import { BUSINESS_TYPES, EXPENSES, ORDERS, PRODUCTS, REVENUE_WEEK, TEAM } from '../../data/mock'
import { AnimatedNumber, easeOut, fadeUp, spring, stagger } from '../../motion'
import { useDash } from './DashboardLayout'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

// Every screen staggers its cards in, top-to-bottom, left-to-right (reading order).
const Screen = ({ className = 'space-y-5', children }) => (
  <motion.div className={className} variants={stagger(0.07, 0.05)} initial="hidden" animate="show">{children}</motion.div>
)
const Card = ({ title, action, children, className = '' }) => (
  <motion.section variants={fadeUp} className={`rounded-3xl border border-white/10 bg-neutral-950 p-5 sm:p-6 ${className}`}>
    {title && <div className="mb-4 flex items-center justify-between gap-2"><h2 className="font-semibold tracking-tight">{title}</h2>{action}</div>}
    {children}
  </motion.section>
)
const Pill = ({ tone = 'slate', children }) => {
  const t = { slate: 'bg-white/10 text-neutral-200', green: 'bg-emerald-400/15 text-emerald-300', amber: 'bg-amber-400/15 text-amber-300', rose: 'bg-rose-400/15 text-rose-300' }
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${t[tone]}`}>{children}</span>
}
const Th = (p) => <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-400" {...p} />
const Td = ({ className = '', ...p }) => <td className={`px-3 py-3 text-sm text-neutral-300 ${className}`} {...p} />
const Row = (p) => <motion.tr variants={fadeUp} className="transition-colors hover:bg-white/[0.03]" {...p} />

function Bars({ data, label, format = (v) => v }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <figure>
      <div className="flex h-52 items-end gap-2 sm:gap-3" role="img" aria-label={`${label}: ${data.map((d) => `${d.day} ${format(d.value)}`).join(', ')}`}>
        {data.map((d, i) => (
          <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.06 }} className="text-[11px] font-medium text-neutral-400">{d.value ? format(d.value) : ''}</motion.span>
            <motion.div
              className="w-full origin-bottom rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-300"
              style={{ height: `${(d.value / max) * 82}%` }}
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.9, ease: easeOut, delay: 0.2 + i * 0.06 }}
            />
            <span className="text-xs text-neutral-400">{d.day}</span>
          </div>
        ))}
      </div>
    </figure>
  )
}

export function Overview() {
  const { appointments, pto } = useDash()
  const today = appointments.filter((a) => a.day === 0).sort((a, b) => a.time.localeCompare(b.time))
  const pending = pto.filter((p) => p.status === 'Pending').length
  const stats = [
    { label: "Today's Appointments", value: today.length, icon: 'calendar', to: '/dashboard/calendar' },
    { label: 'Revenue (this week)', value: REVENUE_WEEK.reduce((s, d) => s + d.value, 0), format: money, icon: 'chart', to: '/dashboard/sales' },
    { label: 'Active Team Members', value: TEAM.filter((t) => t.status === 'On shift').length, suffix: ` / ${TEAM.length}`, icon: 'users', to: '/dashboard/team' },
    { label: 'Pending PTO Requests', value: pending, icon: 'clock', to: '/dashboard/team' },
  ]
  return (
    <Screen>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <motion.li key={s.label} variants={fadeUp} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
            <Link to={s.to} className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-neutral-950 p-5 transition-colors duration-300 hover:border-emerald-400/40">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-emerald-400 transition-colors duration-300 group-hover:bg-emerald-400 group-hover:text-black"><Icon name={s.icon} /></span>
              <span>
                <span className="block text-sm text-neutral-400">{s.label}</span>
                <span className="block text-2xl font-semibold tracking-tight"><AnimatedNumber value={s.value} format={s.format} />{s.suffix}</span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
      <div className="grid gap-5 xl:grid-cols-3">
        <Card title="Revenue this week" className="xl:col-span-2"><Bars data={REVENUE_WEEK} label="Daily revenue" format={(v) => `$${(v / 1000).toFixed(1)}k`} /></Card>
        <Card title="Today's schedule" action={<Link to="/dashboard/calendar" className="text-sm font-medium text-emerald-400 hover:underline">View all</Link>}>
          <motion.ul className="divide-y divide-white/5" variants={stagger(0.06, 0.3)} initial="hidden" animate="show">
            {today.map((a) => (
              <motion.li key={a.id} variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0 } }} className="flex items-center gap-3 py-3">
                <span className="w-12 text-sm font-semibold tabular-nums">{a.time}</span>
                <span className="h-8 w-0.5 rounded-full bg-emerald-400/60" aria-hidden="true" />
                <span className="flex-1"><span className="block text-sm font-medium">{a.client}</span><span className="text-xs text-neutral-400">{a.service} · {a.staff}</span></span>
              </motion.li>
            ))}
          </motion.ul>
        </Card>
      </div>
    </Screen>
  )
}

export function Calendar() {
  const { appointments, setAppointments } = useDash()
  const [adding, setAdding] = useState(false)
  const [fresh, setFresh] = useState(null)
  const add = (e) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    const id = Date.now()
    setAppointments([...appointments, { id, day: +f.day, time: f.time, client: f.client.trim(), service: f.service, staff: f.staff, duration: 1 }])
    setFresh(id)
    setAdding(false)
  }
  return (
    <Screen>
      <Card title="This week" action={<Button className="px-4 py-2 text-sm" onClick={() => setAdding(true)}>+ New booking</Button>}>
        <div className="overflow-x-auto">
          <div className="grid min-w-[720px] grid-cols-[60px_repeat(5,1fr)] text-sm">
            <div />
            {DAYS.map((d, i) => <div key={d} className="border-b border-white/10 px-2 py-2 font-semibold">{d}{i === 0 && <span className="ml-1.5 rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs font-medium text-emerald-300">Today</span>}</div>)}
            {HOURS.map((h) => (
              <div key={h} className="contents">
                <div className="border-t border-white/5 py-3 pr-2 text-right text-xs text-neutral-400 tabular-nums">{h}</div>
                {DAYS.map((_, di) => (
                  <div key={di} className={`min-h-14 border-l border-t border-white/5 p-1 ${di === 0 ? 'bg-white/[0.02]' : ''}`}>
                    <AnimatePresence>
                      {appointments.filter((a) => a.day === di && a.time.slice(0, 2) === h.slice(0, 2)).map((a) => (
                        <motion.div
                          key={a.id} layout
                          initial={a.id === fresh ? { opacity: 0, scale: 0.6 } : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0, boxShadow: a.id === fresh ? ['0 0 0 0 rgba(52,211,153,0.7)', '0 0 0 10px rgba(52,211,153,0)'] : 'none' }}
                          transition={{ ...spring, delay: a.id === fresh ? 0.35 : 0.15 + di * 0.04, boxShadow: { duration: 1.2, delay: 0.5 } }}
                          className="mb-1 rounded-lg border-l-[3px] border-emerald-400 bg-emerald-400/10 px-2 py-1"
                        >
                          <p className="text-xs font-semibold">{a.time} {a.client}</p>
                          <p className="text-[11px] text-neutral-400">{a.service} · {a.staff}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-neutral-400"><Icon name="check" className="h-4 w-4 text-emerald-400" /> Calendar sync on · Reminders sent 24h before each appointment</p>
      </Card>
      <Modal open={adding} onClose={() => setAdding(false)} title="New booking">
        <form onSubmit={add} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="bk-client" className="mb-1.5 block text-sm font-medium text-neutral-300">Client name</label>
            <input id="bk-client" name="client" required maxLength={60} className={inputCls} />
          </div>
          <Select label="Service" name="service" options={BUSINESS_TYPES.salon.services.map(([s]) => ({ value: s, label: s }))} />
          <Select label="Staff" name="staff" options={['Jess', 'Sam', 'Alex'].map((s) => ({ value: s, label: s }))} />
          <Select label="Day" name="day" options={DAYS.map((d, i) => ({ value: String(i), label: d }))} />
          <Select label="Time" name="time" options={HOURS.map((h) => ({ value: h, label: h }))} />
          <Button type="submit" variant="white" className="sm:col-span-2">Save booking</Button>
        </form>
      </Modal>
    </Screen>
  )
}

export function Sales() {
  return (
    <Screen className="grid gap-5 xl:grid-cols-5">
      <Card title="Products & services" className="xl:col-span-3">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/10"><Th>Name</Th><Th>Type</Th><Th>Price</Th><Th>Stock</Th><Th>Sold (30d)</Th></tr></thead>
            <motion.tbody className="divide-y divide-white/5" variants={stagger(0.05, 0.2)} initial="hidden" animate="show">
              {PRODUCTS.map((p) => (
                <Row key={p.id}>
                  <Td className="font-medium text-white">{p.name}</Td>
                  <Td><Pill>{p.type}</Pill></Td>
                  <Td>{money(p.price)}</Td>
                  <Td>{p.stock == null ? '—' : p.stock <= 5 ? <Pill tone="amber">Low: {p.stock}</Pill> : p.stock}</Td>
                  <Td className="tabular-nums">{p.sold}</Td>
                </Row>
              ))}
            </motion.tbody>
          </table>
        </div>
      </Card>
      <Card title="Recent orders" className="xl:col-span-2">
        <motion.ul className="divide-y divide-white/5" variants={stagger(0.06, 0.25)} initial="hidden" animate="show">
          {ORDERS.map((o) => (
            <motion.li key={o.id} variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0 } }} className="flex items-center justify-between gap-3 py-3">
              <span><span className="block text-sm font-medium">{o.id} · {o.customer}</span><span className="text-xs text-neutral-400">{o.when}</span></span>
              <span className="text-right"><span className="block text-sm font-semibold">{money(o.total)}</span><Pill tone={o.status === 'Paid' ? 'green' : 'amber'}>{o.status}</Pill></span>
            </motion.li>
          ))}
        </motion.ul>
      </Card>
    </Screen>
  )
}

export function Team() {
  const { pto, setPto } = useDash()
  const decide = (id, status) => setPto(pto.map((p) => (p.id === id ? { ...p, status } : p)))
  // Pending requests float to the top; decided ones glide down.
  const sorted = [...pto].sort((a, b) => (a.status === 'Pending' ? 0 : 1) - (b.status === 'Pending' ? 0 : 1))
  return (
    <Screen className="grid gap-5 xl:grid-cols-2">
      <Card title="Team members">
        <ul className="divide-y divide-white/5">
          {TEAM.map((t) => (
            <li key={t.id} className="flex items-center gap-3 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-sm font-semibold text-black" aria-hidden="true">{t.name.split(' ').map((n) => n[0]).join('')}</span>
              <span className="flex-1"><span className="block text-sm font-medium">{t.name}</span><span className="text-xs text-neutral-400">{t.role} · {t.hours} hrs this week</span></span>
              <Pill tone={t.status === 'On shift' ? 'green' : 'slate'}>{t.status}</Pill>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Time-off requests">
        <ul className="divide-y divide-white/5">
          {sorted.map((p) => (
            <motion.li layout transition={spring} key={p.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="flex-1"><span className="block text-sm font-medium">{p.name}</span><span className="text-xs text-neutral-400">{p.type} · {p.dates}</span></span>
              <AnimatePresence mode="popLayout" initial={false}>
                {p.status === 'Pending' ? (
                  <motion.span key="actions" className="flex gap-2" exit={{ opacity: 0, scale: 0.8 }}>
                    <motion.button whileTap={{ scale: 0.92 }} onClick={() => decide(p.id, 'Approved')} className="rounded-full bg-emerald-400 px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-emerald-300" aria-label={`Approve ${p.name}`}>Approve</motion.button>
                    <motion.button whileTap={{ scale: 0.92 }} onClick={() => decide(p.id, 'Denied')} className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-white/15" aria-label={`Deny ${p.name}`}>Deny</motion.button>
                  </motion.span>
                ) : (
                  <motion.span key="status" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={spring}>
                    <Pill tone={p.status === 'Approved' ? 'green' : 'rose'}>{p.status}</Pill>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </Card>
      <Card title="Shift schedule" className="xl:col-span-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead><tr className="border-b border-white/10"><Th>Member</Th>{DAYS.map((d) => <Th key={d}>{d}</Th>)}</tr></thead>
            <tbody className="divide-y divide-white/5">
              {TEAM.map((t, i) => (
                <tr key={t.id} className="transition-colors hover:bg-white/[0.03]">
                  <Td className="font-medium text-white">{t.name.split(' ')[0]}</Td>
                  {DAYS.map((d, di) => <Td key={d}>{(i + di) % 4 === 3 ? <span className="text-neutral-500">Off</span> : <span className="rounded-md bg-white/5 px-2 py-1">{i % 2 ? '12–8 PM' : '9–5 PM'}</span>}</Td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Screen>
  )
}

export function Payroll() {
  const gross = TEAM.reduce((s, t) => s + t.rate * t.hours, 0)
  const total = EXPENSES.reduce((s, e) => s + e.value, 0)
  return (
    <Screen>
      <ul className="grid gap-4 sm:grid-cols-3">
        {[['Pay period', 'Nov 1 – Nov 14'], ['Gross wages', <AnimatedNumber key="g" value={gross} format={money} />], ['Next payday', 'Nov 15']].map(([l, v]) => (
          <motion.li key={l} variants={fadeUp} className="rounded-3xl border border-white/10 bg-neutral-950 p-5"><p className="text-sm text-neutral-400">{l}</p><p className="text-2xl font-semibold tracking-tight">{v}</p></motion.li>
        ))}
      </ul>
      <div className="grid gap-5 xl:grid-cols-5">
        <Card title="Employee summary" className="xl:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/10"><Th>Name</Th><Th>Hours</Th><Th>Rate</Th><Th>Gross</Th></tr></thead>
              <motion.tbody className="divide-y divide-white/5" variants={stagger(0.05, 0.2)} initial="hidden" animate="show">
                {TEAM.map((t) => <Row key={t.id}><Td className="font-medium text-white">{t.name}</Td><Td className="tabular-nums">{t.hours}</Td><Td>{money(t.rate)}/hr</Td><Td className="font-semibold text-white tabular-nums">{money(t.rate * t.hours)}</Td></Row>)}
              </motion.tbody>
            </table>
          </div>
        </Card>
        <Card title="Expense distribution" className="xl:col-span-2">
          <ul className="space-y-4">
            {EXPENSES.map((e, i) => (
              <li key={e.label}>
                <div className="flex justify-between text-sm"><span className="text-neutral-300">{e.label}</span><span className="font-medium">{money(e.value)} <span className="font-normal text-neutral-400">({Math.round((e.value / total) * 100)}%)</span></span></div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" initial={{ width: 0 }} animate={{ width: `${(e.value / total) * 100}%` }} transition={{ duration: 1, ease: easeOut, delay: 0.3 + i * 0.08 }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Screen>
  )
}

const TYPE_OPTIONS = Object.entries(BUSINESS_TYPES).map(([value, v]) => ({ value, label: v.label }))

export function Settings() {
  const { business, setBusiness } = useDash()
  const [saved, setSaved] = useState(false)
  const save = (e) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    setBusiness({ ...business, name: f.name.trim() || business.name, tagline: f.tagline.trim(), type: f.type, color: f.color })
    setSaved(true)
  }
  return (
    <Screen>
      <Card title="Business profile" className="max-w-2xl">
        <form onSubmit={save} onChange={() => setSaved(false)} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="st-name" className="mb-1.5 block text-sm font-medium text-neutral-300">Business name</label>
            <input id="st-name" name="name" defaultValue={business.name} required maxLength={40} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="st-tag" className="mb-1.5 block text-sm font-medium text-neutral-300">Tagline</label>
            <input id="st-tag" name="tagline" defaultValue={business.tagline} maxLength={80} className={inputCls} />
          </div>
          <Select label="Business type" name="type" defaultValue={business.type} options={TYPE_OPTIONS} onChange={() => setSaved(false)} />
          <div>
            <label htmlFor="st-color" className="mb-1.5 block text-sm font-medium text-neutral-300">Brand color</label>
            <input id="st-color" name="color" type="color" defaultValue={business.color} className={`${inputCls} h-[46px] cursor-pointer p-1.5`} />
          </div>
          <div className="flex items-center gap-4 sm:col-span-2">
            <Button type="submit" variant="white">Save changes</Button>
            <span role="status" className="text-sm text-emerald-400">
              <AnimatePresence>
                {saved && (
                  <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5">
                    <Icon name="check" className="h-4 w-4" /> Saved — toggle “Customer view” to preview.
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </div>
        </form>
      </Card>
    </Screen>
  )
}
