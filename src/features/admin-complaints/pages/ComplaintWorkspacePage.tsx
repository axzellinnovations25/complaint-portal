import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import type { ComplaintPriority } from '../../../entities/complaint/model/types'
import { complaintStatuses, type ComplaintStatus } from '../../../entities/complaint/model/status'
import { supabase } from '../../../shared/lib/supabase/client'
import { useAdminLanguage, type AdminLanguage } from '../../../shared/i18n/AdminLanguageContext'

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
  category_id: string | null
  departments: { name: string } | null
  complaint_categories: { name_en: string; expected_sla_hours: number } | null
  locations: { id: string; ward: string | null; village: string | null; gn_division: string | null } | null
  profiles: { full_name: string } | null
}

type OfficerOption = {
  id: string
  full_name: string
  role: string
}

type CategoryOption = {
  id: string
  name_en: string
}

type QueueFilter = 'open' | 'new' | 'due' | 'unassigned'

type SaveState = 'idle' | 'saving' | 'saved'

const priorityLabels: Record<AdminLanguage, Record<ComplaintPriority, string>> = {
  en: {
    low: 'Low',
    normal: 'Normal',
    high: 'High',
    urgent: 'Urgent',
  },
  // Priority values are kept in English in both languages - officers commonly use these
  // English words verbally in the office, so translating them would be less recognizable.
  ta: {
    low: 'Low',
    normal: 'Normal',
    high: 'High',
    urgent: 'Urgent',
  },
}

const statusLabels: Record<AdminLanguage, Record<ComplaintStatus, string>> = {
  en: {
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
  },
  // Status values are kept in English in both languages, same reasoning as priority above.
  ta: {
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
  },
}

const openStatuses: ComplaintStatus[] = ['submitted', 'under_review', 'accepted', 'assigned', 'in_progress', 'on_hold', 'reopened']

const queueFilterIds: QueueFilter[] = ['open', 'new', 'due', 'unassigned']

