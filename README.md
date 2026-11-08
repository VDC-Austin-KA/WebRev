# WebRev

Marketing site + all-in-one client dashboard for small businesses.
*"Stop juggling 5+ subscriptions. One platform, one monthly bill, total business control."*

Built with React 19, Vite, Tailwind CSS v4 and React Router. Restrained dark UI with no animation library and no web fonts.

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

## Design system

All tokens live in `src/index.css` (`@theme`), so Tailwind classes like `bg-surface`, `text-fg-2`, `border-line` and `text-accent` stay consistent:

| Token | Value | Use |
|---|---|---|
| `bg` / `surface` / `raised` | `#101114` / `#17191E` / `#1D2026` | Page, cards, inputs and active states |
| `line` | `#30333A` | Borders and dividers |
| `fg` / `fg-2` / `fg-3` | `#F5F5F7` / `#A1A1AA` / `#71717A` | Primary, secondary, muted (large text only) |
| `brand` / `brand-hover` | `#44499C` / `#5359B2` | City of Austin "Violet Crown" blue: filled actions (buttons, switches) |
| `accent` | `#9DA2DA` | Tint of the Austin blue for text, icons and indicators on dark backgrounds |
| `green` / `success` | `#009F4D` | City of Austin green: confirmations, positive values (savings, checks) |
| `warning` / `danger` | `#D6AA68` / `#D77D7D` | Status |

- **Type:** system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", …`), weights 400/500/600, tabular numbers for figures.
- **Shape:** 8px controls, 12px surfaces. No gradients, glows, glass or blur.
- **Components:** one button system (`primary` / `secondary` / `quiet` × `sm` / `md` / `lg`), native selects, checkboxes and dialogs.
- **Data:** grouped into one surface with dividers rather than separate cards.

## Transitions

Animations exist to show where you moved, and they use only the browser's View Transitions API and CSS (`src/transitions.js`, `src/index.css`):

- **Horizontal navigation** (top nav, showcase tabs): content slides in from the direction you moved.
- **Dashboard sidebar:** content and page title come from below when moving down the list, from above when moving up.
- **Depth:** entering the dashboard or the Customer view scales in; leaving scales out.
- **Indicators:** active-item markers slide between items using CSS transitions. Dialogs fade in and out with CSS.
- Browsers without View Transitions switch pages instantly. `prefers-reduced-motion` turns all motion off.

## Configure

All tunables live in `src/config.js`:

- `BRAND` — platform name used across the UI.
- `FOUNDER` — total/claimed founder spots. Set `VITE_SPOTS_ENDPOINT` (GET → `{ "claimed": 63 }`) to make the counter live; it polls every 30s.
- `VITE_LEAD_ENDPOINT` — POST target for the claim/waitlist form (`{ name, business, email, plan }`). Without it the form shows success locally.
- `PLANS`, `LEGACY_TOOLS` — prices used by the tiers and savings calculator.
- `DEMO_VIDEO.embedUrl` and `embedUrl` on each entry in `src/data/mock.js` `VIDEOS` — YouTube/Vimeo embed URL or `.mp4`. Empty shows a placeholder.

Dashboard and showcase data is sample data in `src/data/mock.js`; case studies are labeled as illustrative — replace with real ones.

## Deploy (Cloudflare)

Hosted as a static site on Cloudflare Workers (`wrangler.jsonc`). Unknown paths fall back to `index.html` for client-side routing, and `public/_headers` marks the test site `noindex`.

```bash
export CLOUDFLARE_API_TOKEN=...   # token with "Edit Cloudflare Workers" permissions
npm run deploy                    # builds, then publishes to https://webrev.<account>.workers.dev
```

For a custom subdomain on a domain in your Cloudflare account, add to `wrangler.jsonc`:
`"routes": [{ "pattern": "preview.yourdomain.com", "custom_domain": true }]`. Remove `public/_headers` when the site should be indexed.

## Accessibility

Skip links, visible focus rings, native `<dialog>` modals, keyboard-operable listbox selects and switches, (focus trap + Esc), ARIA tabs with arrow-key navigation, labelled form controls, `role="status"` live regions, text-labelled charts, and AA-contrast text on black (neutral-400 or lighter for body text). Animations respect `prefers-reduced-motion`.
