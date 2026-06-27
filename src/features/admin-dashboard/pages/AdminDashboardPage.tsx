import { StatCard } from '../../../shared/ui/StatCard'

const dashboardStats = [
  { label: 'New', value: '12', tone: 'blue' },
  { label: 'In progress', value: '34', tone: 'green' },
  { label: 'Overdue', value: '05', tone: 'amber' },
  { label: 'Reopened', value: '03', tone: 'red' },
] as const

export function AdminDashboardPage() {
  return (
    <section className="dashboard-panel">
      <div>
        <p className="eyebrow">Dashboard foundation</p>
        <h2>Role-aware complaint overview</h2>
      </div>
      <div className="stat-grid">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} tone={stat.tone} />
        ))}
      </div>
    </section>
  )
}
