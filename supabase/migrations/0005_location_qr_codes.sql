alter table public.locations
add column if not exists qr_payload text,
add column if not exists qr_code_data_url text;
