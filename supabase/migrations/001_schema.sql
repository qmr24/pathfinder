-- Pathfinder Simplified Schema
-- No auth, no combinations, no admin panel
-- Admin enters data directly via Supabase dashboard

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Subjects
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,   -- ACC, ECON, ICT, BS
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Students (identified by NIC — no login needed)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    nic TEXT UNIQUE NOT NULL,    -- NIC used to look up marks
    school TEXT,
    al_year INTEGER DEFAULT 2026,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Term Examinations
CREATE TABLE IF NOT EXISTS public.term_examinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    year INTEGER NOT NULL DEFAULT 2026,
    term_number INTEGER NOT NULL CHECK (term_number BETWEEN 1 AND 4),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(year, term_number)
);

-- 4. Monthly Assessments
CREATE TABLE IF NOT EXISTS public.monthly_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    year INTEGER NOT NULL DEFAULT 2026,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    assessment_number INTEGER NOT NULL CHECK (assessment_number IN (1, 2)),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    max_marks NUMERIC DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Monthly Marks
CREATE TABLE IF NOT EXISTS public.monthly_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES public.monthly_assessments(id) ON DELETE CASCADE,
    marks_obtained NUMERIC NOT NULL CHECK (marks_obtained >= 0 AND marks_obtained <= 100),
    grade TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, assessment_id)
);

-- 6. Term Marks
CREATE TABLE IF NOT EXISTS public.term_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    term_exam_id UUID NOT NULL REFERENCES public.term_examinations(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    marks_obtained NUMERIC NOT NULL CHECK (marks_obtained >= 0 AND marks_obtained <= 100),
    grade TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, term_exam_id, subject_id)
);

-- 7. Resources (publicly accessible)
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('notes', 'past_papers', 'model_papers', 'revision', 'other')),
    file_url TEXT NOT NULL,
    file_size TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast NIC lookup
CREATE INDEX IF NOT EXISTS idx_students_nic ON public.students(nic);
CREATE INDEX IF NOT EXISTS idx_monthly_marks_student ON public.monthly_marks(student_id);
CREATE INDEX IF NOT EXISTS idx_term_marks_student ON public.term_marks(student_id);
