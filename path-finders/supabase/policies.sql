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
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.admin_roles ar where ar.profile_id=auth.uid());
$$;

create policy "students read own profile" on public.profiles for select using (id=auth.uid() or public.is_admin());
create policy "students update allowed profile fields" on public.profiles for update using (id=auth.uid()) with check (id=auth.uid());
create policy "admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "subjects readable" on public.subjects for select using (true);
create policy "combinations readable" on public.subject_combinations for select using (true);
create policy "combination subjects readable" on public.combination_subjects for select using (true);

create policy "assessments readable to signed in users" on public.assessments for select using (auth.role()='authenticated');
create policy "own assessment results" on public.assessment_results for select using (student_id=auth.uid() or public.is_admin());
create policy "admins write assessment results" on public.assessment_results for all using (public.is_admin()) with check (public.is_admin());

create policy "exams readable" on public.examinations for select using (auth.role()='authenticated');
create policy "own exam results" on public.examination_results for select using (student_id=auth.uid() or public.is_admin());
create policy "admins write exam results" on public.examination_results for all using (public.is_admin()) with check (public.is_admin());

create policy "public resources readable" on public.resources for select using (
  visibility='public' and archived=false
  or (auth.role()='authenticated' and archived=false)
  or public.is_admin()
);
create policy "resource categories readable" on public.resource_categories for select using (auth.role()='authenticated' or true);
create policy "admins manage resources" on public.resources for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage categories" on public.resource_categories for all using (public.is_admin()) with check (public.is_admin());

create policy "admins read admin roles" on public.admin_roles for select using (profile_id=auth.uid() or public.is_admin());
create policy "super admins manage roles" on public.admin_roles for all using (
  exists(select 1 from public.admin_roles ar where ar.profile_id=auth.uid() and ar.admin_role='super_admin')
) with check (
  exists(select 1 from public.admin_roles ar where ar.profile_id=auth.uid() and ar.admin_role='super_admin')
);

create policy "admins read audit logs" on public.audit_logs for select using (public.is_admin());
create policy "authenticated can read no audit logs" on public.audit_logs for insert with check (public.is_admin());
