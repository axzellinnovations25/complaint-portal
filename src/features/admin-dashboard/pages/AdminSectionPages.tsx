import type { ReactNode } from 'react'
import type { AdminSectionDefinition, UserRole } from '../../../entities/user/model/roles'
import { userRoleLabels } from '../../../entities/user/model/roles'

type AdminSectionPageProps = {
  role: UserRole
  visibleSections: AdminSectionDefinition[]
}

const officers = [
  {
    name: 'N. Kumar',
    role: 'Officer',
    department: 'Electrical',
    activeCases: 9,
    status: 'Active',
    lastSeen: '10 minutes ago',
  },
  {
    name: 'S. Fernando',
    role: 'Field officer',
    department: 'Public Health',
    activeCases: 12,
    status: 'Field visit',
    lastSeen: '32 minutes ago',
  },
  {
    name: 'A. Perera',
    role: 'Department head',
    department: 'Roads',
    activeCases: 18,
    status: 'Reviewing',
    lastSeen: '1 hour ago',
  },
]

const departmentRoutes = [
  { category: 'Drainage and sanitation', department: 'Public Health', sla: '48h', owner: 'S. Fernando' },
  { category: 'Street lighting', department: 'Electrical', sla: '72h', owner: 'N. Kumar' },
  { category: 'Road damage', department: 'Roads', sla: '96h', owner: 'A. Perera' },
]

const reportRows = [
  { metric: 'Average first response', current: '4h 12m', previous: '5h 05m', trend: 'Improved' },
  { metric: 'SLA breach rate', current: '8%', previous: '11%', trend: 'Improved' },
  { metric: 'Reopened cases', current: '3', previous: '2', trend: 'Watch' },
  { metric: 'Resolved this week', current: '42', previous: '37', trend: 'Improved' },
]

const departmentPerformance = [
  { department: 'Public Health', open: 18, resolved: 24, risk: 'High' },
  { department: 'Roads', open: 14, resolved: 16, risk: 'Medium' },
  { department: 'Electrical', open: 9, resolved: 21, risk: 'Low' },
]

const contentItems = [
  { title: 'Water supply interruption - Ward 04', type: 'Notice', status: 'Published', updated: 'Today' },
  { title: 'How to report illegal dumping', type: 'Service guide', status: 'Draft', updated: 'Yesterday' },
  { title: 'Drainage complaint evidence guide', type: 'Knowledge base', status: 'Review', updated: '2 days ago' },
]

const smsTemplates = [
  { name: 'Complaint received', trigger: 'New submission', language: 'EN/Tamil', status: 'Active' },
  { name: 'Officer assigned', trigger: 'Assignment change', language: 'EN/Tamil', status: 'Active' },
  { name: 'Resolution delayed', trigger: 'SLA risk', language: 'EN', status: 'Review' },
]

const smsLogs = [
  { reference: 'PS-2026-0001', recipient: '+94 77 *** 1842', status: 'Queued', time: '10:04 AM' },
  { reference: 'PS-2026-0002', recipient: '+94 71 *** 0903', status: 'Delivered', time: '09:41 AM' },
  { reference: 'PS-2026-0003', recipient: '+94 76 *** 4451', status: 'Failed', time: 'Yesterday' },
]

