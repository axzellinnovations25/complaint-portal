# Supabase Platform Layer

This folder owns backend-platform work for the complaint portal:

- `migrations/` keeps Postgres schema, RLS, functions, seed data, and indexes.
- `functions/` keeps Supabase Edge Functions such as secure Text.lk SMS calls.
- Storage buckets should be private by default for complaint evidence and officer proof.

The React app must never store Text.lk secrets or service-role keys.

## Development Staff Accounts

`seed.sql` creates local/demo staff accounts for every role. These credentials are for non-production
testing only.

| Role | Email | Password |
| --- | --- | --- |
| Super admin | `super.admin@complaint.local` | `SuperAdmin#2026!` |
| Main admin | `main.admin@complaint.local` | `MainAdmin#2026!` |
| Management viewer | `management.viewer@complaint.local` | `Management#2026!` |
| Department head | `department.head@complaint.local` | `DeptHead#2026!` |
| Officer | `officer@complaint.local` | `Officer#2026!` |
| Field officer | `field.officer@complaint.local` | `FieldOfficer#2026!` |
| Content admin | `content.admin@complaint.local` | `ContentAdmin#2026!` |
| Knowledge admin | `knowledge.admin@complaint.local` | `KnowledgeAdmin#2026!` |
| Viewer | `viewer@complaint.local` | `Viewer#2026!` |
