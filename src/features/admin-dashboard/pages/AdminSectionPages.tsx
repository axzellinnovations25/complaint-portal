import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import * as QRCode from 'qrcode'
import type { AdminSectionDefinition, UserRole } from '../../../entities/user/model/roles'
import { userRoleLabels, userRoles } from '../../../entities/user/model/roles'
import { supabase } from '../../../shared/lib/supabase/client'

type AdminSectionPageProps = {
  role: UserRole
  visibleSections: AdminSectionDefinition[]
}

type DepartmentRow = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
}

type DepartmentFormState = {
  description: string
  name: string
}

type ProfileFormState = {
  departmentId: string
  fullName: string
  role: UserRole
}

type ProfileRow = {
  id: string
  full_name: string
  role: UserRole
  department_id: string | null
  is_active: boolean
  created_at: string
  departments?: { name: string } | null
}

type CategoryRow = {
  id: string
  name_en: string
  name_ta: string
  expected_sla_hours: number
  is_active: boolean
  created_at: string
  departments?: { name: string } | null
}

type LocationRow = {
  id: string
  ward: string | null
  village: string | null
  gn_division: string | null
  qr_payload: string | null
  qr_code_data_url: string | null
  created_at: string
}

type LocationFormState = {
  gnDivision: string
  village: string
  ward: string
}

type LocationPayload = {
  id?: string
  gn_division: string | null
  qr_code_data_url?: string
  qr_payload?: string
  village: string | null
  ward: string | null
}

type ComplaintReportRow = {
  id: string
  status: string
  priority: string
  submitted_at: string
  resolved_at: string | null
  departments?: { name: string } | null
}

type ContentRow = {
  id: string
  content_type: string
  title_en: string
  is_published: boolean
  published_at: string | null
  created_at: string
}

type SmsLogRow = {
  id: string
  recipient: string
  status: string
  created_at: string
  complaints?: { reference_no: string } | null
}

type EventRow = {
  id: string
  event_type: string
  note: string | null
  created_at: string
  complaints?: { reference_no: string } | null
  profiles?: { full_name: string } | null
}

type LoadState<T> = {
  data: T
  errorMessage: string
  isLoading: boolean
}

const openStatuses = ['submitted', 'under_review', 'accepted', 'assigned', 'in_progress', 'on_hold', 'reopened']

