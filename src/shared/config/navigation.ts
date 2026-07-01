export type NavigationItem = {
  label: string
  href: string
}

export type ModuleDefinition = {
  title: string
  description: string
  owner: string
}

export const publicNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Submit', href: '/submit' },
  { label: 'Track', href: '/track' },
  { label: 'Notices', href: '/notices' },
]

export const systemModules = {
  public: [
    {
      title: 'Complaint submission',
      description: 'Anonymous or contact-number complaint intake with media evidence and reference numbers.',
      owner: 'features/public-portal',
    },
    {
      title: 'Tracking and feedback',
      description: 'Reference-based status lookup with clear complaint progress and next-step guidance.',
      owner: 'features/public-portal',
    },
    {
      title: 'Notices and service information',
      description: 'Public guidance for service categories, emergency boundaries, and useful report details.',
      owner: 'features/content',
    },
  ],
  admin: [
    {
      title: 'Complaint operations',
      description: 'Review, prioritise, assign, update, and resolve civic submissions from one queue.',
      owner: 'features/admin-complaints',
    },
    {
      title: 'Departments and officers',
      description: 'Role-based workflow across admins, department heads, officers, and management viewers.',
      owner: 'features/identity',
    },
    {
      title: 'Access, settings, and audit',
      description: 'Staff invitations, role governance, platform defaults, integration checks, and activity review.',
      owner: 'features/settings',
    },
    {
      title: 'Categories, SLA, and locations',
      description: 'Complaint taxonomy, department routing, SLA targets, location names, villages, and service zones.',
      owner: 'features/locations',
    },
    {
      title: 'SLA, reports, and audit',
      description: 'SLA risk indicators, workload summaries, exports, and performance visibility.',
      owner: 'features/reporting',
    },
    {
      title: 'SMS communication',
      description: 'Text.lk messages are sent through Supabase Edge Functions, never from browser secrets.',
      owner: 'features/communication',
    },
  ],
} satisfies Record<'public' | 'admin', ModuleDefinition[]>
