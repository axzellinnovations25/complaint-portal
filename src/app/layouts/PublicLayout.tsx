import { useState, type MouseEvent, type PropsWithChildren } from 'react'
import type { NavigationItem } from '../../shared/config/navigation'

type PublicLayoutProps = PropsWithChildren<{
  currentPath: string
  onNavigate: (href: string) => void
  navigation: NavigationItem[]
}>

export function PublicLayout({ children, currentPath, navigation, onNavigate }: PublicLayoutProps) {
  const [language, setLanguage] = useState('en')

  const handleNavigate = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigate(href)
  }
  const secondaryNavigation = navigation.filter((item) => item.href !== '/submit')

  return (
    <section className="public-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="topbar" aria-label="Public site header">
          <a
            className="brand-lockup"
            href="/"
            aria-label="Smart Citizen Platform home"
            onClick={handleNavigate('/')}
          >
            <span className="brand-mark" aria-hidden="true">
              <img src="/logo.svg" alt="" />
            </span>
            <span>
              <span className="brand-kicker">Pradeshiya Sabha</span>
              <strong>Smart Citizen Platform</strong>
            </span>
          </a>

          <div className="topbar-actions">
            <nav className="topbar-nav" aria-label="Public navigation">
              {secondaryNavigation.map((item) => (
                <a
                  aria-current={currentPath === item.href ? 'page' : undefined}
                  href={item.href}
                  key={item.href}
                  onClick={handleNavigate(item.href)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="language-switcher" aria-label="Language options">
              <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
              <button type="button" aria-pressed={language === 'ta'} onClick={() => setLanguage('ta')}>தமிழ்</button>
            </div>
            <a className="nav-cta" href="/submit" onClick={handleNavigate('/submit')}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Report issue
            </a>
          </div>
        </div>
      </header>

      <div id="main-content" className="main-content">
        {children}
      </div>

      <footer aria-label="Site footer" className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-grid">
            <div className="footer-brand">
              <div className="footer-brand-lockup">
                <span className="brand-mark footer-brand-mark" aria-hidden="true">
                  <img src="/logo.svg" alt="" />
                </span>
                <div>
                  <span className="brand-kicker">Pradeshiya Sabha</span>
                  <strong>Smart Citizen Platform</strong>
                </div>
              </div>
              <p>
                Submit complaints, track progress, and reach the right civic team without visiting an office.
              </p>
            </div>

            <div className="footer-column">
              <span className="footer-heading">Quick links</span>
              <a href="/" onClick={handleNavigate('/')}>Home</a>
              <a href="/submit" onClick={handleNavigate('/submit')}>Submit complaint</a>
              <a href="/track" onClick={handleNavigate('/track')}>Track complaint</a>
            </div>

            <div className="footer-column">
              <span className="footer-heading">Information</span>
              <a href="/services" onClick={handleNavigate('/services')}>Service categories</a>
              <a href="/notices" onClick={handleNavigate('/notices')}>Public notices</a>
              <span className="footer-muted">Emergency matters should go to emergency services first.</span>
            </div>
          </div>

          <div className="site-footer-bar">
            <span>Smart Citizen Platform</span>
            <span>Public civic service complaints only</span>
          </div>
        </div>
      </footer>
    </section>
  )
}