function downloadCsv(filename: string, rows: Record<string, string | number | boolean | null | undefined>[]) {
  if (rows.length === 0) {
    return
  }

  const headers = Object.keys(rows[0])
  const escapeCell = (value: string | number | boolean | null | undefined) => {
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

function goToPath(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function ActionNotice({ message }: { message: string }) {
  return message ? <p className="admin-action-notice">{message}</p> : null
}

function useData<T>(initialData: T, loader: () => Promise<T>) {
  const initialDataRef = useRef(initialData)
  const loaderRef = useRef(loader)
  const [state, setState] = useState<LoadState<T>>({
    data: initialData,
    errorMessage: '',
    isLoading: true,
  })

  useEffect(() => {
    let isMounted = true

    async function load() {
      setState((currentState) => ({ ...currentState, errorMessage: '', isLoading: true }))

      try {
        const data = await loaderRef.current()

        if (isMounted) {
          setState({ data, errorMessage: '', isLoading: false })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: initialDataRef.current,
            errorMessage: error instanceof Error ? error.message : 'Data could not be loaded.',
            isLoading: false,
          })
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [])

  return state
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Not set'
  }

  return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatusBadge({ label }: { label: string }) {
  const tone = label.toLowerCase().replace(/\s+/g, '-')

  return <span className={`admin-status-badge admin-status-${tone}`}>{label}</span>
}

function EmptyState({ children }: { children: ReactNode }) {
  return <p className="admin-empty-state">{children}</p>
}

function DataError({ message }: { message: string }) {
  return message ? <p className="admin-auth-error">{message}</p> : null
}

function AdminPageHeader({
  actions,
  eyebrow,
  title,
  description,
}: {
  actions?: ReactNode
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="admin-page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {actions && <div className="case-actions">{actions}</div>}
    </div>
  )
}

async function loadDepartmentsPageData() {
  const [
    { data: departments, error: departmentsError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from('departments')
      .select('id, name, description, is_active, created_at')
      .order('name', { ascending: true }),
    supabase
      .from('complaint_categories')
      .select('id, name_en, name_ta, expected_sla_hours, is_active, created_at, departments(name)')
      .order('name_en', { ascending: true }),
  ])

  if (departmentsError || categoriesError) {
    throw new Error(
      departmentsError?.message ??
        categoriesError?.message ??
        'Department data could not be loaded.',
    )
  }

  return {
    departments: (departments ?? []) as DepartmentRow[],
    categories: (categories ?? []) as CategoryRow[],
  }
}

export function DepartmentsAdministrationPage() {
  const { data, errorMessage, isLoading } = useData(
    { departments: [] as DepartmentRow[], categories: [] as CategoryRow[] },
    loadDepartmentsPageData,
  )
  const [actionMessage, setActionMessage] = useState('')
  const [departmentError, setDepartmentError] = useState('')
  const [departments, setDepartments] = useState<DepartmentRow[]>([])
  const [departmentForm, setDepartmentForm] = useState<DepartmentFormState>({ description: '', name: '' })
  const [editDepartmentForm, setEditDepartmentForm] = useState<DepartmentFormState>({ description: '', name: '' })
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null)
  const [isDepartmentSaving, setIsDepartmentSaving] = useState(false)
  const createDepartmentRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setDepartments(data.departments)
  }, [data.departments])

  const sortedDepartments = useMemo(
    () => [...departments].sort((first, second) => first.name.localeCompare(second.name)),
    [departments],
  )

  const resetDepartmentForms = () => {
    setDepartmentForm({ description: '', name: '' })
    setEditDepartmentForm({ description: '', name: '' })
    setEditingDepartmentId(null)
  }

  const handleCreateDepartment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = departmentForm.name.trim()

    if (!name) {
      setDepartmentError('Department name is required.')
      return
    }

    setDepartmentError('')
    setActionMessage('')
    setIsDepartmentSaving(true)

    const { data: createdDepartment, error } = await supabase
      .from('departments')
      .insert({
        description: departmentForm.description.trim() || null,
        is_active: true,
        name,
      })
      .select('id, name, description, is_active, created_at')
      .single()

    setIsDepartmentSaving(false)

    if (error) {
      setDepartmentError(error.message)
      return
    }

    setDepartments((currentDepartments) => [...currentDepartments, createdDepartment as DepartmentRow])
    resetDepartmentForms()
    setActionMessage(`Department "${createdDepartment.name}" created.`)
  }

  const handleStartEditDepartment = (department: DepartmentRow) => {
    setDepartmentError('')
    setActionMessage('')
    setEditingDepartmentId(department.id)
    setEditDepartmentForm({
      description: department.description ?? '',
      name: department.name,
    })
  }

  const handleUpdateDepartment = async (departmentId: string) => {
    const name = editDepartmentForm.name.trim()

    if (!name) {
      setDepartmentError('Department name is required.')
      return
    }

    setDepartmentError('')
    setActionMessage('')
    setIsDepartmentSaving(true)

    const { data: updatedDepartment, error } = await supabase
      .from('departments')
      .update({
        description: editDepartmentForm.description.trim() || null,
        name,
      })
      .eq('id', departmentId)
      .select('id, name, description, is_active, created_at')
      .single()

    setIsDepartmentSaving(false)

    if (error) {
      setDepartmentError(error.message)
      return
    }

    setDepartments((currentDepartments) =>
      currentDepartments.map((department) =>
        department.id === departmentId ? (updatedDepartment as DepartmentRow) : department,
      ),
    )
    resetDepartmentForms()
    setActionMessage(`Department "${updatedDepartment.name}" updated.`)
  }

  const handleToggleDepartment = async (department: DepartmentRow) => {
    setDepartmentError('')
    setActionMessage('')
    setIsDepartmentSaving(true)

    const { data: updatedDepartment, error } = await supabase
      .from('departments')
      .update({ is_active: !department.is_active })
      .eq('id', department.id)
      .select('id, name, description, is_active, created_at')
      .single()

    setIsDepartmentSaving(false)

    if (error) {
      setDepartmentError(error.message)
      return
    }

    setDepartments((currentDepartments) =>
      currentDepartments.map((currentDepartment) =>
        currentDepartment.id === department.id ? (updatedDepartment as DepartmentRow) : currentDepartment,
      ),
    )
    setActionMessage(
      `Department "${updatedDepartment.name}" ${updatedDepartment.is_active ? 'reactivated' : 'deactivated'}.`,
    )
  }

  const handleDeleteDepartment = async (department: DepartmentRow) => {
    const confirmed = window.confirm(
      `Delete "${department.name}"? This only succeeds when no staff, categories, or complaints reference this department.`,
    )

    if (!confirmed) {
      return
    }

    setDepartmentError('')
    setActionMessage('')
    setIsDepartmentSaving(true)

    const { error } = await supabase.from('departments').delete().eq('id', department.id)

    setIsDepartmentSaving(false)

    if (error) {
      setDepartmentError(`${error.message} Deactivate the department instead if records still reference it.`)
      return
    }

    setDepartments((currentDepartments) =>
      currentDepartments.filter((currentDepartment) => currentDepartment.id !== department.id),
    )
    setActionMessage(`Department "${department.name}" deleted.`)
  }

  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button
              className="button button-secondary"
              disabled={sortedDepartments.length === 0}
              onClick={() =>
                downloadCsv(
                  `departments-${new Date().toISOString().slice(0, 10)}.csv`,
                  sortedDepartments.map((department) => ({
                    created_at: department.created_at,
                    description: department.description,
                    id: department.id,
                    is_active: department.is_active,
                    name: department.name,
                  })),
                )
              }
              type="button"
            >
              Export departments
            </button>
            <button
              className="button button-primary"
              onClick={() => {
                createDepartmentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                createDepartmentRef.current?.querySelector('input')?.focus()
              }}
              type="button"
            >
              New department
            </button>
          </>
        }
        description="Manage department master records, active state, ownership notes, and complaint routing structure."
        eyebrow="Identity administration"
        title="Departments"
      />

      <DataError message={errorMessage} />
      <DataError message={departmentError} />
      <ActionNotice message={actionMessage} />

      <div className="admin-two-column admin-two-column-wide">
        <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Department directory</strong>
            <span>{sortedDepartments.length} department records</span>
          </div>
          {sortedDepartments.length > 0 ? (
            <div className="admin-table admin-department-table" role="table" aria-label="Department directory">
              <div className="admin-table-row admin-table-head" role="row">
                <span>Department</span>
                <span>Description</span>
                <span>Status</span>
                <span>Created</span>
                <span>Actions</span>
              </div>
              {sortedDepartments.map((department) =>
                editingDepartmentId === department.id ? (
                  <form
                    className="admin-table-row admin-department-edit-row"
                    key={department.id}
                    onSubmit={(event) => {
                      event.preventDefault()
                      void handleUpdateDepartment(department.id)
                    }}
                    role="row"
                  >
                    <span>
                      <input
                        aria-label="Department name"
                        onChange={(event) =>
                          setEditDepartmentForm((currentForm) => ({ ...currentForm, name: event.target.value }))
                        }
                        value={editDepartmentForm.name}
                      />
                    </span>
                    <span>
                      <input
                        aria-label="Department description"
                        onChange={(event) =>
                          setEditDepartmentForm((currentForm) => ({
                            ...currentForm,
                            description: event.target.value,
                          }))
                        }
                        value={editDepartmentForm.description}
                      />
                    </span>
                    <StatusBadge label={department.is_active ? 'Active' : 'Inactive'} />
                    <span>{formatDate(department.created_at)}</span>
                    <span className="admin-row-actions">
                      <button className="case-link-button" disabled={isDepartmentSaving} type="submit">
                        Save
                      </button>
                      <button className="case-link-button" onClick={resetDepartmentForms} type="button">
                        Cancel
                      </button>
                    </span>
                  </form>
                ) : (
                  <article className="admin-table-row" key={department.id} role="row">
                    <span>
                      <strong>{department.name}</strong>
                      <small>{department.id}</small>
                    </span>
                    <span>{department.description ?? 'No description'}</span>
                    <StatusBadge label={department.is_active ? 'Active' : 'Inactive'} />
                    <span>{formatDate(department.created_at)}</span>
                    <span className="admin-row-actions">
                      <button
                        className="case-link-button"
                        disabled={isDepartmentSaving}
                        onClick={() => handleStartEditDepartment(department)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="case-link-button"
                        disabled={isDepartmentSaving}
                        onClick={() => void handleToggleDepartment(department)}
                        type="button"
                      >
                        {department.is_active ? 'Deactivate' : 'Reactivate'}
                      </button>
                      <button
                        className="case-link-button case-link-danger"
                        disabled={isDepartmentSaving}
                        onClick={() => void handleDeleteDepartment(department)}
                        type="button"
                      >
                        Delete
                      </button>
                    </span>
                  </article>
                ),
              )}
            </div>
          ) : (
            <EmptyState>{isLoading ? 'Loading departments.' : 'No departments found.'}</EmptyState>
          )}
        </div>

        <aside className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Create department</strong>
            <span>Department master data</span>
          </div>
          <form className="admin-form-preview" onSubmit={handleCreateDepartment} ref={createDepartmentRef}>
            <label>
              Department name
              <input
                onChange={(event) =>
                  setDepartmentForm((currentForm) => ({ ...currentForm, name: event.target.value }))
                }
                placeholder="Example: Public Health"
                value={departmentForm.name}
              />
            </label>
            <label>
              Description
              <textarea
                onChange={(event) =>
                  setDepartmentForm((currentForm) => ({ ...currentForm, description: event.target.value }))
                }
                placeholder="What this department owns or handles"
                value={departmentForm.description}
              />
            </label>
            <button className="button button-primary" disabled={isDepartmentSaving} type="submit">
              {isDepartmentSaving ? 'Saving...' : 'Create department'}
            </button>
          </form>
        </aside>
      </div>

      <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Category routing</strong>
            <span>Database rules</span>
          </div>
          {data.categories.length > 0 ? (
            <div className="admin-route-list">
              {data.categories.map((category) => (
                <article key={category.id}>
                  <div>
                    <strong>{category.name_en}</strong>
                    <span>{category.departments?.name ?? 'No department'} - {category.expected_sla_hours} hours</span>
                  </div>
                  <StatusBadge label={category.is_active ? 'Active' : 'Inactive'} />
                </article>
              ))}
            </div>
          ) : (
            <EmptyState>{isLoading ? 'Loading category routing.' : 'No complaint categories found.'}</EmptyState>
          )}
      </div>
    </section>
  )
}