function StatusBadge({ label }: { label: string }) {
  const tone = label.toLowerCase().replace(/\s+/g, '-')

  return <span className={`admin-status-badge admin-status-${tone}`}>{label}</span>
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

export function DepartmentsAdministrationPage() {
  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button className="button button-secondary" type="button">Export users</button>
            <button className="button button-primary" type="button">Invite officer</button>
          </>
        }
        description="Manage active staff, role assignment, department ownership, and complaint routing rules."
        eyebrow="Identity administration"
        title="Departments and officers"
      />

      <div className="admin-control-row">
        <label>
          Search staff
          <input placeholder="Name, role, or department" type="search" />
        </label>
        <label>
          Department
          <select defaultValue="all">
            <option value="all">All departments</option>
            <option value="public-health">Public Health</option>
            <option value="roads">Roads</option>
            <option value="electrical">Electrical</option>
          </select>
        </label>
        <label>
          Role
          <select defaultValue="all">
            <option value="all">All roles</option>
            <option value="department_head">Department head</option>
            <option value="officer">Officer</option>
            <option value="field_officer">Field officer</option>
          </select>
        </label>
      </div>

      <div className="admin-two-column">
        <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Officer directory</strong>
            <span>{officers.length} active records</span>
          </div>
          <div className="admin-table admin-officer-table" role="table" aria-label="Officer directory">
            <div className="admin-table-row admin-table-head" role="row">
              <span>Officer</span>
              <span>Department</span>
              <span>Cases</span>
              <span>Status</span>
            </div>
            {officers.map((officer) => (
              <article className="admin-table-row" key={officer.name} role="row">
                <span>
                  <strong>{officer.name}</strong>
                  <small>{officer.role} - {officer.lastSeen}</small>
                </span>
                <span>{officer.department}</span>
                <span>{officer.activeCases}</span>
                <StatusBadge label={officer.status} />
              </article>
            ))}
          </div>
        </div>

        <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Category routing</strong>
            <span>SLA ownership</span>
          </div>
          <div className="admin-route-list">
            {departmentRoutes.map((route) => (
              <article key={route.category}>
                <div>
                  <strong>{route.category}</strong>
                  <span>{route.department} - {route.owner}</span>
                </div>
                <StatusBadge label={route.sla} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ReportsAdministrationPage() {
  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button className="button button-secondary" type="button">Schedule report</button>
            <button className="button button-primary" type="button">Download CSV</button>
          </>
        }
        description="Review SLA pressure, department throughput, and audit-ready performance summaries."
        eyebrow="Reporting"
        title="SLA, workload, and audit reports"
      />

      <div className="admin-report-grid">
        {reportRows.map((row) => (
          <article key={row.metric}>
            <span>{row.metric}</span>
            <strong>{row.current}</strong>
            <small>Previous: {row.previous}</small>
            <StatusBadge label={row.trend} />
          </article>
        ))}
      </div>

      <div className="admin-two-column">
        <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Department performance</strong>
            <span>This week</span>
          </div>
          <div className="admin-table admin-performance-table" role="table" aria-label="Department performance">
            <div className="admin-table-row admin-table-head" role="row">
              <span>Department</span>
              <span>Open</span>
              <span>Resolved</span>
              <span>Risk</span>
            </div>
            {departmentPerformance.map((department) => (
              <article className="admin-table-row" key={department.department} role="row">
                <span><strong>{department.department}</strong></span>
                <span>{department.open}</span>
                <span>{department.resolved}</span>
                <StatusBadge label={department.risk} />
              </article>
            ))}
          </div>
        </div>

        <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>SLA distribution</strong>
            <span>Open complaints</span>
          </div>
          <div className="admin-progress-list">
            <article>
              <span>On track</span>
              <strong>67%</strong>
              <meter min="0" max="100" value="67">67%</meter>
            </article>
            <article>
              <span>Due within 24h</span>
              <strong>21%</strong>
              <meter min="0" max="100" value="21">21%</meter>
            </article>
            <article>
              <span>Overdue</span>
              <strong>12%</strong>
              <meter min="0" max="100" value="12">12%</meter>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ContentAdministrationPage() {
  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button className="button button-secondary" type="button">Preview public site</button>
            <button className="button button-primary" type="button">New notice</button>
          </>
        }
        description="Publish public notices, update service guidance, and keep internal response material current."
        eyebrow="Content administration"
        title="Public notices and service guidance"
      />

      <div className="admin-two-column admin-two-column-wide">
        <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Content queue</strong>
            <span>{contentItems.length} items</span>
          </div>
          <div className="admin-table admin-content-table" role="table" aria-label="Content queue">
            <div className="admin-table-row admin-table-head" role="row">
              <span>Title</span>
              <span>Type</span>
              <span>Status</span>
              <span>Updated</span>
            </div>
            {contentItems.map((item) => (
              <article className="admin-table-row" key={item.title} role="row">
                <span><strong>{item.title}</strong></span>
                <span>{item.type}</span>
                <StatusBadge label={item.status} />
                <span>{item.updated}</span>
              </article>
            ))}
          </div>
        </div>

        <aside className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Draft composer</strong>
            <span>Internal preview</span>
          </div>
          <div className="admin-form-preview">
            <label>
              Content type
              <select defaultValue="notice">
                <option value="notice">Public notice</option>
                <option value="guide">Service guide</option>
                <option value="knowledge">Knowledge base</option>
              </select>
            </label>
            <label>
              Title
              <input defaultValue="Road maintenance notice" />
            </label>
            <label>
              Summary
              <textarea defaultValue="Short public message for affected wards and expected service dates." />
            </label>
            <button className="button button-primary" type="button">Save draft</button>
          </div>
        </aside>
      </div>
    </section>
  )
}

export function CommunicationAdministrationPage() {
  return (
    <section className="admin-section-panel">
      <AdminPageHeader
        actions={
          <>
            <button className="button button-secondary" type="button">Sync delivery status</button>
            <button className="button button-primary" type="button">Send update</button>
          </>
        }
        description="Manage SMS templates and delivery review through Supabase Edge Functions only."
        eyebrow="Communication"
        title="SMS updates and delivery review"
      />

      <div className="admin-two-column">
        <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Approved templates</strong>
            <span>Text.lk</span>
          </div>
          <div className="admin-route-list">
            {smsTemplates.map((template) => (
              <article key={template.name}>
                <div>
                  <strong>{template.name}</strong>
                  <span>{template.trigger} - {template.language}</span>
                </div>
                <StatusBadge label={template.status} />
              </article>
            ))}
          </div>
        </div>

        <div className="admin-data-panel">
          <div className="admin-panel-heading">
            <strong>Manual citizen update</strong>
            <span>Requires complaint reference</span>
          </div>
          <div className="admin-form-preview">
            <label>
              Complaint reference
              <input defaultValue="PS-2026-0001" />
            </label>
            <label>
              Recipient phone
              <input defaultValue="+94 77 000 0000" />
            </label>
            <label>
              Message
              <textarea defaultValue="Your complaint has been assigned to the Public Health team for review." />
            </label>
          </div>
        </div>
      </div>

      <div className="admin-data-panel">
        <div className="admin-panel-heading">
          <strong>Delivery log</strong>
          <span>Latest messages</span>
        </div>
        <div className="admin-table admin-sms-table" role="table" aria-label="SMS delivery log">
          <div className="admin-table-row admin-table-head" role="row">
            <span>Reference</span>
            <span>Recipient</span>
            <span>Status</span>
            <span>Time</span>
          </div>
          {smsLogs.map((log) => (
            <article className="admin-table-row" key={`${log.reference}-${log.time}`} role="row">
              <span><strong>{log.reference}</strong></span>
              <span>{log.recipient}</span>
              <StatusBadge label={log.status} />
              <span>{log.time}</span>
            </article>
          ))}
        </div>
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
