-- Migration 001: Path Finders LMS Core Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- ACC, ECON, ICT, BS
    name TEXT NOT NULL,        -- e.g. Accounting, Economics, ICT, Business Studies
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subject Combinations Table
CREATE TABLE IF NOT EXISTS public.subject_combinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- COMB_1_ICT, COMB_2_BS
    name TEXT NOT NULL,        -- Combination 1 (ACC, ECON, ICT) or Combination 2 (ACC, ECON, BS)
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Combination Subjects Join Table
CREATE TABLE IF NOT EXISTS public.combination_subjects (
    combination_id UUID REFERENCES public.subject_combinations(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (combination_id, subject_id)
);

-- 4. Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    student_id TEXT UNIQUE NOT NULL, -- e.g. PF-2026-001
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    school TEXT,
    al_year INTEGER DEFAULT 2026,
    combination_id UUID REFERENCES public.subject_combinations(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Roles Table (Admin Permissions Engine)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'academic_admin', 'content_admin')),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID REFERENCES public.profiles(id),
    UNIQUE(user_id, role)
);

-- 6. Monthly Assessments Table
CREATE TABLE IF NOT EXISTS public.monthly_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL, -- e.g. "January Assessment 01"
    year INTEGER NOT NULL DEFAULT 2026,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    assessment_number INTEGER NOT NULL CHECK (assessment_number IN (1, 2)),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    google_form_url TEXT,
    max_marks NUMERIC DEFAULT 100 CHECK (max_marks > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

-- 7. Monthly Marks Table
CREATE TABLE IF NOT EXISTS public.monthly_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES public.monthly_assessments(id) ON DELETE CASCADE,
    marks_obtained NUMERIC NOT NULL CHECK (marks_obtained >= 0 AND marks_obtained <= 100),
    grade TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id),
    UNIQUE(student_id, assessment_id)
);

-- 8. Term Examinations Table
CREATE TABLE IF NOT EXISTS public.term_examinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL, -- e.g. "2026 First Term Examination"
    year INTEGER NOT NULL DEFAULT 2026,
    term_number INTEGER NOT NULL CHECK (term_number BETWEEN 1 AND 4),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id),
    UNIQUE(year, term_number)
);

-- 9. Term Marks Table
CREATE TABLE IF NOT EXISTS public.term_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    term_exam_id UUID NOT NULL REFERENCES public.term_examinations(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    marks_obtained NUMERIC NOT NULL CHECK (marks_obtained >= 0 AND marks_obtained <= 100),
    grade TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id),
    UNIQUE(student_id, term_exam_id, subject_id)
);

-- 10. Learning Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('notes', 'past_papers', 'model_papers', 'revision', 'other')),
    visibility TEXT NOT NULL DEFAULT 'combination' CHECK (visibility IN ('public', 'students', 'combination')),
    file_url TEXT NOT NULL,
    storage_provider TEXT DEFAULT 'supabase' CHECK (storage_provider IN ('supabase', 'gdrive')),
    file_size TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

-- 11. Audit Logs Table (Tracks mark edits and administrative changes)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    performed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for high-performance student lookups
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON public.profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_monthly_marks_student ON public.monthly_marks(student_id);
CREATE INDEX IF NOT EXISTS idx_term_marks_student ON public.term_marks(student_id);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON public.resources(subject_id);
