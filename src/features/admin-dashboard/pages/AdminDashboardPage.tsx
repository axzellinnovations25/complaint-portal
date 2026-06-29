import { useEffect, useMemo, useState } from 'react'
import type { ComplaintPriority } from '../../../entities/complaint/model/types'
import { supabase } from '../../../shared/lib/supabase/client'
import { StatCard } from '../../../shared/ui/StatCard'

type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'assigned'
  | 'in_progress'
  | 'on_hold'
  | 'resolved'
  | 'reopened'
  | 'closed'

type DashboardComplaint = {
  id: string
  reference_no: string
  title: string
  priority: ComplaintPriority
  status: ComplaintStatus
  submitted_at: string
  updated_at: string
  resolved_at: string | null
  departments: { name: string } | null
  complaint_categories: { expected_sla_hours: number } | null
}

type DashboardEvent = {
  id: string
  event_type: string
  note: string | null
  created_at: string
  complaints: { reference_no: string } | null
}

const openStatuses: ComplaintStatus[] = ['submitted', 'under_review', 'accepted', 'assigned', 'in_progress', 'on_hold', 'reopened']

function isToday(value: string) {
  const date = new Date(value)
  const today = new Date()

  return date.toDateString() === today.toDateString()
}

function formatCount(value: number) {
  return value.toString().padStart(2, '0')
}

function formatRelative(value: string) {
  const timestamp = new Date(value).getTime()
  const diffMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000))

  if (diffMinutes < 1) {
    return 'Just now'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} hr ago`
  }

  return new Date(value).toLocaleDateString()
}

function isSlaRisk(complaint: DashboardComplaint) {
  if (!openStatuses.includes(complaint.status)) {
    return false
  }

  const slaHours = complaint.complaint_categories?.expected_sla_hours
  if (!slaHours) {
    return false
  }

  const deadline = new Date(complaint.submitted_at).getTime() + slaHours * 60 * 60 * 1000
  const hoursRemaining = (deadline - Date.now()) / (60 * 60 * 1000)

  return hoursRemaining <= 24
}

export function AdminDashboardPage() {
  const [complaints, setComplaints] = useState<DashboardComplaint[]>([])
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setIsLoading(true)
      setErrorMessage('')

      const [{ data: complaintData, error: complaintError }, { data: eventData, error: eventError }] =
        await Promise.all([
          supabase
            .from('complaints')
            .select(
              'id, reference_no, title, priority, status, submitted_at, updated_at, resolved_at, departments(name), complaint_categories(expected_sla_hours)',
            )
            .order('updated_at', { ascending: false }),
          supabase
            .from('complaint_events')
            .select('id, event_type, note, created_at, complaints(reference_no)')
            .order('created_at', { ascending: false })
            .limit(5),
        ])

      if (!isMounted) {
        return
      }

      if (complaintError || eventError) {
        setErrorMessage(complaintError?.message ?? eventError?.message ?? 'Dashboard data could not be loaded.')
        setIsLoading(false)
        return
      }

      setComplaints((complaintData ?? []) as DashboardComplaint[])
      setEvents((eventData ?? []) as DashboardEvent[])
      setUpdatedAt(new Date())
      setIsLoading(false)
    }

    void loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  const openComplaints = useMemo(
    () => complaints.filter((complaint) => openStatuses.includes(complaint.status)),
    [complaints],
  )
  const slaRiskCount = useMemo(() => complaints.filter(isSlaRisk).length, [complaints])
  const reopenedCount = useMemo(
    () => complaints.filter((complaint) => complaint.status === 'reopened').length,
    [complaints],
  )

  const dashboardStats = [
    { label: 'New today', value: formatCount(complaints.filter((complaint) => isToday(complaint.submitted_at)).length), tone: 'blue' as const },
    { label: 'In progress', value: formatCount(complaints.filter((complaint) => complaint.status === 'in_progress').length), tone: 'cyan' as const },
    { label: 'Due soon', value: formatCount(slaRiskCount), tone: 'amber' as const },
    { label: 'Reopened', value: formatCount(reopenedCount), tone: 'red' as const },
  ]

  const workloadSignals = Object.values(
    openComplaints.reduce<Record<string, { label: string; open: number; highPriority: number }>>((acc, complaint) => {
      const label = complaint.departments?.name ?? 'Unassigned'
      acc[label] ??= { label, open: 0, highPriority: 0 }
      acc[label].open += 1

      if (complaint.priority === 'high' || complaint.priority === 'urgent') {
        acc[label].highPriority += 1
      }

      return acc
    }, {}),
  )

  const priorityBands = (['urgent', 'high', 'normal', 'low'] as const)
    .map((priority) => ({
      label: priority[0].toUpperCase() + priority.slice(1),
      value: openComplaints.filter((complaint) => complaint.priority === priority).length,
    }))
    .filter((band) => band.value > 0)

  return (
    <section className="dashboard-panel">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Operations dashboard</p>
          <h2>Today&apos;s complaint workload</h2>
        </div>
        <span className="dashboard-timestamp">
          {updatedAt ? `Updated ${updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Loading'}
        </span>
      </div>

      {errorMessage && <p className="admin-auth-error">{errorMessage}</p>}

      <div className="stat-grid">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} tone={stat.tone} />
        ))}
      </div>

      {workloadSignals.length > 0 ? (
        <div className="workload-grid" aria-label="Department workload">
          {workloadSignals.map((signal) => (
            <article key={signal.label}>
              <span>{signal.label}</span>
              <strong>{signal.open} open</strong>
              <p>{signal.highPriority} high priority</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="admin-empty-state">{isLoading ? 'Loading complaint workload.' : 'No open complaint workload found.'}</p>
      )}

      <div className="admin-two-column">
        <section className="admin-data-panel" aria-labelledby="activity-heading">
          <div className="admin-panel-heading">
            <strong id="activity-heading">Live activity</strong>
            <span>Latest operational updates</span>
          </div>
          {events.length > 0 ? (
            <div className="admin-route-list">
              {events.map((event) => (
                <article key={event.id}>
                  <div>
                    <strong>{event.complaints?.reference_no ?? 'Complaint'} - {event.event_type}</strong>
                    <span>{event.note ?? formatRelative(event.created_at)}</span>
                  </div>
                  <span className="admin-status-badge admin-status-review">{formatRelative(event.created_at)}</span>
                </article>
              ))}
            </div>
          ) : (
            <p className="admin-empty-state">{isLoading ? 'Loading activity.' : 'No complaint activity events found.'}</p>
          )}
        </section>

        <section className="admin-data-panel" aria-labelledby="priority-heading">
          <div className="admin-panel-heading">
            <strong id="priority-heading">Priority mix</strong>
            <span>Open complaints</span>
          </div>
          {priorityBands.length > 0 ? (
            <div className="admin-progress-list">
              {priorityBands.map((band) => (
                <article key={band.label}>
                  <span>{band.label}</span>
                  <strong>{band.value}</strong>
                  <meter min="0" max={Math.max(openComplaints.length, 1)} value={band.value}>{band.value}</meter>
                </article>
              ))}
            </div>
          ) : (
            <p className="admin-empty-state">{isLoading ? 'Loading priority mix.' : 'No open complaints found.'}</p>
          )}
        </section>
      </div>
    </section>
  )
}
