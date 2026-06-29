import type { MouseEvent, PropsWithChildren } from 'react'
import type { AdminSectionDefinition, UserRole } from '../../entities/user/model/roles'
import { userRoleLabels } from '../../entities/user/model/roles'

type AdminLayoutProps = PropsWithChildren<{
  currentPath: string
  email: string
  fullName: string
  onNavigate: (href: string) => void
  onSignOut: () => void
  role: UserRole
  sections: AdminSectionDefinition[]
}>

export function AdminLayout({
  children,
  currentPath,
  email,
  fullName,
  onNavigate,
  onSignOut,
  role,
  sections,
}: AdminLayoutProps) {
  const handleNavigate = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <section className="admin-shell" aria-labelledby="admin-heading">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-card">
          <p className="eyebrow">Officer workspace</p>
          <h2 id="admin-heading">Administration</h2>
          <div className="admin-user-card">
            <strong>{fullName}</strong>
            <span>{userRoleLabels[role]}</span>
            <small>{email}</small>
          </div>
          <nav className="admin-nav" aria-label="Administration sections">
            {sections.map((section) => (
              <a
                aria-current={currentPath === section.href ? 'page' : undefined}
                href={section.href}
                key={section.id}
                onClick={handleNavigate(section.href)}
              >
                <strong>{section.label}</strong>
                <span>{section.description}</span>
              </a>
            ))}
          </nav>
          <button className="button button-secondary admin-signout-button" onClick={onSignOut} type="button">
            Sign out
          </button>
        </div>
      </aside>
      <div className="admin-content">{children}</div>
    </section>
  )
}
