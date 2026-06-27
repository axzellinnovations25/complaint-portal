# Supabase Platform Layer

This folder owns backend-platform work for the complaint portal:

- `migrations/` keeps Postgres schema, RLS, functions, seed data, and indexes.
- `functions/` keeps Supabase Edge Functions such as secure Text.lk SMS calls.
- Storage buckets should be private by default for complaint evidence and officer proof.

The React app must never store Text.lk secrets or service-role keys.
