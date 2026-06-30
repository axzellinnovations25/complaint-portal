import { useEffect, useState, type MouseEvent, type PropsWithChildren } from 'react'
import type { NavigationItem } from '../../shared/config/navigation'
import { PublicLanguageProvider, type PublicLanguage } from '../../shared/i18n/PublicLanguageContext'

type PublicLayoutProps = PropsWithChildren<{
  currentPath: string
  onNavigate: (href: string) => void
  navigation: NavigationItem[]
}>

const layoutCopy = {
  en: {
    skip: 'Skip to main content',
    homeLabel: 'Smart Citizen Platform home',
    brandKicker: 'Pradeshiya Sabha',
    brandName: 'Smart Citizen Platform',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menu: 'Menu',
    languageOptions: 'Language options',
    publicNavigation: 'Public navigation',
    mobileNavigation: 'Mobile navigation',
    mobilePublicNavigation: 'Mobile public navigation',
    navLabels: {
      '/': 'Home',
      '/services': 'Services',
      '/submit': 'Submit',
      '/track': 'Track',
      '/notices': 'Notices',
    } as Record<string, string>,
    reportIssue: 'Report issue',
    footerText: 'Submit complaints, track progress, and reach the right civic team without visiting an office.',
    quickLinks: 'Quick links',
    submitComplaint: 'Submit complaint',
    trackComplaint: 'Track complaint',
    information: 'Information',
    serviceCategories: 'Service categories',
    publicNotices: 'Public notices',
    emergencyNote: 'Emergency matters should go to emergency services first.',
    footerBoundary: 'Public civic service complaints only',
  },
  ta: {
    skip: 'முக்கிய உள்ளடக்கத்திற்குச் செல்லவும்',
    homeLabel: 'மக்கள் சேவை மையத்தின் முகப்புப் பக்கம்',
    brandKicker: 'பிரதேச சபை',
    brandName: 'மக்கள் சேவை மையம்',
    openMenu: 'மெனுவைத் திறக்கவும்',
    closeMenu: 'மெனுவை மூடவும்',
    menu: 'மெனு',
    languageOptions: 'மொழித் தேர்வு',
    publicNavigation: 'பொது வழிசெலுத்தல்',
    mobileNavigation: 'கையடக்கச் சாதன வழிசெலுத்தல்',
    mobilePublicNavigation: 'கையடக்கச் சாதன பொதுமெனு',
    navLabels: {
      '/': 'முகப்பு',
      '/services': 'சேவைகள்',
      '/submit': 'முறைப்பாடு பதிவு',
      '/track': 'முறைப்பாட்டு நிலை',
      '/notices': 'அறிவிப்புகள்',
    } as Record<string, string>,
    reportIssue: 'முறைப்பாடு பதிவு',
    footerText: 'அலுவலகத்திற்கு நேரில் வராமல் முறைப்பாடுகளைப் பதிவு செய்து, அவற்றின் முன்னேற்றத்தைக் கண்காணித்து, உரிய சேவை அணியுடன் தொடர்பு கொள்ளலாம்.',
    quickLinks: 'விரைவு இணைப்புகள்',
    submitComplaint: 'முறைப்பாடு பதிவு',
    trackComplaint: 'முறைப்பாட்டு நிலை',
    information: 'தகவல்',
    serviceCategories: 'சேவை வகைகள்',
    publicNotices: 'பொது அறிவிப்புகள்',
    emergencyNote: 'அவசர நிலைகளில் முதலில் உரிய அவசர சேவைகளைத் தொடர்பு கொள்ளவும்.',
    footerBoundary: 'பொது குடிமக்கள் சேவை முறைப்பாடுகளுக்காக மட்டும்',
  },
}

