import { StrictMode, useLayoutEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom'
import './index.css'
import SiteLayout from './components/SiteLayout'
import Landing from './pages/Landing'
import Showcase from './pages/Showcase'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import { Calendar, Overview, Payroll, Sales, Settings, Team } from './pages/dashboard/pages'
import { installLinkDirections } from './transitions'

installLinkDirections()

// New page → top (or its #anchor); same page + #anchor → smooth scroll.
function Root() {
  const { pathname, hash } = useLocation()
  const prev = useRef(pathname)
  useLayoutEffect(() => {
    const samePage = prev.current === pathname
    prev.current = pathname
    const el = hash && document.getElementById(hash.slice(1))
    if (el) el.scrollIntoView({ behavior: samePage ? 'smooth' : 'instant' })
    else if (!samePage) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return <Outlet />
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        element: <SiteLayout />,
        children: [
          { index: true, element: <Landing /> },
          { path: 'showcase', element: <Showcase /> },
          { path: 'examples', element: <Showcase /> },
        ],
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Overview /> },
          { path: 'calendar', element: <Calendar /> },
          { path: 'sales', element: <Sales /> },
          { path: 'team', element: <Team /> },
          { path: 'payroll', element: <Payroll /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
