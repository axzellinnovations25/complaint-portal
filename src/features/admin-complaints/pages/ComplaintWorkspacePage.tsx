import type { ComplaintPriority, ComplaintSummary } from '../../../entities/complaint/model/types'
import { complaintStatusLabels } from '../../../entities/complaint/model/status'

type ComplaintQueueItem = ComplaintSummary & {
  assignee: string
  location: string
  sla: string
}

const priorityLabels: Record<ComplaintPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
}

const sampleComplaints: ComplaintQueueItem[] = [
  {
    referenceNo: 'PS-2026-0001',
    title: 'Blocked drainage near market road',
    status: 'under_review',
    priority: 'high',
    department: 'Public Health',
    assignee: 'Unassigned',
    location: 'Market Road, Ward 04',
    sla: 'Due today',
    updatedAt: 'Today',
  },
  {
    referenceNo: 'PS-2026-0002',
    title: 'Street light not working',
    status: 'assigned',
    priority: 'normal',
    department: 'Electrical',
    assignee: 'N. Kumar',
    location: 'Library junction',
    sla: '2 days left',
    updatedAt: 'Yesterday',
  },
  {
    referenceNo: 'PS-2026-0003',
    title: 'Illegal waste dumping near playground',
    status: 'in_progress',
    priority: 'urgent',
    department: 'Public Health',
    assignee: 'S. Fernando',
    location: 'North playground lane',
    sla: 'Overdue',
    updatedAt: '2 hours ago',
  },
]

export function ComplaintWorkspacePage() {
  return (
    <section className="case-panel">
      <div className="case-header">
        <div>
          <p className="eyebrow">Case queue</p>
          <h2>Review, assign, and update complaints</h2>
        </div>
        <div className="case-actions" aria-label="Complaint queue actions">
          <button className="button button-secondary" type="button">Export</button>
          <button className="button button-primary" type="button">Assign selected</button>
        </div>
      </div>

      <div className="queue-filters" aria-label="Complaint filters">
        <button type="button" className="filter-chip filter-chip-active">All open</button>
        <button type="button" className="filter-chip">New</button>
        <button type="button" className="filter-chip">SLA risk</button>
        <button type="button" className="filter-chip">Unassigned</button>
      </div>

      <div className="case-table" role="table" aria-label="Complaint workspace">
        <div className="case-row case-row-header" role="row">
          <span>Reference</span>
          <span>Complaint</span>
          <span>Team</span>
          <span>Status</span>
          <span>SLA</span>
          <span>Action</span>
        </div>
        {sampleComplaints.map((complaint) => (
          <article className="case-row" key={complaint.referenceNo} role="row">
            <strong>{complaint.referenceNo}</strong>
            <div className="case-title-cell">
              <strong>{complaint.title}</strong>
              <span>{complaint.location}</span>
              <small>{priorityLabels[complaint.priority]} priority · Updated {complaint.updatedAt}</small>
            </div>
            <span>
              {complaint.department}
              <small>{complaint.assignee}</small>
            </span>
            <span className="status-pill status-pill-active">{complaintStatusLabels[complaint.status]}</span>
            <span className={complaint.sla === 'Overdue' ? 'sla-badge sla-badge-risk' : 'sla-badge'}>{complaint.sla}</span>
            <button className="case-link-button" type="button">Open</button>
          </article>
        ))}
      </div>
    </section>
  )
}
