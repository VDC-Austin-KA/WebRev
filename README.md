# WebRev

Marketing site + all-in-one client dashboard for small businesses.
*"Stop juggling 5+ subscriptions. One platform, one monthly bill, total business control."*

Built with React 19, Vite, Tailwind CSS v4 and React Router.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Routes

| Route | What it is |
|---|---|
| `/` | Landing page: hero, old-way vs. new-way matrix, feature grid, early-bird pricing with live spot counter and savings calculator |
| `/showcase` (alias `/examples`) | Tabbed hub: video demo gallery (modal player), before/after case-study cards, interactive customer-portal sandbox |
| `/dashboard/*` | Client app: Overview, Calendar & Bookings, Sales & Products, Team (HR & PTO), Payroll, Settings, plus a **Customer view** toggle that previews the public storefront/booking page |

## Configure

All tunables live in `src/config.js`:

- `BRAND` — platform name used across the UI.
- `FOUNDER` — total/claimed founder spots. Set `VITE_SPOTS_ENDPOINT` (GET → `{ "claimed": 63 }`) to make the counter live; it polls every 30s.
- `VITE_LEAD_ENDPOINT` — POST target for the claim/waitlist form (`{ name, business, email, plan }`). Without it the form shows success locally.
- `PLANS`, `LEGACY_TOOLS` — prices used by the tiers and savings calculator.
- `DEMO_VIDEO.embedUrl` and `embedUrl` on each entry in `src/data/mock.js` `VIDEOS` — YouTube/Vimeo embed URL or `.mp4`. Empty shows a placeholder.

Dashboard and showcase data is sample data in `src/data/mock.js`; case studies are labeled as illustrative — replace with real ones.

## Deploy

Uses client-side routing — configure your host to serve `index.html` for unknown paths (e.g. Netlify `_redirects`: `/* /index.html 200`, or Vercel rewrites).

## Accessibility

Skip links, visible focus rings, native `<dialog>` modals (focus trap + Esc), ARIA tabs with arrow-key navigation, labelled form controls, `role="status"` live regions, text-labelled charts, and AA-contrast color pairs (emerald-700+ on light, emerald-300/400 on dark). Animations respect `prefers-reduced-motion`.
