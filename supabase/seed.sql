-- Development staff accounts for local testing only.
-- Run with `supabase db reset` or execute manually against a non-production database.

insert into public.departments (id, name, description, is_active)
values
  ('10000000-0000-0000-0000-000000000001', 'Secretariat', 'Platform administration and citizen service coordination.', true),
  ('10000000-0000-0000-0000-000000000002', 'Public Health', 'Drainage, sanitation, waste, and public health complaints.', true),
  ('10000000-0000-0000-0000-000000000003', 'Roads', 'Road damage, access, and maintenance complaints.', true),
  ('10000000-0000-0000-0000-000000000004', 'Electrical', 'Street lighting and electrical maintenance complaints.', true),
  ('10000000-0000-0000-0000-000000000005', 'Public Relations', 'Public notices, service guidance, and citizen communication.', true)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active;

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

insert into public.complaint_categories (id, name_en, name_ta, department_id, expected_sla_hours, is_active)
values
  ('30000000-0000-0000-0000-000000000001', 'Blocked drainage', 'Adaippatta vadikal', '10000000-0000-0000-0000-000000000002', 24, true),
  ('30000000-0000-0000-0000-000000000002', 'Waste collection', 'Kuppai segarippu', '10000000-0000-0000-0000-000000000002', 48, true),
  ('30000000-0000-0000-0000-000000000003', 'Road damage', 'Salai setham', '10000000-0000-0000-0000-000000000003', 72, true),
  ('30000000-0000-0000-0000-000000000004', 'Street lighting', 'Theru vilakku', '10000000-0000-0000-0000-000000000004', 48, true),
  ('30000000-0000-0000-0000-000000000005', 'Public notice request', 'Pothu arivippu vendukol', '10000000-0000-0000-0000-000000000005', 96, true),
  ('30000000-0000-0000-0000-000000000006', 'Illegal dumping', 'Anumathi illatha kuppai poduthal', '10000000-0000-0000-0000-000000000002', 24, true),
  ('30000000-0000-0000-0000-000000000007', 'Water stagnation', 'Thanneer nirkum nilai', '10000000-0000-0000-0000-000000000002', 24, true),
  ('30000000-0000-0000-0000-000000000008', 'Damaged footpath', 'Nadapathai setham', '10000000-0000-0000-0000-000000000003', 72, true)
on conflict (id) do update
set
  name_en = excluded.name_en,
  name_ta = excluded.name_ta,
  department_id = excluded.department_id,
  expected_sla_hours = excluded.expected_sla_hours,
  is_active = excluded.is_active;

insert into public.locations (id, ward, village, gn_division, latitude, longitude)
values
  ('40000000-0000-0000-0000-000000000001', 'Ward 01', 'Central Market', 'GN 101 - Town North', 7.8731, 80.7718),
  ('40000000-0000-0000-0000-000000000002', 'Ward 02', 'Library Junction', 'GN 102 - Town East', 7.8742, 80.7731),
  ('40000000-0000-0000-0000-000000000003', 'Ward 03', 'Lake Road', 'GN 103 - Lake Side', 7.8715, 80.7692),
  ('40000000-0000-0000-0000-000000000004', 'Ward 04', 'North Playground', 'GN 104 - North Field', 7.8789, 80.7754),
  ('40000000-0000-0000-0000-000000000005', 'Ward 05', 'Hospital Lane', 'GN 105 - South Gate', 7.8697, 80.7681),
  ('40000000-0000-0000-0000-000000000006', 'Ward 06', 'Bus Stand Road', 'GN 106 - Transit Zone', 7.8766, 80.7725)
on conflict (id) do update
set
  ward = excluded.ward,
  village = excluded.village,
  gn_division = excluded.gn_division,
  latitude = excluded.latitude,
  longitude = excluded.longitude;

