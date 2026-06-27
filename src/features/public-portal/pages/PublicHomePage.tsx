import { ModuleCard } from '../../../shared/ui/ModuleCard'
import type { ModuleDefinition } from '../../../shared/config/navigation'

type PublicHomePageProps = {
  modules: ModuleDefinition[]
}

export function PublicHomePage({ modules }: PublicHomePageProps) {
  return (
    <section className="hero-section">
      <div>
        <p className="eyebrow">React TypeScript + Supabase</p>
        <h2>Mobile-first complaint intake with proper operational back office boundaries.</h2>
        <p>
          This project is structured around civic workflows instead of a single long component file:
          public access, officer operations, communication, content, reports, and Supabase platform code.
        </p>
      </div>
      <div className="module-grid">
        {modules.map((module) => (
          <ModuleCard module={module} key={module.title} />
        ))}
      </div>
    </section>
  )
}
