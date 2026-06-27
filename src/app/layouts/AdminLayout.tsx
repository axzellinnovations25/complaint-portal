import type { PropsWithChildren } from 'react'
import type { ModuleDefinition } from '../../shared/config/navigation'
import { ModuleCard } from '../../shared/ui/ModuleCard'

type AdminLayoutProps = PropsWithChildren<{
  modules: ModuleDefinition[]
}>

export function AdminLayout({ children, modules }: AdminLayoutProps) {
  return (
    <section className="admin-shell" aria-labelledby="admin-heading">
      <aside className="admin-sidebar">
        <p className="eyebrow">Officer workspace</p>
        <h2 id="admin-heading">Operations</h2>
        <div className="module-list">
          {modules.map((module) => (
            <ModuleCard module={module} key={module.title} compact />
          ))}
        </div>
      </aside>
      <div className="admin-content">{children}</div>
    </section>
  )
}
