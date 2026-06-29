import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import type { ComplaintPriority } from '../../../entities/complaint/model/types'
import { complaintStatuses, complaintStatusLabels, type ComplaintStatus } from '../../../entities/complaint/model/status'
import { supabase } from '../../../shared/lib/supabase/client'

type ComplaintQueueItem = {
  id: string
  reference_no: string
  title: string
  description: string
  status: ComplaintStatus
  priority: ComplaintPriority
  contact_number: string | null
  public_status_note: string | null
  internal_note: string | null
  assigned_officer_id: string | null
  submitted_at: string
  updated_at: string
  resolved_at: string | null
  departments: { name: string } | null
  complaint_categories: { name_en: string; expected_sla_hours: number } | null
  locations: { ward: string | null; village: string | null; gn_division: string | null } | null
  profiles: { full_name: string } | null
}

type OfficerOption = {
  id: string
  full_name: string
  role: string
}

type QueueFilter = 'open' | 'new' | 'due' | 'unassigned'

type SaveState = 'idle' | 'saving' | 'saved'

const priorityLabels: Record<ComplaintPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
}

const openStatuses: ComplaintStatus[] = ['submitted', 'under_review', 'accepted', 'assigned', 'in_progress', 'on_hold', 'reopened']

const queueFilters: { id: QueueFilter; label: string }[] = [
  { id: 'open', label: 'All open' },
  { id: 'new', label: 'New' },
  { id: 'due', label: 'Due soon' },
  { id: 'unassigned', label: 'Unassigned' },
]

