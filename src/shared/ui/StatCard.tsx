type StatCardProps = {
  label: string
  value: string
  tone: 'blue' | 'cyan' | 'amber' | 'red'
}

export function StatCard({ label, value, tone }: StatCardProps) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}