export function PublicLayout({ children, currentPath, navigation, onNavigate }: PublicLayoutProps) {
  const [language, setLanguage] = useState<PublicLanguage>('en')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const copy = layoutCopy[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const handleNavigate = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setIsMobileMenuOpen(false)
    onNavigate(href)
  }
  const secondaryNavigation = navigation.filter((item) => item.href !== '/submit')

  return (
    <section className="public-shell">
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>

      <header className="site-header">
        <div className="topbar" aria-label="Public site header">
          <a
            className="brand-lockup"
            href="/"
            aria-label={copy.homeLabel}
            onClick={handleNavigate('/')}
          >
            <span className="brand-mark" aria-hidden="true">
              <img src="/logo.svg" alt="" />
            </span>
            <span>
              <span className="brand-kicker">{copy.brandKicker}</span>
              <strong>{copy.brandName}</strong>
            </span>
          </a>

          <button
            aria-controls="mobile-public-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? copy.closeMenu : copy.openMenu}
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            type="button"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <div className="topbar-actions">
            <nav className="topbar-nav" aria-label={copy.publicNavigation}>
              {secondaryNavigation.map((item) => (
                <a
                  aria-current={currentPath === item.href ? 'page' : undefined}
                  href={item.href}
                  key={item.href}
                  onClick={handleNavigate(item.href)}
                >
                  {copy.navLabels[item.href] ?? item.label}
                </a>
              ))}
            </nav>
            <div className="language-switcher" aria-label={copy.languageOptions}>
              <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
              <button type="button" aria-pressed={language === 'ta'} onClick={() => setLanguage('ta')}>தமிழ்</button>
            </div>
            <a className="nav-cta" href="/submit" onClick={handleNavigate('/submit')}>
              {copy.reportIssue}
            </a>
          </div>
        </div>

        <button
          aria-label={copy.closeMenu}
          className={`mobile-menu-backdrop ${isMobileMenuOpen ? 'is-open' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
          type="button"
        />

        <aside
          aria-label={copy.mobilePublicNavigation}
          className={`mobile-public-menu ${isMobileMenuOpen ? 'is-open' : ''}`}
          id="mobile-public-menu"
        >
          <div className="mobile-menu-head">
            <div>
              <span className="brand-kicker">{copy.menu}</span>
              <strong>{copy.brandName}</strong>
            </div>
            <button aria-label={copy.closeMenu} onClick={() => setIsMobileMenuOpen(false)} type="button">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <nav className="mobile-menu-nav" aria-label={copy.mobileNavigation}>
            {secondaryNavigation.map((item) => (
              <a
                aria-current={currentPath === item.href ? 'page' : undefined}
                href={item.href}
                key={item.href}
                onClick={handleNavigate(item.href)}
              >
                {copy.navLabels[item.href] ?? item.label}
              </a>
            ))}
          </nav>

          <div className="mobile-menu-language" aria-label={copy.languageOptions}>
            <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
            <button type="button" aria-pressed={language === 'ta'} onClick={() => setLanguage('ta')}>தமிழ்</button>
          </div>

          <a className="mobile-menu-cta" href="/submit" onClick={handleNavigate('/submit')}>
            {copy.reportIssue}
          </a>
        </aside>
      </header>

      <div id="main-content" className="main-content">
        <PublicLanguageProvider language={language}>{children}</PublicLanguageProvider>
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
                  <span className="brand-kicker">{copy.brandKicker}</span>
                  <strong>{copy.brandName}</strong>
                </div>
              </div>
              <p>{copy.footerText}</p>
            </div>

            <div className="footer-column">
              <span className="footer-heading">{copy.quickLinks}</span>
              <a href="/" onClick={handleNavigate('/')}>{copy.navLabels['/']}</a>
              <a href="/submit" onClick={handleNavigate('/submit')}>{copy.submitComplaint}</a>
              <a href="/track" onClick={handleNavigate('/track')}>{copy.trackComplaint}</a>
            </div>

            <div className="footer-column">
              <span className="footer-heading">{copy.information}</span>
              <a href="/services" onClick={handleNavigate('/services')}>{copy.serviceCategories}</a>
              <a href="/notices" onClick={handleNavigate('/notices')}>{copy.publicNotices}</a>
              <span className="footer-muted">{copy.emergencyNote}</span>
            </div>
          </div>

          <div className="site-footer-bar">
            <span>{copy.brandName}</span>
            <span>{copy.footerBoundary}</span>
          </div>
        </div>
      </footer>
    </section>
  )
}
