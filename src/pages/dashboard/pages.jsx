import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Modal, Select, card, fieldCls, labelCls, money } from '../../components/ui'
import { BUSINESS_TYPES, EXPENSES, ORDERS, PRODUCTS, REVENUE_WEEK, TEAM } from '../../data/mock'
import { useDash } from './DashboardLayout'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const Card = ({ title, action, children, className = '', flush = false }) => (
  <section className={`${card} ${className}`}>
    {title && <div className="flex h-12 items-center justify-between gap-2 border-b border-line px-5"><h2 className="text-sm font-semibold">{title}</h2>{action}</div>}
    <div className={flush ? '' : 'p-5'}>{children}</div>
  </section>
)
const Badge = ({ tone = 'neutral', children }) => {
  const t = { neutral: 'text-fg-2 bg-raised', success: 'text-success bg-success/10', warning: 'text-warning bg-warning/10', danger: 'text-danger bg-danger/10' }
  return <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${t[tone]}`}>{children}</span>
}
const Th = ({ num, ...p }) => <th scope="col" className={`px-5 py-2.5 text-xs font-medium text-fg-2 ${num ? 'text-right' : 'text-left'}`} {...p} />
const Td = ({ num, className = '', ...p }) => <td className={`px-5 py-3 text-sm ${num ? 'text-right tabular-nums' : ''} ${className}`} {...p} />

/** A row of key figures on one surface, separated by dividers instead of separate cards. */
function StatStrip({ stats }) {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
      {stats.map((s) => {
        const body = <><span className="block text-[13px] text-fg-2">{s.label}</span><span className="mt-1 block text-2xl font-semibold tracking-tight tabular-nums">{s.value}</span></>
        return (
          <li key={s.label} className="bg-surface">
            {s.to ? <Link to={s.to} viewTransition className="block h-full px-5 py-4 transition-colors hover:bg-raised">{body}</Link> : <div className="px-5 py-4">{body}</div>}
          </li>
        )
      })}
    </ul>
  )
}

function Bars({ data, label, format }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const best = data.reduce((a, b) => (b.value > a.value ? b : a))
  return (
    <figure>
      <div className="flex h-48 items-end gap-3" role="img" aria-label={`${label}: ${data.map((d) => `${d.day} ${format(d.value)}`).join(', ')}`}>
        {data.map((d) => (
          <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[11px] tabular-nums text-fg-2">{d.value ? format(d.value) : ''}</span>
            <div className={`w-full rounded-sm ${d === best ? 'bg-accent' : 'bg-accent/40'}`} style={{ height: `${(d.value / max) * 82}%` }} />
            <span className="text-xs text-fg-2">{d.day}</span>
          </div>
        ))}
      </div>
    </figure>
  )
}

export function Overview() {
  const { appointments, pto } = useDash()
  const today = appointments.filter((a) => a.day === 0).sort((a, b) => a.time.localeCompare(b.time))
  return (
    <div className="space-y-5">
      <StatStrip stats={[
        { label: "Today's Appointments", value: today.length, to: '/dashboard/calendar' },
        { label: 'Revenue (this week)', value: money(REVENUE_WEEK.reduce((s, d) => s + d.value, 0)), to: '/dashboard/sales' },
        { label: 'Active Team Members', value: `${TEAM.filter((t) => t.status === 'On shift').length} / ${TEAM.length}`, to: '/dashboard/team' },
        { label: 'Pending PTO Requests', value: pto.filter((p) => p.status === 'Pending').length, to: '/dashboard/team' },
      ]} />
      <div className="grid gap-5 xl:grid-cols-3">
        <Card title="Revenue this week" className="xl:col-span-2"><Bars data={REVENUE_WEEK} label="Daily revenue" format={(v) => `$${(v / 1000).toFixed(1)}k`} /></Card>
        <Card title="Today's schedule" flush action={<Link to="/dashboard/calendar" viewTransition className="text-[13px] text-accent hover:underline">View all</Link>}>
          <ul className="divide-y divide-line">
            {today.map((a) => (
              <li key={a.id} className="flex items-baseline gap-4 px-5 py-3">
                <span className="w-11 text-sm tabular-nums text-fg-2">{a.time}</span>
                <span className="flex-1"><span className="block text-sm">{a.client}</span><span className="text-[13px] text-fg-2">{a.service} · {a.staff}</span></span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
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
    e.currentTarget.reset()
  }
  return (
    <>
      <Card title="This week" flush action={<Button size="sm" onClick={() => setAdding(true)}>New booking</Button>}>
        <div className="overflow-x-auto">
          <div className="grid min-w-[720px] grid-cols-[64px_repeat(5,1fr)] text-sm">
            <div className="border-b border-line" />
            {DAYS.map((d, i) => <div key={d} className="border-b border-l border-line px-3 py-2 text-[13px] font-medium">{d}{i === 0 && <span className="ml-1.5 font-normal text-accent">Today</span>}</div>)}
            {HOURS.map((h) => (
              <div key={h} className="contents">
                <div className="border-b border-line py-3 pr-3 text-right text-xs tabular-nums text-fg-2">{h}</div>
                {DAYS.map((_, di) => (
                  <div key={di} className={`min-h-14 border-b border-l border-line p-1 ${di === 0 ? 'bg-raised/40' : ''}`}>
                    {appointments.filter((a) => a.day === di && a.time.slice(0, 2) === h.slice(0, 2)).map((a) => (
                      <div key={a.id} className={`mb-1 rounded-md border-l-2 border-accent bg-raised px-2 py-1 ${a.id === fresh ? 'just-added' : ''}`}>
                        <p className="text-xs font-medium"><span className="tabular-nums">{a.time}</span> {a.client}</p>
                        <p className="text-[11px] text-fg-2">{a.service} · {a.staff}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="flex items-center gap-2 px-5 py-3 text-[13px] text-fg-2"><Icon name="check" className="h-4 w-4 text-success" /> Calendar sync on · Reminders sent 24h before each appointment</p>
      </Card>
      <Modal open={adding} onClose={() => setAdding(false)} title="New booking">
        <form onSubmit={add} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="bk-client" className={labelCls}>Client name</label>
            <input id="bk-client" name="client" required maxLength={60} className={fieldCls} />
          </div>
          <Select label="Service" name="service" options={BUSINESS_TYPES.salon.services.map(([s]) => ({ value: s, label: s }))} />
          <Select label="Staff" name="staff" options={['Jess', 'Sam', 'Alex'].map((s) => ({ value: s, label: s }))} />
          <Select label="Day" name="day" options={DAYS.map((d, i) => ({ value: String(i), label: d }))} />
          <Select label="Time" name="time" options={HOURS.map((h) => ({ value: h, label: h }))} />
          <Button type="submit" className="sm:col-span-2">Save booking</Button>
        </form>
      </Modal>
    </>
  )
}

export function Sales() {
  return (
    <div className="grid gap-5 xl:grid-cols-5">
      <Card title="Products & services" flush className="xl:col-span-3">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-line"><tr><Th>Name</Th><Th>Type</Th><Th num>Price</Th><Th num>Stock</Th><Th num>Sold (30d)</Th></tr></thead>
            <tbody className="divide-y divide-line">
              {PRODUCTS.map((p) => (
                <tr key={p.id} className="hover:bg-raised/50">
                  <Td>{p.name}</Td>
                  <Td className="text-fg-2">{p.type}</Td>
                  <Td num>{money(p.price)}</Td>
                  <Td num>{p.stock == null ? <span className="text-fg-2">—</span> : p.stock <= 5 ? <Badge tone="warning">Low · {p.stock}</Badge> : p.stock}</Td>
                  <Td num>{p.sold}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title="Recent orders" flush className="xl:col-span-2">
        <ul className="divide-y divide-line">
          {ORDERS.map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <span><span className="block text-sm"><span className="tabular-nums text-fg-2">{o.id}</span> · {o.customer}</span><span className="text-[13px] text-fg-2">{o.when}</span></span>
              <span className="text-right"><span className="block text-sm tabular-nums">{money(o.total)}</span><Badge tone={o.status === 'Paid' ? 'success' : 'warning'}>{o.status}</Badge></span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export function Team() {
  const { pto, setPto } = useDash()
  const decide = (id, status) => setPto(pto.map((p) => (p.id === id ? { ...p, status } : p)))
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card title="Team members" flush>
        <ul className="divide-y divide-line">
          {TEAM.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-5 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-raised text-xs font-medium text-fg-2" aria-hidden="true">{t.name.split(' ').map((n) => n[0]).join('')}</span>
              <span className="flex-1"><span className="block text-sm">{t.name}</span><span className="text-[13px] text-fg-2">{t.role} · <span className="tabular-nums">{t.hours}</span> hrs this week</span></span>
              <Badge tone={t.status === 'On shift' ? 'success' : 'neutral'}>{t.status}</Badge>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Time-off requests" flush>
        <ul className="divide-y divide-line">
          {pto.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
              <span className="flex-1"><span className="block text-sm">{p.name}</span><span className="text-[13px] text-fg-2">{p.type} · {p.dates}</span></span>
              {p.status === 'Pending' ? (
                <span className="flex gap-2">
                  <Button size="sm" onClick={() => decide(p.id, 'Approved')} aria-label={`Approve ${p.name}`}>Approve</Button>
                  <Button size="sm" variant="secondary" onClick={() => decide(p.id, 'Denied')} aria-label={`Deny ${p.name}`}>Deny</Button>
                </span>
              ) : (
                <Badge tone={p.status === 'Approved' ? 'success' : 'danger'}>{p.status}</Badge>
              )}
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Shift schedule" flush className="xl:col-span-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="border-b border-line"><tr><Th>Member</Th>{DAYS.map((d) => <Th key={d}>{d}</Th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              {TEAM.map((t, i) => (
                <tr key={t.id} className="hover:bg-raised/50">
                  <Td>{t.name.split(' ')[0]}</Td>
                  {DAYS.map((d, di) => <Td key={d} className="tabular-nums">{(i + di) % 4 === 3 ? <span className="text-fg-3">Off</span> : i % 2 ? '12–8 PM' : '9–5 PM'}</Td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export function Payroll() {
  const gross = TEAM.reduce((s, t) => s + t.rate * t.hours, 0)
  const total = EXPENSES.reduce((s, e) => s + e.value, 0)
  return (
    <div className="space-y-5">
      <StatStrip stats={[{ label: 'Pay period', value: 'Nov 1 – Nov 14' }, { label: 'Gross wages', value: money(gross) }, { label: 'Next payday', value: 'Nov 15' }, { label: 'Team members', value: TEAM.length }]} />
      <div className="grid gap-5 xl:grid-cols-5">
        <Card title="Employee summary" flush className="xl:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-line"><tr><Th>Name</Th><Th num>Hours</Th><Th num>Rate</Th><Th num>Gross</Th></tr></thead>
              <tbody className="divide-y divide-line">
                {TEAM.map((t) => <tr key={t.id} className="hover:bg-raised/50"><Td>{t.name}</Td><Td num>{t.hours}</Td><Td num>{money(t.rate)}/hr</Td><Td num className="font-medium">{money(t.rate * t.hours)}</Td></tr>)}
              </tbody>
              <tfoot className="border-t border-line"><tr><Td className="text-fg-2">Total</Td><Td num>{TEAM.reduce((s, t) => s + t.hours, 0)}</Td><Td /><Td num className="font-semibold">{money(gross)}</Td></tr></tfoot>
            </table>
          </div>
        </Card>
        <Card title="Expense distribution" className="xl:col-span-2">
          <ul className="space-y-4">
            {EXPENSES.map((e) => (
              <li key={e.label}>
                <div className="flex justify-between text-sm"><span className="text-fg-2">{e.label}</span><span className="tabular-nums">{money(e.value)} <span className="text-fg-2">· {Math.round((e.value / total) * 100)}%</span></span></div>
                <div className="mt-1.5 h-1 rounded-full bg-raised"><div className="h-full rounded-full bg-accent" style={{ width: `${(e.value / total) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
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
    <Card title="Business profile" className="max-w-2xl">
      <form onSubmit={save} onChange={() => setSaved(false)} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="st-name" className={labelCls}>Business name</label>
          <input id="st-name" name="name" defaultValue={business.name} required maxLength={40} className={fieldCls} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="st-tag" className={labelCls}>Tagline</label>
          <input id="st-tag" name="tagline" defaultValue={business.tagline} maxLength={80} className={fieldCls} />
        </div>
        <Select label="Business type" name="type" defaultValue={business.type} options={TYPE_OPTIONS} />
        <div>
          <label htmlFor="st-color" className={labelCls}>Brand color</label>
          <input id="st-color" name="color" type="color" defaultValue={business.color} className={`${fieldCls} cursor-pointer p-1`} />
        </div>
        <div className="flex items-center gap-4 border-t border-line pt-4 sm:col-span-2">
          <Button type="submit">Save changes</Button>
          <p role="status" className="text-sm text-fg-2">{saved && <span className="inline-flex items-center gap-1.5"><Icon name="check" className="h-4 w-4 text-success" /> Saved. Turn on Customer view to preview.</span>}</p>
        </div>
      </form>
    </Card>
  )
}
