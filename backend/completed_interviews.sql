-- Table for Completed Curated (Preset) Interviews
-- Stores data for SDE, DevOps, and Behavioral interviews from the preset list.
create table public.completed_curated_interviews (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  curated_interview_id uuid null, -- ID from sde_interviews/devops_interviews
  type text not null, -- 'sde', 'devops', 'behavioral'
  title text not null, -- Snapshot of the interview title
  company text null,
  transcript jsonb null, -- Full chat history
  report_data jsonb null, -- AI generated report
  score integer null,
  duration_mins integer null,
  started_at timestamp with time zone null,
  completed_at timestamp with time zone not null default now(),
  constraint completed_curated_interviews_pkey primary key (id),
  constraint completed_curated_interviews_user_id_fkey foreign key (user_id) references profiles (id) on delete cascade
);

-- Table for Completed Custom Interviews
-- Stores data for interviews generated from a JD or custom context.
create table public.completed_custom_interviews (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  title text not null, -- System context from file input, formatted (only first letter capitalized)
  job_role text null,
  job_description text null, -- The custom JD
  transcript jsonb null,
  report_data jsonb null,
  score integer null,
  duration_mins integer null,
  started_at timestamp with time zone null,
  completed_at timestamp with time zone not null default now(),
  constraint completed_custom_interviews_pkey primary key (id),
  constraint completed_custom_interviews_user_id_fkey foreign key (user_id) references profiles (id) on delete cascade
);

-- Optional: Enable Row Level Security (RLS)
alter table public.completed_curated_interviews enable row level security;
alter table public.completed_custom_interviews enable row level security;

-- Policy: Users can see only their own completed interviews
create policy "Users can view their own completed curated interviews"
on public.completed_curated_interviews
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can view their own completed custom interviews"
on public.completed_custom_interviews
for select
to authenticated
using (auth.uid() = user_id);

-- Policy: Users can insert their own completed interviews (or service role only)
-- Usually insertion happens via backend, so service role bypasses RLS.
-- But if we allow client usage:
create policy "Users can insert their own completed curated interviews"
on public.completed_curated_interviews
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can insert their own completed custom interviews"
on public.completed_custom_interviews
for insert
to authenticated
with check (auth.uid() = user_id);
