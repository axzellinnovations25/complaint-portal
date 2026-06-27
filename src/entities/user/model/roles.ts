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