insert into public.complaints (
  id,
  reference_no,
  title,
  description,
  status,
  priority,
  category_id,
  location_id,
  department_id,
  assigned_officer_id,
  contact_number,
  public_status_note,
  internal_note,
  submitted_at,
  resolved_at,
  closed_at,
  created_at,
  updated_at
)
values
  (
    '50000000-0000-0000-0000-000000000001',
    'CP-2026-0001',
    'Blocked drainage near central market',
    'Storm water drain beside the central market has been blocked for two days and water is entering nearby shops.',
    'in_progress',
    'urgent',
    '30000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000005',
    '+94771234567',
    'Public Health team has inspected the location and cleaning work is scheduled.',
    'Coordinate gully bowser and market road access before noon.',
    now() - interval '22 hours',
    null,
    null,
    now() - interval '22 hours',
    now() - interval '1 hour'
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'CP-2026-0002',
    'Street light not working at library junction',
    'The main street light at Library Junction has not worked for a week, making the crossing unsafe at night.',
    'assigned',
    'normal',
    '30000000-0000-0000-0000-000000000004',
    '40000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000006',
    '+94772345678',
    'Electrical maintenance has been assigned.',
    'Check lamp head and fuse carrier.',
    now() - interval '2 days',
    null,
    null,
    now() - interval '2 days',
    now() - interval '5 hours'
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    'CP-2026-0003',
    'Illegal waste dumping near north playground',
    'Mixed household waste has been dumped near the playground boundary and stray animals are spreading it.',
    'reopened',
    'high',
    '30000000-0000-0000-0000-000000000006',
    '40000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000005',
    '+94773456789',
    'The complaint has been reopened after citizen feedback.',
    'Previous cleanup was incomplete. Verify with field photo.',
    now() - interval '5 days',
    null,
    null,
    now() - interval '5 days',
    now() - interval '2 hours'
  ),
  (
    '50000000-0000-0000-0000-000000000004',
    'CP-2026-0004',
    'Potholes on bus stand road',
    'Several potholes on the road near the bus stand are affecting buses and three-wheelers during peak hours.',
    'under_review',
    'high',
    '30000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000003',
    null,
    '+94774567890',
    'Roads department is reviewing the complaint.',
    'Needs site measurement and temporary warning cones.',
    now() - interval '14 hours',
    null,
    null,
    now() - interval '14 hours',
    now() - interval '3 hours'
  ),
  (
    '50000000-0000-0000-0000-000000000005',
    'CP-2026-0005',
    'Water stagnation behind hospital lane',
    'Rain water has stagnated behind Hospital Lane and residents are concerned about mosquito breeding.',
    'resolved',
    'urgent',
    '30000000-0000-0000-0000-000000000007',
    '40000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000006',
    '+94775678901',
    'The stagnant water was cleared and larvicide treatment was completed.',
    'Resolved after field visit. Keep in weekly mosquito control review.',
    now() - interval '7 days',
    now() - interval '2 days',
    null,
    now() - interval '7 days',
    now() - interval '2 days'
  ),
  (
    '50000000-0000-0000-0000-000000000006',
    'CP-2026-0006',
    'Damaged footpath near lake road',
    'Footpath slabs are broken near Lake Road and pedestrians are stepping onto the main road.',
    'submitted',
    'normal',
    '30000000-0000-0000-0000-000000000008',
    '40000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    null,
    '+94776789012',
    'Complaint received and awaiting initial review.',
    null,
    now() - interval '3 hours',
    null,
    null,
    now() - interval '3 hours',
    now() - interval '3 hours'
  ),
  (
    '50000000-0000-0000-0000-000000000007',
    'CP-2026-0007',
    'Missed waste collection at Lake Road',
    'Household waste was not collected on the scheduled morning collection route.',
    'closed',
    'low',
    '30000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000005',
    '+94777890123',
    'Collection was completed and the case is closed.',
    'Route supervisor confirmed missed segment was collected.',
    now() - interval '12 days',
    now() - interval '10 days',
    now() - interval '9 days',
    now() - interval '12 days',
    now() - interval '9 days'
  ),
  (
    '50000000-0000-0000-0000-000000000008',
    'CP-2026-0008',
    'Public notice needed for road closure',
    'Residents request a clear public notice before the temporary road closure near the market repair work.',
    'accepted',
    'normal',
    '30000000-0000-0000-0000-000000000005',
    '40000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000007',
    '+94778901234',
    'Public Relations accepted the request and is preparing notice content.',
    'Coordinate closure dates with Roads before publishing.',
    now() - interval '1 day',
    null,
    null,
    now() - interval '1 day',
    now() - interval '6 hours'
  )
on conflict (reference_no) do update
set
  title = excluded.title,
  description = excluded.description,
  status = excluded.status,
  priority = excluded.priority,
  category_id = excluded.category_id,
  location_id = excluded.location_id,
  department_id = excluded.department_id,
  assigned_officer_id = excluded.assigned_officer_id,
  contact_number = excluded.contact_number,
  public_status_note = excluded.public_status_note,
  internal_note = excluded.internal_note,
  submitted_at = excluded.submitted_at,
  resolved_at = excluded.resolved_at,
  closed_at = excluded.closed_at,
  updated_at = excluded.updated_at;

insert into public.complaint_media (id, complaint_id, storage_path, media_type, uploaded_by, is_public_visible, created_at)
values
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'complaints/CP-2026-0001/drainage-before.jpg', 'image/jpeg', null, true, now() - interval '22 hours'),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000003', 'complaints/CP-2026-0003/dumping-site.jpg', 'image/jpeg', null, true, now() - interval '5 days'),
  ('60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000005', 'complaints/CP-2026-0005/field-proof.jpg', 'image/jpeg', '20000000-0000-0000-0000-000000000006', false, now() - interval '2 days')
