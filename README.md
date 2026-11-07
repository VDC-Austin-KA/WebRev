# WebRev

Marketing site + all-in-one client dashboard for small businesses.
*"Stop juggling 5+ subscriptions. One platform, one monthly bill, total business control."*

Built with React 19, Vite, Tailwind CSS v4, React Router and [Motion](https://motion.dev). Dark, Apple-inspired UI.

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

## Motion language

Animations follow the layout so users can tell where they are from movement alone (all in `src/motion.jsx`):

- **Horizontal UI → horizontal motion.** Top-nav pages and showcase tabs slide left/right in the direction travelled; a pill glides under the active item. The nav pill also follows the section you scroll into, and a hairline progress bar tracks scroll depth.
- **Vertical UI → vertical motion.** Dashboard pages rise from below when moving down the sidebar and drop from above when moving up; the sidebar indicator and page title move the same way.
- **Depth → zoom.** Entering the dashboard or the Customer view zooms in; leaving zooms back out. Dialogs grow out of the button that opened them and shrink back into it.
- **Reading order.** Cards, rows and list items stagger in top-to-bottom, left-to-right. Counters count up, charts grow from their baseline, and approved PTO requests slide below pending ones.
- Buttons respond to presses with spring scale; dropdowns (custom accessible listbox) unfold from their trigger.
- `prefers-reduced-motion` is respected: movement is removed, fades remain.

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

Skip links, visible focus rings, native `<dialog>` modals, keyboard-operable listbox selects and switches, (focus trap + Esc), ARIA tabs with arrow-key navigation, labelled form controls, `role="status"` live regions, text-labelled charts, and AA-contrast text on black (neutral-400 or lighter for body text). Animations respect `prefers-reduced-motion`.
