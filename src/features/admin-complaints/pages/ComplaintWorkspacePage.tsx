import type { ComplaintSummary } from '../../../entities/complaint/model/types'
import { complaintStatusLabels } from '../../../entities/complaint/model/status'

const sampleComplaints: ComplaintSummary[] = [
  {
    referenceNo: 'PS-2026-0001',
    title: 'Blocked drainage near market road',
    status: 'under_review',
    priority: 'high',
    department: 'Public Health',
    updatedAt: 'Today',
  },
  {
    referenceNo: 'PS-2026-0002',
    title: 'Street light not working',
    status: 'assigned',
    priority: 'normal',
    department: 'Electrical',
    updatedAt: 'Yesterday',
  },
]

export function ComplaintWorkspacePage() {
  return (
    <section className="case-panel">
      <div>
        <p className="eyebrow">Case files</p>
        <h2>Complaint lifecycle workspace</h2>
      </div>
      <div className="case-table" role="table" aria-label="Complaint workspace">
        {sampleComplaints.map((complaint) => (
          <article className="case-row" key={complaint.referenceNo}>
            <strong>{complaint.referenceNo}</strong>
            <span>{complaint.title}</span>
            <span>{complaint.department}</span>
            <span>{complaintStatusLabels[complaint.status]}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
