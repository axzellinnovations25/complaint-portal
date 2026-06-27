import type { PropsWithChildren } from 'react'
import type { NavigationItem } from '../../shared/config/navigation'

type PublicLayoutProps = PropsWithChildren<{
  navigation: NavigationItem[]
}>

export function PublicLayout({ children, navigation }: PublicLayoutProps) {
  return (
    <section className="public-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Pradeshiya Sabha</span>
          <h1>Smart Citizen Complaint Platform</h1>
        </div>
        <nav aria-label="Public navigation">
          {navigation.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      {children}
    </section>
  )
}
