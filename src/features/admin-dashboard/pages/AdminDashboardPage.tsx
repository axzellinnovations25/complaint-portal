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

const openStatuses: ComplaintStatus[] = ['submitted', 'under_review', 'accepted', 'assigned', 'in_progress', 'on_hold', 'reopened']

function isToday(value: string) {
  const date = new Date(value)
  const today = new Date()

  return date.toDateString() === today.toDateString()
}

function formatCount(value: number) {
  return value.toString().padStart(2, '0')
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
  const [errorMessage, setErrorMessage] = useState('')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setErrorMessage('')

      const { data: complaintData, error: complaintError } = await supabase
        .from('complaints')
        .select(
          'id, reference_no, title, priority, status, submitted_at, updated_at, resolved_at, departments(name), complaint_categories(expected_sla_hours)',
        )
        .order('updated_at', { ascending: false })

      if (!isMounted) {
        return
      }

      if (complaintError) {
        setErrorMessage(complaintError.message ?? 'Dashboard data could not be loaded.')
        return
      }

      setComplaints((complaintData ?? []) as DashboardComplaint[])
      setUpdatedAt(new Date())
    }

    void loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

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
    </section>
  )
}
