create extension if not exists pgcrypto;

create type public.user_role as enum ('student','admin');
create type public.admin_role as enum ('super_admin','academic_admin','content_admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  student_id text unique,
  email text,
  school text,
  al_batch integer,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text unique not null,
  active boolean not null default true
);

create table public.subject_combinations (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null
);

create table public.combination_subjects (
  combination_id uuid references public.subject_combinations(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  primary key (combination_id, subject_id)
);

alter table public.profiles add column combination_id uuid references public.subject_combinations(id);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  assessment_date date,
  academic_year integer,
  month_number integer,
  sequence_number integer,
  subject_id uuid references public.subjects(id),
  form_url text,
  max_mark numeric(6,2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  mark numeric(6,2) check (mark >= 0),
  updated_at timestamptz not null default now(),
  unique (assessment_id, student_id)
);

create table public.examinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  academic_year integer not null,
  term_number integer not null,
  exam_date date,
  active boolean not null default true,
  unique (academic_year, term_number)
);

create table public.examination_results (
  id uuid primary key default gen_random_uuid(),
  examination_id uuid not null references public.examinations(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id),
  mark numeric(6,2) check (mark >= 0),
  grade text,
  updated_at timestamptz not null default now(),
  unique (examination_id, student_id, subject_id)
);

create table public.resource_categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  subject_id uuid references public.subjects(id),
  category_id uuid references public.resource_categories(id),
  visibility text not null check (visibility in ('public','students','combination','subject')) default 'students',
  combination_id uuid references public.subject_combinations(id),
  file_path text,
  file_url text,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.admin_roles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  admin_role public.admin_role not null
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);
