import type { MouseEvent, PropsWithChildren } from 'react'
import type { AdminSectionDefinition, UserRole } from '../../entities/user/model/roles'
import { userRoleLabels } from '../../entities/user/model/roles'

type AdminLayoutProps = PropsWithChildren<{
  currentPath: string
  fullName: string
  onNavigate: (href: string) => void
  onSignOut: () => void
  role: UserRole
  sections: AdminSectionDefinition[]
}>

export function AdminLayout({
  children,
  currentPath,
  fullName,
  onNavigate,
  onSignOut,
  role,
  sections,
}: AdminLayoutProps) {
  const activeSection = sections.find((section) => section.href === currentPath)

  const handleNavigate = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <section className="admin-shell" aria-labelledby="admin-heading">
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <span aria-hidden="true">
            <img src="/logo.svg" alt="" />
          </span>
          <div>
            <strong>Complaint Administration</strong>
            <small>{activeSection?.label ?? 'Administration'}</small>
          </div>
        </div>
        <div className="admin-topbar-actions">
          <div className="admin-topbar-user">
            <span>{userRoleLabels[role]}</span>
            <strong>{fullName}</strong>
          </div>
          <button className="button button-secondary admin-topbar-signout" onClick={onSignOut} type="button">
            Sign out
          </button>
        </div>
      </header>

      <aside className="admin-sidebar">
        <div className="admin-sidebar-card">
          <nav className="admin-nav" aria-label="Administration sections">
            {sections.map((section) => (
              <a
                aria-current={currentPath === section.href ? 'page' : undefined}
                href={section.href}
                key={section.id}
                onClick={handleNavigate(section.href)}
              >
                <strong>{section.label}</strong>
              </a>
            ))}
          </nav>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-content-header">
          <div>
            <p className="eyebrow">Administration</p>
            <h1>{activeSection?.label ?? 'Administration'}</h1>
            <p>{activeSection?.description ?? 'Manage the complaint portal from the staff workspace.'}</p>
          </div>
        </header>
        {children}
      </div>
    </section>
  )
}
