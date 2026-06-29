export const userRoles = [
  'super_admin',
  'main_admin',
  'management_viewer',
  'department_head',
  'officer',
  'field_officer',
  'content_admin',
  'knowledge_admin',
  'viewer',
] as const

export type UserRole = (typeof userRoles)[number]

export const userRoleLabels = {
  super_admin: 'Super admin',
  main_admin: 'Main admin',
  management_viewer: 'Management viewer',
  department_head: 'Department head',
  officer: 'Officer',
  field_officer: 'Field officer',
  content_admin: 'Content admin',
  knowledge_admin: 'Knowledge admin',
  viewer: 'Viewer',
} satisfies Record<UserRole, string>

export type AdminSectionId =
  | 'dashboard'
  | 'complaints'
  | 'departments'
  | 'users'
  | 'categories'
  | 'locations'
  | 'reports'
  | 'content'
  | 'communications'
  | 'settings'
  | 'audit'

export type AdminSectionDefinition = {
  id: AdminSectionId
  label: string
  href: string
  description: string
  allowedRoles: readonly UserRole[]
}

const allAdministrationRoles = [
  'super_admin',
  'main_admin',
  'management_viewer',
  'department_head',
  'officer',
  'field_officer',
  'content_admin',
  'knowledge_admin',
] as const satisfies readonly UserRole[]

export const adminSections = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    description: 'Workload, SLA pressure, and management summary.',
    allowedRoles: allAdministrationRoles,
  },
  {
    id: 'complaints',
    label: 'Complaints',
    href: '/admin/complaints',
    description: 'Review, assign, update, and resolve complaint cases.',
    allowedRoles: ['super_admin', 'main_admin', 'department_head', 'officer', 'field_officer'],
  },
  {
    id: 'departments',
    label: 'Departments and officers',
    href: '/admin/departments',
    description: 'Manage teams, officer access, and department ownership.',
    allowedRoles: ['super_admin', 'main_admin', 'department_head'],
  },
  {
    id: 'users',
    label: 'User access',
    href: '/admin/users',
    description: 'Invite staff, review roles, and suspend inactive accounts.',
    allowedRoles: ['super_admin', 'main_admin'],
  },
  {
    id: 'categories',
    label: 'Categories and SLA',
    href: '/admin/categories',
    description: 'Configure complaint categories, routing, and response targets.',
    allowedRoles: ['super_admin', 'main_admin', 'department_head'],
  },
  {
    id: 'locations',
    label: 'Locations',
    href: '/admin/locations',
    description: 'Maintain wards, GN divisions, villages, and service zones.',
    allowedRoles: ['super_admin', 'main_admin', 'department_head'],
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/admin/reports',
    description: 'SLA trends, department performance, and exports.',
    allowedRoles: ['super_admin', 'main_admin', 'management_viewer', 'department_head'],
  },
  {
    id: 'content',
    label: 'Public content',
    href: '/admin/content',
    description: 'Publish notices, service guidance, and knowledge articles.',
    allowedRoles: ['super_admin', 'main_admin', 'content_admin', 'knowledge_admin'],
  },
  {
    id: 'communications',
    label: 'SMS communication',
    href: '/admin/communications',
    description: 'Send status messages and review delivery logs.',
    allowedRoles: ['super_admin', 'main_admin', 'officer', 'content_admin'],
  },
  {
    id: 'settings',
    label: 'System settings',
    href: '/admin/settings',
    description: 'Reference formats, intake rules, SMS provider, and retention.',
    allowedRoles: ['super_admin', 'main_admin'],
  },
  {
    id: 'audit',
    label: 'Audit log',
    href: '/admin/audit',
    description: 'Track staff activity, permission changes, and case history.',
    allowedRoles: ['super_admin', 'main_admin', 'management_viewer'],
  },
] as const satisfies readonly AdminSectionDefinition[]

export function getAdminSectionsForRole(role: UserRole) {
  return adminSections.filter((section) => section.allowedRoles.some((allowedRole) => allowedRole === role))
}

export function canAccessAdminSection(role: UserRole, sectionId: AdminSectionId) {
  return adminSections.some(
    (section) => section.id === sectionId && section.allowedRoles.some((allowedRole) => allowedRole === role),
  )
}
