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
  { label: 'Submit', href: '#submit' },
  { label: 'Track', href: '#track' },
  { label: 'Notices', href: '#notices' },
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
      description: 'Reference-based status lookup, resolved-case feedback, and reopening request flow.',
      owner: 'features/public-portal',
    },
    {
      title: 'Notices and service information',
      description: 'Tamil and English public content for categories, service updates, FAQs, and documents.',
      owner: 'features/content',
    },
  ],
  admin: [
    {
      title: 'Complaint operations',
      description: 'Review, categorise, assign, update, resolve, reopen, and close civic submissions.',
      owner: 'features/admin-complaints',
    },
    {
      title: 'Departments and officers',
      description: 'Role-based workflow across admins, department heads, officers, and management viewers.',
      owner: 'features/identity',
    },
    {
      title: 'SLA, reports, and audit',
      description: 'Overdue detection, management reports, export logs, and full action history.',
      owner: 'features/reporting',
    },
    {
      title: 'SMS communication',
      description: 'Text.lk messages are sent through Supabase Edge Functions, never from browser secrets.',
      owner: 'features/communication',
    },
  ],
} satisfies Record<'public' | 'admin', ModuleDefinition[]>
