import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Modal, money } from '../../components/ui'
import { BUSINESS_TYPES, EXPENSES, ORDERS, PRODUCTS, REVENUE_WEEK, TEAM } from '../../data/mock'
import { useDash } from './DashboardLayout'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const Card = ({ title, action, children, className = '' }) => (
  <section className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${className}`}>
    {title && <div className="mb-4 flex items-center justify-between gap-2"><h2 className="font-bold text-slate-900">{title}</h2>{action}</div>}
    {children}
  </section>
)
const Pill = ({ tone = 'slate', children }) => {
  const t = { slate: 'bg-slate-100 text-slate-800', green: 'bg-emerald-100 text-emerald-900', amber: 'bg-amber-100 text-amber-900', rose: 'bg-rose-100 text-rose-900' }
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${t[tone]}`}>{children}</span>
}
const Th = (p) => <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600" {...p} />
const Td = ({ className = '', ...p }) => <td className={`px-3 py-3 text-sm text-slate-800 ${className}`} {...p} />

function Bars({ data, label, format = (v) => v }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <figure>
      <div className="flex h-44 items-end gap-2" role="img" aria-label={`${label}: ${data.map((d) => `${d.day ?? d.label} ${format(d.value)}`).join(', ')}`}>
        {data.map((d) => (
          <div key={d.day ?? d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className="text-[11px] font-medium text-slate-700">{d.value ? format(d.value) : ''}</span>
            <div className="w-full rounded-t-md bg-emerald-600" style={{ height: `${(d.value / max) * 80}%` }} />
            <span className="text-xs text-slate-600">{d.day ?? d.label}</span>
          </div>
        ))}
      </div>
    </figure>
  )
}

