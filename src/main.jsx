import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import './index.css'
import SiteLayout from './components/SiteLayout'
import Landing from './pages/Landing'
import Showcase from './pages/Showcase'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import { Calendar, Overview, Payroll, Sales, Settings, Team } from './pages/dashboard/pages'
import { RouteLocation, flow, useFlow } from './motion'

// Marketing site and dashboard are two "depths": entering the dashboard zooms in, leaving zooms out.
function App() {
  const location = useLocation()
  const depth = location.pathname.startsWith('/dashboard') ? 1 : 0
  const dir = useFlow(depth, depth, 'z')
  return (
    <AnimatePresence mode="wait" custom={dir}>
      <motion.div key={depth} custom={dir} variants={flow} initial="initial" animate="animate" exit="exit">
        <RouteLocation.Provider value={location}>
          <Routes location={location}>
            <Route element={<SiteLayout />}>
              <Route index element={<Landing />} />
              <Route path="showcase" element={<Showcase />} />
              <Route path="examples" element={<Showcase />} />
            </Route>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="sales" element={<Sales />} />
              <Route path="team" element={<Team />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </RouteLocation.Provider>
      </motion.div>
    </AnimatePresence>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
