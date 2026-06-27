import { AdminDashboardPage } from '../../features/admin-dashboard/pages/AdminDashboardPage'
import { ComplaintWorkspacePage } from '../../features/admin-complaints/pages/ComplaintWorkspacePage'
import { PublicHomePage } from '../../features/public-portal/pages/PublicHomePage'
import { SubmitComplaintPage } from '../../features/public-portal/pages/SubmitComplaintPage'
import { TrackComplaintPage } from '../../features/public-portal/pages/TrackComplaintPage'
import { publicNavigation, systemModules } from '../../shared/config/navigation'
import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'

export function RouteRegistry() {
  return (
    <main>
      <PublicLayout navigation={publicNavigation}>
        <PublicHomePage modules={systemModules.public} />
        <SubmitComplaintPage />
        <TrackComplaintPage />
      </PublicLayout>

      <AdminLayout modules={systemModules.admin}>
        <AdminDashboardPage />
        <ComplaintWorkspacePage />
      </AdminLayout>
    </main>
  )
}
