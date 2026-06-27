# Smart Citizen Complaint Platform

React TypeScript frontend with Supabase as the serverless backend platform for a Pradeshiya Sabha
complaint and civic service management system.

## Architecture Goal

This project is intentionally not built as one long component file. It uses feature-first folders so the
public portal, officer workflow, SMS communication, reporting, content, identity, locations, and settings
can grow independently.

See [docs/architecture.md](docs/architecture.md) for the full folder boundary guide.

## Main Stack

- React TypeScript
- Vite
- Supabase Auth, Postgres, Storage, RLS, and Edge Functions
- Text.lk SMS through Supabase Edge Functions only

## Project Structure

```text
src/
  app/                 App composition, layouts, providers, route registry
  entities/            Shared domain models such as complaints and user roles
  features/            Product modules grouped by civic workflow
  shared/              Reusable UI, config, env, Supabase client
  styles/              Global styling
supabase/
  migrations/          Database schema, RLS, policies, indexes
  functions/           Secure Edge Functions such as Text.lk SMS
docs/
  architecture.md      Architecture notes and boundary rules
```

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Fill these values before using Supabase-backed screens:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Verification

```bash
npm run build
npm.cmd run lint
```