on conflict (id) do update
set
  complaint_id = excluded.complaint_id,
  storage_path = excluded.storage_path,
  media_type = excluded.media_type,
  uploaded_by = excluded.uploaded_by,
  is_public_visible = excluded.is_public_visible,
  created_at = excluded.created_at;

insert into public.complaint_events (id, complaint_id, actor_id, event_type, from_status, to_status, note, created_at)
values
  ('70000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', null, 'submitted', null, 'submitted', 'Citizen submitted complaint through public portal.', now() - interval '22 hours'),
  ('70000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', 'status_update', 'submitted', 'in_progress', 'Assigned to Public Health cleaning team.', now() - interval '1 hour'),
  ('70000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', 'assignment', 'under_review', 'assigned', 'Assigned to field officer for lamp inspection.', now() - interval '5 hours'),
  ('70000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', 'reopened', 'resolved', 'reopened', 'Citizen reported waste remained after initial cleanup.', now() - interval '2 hours'),
  ('70000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000006', 'resolved', 'in_progress', 'resolved', 'Field team cleared stagnant water and uploaded proof.', now() - interval '2 days'),
  ('70000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000007', 'accepted', 'submitted', 'accepted', 'Public notice request accepted for content preparation.', now() - interval '6 hours')
on conflict (id) do update
set
  complaint_id = excluded.complaint_id,
  actor_id = excluded.actor_id,
  event_type = excluded.event_type,
  from_status = excluded.from_status,
  to_status = excluded.to_status,
  note = excluded.note,
  created_at = excluded.created_at;

insert into public.sms_logs (id, complaint_id, recipient, message, provider, status, provider_response, created_at)
values
  ('80000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '+94771234567', 'Your complaint CP-2026-0001 is in progress.', 'text_lk', 'delivered', '{"message_id":"demo-001","status":"delivered"}', now() - interval '1 hour'),
  ('80000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', '+94772345678', 'Your complaint CP-2026-0002 has been assigned.', 'text_lk', 'queued', '{"message_id":"demo-002","status":"queued"}', now() - interval '5 hours'),
  ('80000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000005', '+94775678901', 'Your complaint CP-2026-0005 has been resolved.', 'text_lk', 'delivered', '{"message_id":"demo-003","status":"delivered"}', now() - interval '2 days'),
  ('80000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000003', '+94773456789', 'Your complaint CP-2026-0003 has been reopened for review.', 'text_lk', 'failed', '{"message_id":"demo-004","status":"failed","error":"demo gateway timeout"}', now() - interval '2 hours')
on conflict (id) do update
set
  complaint_id = excluded.complaint_id,
  recipient = excluded.recipient,
  message = excluded.message,
  provider = excluded.provider,
  status = excluded.status,
  provider_response = excluded.provider_response,
  created_at = excluded.created_at;

insert into public.public_content (id, content_type, title_en, title_ta, body_en, body_ta, is_published, published_at, created_by, created_at)
values
  (
    '90000000-0000-0000-0000-000000000001',
    'notice',
    'Market road drainage cleaning schedule',
    null,
    'Public Health teams will clean the drainage line near Central Market between 8:00 AM and 12:00 PM. Please keep access clear.',
    null,
    true,
    now() - interval '1 day',
    '20000000-0000-0000-0000-000000000007',
    now() - interval '2 days'
  ),
  (
    '90000000-0000-0000-0000-000000000002',
    'service_guidance',
    'How to report road and footpath issues',
    null,
    'Include the nearest landmark, ward, and a clear photo when reporting road damage so officers can verify and schedule maintenance faster.',
    null,
    true,
    now() - interval '6 days',
    '20000000-0000-0000-0000-000000000008',
    now() - interval '7 days'
  ),
  (
    '90000000-0000-0000-0000-000000000003',
    'notice',
    'Temporary public notice draft for road closure',
    null,
    'Draft notice for upcoming market road repair closure. Pending confirmation of final dates from Roads department.',
    null,
    false,
    null,
    '20000000-0000-0000-0000-000000000007',
    now() - interval '6 hours'
  ),
  (
    '90000000-0000-0000-0000-000000000004',
    'service_guidance',
    'Waste collection complaint checklist',
    null,
    'When reporting missed collection, include collection day, street name, and whether mixed or recyclable waste was left uncollected.',
    null,
    true,
    now() - interval '10 days',
    '20000000-0000-0000-0000-000000000008',
    now() - interval '11 days'
  )
on conflict (id) do update
set
  content_type = excluded.content_type,
  title_en = excluded.title_en,
  title_ta = excluded.title_ta,
  body_en = excluded.body_en,
  body_ta = excluded.body_ta,
  is_published = excluded.is_published,
  published_at = excluded.published_at,
  created_by = excluded.created_by,
  created_at = excluded.created_at;