async function loadUsersPageData() {
  const [{ data: profiles, error: profilesError }, { data: departments, error: departmentsError }] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, role, department_id, is_active, created_at, departments(name)')
        .order('created_at', { ascending: false }),
      supabase
        .from('departments')
        .select('id, name, description, is_active, created_at')
        .order('name', { ascending: true }),
    ])

  if (profilesError || departmentsError) {
    throw new Error(profilesError?.message ?? departmentsError?.message ?? 'User access data could not be loaded.')
  }

  return {
    departments: (departments ?? []) as DepartmentRow[],
    profiles: (profiles ?? []) as ProfileRow[],
  }
}

export function UsersAdministrationPage() {
  const { data, errorMessage, isLoading } = useData(
    { departments: [] as DepartmentRow[], profiles: [] as ProfileRow[] },
    loadUsersPageData,
  )
  const [showInactiveOnly, setShowInactiveOnly] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null)
  const [editProfileForm, setEditProfileForm] = useState<ProfileFormState>({
    departmentId: '',
    fullName: '',
    role: 'officer',
  })
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profiles, setProfiles] = useState<ProfileRow[]>([])

  useEffect(() => {
    setProfiles(data.profiles)
  }, [data.profiles])

  const sortedDepartments = useMemo(
    () => [...data.departments].sort((first, second) => first.name.localeCompare(second.name)),
    [data.departments],
  )
  const visibleProfiles = useMemo(
    () =>
      [...(showInactiveOnly ? profiles.filter((profile) => !profile.is_active) : profiles)].sort((first, second) =>
        first.full_name.localeCompare(second.full_name),
      ),
    [profiles, showInactiveOnly],
  )
  const roleCounts = useMemo(
    () =>
      Object.entries(
        profiles.reduce<Record<string, number>>((acc, profile) => {
          acc[profile.role] = (acc[profile.role] ?? 0) + 1
          return acc
        }, {}),
      ),
    [profiles],
  )

  const resetProfileForm = () => {
    setEditProfileForm({ departmentId: '', fullName: '', role: 'officer' })
    setEditingProfileId(null)
  }

  const getDepartmentName = (departmentId: string | null, fallback?: string) => {
    if (!departmentId) {
      return 'No department'
    }

    return sortedDepartments.find((department) => department.id === departmentId)?.name ?? fallback ?? 'No department'
  }

  const handleStartEditProfile = (profile: ProfileRow) => {
    setProfileError('')
    setActionMessage('')
    setEditingProfileId(profile.id)
    setEditProfileForm({
      departmentId: profile.department_id ?? '',
      fullName: profile.full_name,
      role: profile.role,
    })
  }

  const handleUpdateProfile = async (profileId: string) => {
    const fullName = editProfileForm.fullName.trim()

    if (!fullName) {
      setProfileError('Staff name is required.')
      return
    }

    setProfileError('')
    setActionMessage('')
    setIsProfileSaving(true)

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        department_id: editProfileForm.departmentId || null,
        full_name: fullName,
        role: editProfileForm.role,
      })
      .eq('id', profileId)
      .select('id, full_name, role, department_id, is_active, created_at')
      .single()

    setIsProfileSaving(false)

    if (error) {
      setProfileError(error.message)
      return
    }

    const profile = updatedProfile as ProfileRow

    setProfiles((currentProfiles) =>
      currentProfiles.map((currentProfile) => (currentProfile.id === profileId ? profile : currentProfile)),
    )
    resetProfileForm()
    setActionMessage(`Staff account "${profile.full_name}" updated.`)
  }

  const handleToggleProfile = async (profile: ProfileRow) => {
    setProfileError('')
    setActionMessage('')
    setIsProfileSaving(true)

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({ is_active: !profile.is_active })
      .eq('id', profile.id)
      .select('id, full_name, role, department_id, is_active, created_at')
      .single()

    setIsProfileSaving(false)

    if (error) {
      setProfileError(error.message)
      return
    }

    const changedProfile = updatedProfile as ProfileRow

    setProfiles((currentProfiles) =>
      currentProfiles.map((currentProfile) =>
        currentProfile.id === profile.id ? changedProfile : currentProfile,
      ),
    )
    setActionMessage(`Staff account "${changedProfile.full_name}" ${changedProfile.is_active ? 'reactivated' : 'deactivated'}.`)
  }

  const handleDeleteProfile = async (profile: ProfileRow) => {
    const confirmed = window.confirm(
      `Delete profile for "${profile.full_name}"? This removes the staff profile but does not delete the Supabase Auth account.`,
    )

    if (!confirmed) {
      return
    }

    setProfileError('')
    setActionMessage('')
    setIsProfileSaving(true)

    const { error } = await supabase.from('profiles').delete().eq('id', profile.id)

    setIsProfileSaving(false)

    if (error) {
      setProfileError(`${error.message} Deactivate the account instead if records still reference this profile.`)
      return
    }

    setProfiles((currentProfiles) => currentProfiles.filter((currentProfile) => currentProfile.id !== profile.id))
    setActionMessage(`Staff profile "${profile.full_name}" deleted.`)
  }

  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button
              className="button button-secondary"
              disabled={profiles.length === 0}
              onClick={() => setShowInactiveOnly((currentValue) => !currentValue)}
              type="button"
            >
              {showInactiveOnly ? 'Show all users' : 'Review inactive'}
            </button>
            <button
              className="button button-primary"
              onClick={() => setActionMessage('Staff invitations require a server-side Supabase Auth admin endpoint so service-role credentials stay out of the browser.')}
              type="button"
            >
              Invite staff
            </button>
          </>
        }
        description="Control staff access, account state, role scope, and minimum security expectations."
        eyebrow="Access control"
        title="User access and permissions"
      />

      <DataError message={errorMessage} />
      <DataError message={profileError} />
      <ActionNotice message={actionMessage} />

      <div className="admin-two-column admin-two-column-wide">
        <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Staff accounts</strong>
            <span>{visibleProfiles.length} profile records</span>
          </div>
          {visibleProfiles.length > 0 ? (
            <div className="admin-table admin-user-table" role="table" aria-label="Staff account access">
              <div className="admin-table-row admin-table-head" role="row">
                <span>User</span>
                <span>Role</span>
                <span>Department</span>
                <span>Created</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {visibleProfiles.map((profile) =>
                editingProfileId === profile.id ? (
                  <form
                    className="admin-table-row admin-officer-edit-row"
                    key={profile.id}
                    onSubmit={(event) => {
                      event.preventDefault()
                      void handleUpdateProfile(profile.id)
                    }}
                    role="row"
                  >
                    <span>
                      <input
                        aria-label="Staff full name"
                        onChange={(event) =>
                          setEditProfileForm((currentForm) => ({ ...currentForm, fullName: event.target.value }))
                        }
                        value={editProfileForm.fullName}
                      />
                    </span>
                    <span>
                      <select
                        aria-label="Staff role"
                        onChange={(event) =>
                          setEditProfileForm((currentForm) => ({
                            ...currentForm,
                            role: event.target.value as UserRole,
                          }))
                        }
                        value={editProfileForm.role}
                      >
                        {userRoles.map((role) => (
                          <option key={role} value={role}>
                            {userRoleLabels[role]}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span>
                      <select
                        aria-label="Staff department"
                        onChange={(event) =>
                          setEditProfileForm((currentForm) => ({
                            ...currentForm,
                            departmentId: event.target.value,
                          }))
                        }
                        value={editProfileForm.departmentId}
                      >
                        <option value="">No department</option>
                        {sortedDepartments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span>{formatDate(profile.created_at)}</span>
                    <StatusBadge label={profile.is_active ? 'Active' : 'Inactive'} />
                    <span className="admin-row-actions">
                      <button className="case-link-button" disabled={isProfileSaving} type="submit">
                        Save
                      </button>
                      <button className="case-link-button" onClick={resetProfileForm} type="button">
                        Cancel
                      </button>
                    </span>
                  </form>
                ) : (
                  <article className="admin-table-row" key={profile.id} role="row">
                    <span>
                      <strong>{profile.full_name}</strong>
                      <small>{profile.id}</small>
                    </span>
                    <span>{userRoleLabels[profile.role]}</span>
                    <span>{getDepartmentName(profile.department_id, profile.departments?.name)}</span>
                    <span>{formatDate(profile.created_at)}</span>
                    <StatusBadge label={profile.is_active ? 'Active' : 'Inactive'} />
                    <span className="admin-row-actions">
                      <button
                        className="case-link-button"
                        disabled={isProfileSaving}
                        onClick={() => handleStartEditProfile(profile)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="case-link-button"
                        disabled={isProfileSaving}
                        onClick={() => void handleToggleProfile(profile)}
                        type="button"
                      >
                        {profile.is_active ? 'Deactivate' : 'Reactivate'}
                      </button>
                      <button
                        className="case-link-button case-link-danger"
                        disabled={isProfileSaving}
                        onClick={() => void handleDeleteProfile(profile)}
                        type="button"
                      >
                        Delete
                      </button>
                    </span>
                  </article>
                ),
              )}
            </div>
          ) : (
            <EmptyState>{isLoading ? 'Loading staff accounts.' : 'No staff profiles match this view.'}</EmptyState>
          )}
        </div>

        <aside className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Role counts</strong>
            <span>Current profiles</span>
          </div>
          {roleCounts.length > 0 ? (
            <div className="admin-route-list">
              {roleCounts.map(([role, count]) => (
                <article key={role}>
                  <div>
                    <strong>{userRoleLabels[role as UserRole]}</strong>
                    <span>{count} profile{count === 1 ? '' : 's'}</span>
                  </div>
                  <StatusBadge label="Active" />
                </article>
              ))}
            </div>
          ) : (
            <EmptyState>{isLoading ? 'Loading role counts.' : 'No role counts available.'}</EmptyState>
          )}
        </aside>
      </div>
    </section>
  )
}

async function loadCategoriesPageData() {
  const [{ data: departments, error: departmentsError }, { data: categories, error: categoriesError }] = await Promise.all([
    supabase.from('departments').select('id, name, description, is_active, created_at').order('name', { ascending: true }),
    supabase
      .from('complaint_categories')
      .select('id, name_en, name_ta, expected_sla_hours, is_active, created_at, departments(name)')
      .order('name_en', { ascending: true }),
  ])

  if (departmentsError || categoriesError) {
    throw new Error(departmentsError?.message ?? categoriesError?.message ?? 'Category data could not be loaded.')
  }

  return {
    departments: (departments ?? []) as DepartmentRow[],
    categories: (categories ?? []) as CategoryRow[],
  }
}

export function CategoriesAdministrationPage() {
  const { data, errorMessage, isLoading } = useData(
    { departments: [] as DepartmentRow[], categories: [] as CategoryRow[] },
    loadCategoriesPageData,
  )
  const [actionMessage, setActionMessage] = useState('')

  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button
              className="button button-secondary"
              onClick={() => setActionMessage('Category import needs a CSV parser and validation workflow before bulk writes are enabled.')}
              type="button"
            >
              Import categories
            </button>
            <button
              className="button button-primary"
              onClick={() => setActionMessage('Use the database categories table for now; the create/edit form is the next backend-backed admin workflow to add.')}
              type="button"
            >
              New category
            </button>
          </>
        }
        description="Define public complaint categories, department routing, SLA targets, and escalation behavior."
        eyebrow="Workflow configuration"
        title="Categories, SLA, and routing"
      />

      <DataError message={errorMessage} />
      <ActionNotice message={actionMessage} />

      <div className="admin-two-column admin-two-column-wide">
        <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Complaint categories</strong>
            <span>{data.categories.length} records</span>
          </div>
          {data.categories.length > 0 ? (
            <div className="admin-table admin-category-table" role="table" aria-label="Complaint categories">
              <div className="admin-table-row admin-table-head" role="row">
                <span>Category</span>
                <span>Department</span>
                <span>SLA</span>
                <span>Status</span>
              </div>
              {data.categories.map((category) => (
                <article className="admin-table-row" key={category.id} role="row">
                  <span>
                    <strong>{category.name_en}</strong>
                    <small>{category.name_ta}</small>
                  </span>
                  <span>{category.departments?.name ?? 'No department'}</span>
                  <StatusBadge label={`${category.expected_sla_hours}h`} />
                  <StatusBadge label={category.is_active ? 'Active' : 'Inactive'} />
                </article>
              ))}
            </div>
          ) : (
            <EmptyState>{isLoading ? 'Loading complaint categories.' : 'No complaint categories found.'}</EmptyState>
          )}
        </div>

        <aside className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Departments</strong>
            <span>{data.departments.length} records</span>
          </div>
          {data.departments.length > 0 ? (
            <div className="admin-route-list">
              {data.departments.map((department) => (
                <article key={department.id}>
                  <div>
                    <strong>{department.name}</strong>
                    <span>{department.description ?? 'No description'}</span>
                  </div>
                  <StatusBadge label={department.is_active ? 'Active' : 'Inactive'} />
                </article>
              ))}
            </div>
          ) : (
            <EmptyState>{isLoading ? 'Loading departments.' : 'No departments found.'}</EmptyState>
          )}
        </aside>
      </div>
    </section>
  )
}

async function loadLocationsPageData() {
  const { data, error } = await supabase
    .from('locations')
    .select('id, ward, village, gn_division, qr_payload, qr_code_data_url, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as LocationRow[]
}

export function LocationsAdministrationPage() {
  const { data: loadedLocations, errorMessage, isLoading } = useData([] as LocationRow[], loadLocationsPageData)
  const [locations, setLocations] = useState([] as LocationRow[])
  const [actionMessage, setActionMessage] = useState('')
  const [locationError, setLocationError] = useState('')
  const [isLocationSaving, setIsLocationSaving] = useState(false)
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null)
  const [showCreateLocationDialog, setShowCreateLocationDialog] = useState(false)
  const [selectedQrLocation, setSelectedQrLocation] = useState<LocationRow | null>(null)
  const [locationForm, setLocationForm] = useState<LocationFormState>({
    gnDivision: '',
    village: '',
    ward: '',
  })
  const [editLocationForm, setEditLocationForm] = useState<LocationFormState>({
    gnDivision: '',
    village: '',
    ward: '',
  })

  useEffect(() => {
    setLocations(loadedLocations)
  }, [loadedLocations])

  const resetLocationForms = () => {
    setLocationForm({
      gnDivision: '',
      village: '',
      ward: '',
    })
    setEditLocationForm({
      gnDivision: '',
      village: '',
      ward: '',
    })
    setEditingLocationId(null)
  }

  const buildLocationPayload = (form: LocationFormState): { payload: LocationPayload } | { error: string } => {
    const payload = {
      gn_division: form.gnDivision.trim() || null,
      village: form.village.trim() || null,
      ward: form.ward.trim() || null,
    }

    if (!payload.ward && !payload.village && !payload.gn_division) {
      return { error: 'Add at least a name, village, or GN division.' }
    }

    return { payload }
  }

  const getLocationName = (location: Pick<LocationRow, 'gn_division' | 'village' | 'ward'>) =>
    location.ward ?? location.village ?? location.gn_division ?? 'this location'

  const buildLocationQrPayload = (locationId: string) => {
    const submitUrl = new URL('/submit', 'https://complaint-portals.netlify.app')
    submitUrl.searchParams.set('locationId', locationId)
    submitUrl.hash = 'complaint-intake'

    return submitUrl.toString()
  }

  const handleDownloadLocationQr = (location: LocationRow) => {
    if (!location.qr_code_data_url) {
      setLocationError('This location does not have a stored QR code yet.')
      return
    }

    const filenameBase = getLocationName(location)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'location'
    const anchor = document.createElement('a')
    anchor.href = location.qr_code_data_url
    anchor.download = `${filenameBase}-qr.png`
    anchor.click()
  }

  const handleCreateLocation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const locationPayload = buildLocationPayload(locationForm)

    if ('error' in locationPayload) {
      setLocationError(locationPayload.error)
      return
    }

    setLocationError('')
    setActionMessage('')
    setIsLocationSaving(true)

    try {
      const locationId = crypto.randomUUID()
      const qrPayload = buildLocationQrPayload(locationId)
      const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
        errorCorrectionLevel: 'M',
        margin: 2,
        scale: 8,
      })

      const { data: createdLocation, error } = await supabase
        .from('locations')
        .insert({
          ...locationPayload.payload,
          id: locationId,
          qr_code_data_url: qrCodeDataUrl,
          qr_payload: qrPayload,
        })
        .select('id, ward, village, gn_division, qr_payload, qr_code_data_url, created_at')
        .single()

      if (error) {
        setLocationError(error.message)
        return
      }

      setLocations((currentLocations) => [createdLocation as LocationRow, ...currentLocations])
      resetLocationForms()
      setShowCreateLocationDialog(false)
      setSelectedQrLocation(createdLocation as LocationRow)
      setActionMessage(`Location "${getLocationName(createdLocation)}" created with a QR code.`)
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'QR code could not be generated.')
    } finally {
      setIsLocationSaving(false)
    }
  }

  const handleStartEditLocation = (location: LocationRow) => {
    setLocationError('')
    setActionMessage('')
    setEditingLocationId(location.id)
    setEditLocationForm({
      gnDivision: location.gn_division ?? '',
      village: location.village ?? '',
      ward: location.ward ?? '',
    })
  }

  const handleUpdateLocation = async (locationId: string) => {
    const locationPayload = buildLocationPayload(editLocationForm)

    if ('error' in locationPayload) {
      setLocationError(locationPayload.error)
      return
    }

    setLocationError('')
    setActionMessage('')
    setIsLocationSaving(true)

    try {
      const qrPayload = buildLocationQrPayload(locationId)
      const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
        errorCorrectionLevel: 'M',
        margin: 2,
        scale: 8,
      })

      const { data: updatedLocation, error } = await supabase
        .from('locations')
        .update({
          ...locationPayload.payload,
          qr_code_data_url: qrCodeDataUrl,
          qr_payload: qrPayload,
        })
        .eq('id', locationId)
        .select('id, ward, village, gn_division, qr_payload, qr_code_data_url, created_at')
        .single()

      if (error) {
        setLocationError(error.message)
        return
      }

      setLocations((currentLocations) =>
        currentLocations.map((location) => (location.id === locationId ? (updatedLocation as LocationRow) : location)),
      )
      resetLocationForms()
      setSelectedQrLocation((currentLocation) =>
        currentLocation?.id === locationId ? (updatedLocation as LocationRow) : currentLocation,
      )
      setActionMessage(`Location "${getLocationName(updatedLocation)}" updated with a QR code.`)
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'QR code could not be generated.')
    } finally {
      setIsLocationSaving(false)
    }
  }

  const handleDeleteLocation = async (location: LocationRow) => {
    const locationName = getLocationName(location)
    const confirmed = window.confirm(
      `Delete "${locationName}"? This only succeeds when no complaints reference this location.`,
    )

    if (!confirmed) {
      return
    }

    setLocationError('')
    setActionMessage('')
    setIsLocationSaving(true)

    const { error } = await supabase.from('locations').delete().eq('id', location.id)

    setIsLocationSaving(false)

    if (error) {
      setLocationError(`${error.message} Keep the location if complaints still reference it.`)
      return
    }

    setLocations((currentLocations) => currentLocations.filter((currentLocation) => currentLocation.id !== location.id))
    setSelectedQrLocation((currentLocation) => (currentLocation?.id === location.id ? null : currentLocation))
    setActionMessage(`Location "${locationName}" deleted.`)
  }

  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button
              className="button button-secondary"
              disabled={locations.length === 0}
              onClick={() =>
                downloadCsv(
                  `locations-${new Date().toISOString().slice(0, 10)}.csv`,
                  locations.map((location) => ({
                    created_at: location.created_at,
                    gn_division: location.gn_division,
                    id: location.id,
                    qr_payload: location.qr_payload,
                    village: location.village,
                    ward: location.ward,
                  })),
                )
              }
              type="button"
            >
              Export CSV
            </button>
            <button
              className="button button-primary"
              onClick={() => {
                setLocationError('')
                setActionMessage('')
                resetLocationForms()
                setShowCreateLocationDialog(true)
              }}
              type="button"
            >
              Add location
            </button>
          </>
        }
        description="Maintain the geographic master data used for intake, assignment, reporting, and field work."
        eyebrow="Location administration"
        title="Locations, villages, and service zones"
      />

      <DataError message={errorMessage} />
      <DataError message={locationError} />
      <ActionNotice message={actionMessage} />

      <div className="admin-two-column admin-two-column-wide">
        <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Location master</strong>
            <span>{locations.length} records</span>
          </div>
          {locations.length > 0 ? (
            <div className="admin-table admin-location-table" role="table" aria-label="Location master data">
              <div className="admin-table-row admin-table-head" role="row">
                <span>Name</span>
                <span>Village</span>
                <span>GN division</span>
                <span>Created</span>
                <span>Actions</span>
              </div>
              {locations.map((location) =>
                editingLocationId === location.id ? (
                  <form
                    className="admin-table-row admin-location-edit-row"
                    key={location.id}
                    onSubmit={(event) => {
                      event.preventDefault()
                      void handleUpdateLocation(location.id)
                    }}
                    role="row"
                  >
                    <span>
                      <input
                        aria-label="Location name"
                        onChange={(event) =>
                          setEditLocationForm((currentForm) => ({ ...currentForm, ward: event.target.value }))
                        }
                        value={editLocationForm.ward}
                      />
                    </span>
                    <span>
                      <input
                        aria-label="Village"
                        onChange={(event) =>
                          setEditLocationForm((currentForm) => ({ ...currentForm, village: event.target.value }))
                        }
                        value={editLocationForm.village}
                      />
                    </span>
                    <span>
                      <input
                        aria-label="GN division"
                        onChange={(event) =>
                          setEditLocationForm((currentForm) => ({ ...currentForm, gnDivision: event.target.value }))
                        }
                        value={editLocationForm.gnDivision}
                      />
                    </span>
                    <span>{formatDate(location.created_at)}</span>
                    <span className="admin-row-actions">
                      <button className="case-link-button" disabled={isLocationSaving} type="submit">
                        Save
                      </button>
                      <button className="case-link-button" onClick={resetLocationForms} type="button">
                        Cancel
                      </button>
                    </span>
                  </form>
                ) : (
                  <article className="admin-table-row" key={location.id} role="row">
                    <span>
                      <strong>{location.ward ?? 'No name'}</strong>
                      <small>{location.id}</small>
                    </span>
                    <span>{location.village ?? 'No village'}</span>
                    <span>{location.gn_division ?? 'No GN division'}</span>
                    <span>{formatDate(location.created_at)}</span>
                    <span className="admin-row-actions">
                      <button
                        className="case-link-button"
                        disabled={isLocationSaving || !location.qr_code_data_url}
                        onClick={() => setSelectedQrLocation(location)}
                        type="button"
                      >
                        Show QR
                      </button>
                      <button
                        className="case-link-button"
                        disabled={isLocationSaving}
                        onClick={() => handleStartEditLocation(location)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="case-link-button case-link-danger"
                        disabled={isLocationSaving}
                        onClick={() => void handleDeleteLocation(location)}
                        type="button"
                      >
                        Delete
                      </button>
                    </span>
                  </article>
                ),
              )}
            </div>
          ) : (
            <EmptyState>{isLoading ? 'Loading locations.' : 'No locations found.'}</EmptyState>
          )}
        </div>

        <aside className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Location QR</strong>
            <span>Created location codes</span>
          </div>
          <EmptyState>Select Show QR from a location row to open its code.</EmptyState>
        </aside>
      </div>

      {selectedQrLocation ? (
        <div className="admin-modal-backdrop" role="presentation">
          <section
            aria-labelledby="location-qr-title"
            aria-modal="true"
            className="admin-modal-panel admin-qr-modal-panel"
            role="dialog"
          >
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Location QR</p>
                <h3 id="location-qr-title">{getLocationName(selectedQrLocation)}</h3>
              </div>
              <button className="case-link-button" onClick={() => setSelectedQrLocation(null)} type="button">
                Close
              </button>
            </div>
            {selectedQrLocation.qr_code_data_url ? (
              <div className="admin-qr-preview" aria-live="polite">
                <img
                  alt={`QR code for ${getLocationName(selectedQrLocation)}`}
                  src={selectedQrLocation.qr_code_data_url}
                />
                <span>{selectedQrLocation.qr_payload}</span>
              </div>
            ) : (
              <EmptyState>This location does not have a stored QR code yet.</EmptyState>
            )}
            <div className="admin-modal-actions">
              <button className="button button-secondary" onClick={() => setSelectedQrLocation(null)} type="button">
                Close
              </button>
              <button
                className="button button-primary"
                disabled={!selectedQrLocation.qr_code_data_url}
                onClick={() => handleDownloadLocationQr(selectedQrLocation)}
                type="button"
              >
                Download QR
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {showCreateLocationDialog ? (
        <div className="admin-modal-backdrop" role="presentation">
          <section
            aria-labelledby="create-location-title"
            aria-modal="true"
            className="admin-modal-panel"
            role="dialog"
          >
            <div className="admin-modal-header">
              <div>
                <p className="eyebrow">Location administration</p>
                <h3 id="create-location-title">Create location</h3>
              </div>
              <button
                className="case-link-button"
                disabled={isLocationSaving}
                onClick={() => {
                  resetLocationForms()
                  setShowCreateLocationDialog(false)
                }}
                type="button"
              >
                Close
              </button>
            </div>
            <form className="admin-form-preview" onSubmit={handleCreateLocation}>
              <label>
                Name
                <input
                  autoFocus
                  onChange={(event) =>
                    setLocationForm((currentForm) => ({ ...currentForm, ward: event.target.value }))
                  }
                  placeholder="Example: Central Market"
                  value={locationForm.ward}
                />
              </label>
              <label>
                Village
                <input
                  onChange={(event) =>
                    setLocationForm((currentForm) => ({ ...currentForm, village: event.target.value }))
                  }
                  placeholder="Example: Kallady"
                  value={locationForm.village}
                />
              </label>
              <label>
                GN division
                <input
                  onChange={(event) =>
                    setLocationForm((currentForm) => ({ ...currentForm, gnDivision: event.target.value }))
                  }
                  placeholder="Example: 176A"
                  value={locationForm.gnDivision}
                />
              </label>
              <div className="admin-modal-actions">
                <button
                  className="button button-secondary"
                  disabled={isLocationSaving}
                  onClick={() => {
                    resetLocationForms()
                    setShowCreateLocationDialog(false)
                  }}
                  type="button"
                >
                  Cancel
                </button>
                <button className="button button-primary" disabled={isLocationSaving} type="submit">
                  {isLocationSaving ? 'Saving...' : 'Create location'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </section>
  )
}

async function loadReportsPageData() {
  const { data, error } = await supabase
    .from('complaints')
    .select('id, status, priority, submitted_at, resolved_at, departments(name)')
    .order('submitted_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ComplaintReportRow[]
}

export function ReportsAdministrationPage() {
  const { data: complaints, errorMessage, isLoading } = useData([] as ComplaintReportRow[], loadReportsPageData)
  const [actionMessage, setActionMessage] = useState('')
  const openCount = complaints.filter((complaint) => openStatuses.includes(complaint.status)).length
  const resolvedCount = complaints.filter((complaint) => complaint.resolved_at).length
  const reopenedCount = complaints.filter((complaint) => complaint.status === 'reopened').length
  const urgentCount = complaints.filter((complaint) => complaint.priority === 'urgent').length
  const departmentPerformance = Object.values(
    complaints.reduce<Record<string, { department: string; open: number; resolved: number }>>((acc, complaint) => {
      const department = complaint.departments?.name ?? 'Unassigned'
      acc[department] ??= { department, open: 0, resolved: 0 }

      if (openStatuses.includes(complaint.status)) {
        acc[department].open += 1
      }

      if (complaint.resolved_at) {
        acc[department].resolved += 1
      }

      return acc
    }, {}),
  )

  const reportRows = [
    { metric: 'Total complaints', current: complaints.length.toString(), trend: 'Active' },
    { metric: 'Open complaints', current: openCount.toString(), trend: openCount > 0 ? 'Review' : 'Low' },
    { metric: 'Resolved complaints', current: resolvedCount.toString(), trend: 'Resolved' },
    { metric: 'Reopened cases', current: reopenedCount.toString(), trend: reopenedCount > 0 ? 'Watch' : 'Low' },
    { metric: 'Urgent complaints', current: urgentCount.toString(), trend: urgentCount > 0 ? 'High' : 'Low' },
  ]

  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button
              className="button button-secondary"
              disabled={complaints.length === 0}
              onClick={() => setActionMessage('Scheduled report delivery needs a backend scheduler or Edge Function before it can run unattended.')}
              type="button"
            >
              Schedule report
            </button>
            <button
              className="button button-primary"
              disabled={complaints.length === 0}
              onClick={() =>
                downloadCsv(
                  `complaint-report-${new Date().toISOString().slice(0, 10)}.csv`,
                  complaints.map((complaint) => ({
                    id: complaint.id,
                    status: complaint.status,
                    priority: complaint.priority,
                    department: complaint.departments?.name ?? 'Unassigned',
                    submitted_at: complaint.submitted_at,
                    resolved_at: complaint.resolved_at,
                  })),
                )
              }
              type="button"
            >
              Download CSV
            </button>
          </>
        }
        description="Review response pressure, department throughput, and performance summaries."
        eyebrow="Reporting"
        title="Workload and performance reports"
      />

      <DataError message={errorMessage} />
      <ActionNotice message={actionMessage} />

      {complaints.length > 0 ? (
        <>
          <div className="admin-report-grid">
            {reportRows.map((row) => (
              <article key={row.metric}>
                <span>{row.metric}</span>
                <strong>{row.current}</strong>
                <StatusBadge label={row.trend} />
              </article>
            ))}
          </div>

          <div className="admin-data-panel">
            <div className="admin-panel-heading">
              <strong>Department performance</strong>
              <span>All recorded complaints</span>
            </div>
            <div className="admin-table admin-performance-table" role="table" aria-label="Department performance">
              <div className="admin-table-row admin-table-head" role="row">
                <span>Department</span>
                <span>Open</span>
                <span>Resolved</span>
                <span>Status</span>
              </div>
              {departmentPerformance.map((department) => (
                <article className="admin-table-row" key={department.department} role="row">
                  <span><strong>{department.department}</strong></span>
                  <span>{department.open}</span>
                  <span>{department.resolved}</span>
                  <StatusBadge label={department.open > 0 ? 'Review' : 'Low'} />
                </article>
              ))}
            </div>
          </div>
        </>
      ) : (
        <EmptyState>{isLoading ? 'Loading report data.' : 'No complaint records found for reporting.'}</EmptyState>
      )}
    </section>
  )
}

async function loadContentPageData() {
  const { data, error } = await supabase
    .from('public_content')
    .select('id, content_type, title_en, is_published, published_at, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ContentRow[]
}

export function ContentAdministrationPage() {
  const { data: contentItems, errorMessage, isLoading } = useData([] as ContentRow[], loadContentPageData)
  const [actionMessage, setActionMessage] = useState('')

  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button className="button button-secondary" onClick={() => goToPath('/notices')} type="button">Preview public site</button>
            <button
              className="button button-primary"
              onClick={() => setActionMessage('Notice authoring needs an editor form before publishing can be done safely from this page.')}
              type="button"
            >
              New notice
            </button>
          </>
        }
        description="Publish public notices, update service guidance, and keep response material current."
        eyebrow="Content administration"
        title="Public notices and service guidance"
      />

      <DataError message={errorMessage} />
      <ActionNotice message={actionMessage} />

      <div className="admin-data-panel">
        <div className="admin-panel-heading">
          <strong>Content queue</strong>
          <span>{contentItems.length} records</span>
        </div>
        {contentItems.length > 0 ? (
          <div className="admin-table admin-content-table" role="table" aria-label="Content queue">
            <div className="admin-table-row admin-table-head" role="row">
              <span>Title</span>
              <span>Type</span>
              <span>Status</span>
              <span>Published</span>
            </div>
            {contentItems.map((item) => (
              <article className="admin-table-row" key={item.id} role="row">
                <span><strong>{item.title_en}</strong></span>
                <span>{item.content_type}</span>
                <StatusBadge label={item.is_published ? 'Published' : 'Draft'} />
                <span>{formatDate(item.published_at)}</span>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState>{isLoading ? 'Loading public content.' : 'No public content records found.'}</EmptyState>
        )}
      </div>
    </section>
  )
}

async function loadCommunicationPageData() {
  const { data, error } = await supabase
    .from('sms_logs')
    .select('id, recipient, status, created_at, complaints(reference_no)')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as SmsLogRow[]
}

export function CommunicationAdministrationPage() {
  const { data: smsLogs, errorMessage, isLoading } = useData([] as SmsLogRow[], loadCommunicationPageData)
  const [actionMessage, setActionMessage] = useState('')

  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button
              className="button button-secondary"
              disabled={smsLogs.length === 0}
              onClick={() => setActionMessage('Delivery status sync needs provider polling in an Edge Function; the current table shows recorded SMS log state.')}
              type="button"
            >
              Sync delivery status
            </button>
            <button
              className="button button-primary"
              onClick={() => setActionMessage('Use complaint case updates to send citizen status messages once the SMS Edge Function is connected.')}
              type="button"
            >
              Send update
            </button>
          </>
        }
        description="Review SMS messages recorded by the platform."
        eyebrow="Communication"
        title="SMS updates and delivery review"
      />

      <DataError message={errorMessage} />
      <ActionNotice message={actionMessage} />

      <div className="admin-data-panel">
        <div className="admin-panel-heading">
          <strong>Delivery log</strong>
          <span>{smsLogs.length} records</span>
        </div>
        {smsLogs.length > 0 ? (
          <div className="admin-table admin-sms-table" role="table" aria-label="SMS delivery log">
            <div className="admin-table-row admin-table-head" role="row">
              <span>Reference</span>
              <span>Recipient</span>
              <span>Status</span>
              <span>Time</span>
            </div>
            {smsLogs.map((log) => (
              <article className="admin-table-row" key={log.id} role="row">
                <span><strong>{log.complaints?.reference_no ?? 'No complaint'}</strong></span>
                <span>{log.recipient}</span>
                <StatusBadge label={log.status} />
                <span>{formatDateTime(log.created_at)}</span>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState>{isLoading ? 'Loading SMS logs.' : 'No SMS log records found.'}</EmptyState>
        )}
      </div>
    </section>
  )
}

export function SettingsAdministrationPage() {
  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        description="No persisted system settings table exists yet. Add a settings table before this page can show live configuration records."
        eyebrow="Platform administration"
        title="System settings"
      />
      <EmptyState>No system settings records found.</EmptyState>
    </section>
  )
}

async function loadAuditPageData() {
  const { data, error } = await supabase
    .from('complaint_events')
    .select('id, event_type, note, created_at, complaints(reference_no), profiles(full_name)')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as EventRow[]
}

export function AuditAdministrationPage() {
  const { data: auditEvents, errorMessage, isLoading } = useData([] as EventRow[], loadAuditPageData)
  const [actionMessage, setActionMessage] = useState('')

  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button
              className="button button-secondary"
              disabled={auditEvents.length === 0}
              onClick={() =>
                downloadCsv(
                  `audit-log-${new Date().toISOString().slice(0, 10)}.csv`,
                  auditEvents.map((event) => ({
                    actor: event.profiles?.full_name ?? 'System',
                    event: event.event_type,
                    note: event.note,
                    complaint: event.complaints?.reference_no ?? '',
                    created_at: event.created_at,
                  })),
                )
              }
              type="button"
            >
              Export audit
            </button>
            <button
              className="button button-primary"
              disabled={auditEvents.length === 0}
              onClick={() => setActionMessage('Audit review notes need an insert policy and review-note event type before this page can write governance records.')}
              type="button"
            >
              Create review note
            </button>
          </>
        }
        description="Review recorded complaint workflow changes and staff activity."
        eyebrow="Audit and governance"
        title="Administration audit log"
      />

      <DataError message={errorMessage} />
      <ActionNotice message={actionMessage} />

      <div className="admin-data-panel">
        <div className="admin-panel-heading">
          <strong>Recent events</strong>
          <span>{auditEvents.length} records</span>
        </div>
        {auditEvents.length > 0 ? (
          <div className="admin-table admin-audit-table" role="table" aria-label="Administration audit events">
            <div className="admin-table-row admin-table-head" role="row">
              <span>Actor</span>
              <span>Event</span>
              <span>Complaint</span>
              <span>Time</span>
              <span>Status</span>
            </div>
            {auditEvents.map((event) => (
              <article className="admin-table-row" key={event.id} role="row">
                <span><strong>{event.profiles?.full_name ?? 'System'}</strong></span>
                <span>{event.note ?? event.event_type}</span>
                <span>{event.complaints?.reference_no ?? 'No complaint'}</span>
                <span>{formatDateTime(event.created_at)}</span>
                <StatusBadge label="Recorded" />
              </article>
            ))}
          </div>
        ) : (
          <EmptyState>{isLoading ? 'Loading audit events.' : 'No audit event records found.'}</EmptyState>
        )}
      </div>
    </section>
  )
}

export function AdminAccessDeniedPage({ role, visibleSections }: AdminSectionPageProps) {
  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        description="Your account is active, but the requested section is outside the permissions for this role."
        eyebrow="Access limited"
        title="This role cannot open that administration page"
      />
      <span className="dashboard-timestamp">{userRoleLabels[role]}</span>
      <div className="admin-page-grid">
        {visibleSections.map((section) => (
          <article key={section.id}>
            <strong>{section.label}</strong>
            <p>{section.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
