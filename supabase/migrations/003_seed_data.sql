-- Migration 003: Path Finders Seed Data (Sri Lankan Commerce A/L)

-- Insert Subjects
INSERT INTO public.subjects (id, code, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'ACC', 'Accounting', 'Sri Lankan G.C.E. A/L Accounting Course'),
('22222222-2222-2222-2222-222222222222', 'ECON', 'Economics', 'Sri Lankan G.C.E. A/L Economics Course'),
('33333333-3333-3333-3333-333333333333', 'ICT', 'Information & Communication Technology', 'Sri Lankan G.C.E. A/L ICT Course'),
('44444444-4444-4444-4444-444444444444', 'BS', 'Business Studies', 'Sri Lankan G.C.E. A/L Business Studies Course')
ON CONFLICT (code) DO NOTHING;

-- Insert Subject Combinations
INSERT INTO public.subject_combinations (id, code, name, description) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'COMB_1_ICT', 'Combination 1 (Accounting + Economics + ICT)', 'Stream for students offering ICT as third subject'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'COMB_2_BS', 'Combination 2 (Accounting + Economics + Business Studies)', 'Stream for students offering Business Studies as third subject')
ON CONFLICT (code) DO NOTHING;

-- Link Combinations to Subjects
-- Combination 1: Accounting, Economics, ICT
INSERT INTO public.combination_subjects (combination_id, subject_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- Combination 2: Accounting, Economics, Business Studies
INSERT INTO public.combination_subjects (combination_id, subject_id) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444')
ON CONFLICT DO NOTHING;

-- Seed Term Examinations for 2026
INSERT INTO public.term_examinations (id, title, year, term_number) VALUES
('c1111111-1111-1111-1111-111111111111', '2026 First Term Examination', 2026, 1),
('c2222222-2222-2222-2222-222222222222', '2026 Second Term Examination', 2026, 2),
('c3333333-3333-3333-3333-333333333333', '2026 Third Term Examination', 2026, 3),
('c4444444-4444-4444-4444-444444444444', '2026 Fourth Term Examination', 2026, 4)
ON CONFLICT (year, term_number) DO NOTHING;
