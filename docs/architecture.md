# Project Architecture

The project follows a feature-first React TypeScript structure with Supabase as the serverless backend.
The aim is to keep civic workflows separated so no single file becomes the system.

## Frontend Layers

- `src/app` - application composition, providers, layouts, and route registration.
- `src/features/public-portal` - citizen complaint submission, tracking, feedback, QR-ready access.
- `src/features/admin-complaints` - officer complaint review, assignment, lifecycle updates, case files.
- `src/features/admin-dashboard` - operational overview and management summary surfaces.
- `src/features/communication` - SMS templates, SMS history, Text.lk function calls.
- `src/features/content` - notices, service information, FAQs, documents, future AI knowledge.
- `src/features/identity` - Supabase Auth, profiles, roles, department access, permission helpers.
- `src/features/locations` - wards, villages, GN divisions, map pins, QR location prefill.
- `src/features/reporting` - SLA, overdue views, analytics, audit review, exports.
- `src/features/settings` - master data and operational configuration.
- `src/entities` - domain models shared across features.
- `src/shared` - reusable UI, Supabase client, environment helpers, and shared config.

## Supabase Layers

- `supabase/migrations` - schema, indexes, RLS, policies, database functions, seed data.
- `supabase/functions` - secure server-side integrations. Text.lk SMS belongs here.
- Supabase Storage - complaint evidence, officer proof, public documents, and knowledge files.

## Boundary Rules

- Browser code can use the Supabase anon key only.
- Text.lk credentials and service-role operations stay inside Edge Functions.
- Public citizen submission must not require an account.
- Officer and admin workflows must use Supabase Auth and role-based access.
- Internal notes, audit logs, SMS logs, and private media are not public tracking data.
