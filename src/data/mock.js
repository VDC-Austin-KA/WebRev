// Sample data powering the demo dashboard and showcase. Replace with API calls.

export const VIDEOS = [
  { id: 'tour', title: 'Full platform tour', length: '2:04', category: 'Overview', embedUrl: '', summary: 'Every module in one walk-through: bookings, store, team and payroll.' },
  { id: 'booking', title: 'Set up online booking in 5 minutes', length: '4:31', category: 'Bookings', embedUrl: '', summary: 'Add services, set hours, and share your booking link.' },
  { id: 'store', title: 'Launch your storefront', length: '3:48', category: 'Sales', embedUrl: '', summary: 'Add products, connect payments and take your first order.' },
  { id: 'shifts', title: 'Shifts & time-off for your team', length: '3:12', category: 'Team', embedUrl: '', summary: 'Build a weekly schedule and approve PTO in one click.' },
  { id: 'payroll', title: 'Run payroll reports', length: '2:55', category: 'Payroll', embedUrl: '', summary: 'Review hours, wages and expense distribution each period.' },
  { id: 'crm', title: 'One inbox for every customer', length: '3:20', category: 'CRM', embedUrl: '', summary: 'Texts, emails and booking notes in a single client profile.' },
]

// Illustrative scenarios (not real customers) — swap in real case studies as they come in.
export const CASE_STUDIES = [
  {
    business: 'Corner bakery',
    owner: '2 locations · 9 staff',
    before: ['Paper order book', 'Separate POS, payroll & scheduling apps', 'No online ordering'],
    after: ['Online pre-orders with pickup times', 'Shifts and payroll in one place', 'Single monthly bill'],
    stats: [{ label: 'Software spend', value: '−$212/mo' }, { label: 'Online orders', value: '+38%' }],
  },
  {
    business: 'Neighborhood hair salon',
    owner: '1 location · 6 stylists',
    before: ['Phone-only bookings', 'Frequent no-shows', 'Texting clients from personal phones'],
    after: ['24/7 self-booking with deposits', 'Automatic SMS reminders', 'Shared client inbox'],
    stats: [{ label: 'No-shows', value: '−61%' }, { label: 'Hours saved', value: '7 hrs/wk' }],
  },
  {
    business: 'Family auto repair',
    owner: '1 shop · 5 techs',
    before: ['Outdated website', 'Spreadsheet timesheets', 'Invoices on carbon paper'],
    after: ['Modern site with service booking', 'Clock-in & PTO tracking', 'Digital invoices & payments'],
    stats: [{ label: 'Software spend', value: '−$148/mo' }, { label: 'Paid faster', value: '4.2 days' }],
  },
]

export const APPOINTMENTS = [
  { id: 1, day: 0, time: '09:00', client: 'Maria Lopez', service: 'Cut & style', staff: 'Jess', duration: 1 },
  { id: 2, day: 0, time: '10:30', client: 'Dan Okafor', service: 'Beard trim', staff: 'Sam', duration: 1 },
  { id: 3, day: 0, time: '13:00', client: 'Priya Shah', service: 'Color', staff: 'Jess', duration: 2 },
  { id: 4, day: 0, time: '15:30', client: 'Tom Becker', service: 'Cut & style', staff: 'Alex', duration: 1 },
  { id: 5, day: 1, time: '11:00', client: 'Lena Novak', service: 'Highlights', staff: 'Jess', duration: 2 },
  { id: 6, day: 2, time: '09:30', client: 'Chris Ward', service: 'Cut & style', staff: 'Sam', duration: 1 },
  { id: 7, day: 3, time: '14:00', client: 'Aisha Khan', service: 'Blowout', staff: 'Alex', duration: 1 },
  { id: 8, day: 4, time: '10:00', client: 'Ben Torres', service: 'Cut & style', staff: 'Sam', duration: 1 },
]

export const PRODUCTS = [
  { id: 1, name: 'Cut & style', type: 'Service', price: 55, stock: null, sold: 84 },
  { id: 2, name: 'Color', type: 'Service', price: 120, stock: null, sold: 31 },
  { id: 3, name: 'Argan repair oil', type: 'Product', price: 24, stock: 18, sold: 42 },
  { id: 4, name: 'Gift card', type: 'Product', price: 50, stock: null, sold: 17 },
  { id: 5, name: 'Volume shampoo', type: 'Product', price: 18, stock: 4, sold: 26 },
]

export const ORDERS = [
  { id: '#1042', customer: 'Priya Shah', total: 144, status: 'Paid', when: 'Today, 1:12 PM' },
  { id: '#1041', customer: 'Online order', total: 48, status: 'Ready for pickup', when: 'Today, 11:40 AM' },
  { id: '#1040', customer: 'Dan Okafor', total: 30, status: 'Paid', when: 'Yesterday' },
  { id: '#1039', customer: 'Gift card', total: 100, status: 'Paid', when: 'Yesterday' },
]

export const TEAM = [
  { id: 1, name: 'Jess Rivera', role: 'Senior stylist', rate: 26, hours: 38, status: 'On shift' },
  { id: 2, name: 'Sam Patel', role: 'Barber', rate: 22, hours: 34, status: 'On shift' },
  { id: 3, name: 'Alex Kim', role: 'Stylist', rate: 21, hours: 30, status: 'Off today' },
  { id: 4, name: 'Morgan Lee', role: 'Front desk', rate: 17, hours: 25, status: 'On shift' },
]

export const PTO_REQUESTS = [
  { id: 1, name: 'Alex Kim', dates: 'Nov 24 – Nov 26', type: 'Vacation', status: 'Pending' },
  { id: 2, name: 'Morgan Lee', dates: 'Nov 14', type: 'Sick', status: 'Pending' },
  { id: 3, name: 'Sam Patel', dates: 'Dec 22 – Dec 29', type: 'Vacation', status: 'Approved' },
]

export const REVENUE_WEEK = [
  { day: 'Mon', value: 820 }, { day: 'Tue', value: 640 }, { day: 'Wed', value: 910 },
  { day: 'Thu', value: 1180 }, { day: 'Fri', value: 1460 }, { day: 'Sat', value: 1720 }, { day: 'Sun', value: 0 },
]

export const EXPENSES = [
  { label: 'Wages', value: 3460 },
  { label: 'Payroll taxes', value: 265 },
  { label: 'Supplies', value: 610 },
  { label: 'Rent', value: 1800 },
  { label: 'Software', value: 89 },
]

export const BUSINESS_TYPES = {
  salon: { label: 'Salon / barber', services: [['Cut & style', 55, '45 min'], ['Color', 120, '2 hr'], ['Blowout', 40, '30 min']] },
  bakery: { label: 'Bakery / café', services: [['Custom cake', 65, 'Pre-order'], ['Dozen pastries', 28, 'Pickup'], ['Catering tray', 90, 'Pre-order']] },
  fitness: { label: 'Fitness studio', services: [['Drop-in class', 20, '50 min'], ['Personal training', 70, '1 hr'], ['10-class pack', 170, 'Pass']] },
  repair: { label: 'Repair shop', services: [['Diagnostic', 89, '1 hr'], ['Oil change', 49, '30 min'], ['Brake service', 220, '2 hr']] },
}
