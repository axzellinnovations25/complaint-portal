import type { ModuleDefinition } from '../config/navigation'

type ModuleCardProps = {
  module: ModuleDefinition
  compact?: boolean
}

export function ModuleCard({ module, compact = false }: ModuleCardProps) {
  return (
    <article className={compact ? 'module-card module-card-compact' : 'module-card'}>
      <h3>{module.title}</h3>
      <p>{module.description}</p>
      {!compact && <span>{module.owner}</span>}
    </article>
  )
}
