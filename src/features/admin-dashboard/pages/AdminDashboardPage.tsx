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

const activityItems = [
  { label: 'PS-2026-0003 escalated to Public Health', time: '12 minutes ago', tone: 'Urgent' },
  { label: 'Roads team resolved PS-2026-0007', time: '36 minutes ago', tone: 'Resolved' },
  { label: 'New evidence uploaded for PS-2026-0001', time: '1 hour ago', tone: 'Review' },
]

const priorityBands = [
  { label: 'Urgent', value: 7 },
  { label: 'High', value: 18 },
  { label: 'Normal', value: 41 },
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

      <div className="admin-two-column">
        <section className="admin-data-panel" aria-labelledby="activity-heading">
          <div className="admin-panel-heading">
            <strong id="activity-heading">Live activity</strong>
            <span>Latest operational updates</span>
          </div>
          <div className="admin-route-list">
            {activityItems.map((item) => (
              <article key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.time}</span>
                </div>
                <span className={`admin-status-badge admin-status-${item.tone.toLowerCase()}`}>{item.tone}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-data-panel" aria-labelledby="priority-heading">
          <div className="admin-panel-heading">
            <strong id="priority-heading">Priority mix</strong>
            <span>Open complaints</span>
          </div>
          <div className="admin-progress-list">
            {priorityBands.map((band) => (
              <article key={band.label}>
                <span>{band.label}</span>
                <strong>{band.value}</strong>
                <meter min="0" max="50" value={band.value}>{band.value}</meter>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
