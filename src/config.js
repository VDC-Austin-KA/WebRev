// Central place to rename the platform and tune the offer.
export const BRAND = 'WebRev'

export const FOUNDER = {
  totalSpots: 100,
  // Fallback when no live endpoint is configured.
  claimedSpots: 63,
  // Optional: GET endpoint returning { claimed: number }. Set VITE_SPOTS_ENDPOINT in .env.
  endpoint: import.meta.env.VITE_SPOTS_ENDPOINT,
}

// Optional: POST endpoint that receives { name, business, email, plan } from the claim form.
export const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT

export const PLANS = {
  founder: { name: 'Founding Member', price: 89, includedSeats: 15 },
  standard: { name: 'Standard', price: 149, includedSeats: 15 },
  extraSeat: 4, // per team member above includedSeats
}

// What a typical small business pays to stitch together separate tools (monthly, USD).
// perSeat is charged per team member.
export const LEGACY_TOOLS = [
  { id: 'web', label: 'Website builder', base: 29, perSeat: 0 },
  { id: 'booking', label: 'Booking & scheduling app', base: 35, perSeat: 0 },
  { id: 'store', label: 'Online store / POS', base: 39, perSeat: 0 },
  { id: 'hr', label: 'HR, shifts & PTO tool', base: 0, perSeat: 5 },
  { id: 'payroll', label: 'Payroll service', base: 40, perSeat: 6 },
  { id: 'crm', label: 'CRM & customer inbox', base: 25, perSeat: 0 },
]

// Set embedUrl to a YouTube/Vimeo embed URL (or .mp4) when recordings are ready.
export const DEMO_VIDEO = { title: `${BRAND} in 2 minutes`, embedUrl: '' }