function formatDate(value: string) {
  return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatLocation(location: ComplaintQueueItem['locations']) {
  const parts = [location?.village, location?.ward, location?.gn_division].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'Location not recorded'
}

function formatContact(value: string | null) {
  if (!value) {
    return 'Not provided'
  }

  if (value.length <= 5) {
    return value
  }

  return `${value.slice(0, 4)} *** ${value.slice(-4)}`
}

function getSlaLabel(complaint: ComplaintQueueItem) {
  const slaHours = complaint.complaint_categories?.expected_sla_hours

  if (!slaHours || !openStatuses.includes(complaint.status)) {
    return 'No SLA'
  }

  const deadline = new Date(complaint.submitted_at).getTime() + slaHours * 60 * 60 * 1000
  const hoursRemaining = Math.ceil((deadline - Date.now()) / (60 * 60 * 1000))

  if (hoursRemaining < 0) {
    return 'Overdue'
  }

  if (hoursRemaining <= 24) {
    return 'Due today'
  }

  return `${Math.ceil(hoursRemaining / 24)} days left`
}

function downloadCsv(filename: string, rows: Record<string, string | number | null | undefined>[]) {
  if (rows.length === 0) {
    return
  }

  const headers = Object.keys(rows[0])
  const escapeCell = (value: string | number | null | undefined) => {
    const cell = value === null || value === undefined ? '' : String(value)
    return `"${cell.replace(/"/g, '""')}"`
  }
  const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function matchesFilter(complaint: ComplaintQueueItem, filter: QueueFilter) {
  if (filter === 'new') {
    return complaint.status === 'submitted' || complaint.status === 'under_review'
  }

  if (filter === 'due') {
    return getSlaLabel(complaint) === 'Due today' || getSlaLabel(complaint) === 'Overdue'
  }

  if (filter === 'unassigned') {
    return !complaint.assigned_officer_id
  }

  return openStatuses.includes(complaint.status)
}

export function ComplaintWorkspacePage() {
  const [complaints, setComplaints] = useState<ComplaintQueueItem[]>([])
  const [officers, setOfficers] = useState<OfficerOption[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<QueueFilter>('open')
  const [assignedOfficerId, setAssignedOfficerId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('submitted')
  const [internalNote, setInternalNote] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const actionPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    async function loadWorkspace() {
      setIsLoading(true)
      setErrorMessage('')

      const [{ data: complaintData, error: complaintError }, { data: officerData, error: officerError }] =
        await Promise.all([
          supabase
            .from('complaints')
            .select(
              'id, reference_no, title, description, status, priority, contact_number, public_status_note, internal_note, assigned_officer_id, submitted_at, updated_at, resolved_at, departments(name), complaint_categories(name_en, expected_sla_hours), locations(ward, village, gn_division), profiles(full_name)',
            )
            .order('updated_at', { ascending: false }),
          supabase
            .from('profiles')
            .select('id, full_name, role')
            .eq('is_active', true)
            .in('role', ['department_head', 'officer', 'field_officer']),
        ])

      if (!isMounted) {
        return
      }

      if (complaintError || officerError) {
        setErrorMessage(complaintError?.message ?? officerError?.message ?? 'Complaint workspace could not be loaded.')
        setIsLoading(false)
        return
      }

      const loadedComplaints = (complaintData ?? []) as ComplaintQueueItem[]
      setComplaints(loadedComplaints)
      setOfficers((officerData ?? []) as OfficerOption[])
      setSelectedId((currentSelectedId) => currentSelectedId ?? loadedComplaints[0]?.id ?? null)
      setIsLoading(false)
    }

    void loadWorkspace()

    return () => {
      isMounted = false
    }
  }, [])

  const selectedComplaint = useMemo(
    () => complaints.find((complaint) => complaint.id === selectedId) ?? null,
    [complaints, selectedId],
  )
  const filteredComplaints = useMemo(
    () => complaints.filter((complaint) => matchesFilter(complaint, activeFilter)),
    [activeFilter, complaints],
  )

  useEffect(() => {
    if (!selectedComplaint) {
      setAssignedOfficerId('')
      setSelectedStatus('submitted')
      setInternalNote('')
      return
    }

    setAssignedOfficerId(selectedComplaint.assigned_officer_id ?? '')
    setSelectedStatus(selectedComplaint.status)
    setInternalNote(selectedComplaint.internal_note ?? '')
    setSaveState('idle')
  }, [selectedComplaint])

  useEffect(() => {
    if (filteredComplaints.length === 0) {
      setSelectedId(null)
      return
    }

    if (!filteredComplaints.some((complaint) => complaint.id === selectedId)) {
      setSelectedId(filteredComplaints[0].id)
    }
  }, [filteredComplaints, selectedId])

  const handleExport = () => {
    downloadCsv(
      `complaints-${activeFilter}-${new Date().toISOString().slice(0, 10)}.csv`,
      filteredComplaints.map((complaint) => ({
        reference_no: complaint.reference_no,
        title: complaint.title,
        status: complaintStatusLabels[complaint.status],
        priority: priorityLabels[complaint.priority],
        department: complaint.departments?.name ?? 'Unassigned',
        officer: complaint.profiles?.full_name ?? 'Unassigned',
        location: formatLocation(complaint.locations),
        sla: getSlaLabel(complaint),
        updated_at: complaint.updated_at,
      })),
    )
  }

  const handleFocusAction = () => {
    actionPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    actionPanelRef.current?.querySelector('select')?.focus()
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedComplaint) {
      return
    }

    setSaveState('saving')
    setErrorMessage('')

    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('complaints')
      .update({
        assigned_officer_id: assignedOfficerId || null,
        internal_note: internalNote.trim() || null,
        resolved_at: selectedStatus === 'resolved' ? selectedComplaint.resolved_at ?? now : selectedComplaint.resolved_at,
        status: selectedStatus,
        updated_at: now,
      })
      .eq('id', selectedComplaint.id)
      .select('id, status, assigned_officer_id, internal_note, updated_at, resolved_at')
      .single()

    if (error) {
      setErrorMessage(error.message)
      setSaveState('idle')
      return
    }

    const assignedOfficer = officers.find((officer) => officer.id === assignedOfficerId)

    setComplaints((currentComplaints) =>
      currentComplaints.map((complaint) =>
        complaint.id === selectedComplaint.id
          ? {
              ...complaint,
              assigned_officer_id: data.assigned_officer_id,
              internal_note: data.internal_note,
              profiles: assignedOfficer ? { full_name: assignedOfficer.full_name } : null,
              resolved_at: data.resolved_at,
              status: data.status as ComplaintStatus,
              updated_at: data.updated_at,
            }
          : complaint,
      ),
    )
    setSaveState('saved')
    window.setTimeout(() => setSaveState('idle'), 2200)
  }

  return (
    <section className="case-panel">
      <div className="case-header">
        <div>
          <p className="eyebrow">Case queue</p>
          <h2>Review, assign, and update complaints</h2>
        </div>
        <div className="case-actions" aria-label="Complaint queue actions">
          <button className="button button-secondary" disabled={filteredComplaints.length === 0} onClick={handleExport} type="button">Export</button>
          <button className="button button-primary" disabled={!selectedComplaint} onClick={handleFocusAction} type="button">Assign selected</button>
        </div>
      </div>

      {errorMessage && <p className="admin-auth-error">{errorMessage}</p>}
      {saveState === 'saved' && <p className="admin-action-success">Complaint update saved.</p>}

      <div className="queue-filters" aria-label="Complaint filters">
        {queueFilters.map((filter) => (
          <button
            aria-pressed={activeFilter === filter.id}
            className={activeFilter === filter.id ? 'filter-chip filter-chip-active' : 'filter-chip'}
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
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
        {filteredComplaints.map((complaint) => {
          const sla = getSlaLabel(complaint)

          return (
            <article className={selectedId === complaint.id ? 'case-row case-row-selected' : 'case-row'} key={complaint.id} role="row">
              <strong>{complaint.reference_no}</strong>
              <div className="case-title-cell">
                <strong>{complaint.title}</strong>
                <span>{formatLocation(complaint.locations)}</span>
                <small>{priorityLabels[complaint.priority]} priority - Updated {formatDate(complaint.updated_at)}</small>
              </div>
              <span>
                {complaint.departments?.name ?? 'Unassigned'}
                <small>{complaint.profiles?.full_name ?? 'No officer assigned'}</small>
              </span>
              <span className={`status-pill status-pill-${complaint.status.replace('_', '-')}`}>{complaintStatusLabels[complaint.status]}</span>
              <span className={sla === 'Overdue' ? 'sla-badge sla-badge-risk' : 'sla-badge'}>{sla}</span>
              <button className="case-link-button" onClick={() => setSelectedId(complaint.id)} type="button">Open</button>
            </article>
          )
        })}
      </div>

      {filteredComplaints.length === 0 && (
        <p className="admin-empty-state">{isLoading ? 'Loading complaints.' : 'No complaints match this filter.'}</p>
      )}

      <div className="admin-two-column admin-two-column-wide">
        <section className="admin-data-panel" aria-labelledby="case-detail-heading">
          <div className="admin-panel-heading">
            <strong id="case-detail-heading">Selected case summary</strong>
            <span>{selectedComplaint?.reference_no ?? 'No case selected'}</span>
          </div>
          {selectedComplaint ? (
            <>
              <div className="case-detail-grid">
                <article>
                  <span>Category</span>
                  <strong>{selectedComplaint.complaint_categories?.name_en ?? 'Not categorized'}</strong>
                </article>
                <article>
                  <span>Citizen contact</span>
                  <strong>{formatContact(selectedComplaint.contact_number)}</strong>
                </article>
                <article>
                  <span>Assigned team</span>
                  <strong>{selectedComplaint.departments?.name ?? 'Unassigned'}</strong>
                </article>
                <article>
                  <span>Assigned officer</span>
                  <strong>{selectedComplaint.profiles?.full_name ?? 'Not assigned'}</strong>
                </article>
              </div>
              <p className="admin-section-copy">{selectedComplaint.description}</p>
            </>
          ) : (
            <p className="admin-empty-state">Select a complaint to view details.</p>
          )}
        </section>

        <aside className="admin-data-panel" aria-labelledby="case-action-heading" ref={actionPanelRef}>
          <div className="admin-panel-heading">
            <strong id="case-action-heading">Case action</strong>
            <span>Officer update</span>
          </div>
          {selectedComplaint ? (
            <form className="admin-form-preview" onSubmit={handleSave}>
              <label>
                Assign officer
                <select value={assignedOfficerId} onChange={(event) => setAssignedOfficerId(event.target.value)}>
                  <option value="">Select officer</option>
                  {officers.map((officer) => (
                    <option key={officer.id} value={officer.id}>{officer.full_name} - {officer.role}</option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as ComplaintStatus)}>
                  {complaintStatuses.map((value) => (
                    <option key={value} value={value}>{complaintStatusLabels[value]}</option>
                  ))}
                </select>
              </label>
              <label>
                Internal note
                <textarea value={internalNote} onChange={(event) => setInternalNote(event.target.value)} />
              </label>
              <button className="button button-primary" disabled={saveState === 'saving'} type="submit">
                {saveState === 'saving' ? 'Saving...' : 'Save update'}
              </button>
            </form>
          ) : (
            <p className="admin-empty-state">No complaint selected.</p>
          )}
        </aside>
      </div>
    </section>
  )
}
