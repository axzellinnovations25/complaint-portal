create extension if not exists "pgcrypto";

create type public.complaint_status as enum (
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'assigned',
  'in_progress',
  'on_hold',
  'resolved',
  'reopened',
  'closed'
);

create type public.user_role as enum (
  'super_admin',
  'main_admin',
  'management_viewer',
  'department_head',
  'officer',
  'field_officer',
  'content_admin',
  'knowledge_admin',
  'viewer'
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'viewer',
  department_id uuid references public.departments(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.complaint_categories (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ta text not null,
  department_id uuid references public.departments(id),
  expected_sla_hours integer not null default 72,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  ward text,
  village text,
  gn_division text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz not null default now()
);

create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  reference_no text not null unique,
  title text not null,
  description text not null,
  status public.complaint_status not null default 'submitted',
  priority text not null default 'normal',
  category_id uuid references public.complaint_categories(id),
  location_id uuid references public.locations(id),
  department_id uuid references public.departments(id),
  assigned_officer_id uuid references public.profiles(id),
  contact_number text,
  public_status_note text,
  internal_note text,
  submitted_at timestamptz not null default now(),
  resolved_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.complaint_media (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  storage_path text not null,
  media_type text not null,
  uploaded_by uuid references public.profiles(id),
  is_public_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.complaint_events (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  event_type text not null,
  from_status public.complaint_status,
  to_status public.complaint_status,
  note text,
  created_at timestamptz not null default now()
);

create table public.sms_logs (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid references public.complaints(id) on delete set null,
  recipient text not null,
  message text not null,
  provider text not null default 'text_lk',
  status text not null default 'queued',
  provider_response jsonb,
  created_at timestamptz not null default now()
);

create table public.public_content (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  title_en text not null,
  title_ta text,
  body_en text not null,
  body_ta text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.complaint_categories enable row level security;
alter table public.locations enable row level security;
alter table public.complaints enable row level security;
alter table public.complaint_media enable row level security;
alter table public.complaint_events enable row level security;
alter table public.sms_logs enable row level security;
alter table public.public_content enable row level security;