const pageCopy = {
  en: {
    eyebrow: 'Case queue',
    title: 'Review, assign, and update complaints',
    exportButton: 'Export',
    assignSelected: 'Assign selected',
    queueFiltersLabel: 'Complaint filters',
    filters: {
      open: 'All open',
      new: 'New',
      due: 'Due soon',
      unassigned: 'Unassigned',
    } as Record<QueueFilter, string>,
    locationLabel: 'Location',
    allLocations: 'All locations',
    workspaceLabel: 'Complaint workspace',
    tableHeaders: {
      reference: 'Reference',
      complaint: 'Complaint',
      team: 'Team',
      status: 'Status',
      sla: 'SLA',
      action: 'Action',
    },
    noOfficerAssigned: 'No officer assigned',
    unassigned: 'Unassigned',
    open: 'Open',
    loadingComplaints: 'Loading complaints.',
    noComplaintsMatch: 'No complaints match this filter.',
    updateSaved: 'Complaint update saved.',
    locationNotRecorded: 'Location not recorded',
    notProvided: 'Not provided',
    noSla: 'No SLA',
    overdue: 'Overdue',
    dueToday: 'Due today',
    daysLeft: (count: number) => `${count} days left`,
    priorityUpdated: (priority: string, date: string) => `${priority} priority - Updated ${date}`,
    dialog: {
      caseDetails: 'Case details',
      priority: 'Priority',
      sla: 'SLA',
      category: 'Category',
      notCategorized: 'Not categorized',
      location: 'Location',
      citizenContact: 'Citizen contact',
      assignedTeam: 'Assigned team',
      submitted: 'Submitted',
      resolved: 'Resolved',
      lastUpdated: 'Last updated',
      description: 'Description',
      publicStatusNote: 'Public status note',
      officerUpdate: 'Officer update',
      assignOfficer: 'Assign officer',
      selectOfficer: 'Select officer',
      status: 'Status',
      internalNote: 'Internal note',
      close: 'Close',
      saveUpdate: 'Save update',
      saving: 'Saving...',
    },
  },
  ta: {
    eyebrow: 'முறைப்பாட்டுப் பட்டியல்',
    title: 'முறைப்பாடுகளை மதிப்பாய்வு செய்து, ஒதுக்கி, புதுப்பிக்கவும்',
    exportButton: 'Export',
    assignSelected: 'Assign selected',
    queueFiltersLabel: 'முறைப்பாடு வடிகட்டிகள்',
    filters: {
      open: 'அனைத்து திறந்தவை',
      new: 'புதியவை',
      due: 'கெடு நெருங்கியவை',
      unassigned: 'ஒதுக்கப்படாதவை',
    } as Record<QueueFilter, string>,
    locationLabel: 'இடம்',
    allLocations: 'அனைத்து இடங்களும்',
    workspaceLabel: 'முறைப்பாடு பட்டியல்',
    tableHeaders: {
      reference: 'குறிப்பு எண்',
      complaint: 'முறைப்பாடு',
      team: 'பிரிவு',
      status: 'நிலை',
      sla: 'SLA',
      action: 'செயல்',
    },
    noOfficerAssigned: 'அலுவலர் ஒதுக்கப்படவில்லை',
    unassigned: 'ஒதுக்கப்படவில்லை',
    open: 'Open',
    loadingComplaints: 'முறைப்பாடுகள் ஏற்றப்படுகின்றன.',
    noComplaintsMatch: 'இந்த வடிகட்டலுக்குப் பொருந்தும் முறைப்பாடுகள் இல்லை.',
    updateSaved: 'முறைப்பாடு புதுப்பிப்பு சேமிக்கப்பட்டது.',
    locationNotRecorded: 'இடம் பதிவு செய்யப்படவில்லை',
    notProvided: 'வழங்கப்படவில்லை',
    noSla: 'SLA இல்லை',
    overdue: 'கெடு கடந்தது',
    dueToday: 'இன்று கெடு',
    daysLeft: (count: number) => `${count} நாட்கள் மீதி`,
    priorityUpdated: (priority: string, date: string) => `${priority} முன்னுரிமை - புதுப்பிக்கப்பட்டது ${date}`,
    dialog: {
      caseDetails: 'முறைப்பாட்டு விவரங்கள்',
      priority: 'முன்னுரிமை',
      sla: 'SLA',
      category: 'வகை',
      notCategorized: 'வகை இல்லை',
      location: 'இடம்',
      citizenContact: 'தொடர்பு எண்',
      assignedTeam: 'ஒதுக்கப்பட்ட பிரிவு',
      submitted: 'பதிவு தேதி',
      resolved: 'தீர்வு தேதி',
      lastUpdated: 'கடைசி புதுப்பிப்பு',
      description: 'விவரம்',
      publicStatusNote: 'பொது குறிப்பு',
      officerUpdate: 'அலுவலர் புதுப்பிப்பு',
      assignOfficer: 'Assign officer',
      selectOfficer: 'அலுவலரைத் தேர்ந்தெடுக்கவும்',
      status: 'நிலை',
      internalNote: 'உள் குறிப்பு',
      close: 'Close',
      saveUpdate: 'Save update',
      saving: 'Saving...',
    },
  },
} satisfies Record<AdminLanguage, unknown>

