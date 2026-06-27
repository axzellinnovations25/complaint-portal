import { useEffect, useState } from 'react'
import { AdminDashboardPage } from '../../features/admin-dashboard/pages/AdminDashboardPage'
import { ComplaintWorkspacePage } from '../../features/admin-complaints/pages/ComplaintWorkspacePage'
import { PublicHomePage } from '../../features/public-portal/pages/PublicHomePage'
import { PublicNoticesPage } from '../../features/public-portal/pages/PublicNoticesPage'
import { PublicServicesPage } from '../../features/public-portal/pages/PublicServicesPage'
import { SubmitComplaintPage } from '../../features/public-portal/pages/SubmitComplaintPage'
import { TrackComplaintPage } from '../../features/public-portal/pages/TrackComplaintPage'
import { publicNavigation, systemModules } from '../../shared/config/navigation'
import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'

function getCurrentPath() {
  const pathname = window.location.pathname.replace(/\/+$/, '')
  return pathname || '/'
}

export function RouteRegistry() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath)

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigate = (href: string) => {
    if (href === currentPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    window.history.pushState({}, '', href)
    setCurrentPath(getCurrentPath())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let publicPage = <PublicHomePage onNavigate={handleNavigate} />

  if (currentPath === '/services') {
    publicPage = <PublicServicesPage onNavigate={handleNavigate} />
  }

  if (currentPath === '/submit') {
    publicPage = <SubmitComplaintPage />
  }

  if (currentPath === '/track') {
    publicPage = <TrackComplaintPage />
  }

  if (currentPath === '/notices') {
    publicPage = <PublicNoticesPage onNavigate={handleNavigate} />
  }

  if (currentPath.startsWith('/admin')) {
    return (
      <main>
        <AdminLayout modules={systemModules.admin}>
          <AdminDashboardPage />
          <ComplaintWorkspacePage />
        </AdminLayout>
      </main>
    )
  }

  return (
    <main>
      <PublicLayout currentPath={currentPath} navigation={publicNavigation} onNavigate={handleNavigate}>
        {publicPage}
      </PublicLayout>
    </main>
  )
}
