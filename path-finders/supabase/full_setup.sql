-- ========================================================
-- PATH FINDERS LMS — COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- Copy and paste this ENTIRE script into your Supabase SQL Editor and click RUN.
-- ========================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('student', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.admin_role AS ENUM ('super_admin', 'academic_admin', 'content_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABLES

-- Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT UNIQUE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true
);

-- Subject Combinations Table
CREATE TABLE IF NOT EXISTS public.subject_combinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
);

-- Combination Subjects Join Table
CREATE TABLE IF NOT EXISTS public.combination_subjects (
    combination_id UUID REFERENCES public.subject_combinations(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (combination_id, subject_id)
);

-- Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    student_id TEXT UNIQUE,
    email TEXT,
    school TEXT,
    al_batch INTEGER,
    role public.user_role NOT NULL DEFAULT 'student',
    combination_id UUID REFERENCES public.subject_combinations(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    assessment_date DATE,
    academic_year INTEGER,
    month_number INTEGER,
    sequence_number INTEGER,
    subject_id UUID REFERENCES public.subjects(id),
    form_url TEXT,
    max_mark NUMERIC(6,2) DEFAULT 100.00,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assessment Results Table
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mark NUMERIC(6,2) CHECK (mark >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (assessment_id, student_id)
);

-- Examinations Table
CREATE TABLE IF NOT EXISTS public.examinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    academic_year INTEGER NOT NULL,
    term_number INTEGER NOT NULL,
    exam_date DATE,
    active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (academic_year, term_number)
);

-- Examination Results Table
CREATE TABLE IF NOT EXISTS public.examination_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    examination_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id),
    mark NUMERIC(6,2) CHECK (mark >= 0),
    grade TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (examination_id, student_id, subject_id)
);

-- Resource Categories Table
CREATE TABLE IF NOT EXISTS public.resource_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

-- Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES public.subjects(id),
    category_id UUID REFERENCES public.resource_categories(id),
    visibility TEXT NOT NULL CHECK (visibility IN ('public','students','combination','subject')) DEFAULT 'students',
    combination_id UUID REFERENCES public.subject_combinations(id),
    file_path TEXT,
    file_url TEXT,
    archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin Roles Table
CREATE TABLE IF NOT EXISTS public.admin_roles (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    admin_role public.admin_role NOT NULL
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    previous_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 3. SEED DATA

-- Subjects
INSERT INTO public.subjects (id, code, name) VALUES
('11111111-1111-1111-1111-111111111111', 'ACC', 'Accounting'),
('22222222-2222-2222-2222-222222222222', 'ECO', 'Economics'),
('33333333-3333-3333-3333-333333333333', 'ICT', 'ICT'),
('44444444-4444-4444-4444-444444444444', 'BS', 'Business Studies')
ON CONFLICT (code) DO NOTHING;

-- Subject Combinations
INSERT INTO public.subject_combinations (id, code, name) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'commerce_ict', 'Accounting + Economics + ICT'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'commerce_bs', 'Accounting + Economics + Business Studies')
ON CONFLICT (code) DO NOTHING;

-- Map Combination Subjects
INSERT INTO public.combination_subjects (combination_id, subject_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444')
ON CONFLICT DO NOTHING;

-- Resource Categories
INSERT INTO public.resource_categories (name) VALUES 
('Notes'), ('Past Papers'), ('Model Papers'), ('Revision Materials'), ('Other Documents')
ON CONFLICT (name) DO NOTHING;

-- Default 2026 Examinations
INSERT INTO public.examinations (id, name, academic_year, term_number) VALUES
('c1111111-1111-1111-1111-111111111111', 'Term 01 Examination', 2026, 1),
('c2222222-2222-2222-2222-222222222222', 'Term 02 Examination', 2026, 2),
('c3333333-3333-3333-3333-333333333333', 'Term 03 Examination', 2026, 3),
('c4444444-4444-4444-4444-444444444444', 'Term 04 Examination', 2026, 4)
ON CONFLICT (academic_year, term_number) DO NOTHING;


-- 4. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combination_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examination_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Security Helper Function: Check Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS(SELECT 1 FROM public.admin_roles ar WHERE ar.profile_id = auth.uid());
$$;

-- Profiles Policies
DROP POLICY IF EXISTS "students read own profile" ON public.profiles;
CREATE POLICY "students read own profile" ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "users insert own profile" ON public.profiles;
CREATE POLICY "users insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "students update allowed profile fields" ON public.profiles;
CREATE POLICY "students update allowed profile fields" ON public.profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "admins manage profiles" ON public.profiles;
CREATE POLICY "admins manage profiles" ON public.profiles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Read-only Public Lookups
DROP POLICY IF EXISTS "subjects readable" ON public.subjects;
CREATE POLICY "subjects readable" ON public.subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "combinations readable" ON public.subject_combinations;
CREATE POLICY "combinations readable" ON public.subject_combinations FOR SELECT USING (true);

DROP POLICY IF EXISTS "combination subjects readable" ON public.combination_subjects;
CREATE POLICY "combination subjects readable" ON public.combination_subjects FOR SELECT USING (true);

-- Assessments & Results
DROP POLICY IF EXISTS "assessments readable to signed in users" ON public.assessments;
CREATE POLICY "assessments readable to signed in users" ON public.assessments FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admins manage assessments" ON public.assessments;
CREATE POLICY "admins manage assessments" ON public.assessments FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "own assessment results" ON public.assessment_results;
CREATE POLICY "own assessment results" ON public.assessment_results FOR SELECT USING (student_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "admins write assessment results" ON public.assessment_results;
CREATE POLICY "admins write assessment results" ON public.assessment_results FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Exams & Results
DROP POLICY IF EXISTS "exams readable" ON public.examinations;
CREATE POLICY "exams readable" ON public.examinations FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "own exam results" ON public.examination_results;
CREATE POLICY "own exam results" ON public.examination_results FOR SELECT USING (student_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "admins write exam results" ON public.examination_results;
CREATE POLICY "admins write exam results" ON public.examination_results FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Resources
DROP POLICY IF EXISTS "public resources readable" ON public.resources;
CREATE POLICY "public resources readable" ON public.resources FOR SELECT USING (
  (visibility = 'public' AND archived = false)
  OR (auth.role() = 'authenticated' AND archived = false)
  OR public.is_admin()
);

DROP POLICY IF EXISTS "resource categories readable" ON public.resource_categories;
CREATE POLICY "resource categories readable" ON public.resource_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "admins manage resources" ON public.resources;
CREATE POLICY "admins manage resources" ON public.resources FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Admin Roles & Audit Logs
DROP POLICY IF EXISTS "admins read admin roles" ON public.admin_roles;
CREATE POLICY "admins read admin roles" ON public.admin_roles FOR SELECT USING (profile_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "super admins manage roles" ON public.admin_roles;
CREATE POLICY "super admins manage roles" ON public.admin_roles FOR ALL USING (
  EXISTS(SELECT 1 FROM public.admin_roles ar WHERE ar.profile_id = auth.uid() AND ar.admin_role = 'super_admin')
);

DROP POLICY IF EXISTS "admins read audit logs" ON public.audit_logs;
CREATE POLICY "admins read audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "admins insert audit logs" ON public.audit_logs;
CREATE POLICY "admins insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (public.is_admin());