function formatDate(value: string) {
  return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatLocation(location: ComplaintQueueItem['locations'], copy: (typeof pageCopy)['en']) {
  const parts = [location?.village, location?.ward, location?.gn_division].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : copy.locationNotRecorded
}

function formatContact(value: string | null, copy: (typeof pageCopy)['en']) {
  if (!value) {
    return copy.notProvided
  }

  if (value.length <= 5) {
    return value
  }

  return `${value.slice(0, 4)} *** ${value.slice(-4)}`
}

function getSlaLabel(complaint: ComplaintQueueItem, copy: (typeof pageCopy)['en']) {
  const slaHours = complaint.complaint_categories?.expected_sla_hours

  if (!slaHours || !openStatuses.includes(complaint.status)) {
    return copy.noSla
  }

  const deadline = new Date(complaint.submitted_at).getTime() + slaHours * 60 * 60 * 1000
  const hoursRemaining = Math.ceil((deadline - Date.now()) / (60 * 60 * 1000))

  if (hoursRemaining < 0) {
    return copy.overdue
  }

  if (hoursRemaining <= 24) {
    return copy.dueToday
  }

  return copy.daysLeft(Math.ceil(hoursRemaining / 24))
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

function matchesFilter(complaint: ComplaintQueueItem, filter: QueueFilter, copy: (typeof pageCopy)['en']) {
  if (filter === 'new') {
    return complaint.status === 'submitted' || complaint.status === 'under_review'
  }

  if (filter === 'due') {
    const sla = getSlaLabel(complaint, copy)
    return sla === copy.dueToday || sla === copy.overdue
  }

  if (filter === 'unassigned') {
    return !complaint.assigned_officer_id
  }

  return openStatuses.includes(complaint.status)
}

export function ComplaintWorkspacePage() {
  const language = useAdminLanguage()
  const copy = pageCopy[language]
  const [complaints, setComplaints] = useState<ComplaintQueueItem[]>([])
  const [officers, setOfficers] = useState<OfficerOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<QueueFilter>('open')
  const [locationFilter, setLocationFilter] = useState('all')
  const [assignedOfficerId, setAssignedOfficerId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('submitted')
  const [internalNote, setInternalNote] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const actionPanelRef = useRef<HTMLDivElement>(null)

  const loadWorkspace = useCallback(async (isMountedRef?: { current: boolean }) => {
    setIsLoading(true)
    setErrorMessage('')

    const [
      { data: complaintData, error: complaintError },
      { data: officerData, error: officerError },
      { data: categoryData, error: categoryError },
    ] = await Promise.all([
      supabase
        .from('complaints')
        .select(
          'id, reference_no, title, description, status, priority, contact_number, public_status_note, internal_note, assigned_officer_id, category_id, submitted_at, updated_at, resolved_at, departments(name), complaint_categories(name_en, expected_sla_hours), locations(id, ward, village, gn_division), profiles(full_name)',
        )
        .order('updated_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('is_active', true)
        .in('role', ['department_head', 'officer', 'field_officer']),
      supabase.from('complaint_categories').select('id, name_en').order('name_en'),
    ])

    if (isMountedRef && !isMountedRef.current) {
      return
    }

    if (complaintError || officerError || categoryError) {
      setErrorMessage(
        complaintError?.message ?? officerError?.message ?? categoryError?.message ?? 'Complaint workspace could not be loaded.',
      )
      setIsLoading(false)
      return
    }

    const loadedComplaints = (complaintData ?? []) as ComplaintQueueItem[]
    setComplaints(loadedComplaints)
    setOfficers((officerData ?? []) as OfficerOption[])
    setCategories((categoryData ?? []) as CategoryOption[])
    setSelectedId((currentSelectedId) => currentSelectedId ?? loadedComplaints[0]?.id ?? null)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const isMountedRef = { current: true }
    void loadWorkspace(isMountedRef)

    return () => {
      isMountedRef.current = false
    }
  }, [loadWorkspace])

  const selectedComplaint = useMemo(
    () => complaints.find((complaint) => complaint.id === selectedId) ?? null,
    [complaints, selectedId],
  )
  const locationOptions = useMemo(() => {
    const seen = new Map<string, string>()

    for (const complaint of complaints) {
      if (complaint.locations) {
        seen.set(complaint.locations.id, formatLocation(complaint.locations, copy))
      }
    }

    return Array.from(seen, ([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label))
  }, [complaints, copy])

  const filteredComplaints = useMemo(
    () =>
      complaints
        .filter((complaint) => matchesFilter(complaint, activeFilter, copy))
        .filter((complaint) => locationFilter === 'all' || complaint.locations?.id === locationFilter),
    [activeFilter, complaints, copy, locationFilter],
  )

  useEffect(() => {
    if (!selectedComplaint) {
      setAssignedOfficerId('')
      setCategoryId('')
      setSelectedStatus('submitted')
      setInternalNote('')
      return
    }

    setAssignedOfficerId(selectedComplaint.assigned_officer_id ?? '')
    setCategoryId(selectedComplaint.category_id ?? '')
    setSelectedStatus(selectedComplaint.status)
    setInternalNote(selectedComplaint.internal_note ?? '')
    setSaveState('idle')
    // Deliberately keyed on selectedId, not selectedComplaint: a post-save reload replaces the
    // complaints array (and so selectedComplaint's identity) without the selection actually
    // changing, and re-running this would reset saveState back to 'idle' before the success
    // message has a chance to show.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

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
        status: statusLabels[language][complaint.status],
        priority: priorityLabels[language][complaint.priority],
        department: complaint.departments?.name ?? copy.unassigned,
        officer: complaint.profiles?.full_name ?? copy.unassigned,
        location: formatLocation(complaint.locations, copy),
        sla: getSlaLabel(complaint, copy),
        updated_at: complaint.updated_at,
      })),
    )
  }

  const handleFocusAction = () => {
    setIsDetailOpen(true)
    window.requestAnimationFrame(() => {
      actionPanelRef.current?.querySelector('select')?.focus()
    })
  }

  useEffect(() => {
    if (!isDetailOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDetailOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDetailOpen])

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedComplaint) {
      return
    }

    setSaveState('saving')
    setErrorMessage('')

    const now = new Date().toISOString()
    const { error } = await supabase
      .from('complaints')
      .update({
        assigned_officer_id: assignedOfficerId || null,
        category_id: categoryId || null,
        internal_note: internalNote.trim() || null,
        resolved_at: selectedStatus === 'resolved' ? selectedComplaint.resolved_at ?? now : selectedComplaint.resolved_at,
        status: selectedStatus,
        updated_at: now,
      })
      .eq('id', selectedComplaint.id)

    if (error) {
      setErrorMessage(error.message)
      setSaveState('idle')
      return
    }

    setIsDetailOpen(false)
    setSaveState('saved')
    await loadWorkspace()
    window.setTimeout(() => setSaveState('idle'), 2200)
  }

  return (
    <section className="case-panel">
      <div className="case-header">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
        </div>
        <div className="case-actions" aria-label="Complaint queue actions">
          <button className="button button-secondary" disabled={filteredComplaints.length === 0} onClick={handleExport} type="button">{copy.exportButton}</button>
          <button className="button button-primary" disabled={!selectedComplaint} onClick={handleFocusAction} type="button">{copy.assignSelected}</button>
        </div>
      </div>

      {errorMessage && <p className="admin-auth-error">{errorMessage}</p>}
      {saveState === 'saved' && <p className="admin-action-success">{copy.updateSaved}</p>}

      <div className="queue-filters" aria-label={copy.queueFiltersLabel}>
        {queueFilterIds.map((filterId) => (
          <button
            aria-pressed={activeFilter === filterId}
            className={activeFilter === filterId ? 'filter-chip filter-chip-active' : 'filter-chip'}
            key={filterId}
            onClick={() => setActiveFilter(filterId)}
            type="button"
          >
            {copy.filters[filterId]}
          </button>
        ))}

        <label className="queue-location-filter">
          <span>{copy.locationLabel}</span>
          <select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
            <option value="all">{copy.allLocations}</option>
            {locationOptions.map((location) => (
              <option key={location.id} value={location.id}>{location.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="case-table" role="table" aria-label={copy.workspaceLabel}>
        <div className="case-row case-row-header" role="row">
          <span>{copy.tableHeaders.reference}</span>
          <span>{copy.tableHeaders.complaint}</span>
          <span>{copy.tableHeaders.team}</span>
          <span>{copy.tableHeaders.status}</span>
          <span>{copy.tableHeaders.sla}</span>
          <span>{copy.tableHeaders.action}</span>
        </div>
        {filteredComplaints.map((complaint) => {
          const sla = getSlaLabel(complaint, copy)

          return (
            <article className={selectedId === complaint.id ? 'case-row case-row-selected' : 'case-row'} key={complaint.id} role="row">
              <strong>{complaint.reference_no}</strong>
              <div className="case-title-cell">
                <strong>{complaint.title}</strong>
                <span>{formatLocation(complaint.locations, copy)}</span>
                <small>{copy.priorityUpdated(priorityLabels[language][complaint.priority], formatDate(complaint.updated_at))}</small>
              </div>
              <span>
                {complaint.departments?.name ?? copy.unassigned}
                <small>{complaint.profiles?.full_name ?? copy.noOfficerAssigned}</small>
              </span>
              <span className={`status-pill status-pill-${complaint.status.replace('_', '-')}`}>{statusLabels[language][complaint.status]}</span>
              <span className={sla === copy.overdue ? 'sla-badge sla-badge-risk' : 'sla-badge'}>{sla}</span>
              <button
                className="case-link-button"
                onClick={() => {
                  setSelectedId(complaint.id)
                  setIsDetailOpen(true)
                }}
                type="button"
              >
                {copy.open}
              </button>
            </article>
          )
        })}
      </div>

      {filteredComplaints.length === 0 && (
        <p className="admin-empty-state">{isLoading ? copy.loadingComplaints : copy.noComplaintsMatch}</p>
      )}

      {isDetailOpen && selectedComplaint ? (
        <div className="admin-modal-backdrop" onClick={() => setIsDetailOpen(false)} role="presentation">
          <section
            aria-labelledby="case-detail-heading"
            aria-modal="true"
            className="admin-modal-panel admin-case-modal-panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <form className="case-modal-form" onSubmit={handleSave}>
              <div className="case-modal-header">
                <div>
                  <p className="eyebrow">{selectedComplaint.reference_no}</p>
                  <h3 id="case-detail-heading">{selectedComplaint.title}</h3>
                </div>
                <span className={`status-pill status-pill-${selectedComplaint.status.replace('_', '-')}`}>
                  {statusLabels[language][selectedComplaint.status]}
                </span>
              </div>

              <div className="case-modal-body">
                <p className="case-modal-section-title">{copy.dialog.caseDetails}</p>
                <div className="case-modal-fields">
                  <div className="case-modal-field">
                    <span className="case-modal-label">{copy.dialog.priority}</span>
                    <span className="case-modal-value">{priorityLabels[language][selectedComplaint.priority]}</span>
                  </div>
                  <div className="case-modal-field">
                    <span className="case-modal-label">{copy.dialog.sla}</span>
                    <span className="case-modal-value">{getSlaLabel(selectedComplaint, copy)}</span>
                  </div>
                  <div className="case-modal-field">
                    <span className="case-modal-label">{copy.dialog.category}</span>
                    <span className="case-modal-value">{selectedComplaint.complaint_categories?.name_en ?? copy.dialog.notCategorized}</span>
                  </div>
                  <div className="case-modal-field">
                    <span className="case-modal-label">{copy.dialog.location}</span>
                    <span className="case-modal-value">{formatLocation(selectedComplaint.locations, copy)}</span>
                  </div>
                  <div className="case-modal-field">
                    <span className="case-modal-label">{copy.dialog.citizenContact}</span>
                    <span className="case-modal-value">{formatContact(selectedComplaint.contact_number, copy)}</span>
                  </div>
                  <div className="case-modal-field">
                    <span className="case-modal-label">{copy.dialog.assignedTeam}</span>
                    <span className="case-modal-value">{selectedComplaint.departments?.name ?? copy.unassigned}</span>
                  </div>
                  <div className="case-modal-field">
                    <span className="case-modal-label">{copy.dialog.submitted}</span>
                    <span className="case-modal-value">{formatDate(selectedComplaint.submitted_at)}</span>
                  </div>
                  <div className="case-modal-field">
                    <span className="case-modal-label">{selectedComplaint.resolved_at ? copy.dialog.resolved : copy.dialog.lastUpdated}</span>
                    <span className="case-modal-value">
                      {formatDate(selectedComplaint.resolved_at ?? selectedComplaint.updated_at)}
                    </span>
                  </div>
                </div>

                <div className="case-modal-field case-modal-field-wide">
                  <span className="case-modal-label">{copy.dialog.description}</span>
                  <p className="case-modal-value case-modal-value-block">{selectedComplaint.description}</p>
                </div>

                {selectedComplaint.public_status_note ? (
                  <div className="case-modal-field case-modal-field-wide">
                    <span className="case-modal-label">{copy.dialog.publicStatusNote}</span>
                    <p className="case-modal-value case-modal-value-block">{selectedComplaint.public_status_note}</p>
                  </div>
                ) : null}

                <p className="case-modal-section-title">{copy.dialog.officerUpdate}</p>
                <div className="case-modal-fields" ref={actionPanelRef}>
                  <label className="case-modal-field">
                    <span className="case-modal-label">{copy.dialog.category}</span>
                    <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                      <option value="">{copy.dialog.notCategorized}</option>
                      {categories.map((option) => (
                        <option key={option.id} value={option.id}>{option.name_en}</option>
                      ))}
                    </select>
                  </label>
                  <label className="case-modal-field">
                    <span className="case-modal-label">{copy.dialog.assignOfficer}</span>
                    <select value={assignedOfficerId} onChange={(event) => setAssignedOfficerId(event.target.value)}>
                      <option value="">{copy.dialog.selectOfficer}</option>
                      {officers.map((officer) => (
                        <option key={officer.id} value={officer.id}>{officer.full_name} - {officer.role}</option>
                      ))}
                    </select>
                  </label>
                  <label className="case-modal-field">
                    <span className="case-modal-label">{copy.dialog.status}</span>
                    <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as ComplaintStatus)}>
                      {complaintStatuses.map((value) => (
                        <option key={value} value={value}>{statusLabels[language][value]}</option>
                      ))}
                    </select>
                  </label>
                  <label className="case-modal-field case-modal-field-wide">
                    <span className="case-modal-label">{copy.dialog.internalNote}</span>
                    <textarea value={internalNote} onChange={(event) => setInternalNote(event.target.value)} />
                  </label>
                </div>
              </div>

              <div className="admin-modal-actions">
                <button className="button button-secondary" onClick={() => setIsDetailOpen(false)} type="button">
                  {copy.dialog.close}
                </button>
                <button className="button button-primary" disabled={saveState === 'saving'} type="submit">
                  {saveState === 'saving' ? copy.dialog.saving : copy.dialog.saveUpdate}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </section>
  )
}
