-- Enable RLS everywhere sensitive data exists.
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.subject_combinations enable row level security;
alter table public.combination_subjects enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_results enable row level security;
alter table public.examinations enable row level security;
alter table public.examination_results enable row level security;
alter table public.resource_categories enable row level security;
alter table public.resources enable row level security;
alter table public.admin_roles enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_roles ar where ar.profile_id = auth.uid()
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_roles ar
    where ar.profile_id = auth.uid() and ar.admin_role = 'super_admin'
  );
$$;

-- Students can only read their own profile. Admins can read all profiles.
create policy "students read own profile"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

-- Students may update only safe profile fields. Role, student_id and
-- combination_id cannot be changed by students through this policy.
create policy "students update safe profile fields"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = 'student'
  and student_id = (select p.student_id from public.profiles p where p.id = auth.uid())
  and combination_id = (select p.combination_id from public.profiles p where p.id = auth.uid())
);

create policy "admins manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "subjects readable"
on public.subjects for select
using (true);

create policy "combinations readable"
on public.subject_combinations for select
using (true);

create policy "combination subjects readable"
on public.combination_subjects for select
using (true);

create policy "assessments readable to signed in users"
on public.assessments for select
to authenticated
using (active = true or public.is_admin());

create policy "own assessment results"
on public.assessment_results for select
to authenticated
using (student_id = auth.uid() or public.is_admin());

create policy "admins write assessment results"
on public.assessment_results for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "exams readable"
on public.examinations for select
to authenticated
using (active = true or public.is_admin());

create policy "own exam results"
on public.examination_results for select
to authenticated
using (student_id = auth.uid() or public.is_admin());

create policy "admins write exam results"
on public.examination_results for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Public resources are readable by everyone. Non-public resources require
-- authentication and are further filtered by the application according to
-- subject/combination visibility. Admins retain full access.
create policy "resources readable"
on public.resources for select
using (
  (visibility = 'public' and archived = false)
  or (auth.role() = 'authenticated' and archived = false)
  or public.is_admin()
);

create policy "resource categories readable"
on public.resource_categories for select
using (true);

create policy "admins manage resources"
on public.resources for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage categories"
on public.resource_categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins read admin roles"
on public.admin_roles for select
to authenticated
using (profile_id = auth.uid() or public.is_admin());

create policy "super admins manage roles"
on public.admin_roles for all
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "admins read audit logs"
on public.audit_logs for select
to authenticated
using (public.is_admin());

create policy "admins insert audit logs"
on public.audit_logs for insert
to authenticated
with check (public.is_admin());
