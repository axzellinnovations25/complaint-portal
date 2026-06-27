export const complaintStatuses = [
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'assigned',
  'in_progress',
  'on_hold',
  'resolved',
  'reopened',
  'closed',
] as const

export type ComplaintStatus = (typeof complaintStatuses)[number]

export const complaintStatusLabels: Record<ComplaintStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under review',
  accepted: 'Accepted',
  rejected: 'Rejected',
  assigned: 'Assigned',
  in_progress: 'In progress',
  on_hold: 'On hold',
  resolved: 'Resolved',
  reopened: 'Reopened',
  closed: 'Closed',
}
