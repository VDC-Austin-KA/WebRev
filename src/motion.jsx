import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useReducedMotion } from 'motion/react'
import { useOutlet } from 'react-router-dom'

/*
 * Motion language
 * - Horizontal UI (top nav, tabs)     → content slides along x in the direction you moved.
 * - Vertical UI (dashboard sidebar)    → content slides along y: going down the list, content rises from below.
 * - Depth (site → dashboard, customer view, modals) → zoom: going "in" scales up from behind, going "out" recedes.
 */
export const spring = { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 }
export const softSpring = { type: 'spring', stiffness: 220, damping: 28 }
export const easeOut = [0.16, 1, 0.3, 1]

const OFFSET = 32
export const flow = {
  initial: ({ axis, d }) =>
    axis === 'z'
      ? { opacity: 0, scale: d >= 0 ? 0.96 : 1.03, filter: 'blur(8px)' }
      : { opacity: 0, [axis]: d * OFFSET, filter: 'blur(6px)' },
  animate: {
    opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { ...softSpring, opacity: { duration: 0.35, ease: easeOut }, filter: { duration: 0.35 } },
    transitionEnd: { filter: 'none' }, // a lingering filter would break position:fixed children
  },
  exit: ({ axis, d }) => ({
    opacity: 0,
    ...(axis === 'z' ? { scale: d >= 0 ? 1.03 : 0.96 } : { [axis]: -d * OFFSET }),
    filter: 'blur(6px)',
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  }),
}

/** Remembers the direction of the most recent key change: { axis, d: -1 | 0 | 1 }. */
export function useFlow(key, index, axis) {
  const r = useRef({ key, index, custom: { axis: typeof axis === 'function' ? 'z' : axis, d: 0 } })
  if (r.current.key !== key) {
    const a = typeof axis === 'function' ? axis(r.current.key, key) : axis
    r.current = { key, index, custom: { axis: a, d: Math.sign(index - r.current.index) } }
  }
  return r.current.custom
}

// Location captured per transition, so exiting trees keep rendering their own route.
export const RouteLocation = createContext(null)
export const useRouteLocation = () => useContext(RouteLocation)

export function restoreScroll() {
  const el = window.location.hash && document.getElementById(window.location.hash.slice(1))
  if (el) el.scrollIntoView({ behavior: 'instant' })
  else window.scrollTo({ top: 0, behavior: 'instant' })
}

/** Page wrapper: animates with the flow and restores scroll once mounted. */
export function Page({ custom, children, className }) {
  useLayoutEffect(restoreScroll, [])
  return (
    <motion.div custom={custom} variants={flow} initial="initial" animate="animate" exit="exit" className={className}>
      {children}
    </motion.div>
  )
}

/** Outlet frozen at mount so an exiting page doesn't swap to the next route mid-animation. */
export function FrozenOutlet() {
  const outlet = useOutlet()
  const [frozen] = useState(outlet)
  return frozen
}

// Staggered reveal for lists and grids.
export const stagger = (gap = 0.06, delay = 0) => ({ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } })
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}
export const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } }

export function Reveal({ as = 'div', delay = 0, className, children, ...rest }) {
  const M = motion[as]
  return (
    <M className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: easeOut, delay }} {...rest}>
      {children}
    </M>
  )
}

/** Counts smoothly to `value` (from 0 on mount, from the previous value afterwards). */
export function AnimatedNumber({ value, format = (v) => Math.round(v).toLocaleString('en-US') }) {
  const reduce = useReducedMotion()
  const from = useRef(0)
  const [display, setDisplay] = useState(() => format(reduce ? value : 0))
  useEffect(() => {
    if (reduce) { setDisplay(format(value)); from.current = value; return }
    const c = animate(from.current, value, {
      duration: 0.8, ease: easeOut,
      onUpdate: (v) => { from.current = v; setDisplay(format(v)) },
    })
    return () => c.stop()
  }, [value, reduce]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span className="tabular-nums">{display}</span>
}
