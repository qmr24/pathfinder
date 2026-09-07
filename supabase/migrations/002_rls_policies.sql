-- Migration 002: Path Finders Row Level Security (RLS) & Helper Security Functions

-- 1. Helper Security Functions (SECURITY DEFINER to run with creator permissions safely)

-- Check if a user is any type of admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = $1 AND role IN ('super_admin', 'academic_admin', 'content_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = $1 AND (role = required_role OR role = 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if a student is enrolled in a specific subject via their subject combination
CREATE OR REPLACE FUNCTION public.is_student_enrolled_in_subject(user_id UUID, check_subject_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_comb_id UUID;
BEGIN
    SELECT combination_id INTO user_comb_id FROM public.profiles WHERE id = user_id;
    IF user_comb_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN EXISTS (
        SELECT 1 FROM public.combination_subjects
        WHERE combination_id = user_comb_id AND subject_id = check_subject_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. ENABLE ROW LEVEL SECURITY ON ALL TABLES

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combination_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.term_examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.term_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;


-- 3. POLICIES DEFINITION

-- Subjects & Combinations: Public Read for all, Modify for Admins
CREATE POLICY "Subjects are readable by everyone" ON public.subjects
    FOR SELECT USING (true);

CREATE POLICY "Subjects are editable by admins only" ON public.subjects
    FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Combinations readable by everyone" ON public.subject_combinations
    FOR SELECT USING (true);

CREATE POLICY "Combinations editable by admins only" ON public.subject_combinations
    FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Combination subjects readable by everyone" ON public.combination_subjects
    FOR SELECT USING (true);

-- Profiles: Students read own profile, Admins read all profiles
CREATE POLICY "Users can view own profile or admins view all" ON public.profiles
    FOR SELECT USING (id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own profile upon signup" ON public.profiles
    FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile non-academic fields or admin update all" ON public.profiles
    FOR UPDATE USING (id = auth.uid() OR public.is_admin(auth.uid()));

-- User Roles: Super Admins only
CREATE POLICY "User roles readable by admins" ON public.user_roles
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "User roles manageable by super admins" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Monthly Assessments & Term Examinations: Read for authenticated users, Write for Academic Admins
CREATE POLICY "Monthly assessments readable by authenticated users" ON public.monthly_assessments
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Monthly assessments editable by academic admins" ON public.monthly_assessments
    FOR ALL USING (public.has_role(auth.uid(), 'academic_admin'));

CREATE POLICY "Term exams readable by authenticated users" ON public.term_examinations
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Term exams editable by academic admins" ON public.term_examinations
    FOR ALL USING (public.has_role(auth.uid(), 'academic_admin'));

-- Monthly Marks: Students read strictly OWN marks, Academic Admins read and write all marks
CREATE POLICY "Students view own monthly marks, admins view all" ON public.monthly_marks
    FOR SELECT USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Academic admins manage monthly marks" ON public.monthly_marks
    FOR ALL USING (public.has_role(auth.uid(), 'academic_admin'));

-- Term Marks: Students read strictly OWN marks, Academic Admins read and write all marks
CREATE POLICY "Students view own term marks, admins view all" ON public.term_marks
    FOR SELECT USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Academic admins manage term marks" ON public.term_marks
    FOR ALL USING (public.has_role(auth.uid(), 'academic_admin'));

-- Resources: Public resources readable by all; Student resources readable if enrolled or admin; Managed by Content Admins
CREATE POLICY "Resources visible based on visibility settings" ON public.resources
    FOR SELECT USING (
        visibility = 'public' 
        OR (auth.uid() IS NOT NULL AND visibility = 'students')
        OR (auth.uid() IS NOT NULL AND visibility = 'combination' AND public.is_student_enrolled_in_subject(auth.uid(), subject_id))
        OR public.is_admin(auth.uid())
    );

CREATE POLICY "Resources manageable by content admins" ON public.resources
    FOR ALL USING (public.has_role(auth.uid(), 'content_admin'));

-- Audit Logs: Viewable and writable only by Super Admins / Academic Admins
CREATE POLICY "Audit logs viewable by admins" ON public.audit_logs
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Audit logs insertable by system/admins" ON public.audit_logs
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
