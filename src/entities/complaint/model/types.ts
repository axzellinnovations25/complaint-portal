import type { ComplaintStatus } from './status'

export type ComplaintPriority = 'low' | 'normal' | 'high' | 'urgent'

export type ComplaintSummary = {
  referenceNo: string
  title: string
  status: ComplaintStatus
  priority: ComplaintPriority
  department: string
  updatedAt: string
}
