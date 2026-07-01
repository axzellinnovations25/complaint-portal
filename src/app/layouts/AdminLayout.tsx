import { useEffect, useState, type MouseEvent, type PropsWithChildren } from 'react'
import type { AdminSectionDefinition, AdminSectionId, UserRole } from '../../entities/user/model/roles'
import { userRoleLabels } from '../../entities/user/model/roles'
import { AdminLanguageProvider, type AdminLanguage } from '../../shared/i18n/AdminLanguageContext'

type AdminLayoutProps = PropsWithChildren<{
  currentPath: string
  fullName: string
  onNavigate: (href: string) => void
  onSignOut: () => void
  role: UserRole
  sections: AdminSectionDefinition[]
}>

const roleLabels: Record<AdminLanguage, Record<UserRole, string>> = {
  en: userRoleLabels,
  ta: {
    super_admin: 'மூத்த நிர்வாகி',
    main_admin: 'முதன்மை நிர்வாகி',
    management_viewer: 'மேலாண்மை பார்வையாளர்',
    department_head: 'பிரிவுத் தலைவர்',
    officer: 'அலுவலர்',
    field_officer: 'கள அலுவலர்',
    content_admin: 'உள்ளடக்க நிர்வாகி',
    knowledge_admin: 'தகவல் நிர்வாகி',
    viewer: 'பார்வையாளர்',
  },
}

const navLabels: Record<AdminLanguage, Record<AdminSectionId, string>> = {
  en: {
    dashboard: 'Dashboard',
    complaints: 'Complaints',
    departments: 'Departments',
    users: 'User access',
    categories: 'Categories and SLA',
    locations: 'Locations',
    reports: 'Reports',
    content: 'Public content',
    communications: 'SMS communication',
    settings: 'System settings',
    audit: 'Audit log',
  },
  ta: {
    dashboard: 'நிர்வாக முகப்பு',
    complaints: 'முறைப்பாடுகள்',
    departments: 'பிரிவுகள்',
    users: 'பயனர்கள்',
    categories: 'சேவை வகைகள்',
    locations: 'இடங்கள்',
    reports: 'அறிக்கைகள்',
    content: 'பொது உள்ளடக்கம்',
    communications: 'SMS செய்திகள்',
    settings: 'அமைப்புகள்',
    audit: 'செயல்பாட்டுப் பதிவு',
  },
}

const layoutCopy: Record<AdminLanguage, {
  brandName: string
  administration: string
  signOut: string
  navLabel: string
  languageOptions: string
}> = {
  en: {
    brandName: 'Complaint Administration',
    administration: 'Administration',
    signOut: 'Sign out',
    navLabel: 'Administration sections',
    languageOptions: 'Language options',
  },
  ta: {
    brandName: 'முறைப்பாடு நிர்வாகம்',
    administration: 'நிர்வாகம்',
    signOut: 'வெளியேறு',
    navLabel: 'நிர்வாகப் பிரிவுகள்',
    languageOptions: 'மொழித் தேர்வு',
  },
}

export function AdminLayout({
  children,
  currentPath,
  fullName,
  onNavigate,
  onSignOut,
  role,
  sections,
}: AdminLayoutProps) {
  const [language, setLanguage] = useState<AdminLanguage>('en')
  const activeSection = sections.find((section) => section.href === currentPath)
  const copy = layoutCopy[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

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
            <strong>{copy.brandName}</strong>
            <small>{activeSection ? navLabels[language][activeSection.id] : copy.administration}</small>
          </div>
        </div>
        <div className="admin-topbar-actions">
          <div className="admin-language-switcher" aria-label={copy.languageOptions}>
            <button aria-pressed={language === 'en'} onClick={() => setLanguage('en')} type="button">EN</button>
            <button aria-pressed={language === 'ta'} onClick={() => setLanguage('ta')} type="button">தமிழ்</button>
          </div>
          <div className="admin-topbar-user">
            <span>{roleLabels[language][role]}</span>
            <strong>{fullName}</strong>
          </div>
          <button className="button button-secondary admin-topbar-signout" onClick={onSignOut} type="button">
            {copy.signOut}
          </button>
        </div>
      </header>

      <aside className="admin-sidebar">
        <div className="admin-sidebar-card">
          <nav className="admin-nav" aria-label={copy.navLabel}>
            {sections.map((section) => (
              <a
                aria-current={currentPath === section.href ? 'page' : undefined}
                href={section.href}
                key={section.id}
                onClick={handleNavigate(section.href)}
              >
                <strong>{navLabels[language][section.id]}</strong>
              </a>
            ))}
          </nav>
        </div>
      </aside>
      <div className="admin-content">
        <AdminLanguageProvider language={language}>{children}</AdminLanguageProvider>
      </div>
    </section>
  )
}
