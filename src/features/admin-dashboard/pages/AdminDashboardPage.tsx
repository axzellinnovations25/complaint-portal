import { StatCard } from '../../../shared/ui/StatCard'

const dashboardStats = [
  { label: 'New today', value: '12', tone: 'blue' },
  { label: 'In progress', value: '34', tone: 'cyan' },
  { label: 'SLA risk', value: '05', tone: 'amber' },
  { label: 'Reopened', value: '03', tone: 'red' },
] as const

const workloadSignals = [
  { label: 'Public Health', value: '18 open', note: '3 high priority' },
  { label: 'Roads', value: '14 open', note: '2 nearing SLA' },
  { label: 'Electrical', value: '9 open', note: 'Field visit pending' },
]

export function AdminDashboardPage() {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Operations dashboard</p>
          <h2>Today&apos;s complaint workload</h2>
        </div>
        <span className="dashboard-timestamp">Updated 10:05 AM</span>
      </div>
      <div className="stat-grid">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} tone={stat.tone} />
        ))}
      </div>
      <div className="workload-grid" aria-label="Department workload">
        {workloadSignals.map((signal) => (
          <article key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
            <p>{signal.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
