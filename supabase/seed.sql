-- Development staff accounts for local testing only.
-- Run with `supabase db reset` or execute manually against a non-production database.

insert into public.departments (id, name, description)
values
  ('10000000-0000-0000-0000-000000000001', 'Secretariat', 'Platform administration and citizen service coordination.'),
  ('10000000-0000-0000-0000-000000000002', 'Public Health', 'Drainage, sanitation, waste, and public health complaints.'),
  ('10000000-0000-0000-0000-000000000003', 'Roads', 'Road damage, access, and maintenance complaints.'),
  ('10000000-0000-0000-0000-000000000004', 'Electrical', 'Street lighting and electrical maintenance complaints.'),
  ('10000000-0000-0000-0000-000000000005', 'Public Relations', 'Public notices, service guidance, and citizen communication.')
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description;

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'super.admin@complaint.local',
    crypt('SuperAdmin#2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"S. Super Admin"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'main.admin@complaint.local',
    crypt('MainAdmin#2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"M. Main Admin"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000003',
    'authenticated',
    'authenticated',
    'management.viewer@complaint.local',
    crypt('Management#2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"V. Management Viewer"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000004',
    'authenticated',
    'authenticated',
    'department.head@complaint.local',
    crypt('DeptHead#2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"D. Department Head"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000005',
    'authenticated',
    'authenticated',
    'officer@complaint.local',
    crypt('Officer#2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"O. Case Officer"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000006',
    'authenticated',
    'authenticated',
    'field.officer@complaint.local',
    crypt('FieldOfficer#2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"F. Field Officer"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000007',
    'authenticated',
    'authenticated',
    'content.admin@complaint.local',
    crypt('ContentAdmin#2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"C. Content Admin"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000008',
    'authenticated',
    'authenticated',
    'knowledge.admin@complaint.local',
    crypt('KnowledgeAdmin#2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"K. Knowledge Admin"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000009',
    'authenticated',
    'authenticated',
    'viewer@complaint.local',
    crypt('Viewer#2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"R. Read Only Viewer"}',
    now(),
    now()
  )
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '20000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '{"sub":"20000000-0000-0000-0000-000000000001","email":"super.admin@complaint.local"}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    '{"sub":"20000000-0000-0000-0000-000000000002","email":"main.admin@complaint.local"}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000003',
    '{"sub":"20000000-0000-0000-0000-000000000003","email":"management.viewer@complaint.local"}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000004',
    '{"sub":"20000000-0000-0000-0000-000000000004","email":"department.head@complaint.local"}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000005',
    '{"sub":"20000000-0000-0000-0000-000000000005","email":"officer@complaint.local"}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    '20000000-0000-0000-0000-000000000006',
    '20000000-0000-0000-0000-000000000006',
    '{"sub":"20000000-0000-0000-0000-000000000006","email":"field.officer@complaint.local"}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000007',
    '20000000-0000-0000-0000-000000000007',
    '20000000-0000-0000-0000-000000000007',
    '{"sub":"20000000-0000-0000-0000-000000000007","email":"content.admin@complaint.local"}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000008',
    '20000000-0000-0000-0000-000000000008',
    '20000000-0000-0000-0000-000000000008',
    '{"sub":"20000000-0000-0000-0000-000000000008","email":"knowledge.admin@complaint.local"}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000009',
    '20000000-0000-0000-0000-000000000009',
    '20000000-0000-0000-0000-000000000009',
    '{"sub":"20000000-0000-0000-0000-000000000009","email":"viewer@complaint.local"}',
    'email',
    now(),
    now(),
    now()
  )
on conflict (provider, provider_id) do update
set
  identity_data = excluded.identity_data,
  updated_at = now();

update auth.users
set
  confirmation_token = '',
  recovery_token = '',
  email_change_token_new = '',
  email_change = '',
  is_sso_user = false,
  is_anonymous = false,
  updated_at = now()
where email like '%@complaint.local';

update auth.identities
set
  identity_data = identity_data || '{"email_verified": true, "phone_verified": false}'::jsonb,
  updated_at = now()
where identity_data->>'email' like '%@complaint.local';

insert into public.profiles (id, full_name, role, department_id, is_active)
values
  ('20000000-0000-0000-0000-000000000001', 'S. Super Admin', 'super_admin', '10000000-0000-0000-0000-000000000001', true),
  ('20000000-0000-0000-0000-000000000002', 'M. Main Admin', 'main_admin', '10000000-0000-0000-0000-000000000001', true),
  ('20000000-0000-0000-0000-000000000003', 'V. Management Viewer', 'management_viewer', '10000000-0000-0000-0000-000000000001', true),
  ('20000000-0000-0000-0000-000000000004', 'D. Department Head', 'department_head', '10000000-0000-0000-0000-000000000003', true),
  ('20000000-0000-0000-0000-000000000005', 'O. Case Officer', 'officer', '10000000-0000-0000-0000-000000000002', true),
  ('20000000-0000-0000-0000-000000000006', 'F. Field Officer', 'field_officer', '10000000-0000-0000-0000-000000000002', true),
  ('20000000-0000-0000-0000-000000000007', 'C. Content Admin', 'content_admin', '10000000-0000-0000-0000-000000000005', true),
  ('20000000-0000-0000-0000-000000000008', 'K. Knowledge Admin', 'knowledge_admin', '10000000-0000-0000-0000-000000000005', true),
  ('20000000-0000-0000-0000-000000000009', 'R. Read Only Viewer', 'viewer', '10000000-0000-0000-0000-000000000001', true)
on conflict (id) do update
set
  full_name = excluded.full_name,
  role = excluded.role,
  department_id = excluded.department_id,
  is_active = excluded.is_active;