export function Overview() {
  const { appointments, pto } = useDash()
  const today = appointments.filter((a) => a.day === 0)
  const pending = pto.filter((p) => p.status === 'Pending').length
  const stats = [
    { label: "Today's Appointments", value: today.length, icon: 'calendar', to: '/dashboard/calendar' },
    { label: 'Revenue (this week)', value: money(REVENUE_WEEK.reduce((s, d) => s + d.value, 0)), icon: 'chart', to: '/dashboard/sales' },
    { label: 'Active Team Members', value: TEAM.filter((t) => t.status === 'On shift').length + ' / ' + TEAM.length, icon: 'users', to: '/dashboard/team' },
    { label: 'Pending PTO Requests', value: pending, icon: 'clock', to: '/dashboard/team' },
  ]
  return (
    <div className="space-y-6">
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link to={s.to} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:ring-emerald-500">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-emerald-300"><Icon name={s.icon} /></span>
              <span><span className="block text-sm text-slate-600">{s.label}</span><span className="block text-2xl font-bold text-slate-900">{s.value}</span></span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Revenue this week" className="xl:col-span-2"><Bars data={REVENUE_WEEK} label="Daily revenue" format={(v) => `$${(v / 1000).toFixed(1)}k`} /></Card>
        <Card title="Today's schedule" action={<Link to="/dashboard/calendar" className="text-sm font-medium text-emerald-800 hover:underline">View all</Link>}>
          <ul className="divide-y divide-slate-100">
            {today.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-2.5">
                <span className="w-12 text-sm font-semibold text-slate-900">{a.time}</span>
                <span className="flex-1"><span className="block text-sm font-medium text-slate-900">{a.client}</span><span className="text-xs text-slate-600">{a.service} · {a.staff}</span></span>
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
  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
  const add = (e) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    setAppointments([...appointments, { id: Date.now(), day: +f.day, time: f.time, client: f.client.trim(), service: f.service, staff: f.staff, duration: 1 }])
    setAdding(false)
  }
  return (
    <Card title="This week" action={<Button className="py-2" onClick={() => setAdding(true)}>+ New booking</Button>}>
      <div className="overflow-x-auto">
        <div className="grid min-w-[720px] grid-cols-[60px_repeat(5,1fr)] text-sm">
          <div />
          {DAYS.map((d, i) => <div key={d} className="border-b border-slate-200 px-2 py-2 font-semibold text-slate-900">{d}{i === 0 && <span className="ml-1 text-xs font-normal text-emerald-800">(today)</span>}</div>)}
          {hours.map((h) => (
            <div key={h} className="contents">
              <div className="border-t border-slate-100 py-3 pr-2 text-right text-xs text-slate-600">{h}</div>
              {DAYS.map((_, di) => {
                const appts = appointments.filter((a) => a.day === di && a.time.slice(0, 2) === h.slice(0, 2))
                return (
                  <div key={di} className="min-h-14 border-l border-t border-slate-100 p-1">
                    {appts.map((a) => (
                      <div key={a.id} className="mb-1 rounded-md border-l-4 border-emerald-600 bg-emerald-50 px-2 py-1">
                        <p className="text-xs font-semibold text-slate-900">{a.time} {a.client}</p>
                        <p className="text-[11px] text-slate-700">{a.service} · {a.staff}</p>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-slate-600"><Icon name="check" className="h-4 w-4 text-emerald-700" /> Calendar sync on · Reminders sent 24h before each appointment</p>
      <Modal open={adding} onClose={() => setAdding(false)} title="New booking">
        <form onSubmit={add} className="grid gap-4 sm:grid-cols-2">
          <Field label="Client name" className="sm:col-span-2"><input name="client" required maxLength={60} className="input" /></Field>
          <Field label="Service"><select name="service" className="input">{BUSINESS_TYPES.salon.services.map(([s]) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Staff"><select name="staff" className="input">{['Jess', 'Sam', 'Alex'].map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Day"><select name="day" className="input">{DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}</select></Field>
          <Field label="Time"><select name="time" className="input">{hours.map((h) => <option key={h}>{h}</option>)}</select></Field>
          <Button type="submit" variant="dark" className="sm:col-span-2">Save booking</Button>
        </form>
      </Modal>
    </Card>
  )
}

function Field({ label, children, className = '' }) {
  return <label className={`block text-sm font-medium text-slate-900 ${className}`}>{label}<span className="mt-1 block [&_.input]:w-full [&_.input]:rounded-lg [&_.input]:border [&_.input]:border-slate-300 [&_.input]:px-3 [&_.input]:py-2 [&_.input]:font-normal">{children}</span></label>
}

export function Sales() {
  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <Card title="Products & services" className="xl:col-span-3">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-200"><Th>Name</Th><Th>Type</Th><Th>Price</Th><Th>Stock</Th><Th>Sold (30d)</Th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {PRODUCTS.map((p) => (
                <tr key={p.id}>
                  <Td className="font-medium text-slate-900">{p.name}</Td>
                  <Td><Pill>{p.type}</Pill></Td>
                  <Td>{money(p.price)}</Td>
                  <Td>{p.stock == null ? '—' : p.stock <= 5 ? <Pill tone="amber">Low: {p.stock}</Pill> : p.stock}</Td>
                  <Td>{p.sold}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title="Recent orders" className="xl:col-span-2">
        <ul className="divide-y divide-slate-100">
          {ORDERS.map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-3 py-3">
              <span><span className="block text-sm font-semibold text-slate-900">{o.id} · {o.customer}</span><span className="text-xs text-slate-600">{o.when}</span></span>
              <span className="text-right"><span className="block text-sm font-semibold">{money(o.total)}</span><Pill tone={o.status === 'Paid' ? 'green' : 'amber'}>{o.status}</Pill></span>
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
    <div className="grid gap-6 xl:grid-cols-2">
      <Card title="Team members">
        <ul className="divide-y divide-slate-100">
          {TEAM.map((t) => (
            <li key={t.id} className="flex items-center gap-3 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-emerald-300" aria-hidden="true">{t.name.split(' ').map((n) => n[0]).join('')}</span>
              <span className="flex-1"><span className="block text-sm font-semibold text-slate-900">{t.name}</span><span className="text-xs text-slate-600">{t.role} · {t.hours} hrs this week</span></span>
              <Pill tone={t.status === 'On shift' ? 'green' : 'slate'}>{t.status}</Pill>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Time-off requests">
        <ul className="divide-y divide-slate-100">
          {pto.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="flex-1"><span className="block text-sm font-semibold text-slate-900">{p.name}</span><span className="text-xs text-slate-600">{p.type} · {p.dates}</span></span>
              {p.status === 'Pending' ? (
                <span className="flex gap-2">
                  <button onClick={() => decide(p.id, 'Approved')} className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800" aria-label={`Approve ${p.name}`}>Approve</button>
                  <button onClick={() => decide(p.id, 'Denied')} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100" aria-label={`Deny ${p.name}`}>Deny</button>
                </span>
              ) : (
                <Pill tone={p.status === 'Approved' ? 'green' : 'rose'}>{p.status}</Pill>
              )}
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Shift schedule" className="xl:col-span-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead><tr className="border-b border-slate-200"><Th>Member</Th>{DAYS.map((d) => <Th key={d}>{d}</Th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {TEAM.map((t, i) => (
                <tr key={t.id}>
                  <Td className="font-medium text-slate-900">{t.name.split(' ')[0]}</Td>
                  {DAYS.map((d, di) => <Td key={d}>{(i + di) % 4 === 3 ? <span className="text-slate-500">Off</span> : i % 2 ? '12–8 PM' : '9–5 PM'}</Td>)}
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
    <div className="space-y-6">
      <ul className="grid gap-4 sm:grid-cols-3">
        {[['Pay period', 'Nov 1 – Nov 14'], ['Gross wages', money(gross)], ['Next payday', 'Nov 15']].map(([l, v]) => (
          <li key={l} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm text-slate-600">{l}</p><p className="text-2xl font-bold text-slate-900">{v}</p></li>
        ))}
      </ul>
      <div className="grid gap-6 xl:grid-cols-5">
        <Card title="Employee summary" className="xl:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-200"><Th>Name</Th><Th>Hours</Th><Th>Rate</Th><Th>Gross</Th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {TEAM.map((t) => <tr key={t.id}><Td className="font-medium text-slate-900">{t.name}</Td><Td>{t.hours}</Td><Td>{money(t.rate)}/hr</Td><Td className="font-semibold">{money(t.rate * t.hours)}</Td></tr>)}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Expense distribution" className="xl:col-span-2">
          <ul className="space-y-3">
            {EXPENSES.map((e) => (
              <li key={e.label}>
                <div className="flex justify-between text-sm"><span className="text-slate-800">{e.label}</span><span className="font-semibold text-slate-900">{money(e.value)} <span className="font-normal text-slate-600">({Math.round((e.value / total) * 100)}%)</span></span></div>
                <div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-600" style={{ width: `${(e.value / total) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

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
        <Field label="Business name" className="sm:col-span-2"><input name="name" defaultValue={business.name} required maxLength={40} className="input" /></Field>
        <Field label="Tagline" className="sm:col-span-2"><input name="tagline" defaultValue={business.tagline} maxLength={80} className="input" /></Field>
        <Field label="Business type"><select name="type" defaultValue={business.type} className="input">{Object.entries(BUSINESS_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></Field>
        <Field label="Brand color"><input name="color" type="color" defaultValue={business.color} className="input h-10 cursor-pointer p-1" /></Field>
        <div className="flex items-center gap-4 sm:col-span-2">
          <Button type="submit" variant="dark">Save changes</Button>
          <p role="status" className="text-sm text-emerald-800">{saved && 'Saved — toggle “Customer view” to preview.'}</p>
        </div>
      </form>
    </Card>
  )
}
