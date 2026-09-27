-- Seed: Subjects
INSERT INTO public.subjects (id, code, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'ACC',  'Accounting',                          'G.C.E. A/L Accounting'),
('22222222-2222-2222-2222-222222222222', 'ECON', 'Economics',                           'G.C.E. A/L Economics'),
('33333333-3333-3333-3333-333333333333', 'ICT',  'Information & Communication Technology', 'G.C.E. A/L ICT'),
('44444444-4444-4444-4444-444444444444', 'BS',   'Business Studies',                    'G.C.E. A/L Business Studies')
ON CONFLICT (code) DO NOTHING;

-- Seed: Term Examinations for 2026
INSERT INTO public.term_examinations (id, title, year, term_number) VALUES
('c1111111-1111-1111-1111-111111111111', '2026 First Term Examination',  2026, 1),
('c2222222-2222-2222-2222-222222222222', '2026 Second Term Examination', 2026, 2),
('c3333333-3333-3333-3333-333333333333', '2026 Third Term Examination',  2026, 3),
('c4444444-4444-4444-4444-444444444444', '2026 Fourth Term Examination', 2026, 4)
ON CONFLICT (year, term_number) DO NOTHING;
