import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import SiteLayout from './components/SiteLayout'
import Landing from './pages/Landing'
import Showcase from './pages/Showcase'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import { Calendar, Overview, Payroll, Sales, Settings, Team } from './pages/dashboard/pages'

// Scroll to #hash targets on navigation, otherwise to top.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollManager />
      <Routes>
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
    </BrowserRouter>
  </StrictMode>,
)
