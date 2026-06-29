import { useEffect, useState } from 'react'
import { AdminDashboardPage } from '../../features/admin-dashboard/pages/AdminDashboardPage'
import {
  AdminAccessDeniedPage,
  CommunicationAdministrationPage,
  ContentAdministrationPage,
  DepartmentsAdministrationPage,
  ReportsAdministrationPage,
} from '../../features/admin-dashboard/pages/AdminSectionPages'
import { ComplaintWorkspacePage } from '../../features/admin-complaints/pages/ComplaintWorkspacePage'
import { AdminLoginPage } from '../../features/identity/pages/AdminLoginPage'
import { PublicHomePage } from '../../features/public-portal/pages/PublicHomePage'
import { PublicNoticesPage } from '../../features/public-portal/pages/PublicNoticesPage'
import { PublicServicesPage } from '../../features/public-portal/pages/PublicServicesPage'
import { SubmitComplaintPage } from '../../features/public-portal/pages/SubmitComplaintPage'
import { TrackComplaintPage } from '../../features/public-portal/pages/TrackComplaintPage'
import {
  adminSections,
  canAccessAdminSection,
  getAdminSectionsForRole,
  type AdminSectionDefinition,
  type UserRole,
} from '../../entities/user/model/roles'
import { publicNavigation } from '../../shared/config/navigation'
import { supabase } from '../../shared/lib/supabase/client'
import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import type { Session } from '@supabase/supabase-js'

const ADMIN_LOGIN_PATH = '/staff-access'

type AdminAuthStatus = 'checking' | 'signed-out' | 'authorized' | 'denied'

type AdminProfile = {
  email: string
  fullName: string
  role: UserRole
}

type AdminProfileRow = {
  full_name: string
  is_active: boolean
  role: UserRole
}

function getCurrentPath() {
  const pathname = window.location.pathname.replace(/\/+$/, '')
  return pathname || '/'
}

function renderAdminSection(section: AdminSectionDefinition, role: UserRole) {
  if (!canAccessAdminSection(role, section.id)) {
    return null
  }

  if (section.id === 'dashboard') {
    return <AdminDashboardPage />
  }

  if (section.id === 'complaints') {
    return <ComplaintWorkspacePage />
  }

  if (section.id === 'departments') {
    return <DepartmentsAdministrationPage />
  }

  if (section.id === 'reports') {
    return <ReportsAdministrationPage />
  }

  if (section.id === 'content') {
    return <ContentAdministrationPage />
  }

  return <CommunicationAdministrationPage />
}

export function RouteRegistry() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath)
  const [adminAuthStatus, setAdminAuthStatus] = useState<AdminAuthStatus>('checking')
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [adminAuthMessage, setAdminAuthMessage] = useState('')

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadAdminProfile = async (session: Session | null) => {
      if (!session) {
        if (isMounted) {
          setAdminProfile(null)
          setAdminAuthStatus('signed-out')
          setAdminAuthMessage('')
        }
        return
      }

      if (isMounted) {
        setAdminAuthStatus('checking')
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role, is_active')
        .eq('id', session.user.id)
        .maybeSingle()
      const profile = data as AdminProfileRow | null

      if (!isMounted) {
        return
      }

      if (error) {
        setAdminProfile(null)
        setAdminAuthStatus('denied')
        setAdminAuthMessage('Your account is signed in, but the staff profile could not be read.')
        return
      }

      if (!profile) {
        setAdminProfile(null)
        setAdminAuthStatus('denied')
        setAdminAuthMessage('Your account does not have an officer profile.')
        return
      }

      if (!profile.is_active) {
        setAdminProfile(null)
        setAdminAuthStatus('denied')
        setAdminAuthMessage('Your officer profile is inactive.')
        return
      }

      const visibleSections = getAdminSectionsForRole(profile.role)

      if (visibleSections.length === 0) {
        setAdminProfile(null)
        setAdminAuthStatus('denied')
        setAdminAuthMessage('Your role does not include administration access.')
        return
      }

      setAdminProfile({
        email: session.user.email ?? 'Signed-in staff account',
        fullName: profile.full_name,
        role: profile.role,
      })
      setAdminAuthStatus('authorized')
      setAdminAuthMessage('')
    }

    supabase.auth.getSession().then(({ data }) => {
      void loadAdminProfile(data.session)
    })

    const { data: subscriptionData } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadAdminProfile(session)
    })

    return () => {
      isMounted = false
      subscriptionData.subscription.unsubscribe()
    }
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

  const handleAdminLoginSuccess = () => {
    handleNavigate('/admin/dashboard')
  }

  const handleAdminSignOut = async () => {
    await supabase.auth.signOut()
    handleNavigate(ADMIN_LOGIN_PATH)
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

  if (currentPath === ADMIN_LOGIN_PATH) {
    if (adminAuthStatus === 'authorized' && adminProfile) {
      return (
        <main className="admin-auth-shell">
          <section className="admin-auth-card">
            <p className="eyebrow">Restricted staff portal</p>
            <h1>Already signed in</h1>
            <p className="admin-auth-copy">
              Continue to the administration area for {adminProfile.fullName}.
            </p>
            <button className="button button-primary" onClick={() => handleNavigate('/admin/dashboard')} type="button">
              Open administration
            </button>
          </section>
        </main>
      )
    }

    return <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} />
  }

  if (currentPath.startsWith('/admin')) {
    if (adminAuthStatus === 'checking') {
      return (
        <main className="admin-auth-shell">
          <section className="admin-auth-card">
            <p className="eyebrow">Restricted staff portal</p>
            <h1>Checking access</h1>
            <p className="admin-auth-copy">Loading your officer profile and administration permissions.</p>
          </section>
        </main>
      )
    }

    if (adminAuthStatus === 'signed-out') {
      return <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} />
    }

    if (adminAuthStatus === 'denied' || !adminProfile) {
      return (
        <main className="admin-auth-shell">
          <section className="admin-auth-card">
            <p className="eyebrow">Access denied</p>
            <h1>Administration is restricted</h1>
            <p className="admin-auth-copy">{adminAuthMessage}</p>
            <button className="button button-secondary" onClick={handleAdminSignOut} type="button">
              Sign out
            </button>
          </section>
        </main>
      )
    }

    const visibleSections = getAdminSectionsForRole(adminProfile.role)
    const activeSection =
      adminSections.find((section) => section.href === currentPath) ??
      (currentPath === '/admin' ? visibleSections[0] : undefined)
    const activePage =
      activeSection && visibleSections.some((section) => section.id === activeSection.id)
        ? renderAdminSection(activeSection, adminProfile.role)
        : null

    return (
      <main>
        <AdminLayout
          currentPath={activeSection?.href ?? currentPath}
          email={adminProfile.email}
          fullName={adminProfile.fullName}
          onNavigate={handleNavigate}
          onSignOut={handleAdminSignOut}
          role={adminProfile.role}
          sections={visibleSections}
        >
          {activePage ?? (
            <AdminAccessDeniedPage role={adminProfile.role} visibleSections={visibleSections} />
          )}
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
