import { Profile, MonthlyMark, TermMark, Resource, MonthlyAssessment, TermExamination } from '@/types';

export const MOCK_STUDENT_PROFILE: Profile = {
  id: "student-123",
  full_name: "Kamal Perera",
  student_id: "PF-2026-089",
  email: "kamal.perera@student.lk",
  phone_number: "+94 77 123 4567",
  school: "Ananda College, Colombo",
  al_year: 2026,
  combination_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", // Combination 1: ACC, ECON, ICT
  status: "active",
  created_at: "2026-01-10T10:00:00Z",
  updated_at: "2026-01-10T10:00:00Z",
  combination: {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    code: "COMB_1_ICT",
    name: "Combination 1",
    description: "Accounting, Economics, ICT"
  }
};

export const MOCK_ADMIN_PROFILE: Profile = {
  id: "admin-999",
  full_name: "Dr. Nimal Senanayake",
  student_id: "PF-ADMIN-001",
  email: "admin@pathfinders.lk",
  phone_number: "+94 71 999 8888",
  school: "Path Finders Academy",
  al_year: 2026,
  status: "active",
  created_at: "2026-01-01T08:00:00Z",
  updated_at: "2026-01-01T08:00:00Z"
};

export const MOCK_MONTHLY_ASSESSMENTS: MonthlyAssessment[] = [
  { id: "m-jan-1", title: "January Assessment 01", year: 2026, month: 1, assessment_number: 1, subject_id: "11111111-1111-1111-1111-111111111111", google_form_url: "https://forms.google.com/sample1", max_marks: 100, created_at: "2026-01-05Z" },
  { id: "m-jan-2", title: "January Assessment 02", year: 2026, month: 1, assessment_number: 2, subject_id: "11111111-1111-1111-1111-111111111111", google_form_url: "https://forms.google.com/sample2", max_marks: 100, created_at: "2026-01-20Z" },
  { id: "m-feb-1", title: "February Assessment 01", year: 2026, month: 2, assessment_number: 1, subject_id: "22222222-2222-2222-2222-222222222222", google_form_url: "https://forms.google.com/sample3", max_marks: 100, created_at: "2026-02-05Z" },
  { id: "m-feb-2", title: "February Assessment 02", year: 2026, month: 2, assessment_number: 2, subject_id: "22222222-2222-2222-2222-222222222222", google_form_url: "https://forms.google.com/sample4", max_marks: 100, created_at: "2026-02-20Z" },
  { id: "m-mar-1", title: "March Assessment 01", year: 2026, month: 3, assessment_number: 1, subject_id: "33333333-3333-3333-3333-333333333333", google_form_url: "https://forms.google.com/sample5", max_marks: 100, created_at: "2026-03-05Z" },
  { id: "m-mar-2", title: "March Assessment 02", year: 2026, month: 3, assessment_number: 2, subject_id: "33333333-3333-3333-3333-333333333333", google_form_url: "https://forms.google.com/sample6", max_marks: 100, created_at: "2026-03-20Z" },
];

export const MOCK_MONTHLY_MARKS: (MonthlyMark & { monthName: string; subjectCode: string })[] = [
  { id: "mark-1", student_id: "student-123", assessment_id: "m-jan-1", marks_obtained: 78, grade: "A", monthName: "January", subjectCode: "ACC", created_at: "2026-01-15Z", updated_at: "2026-01-15Z" },
  { id: "mark-2", student_id: "student-123", assessment_id: "m-jan-2", marks_obtained: 84, grade: "A", monthName: "January", subjectCode: "ACC", created_at: "2026-01-25Z", updated_at: "2026-01-25Z" },
  { id: "mark-3", student_id: "student-123", assessment_id: "m-feb-1", marks_obtained: 82, grade: "A", monthName: "February", subjectCode: "ECON", created_at: "2026-02-15Z", updated_at: "2026-02-15Z" },
  { id: "mark-4", student_id: "student-123", assessment_id: "m-feb-2", marks_obtained: 88, grade: "A", monthName: "February", subjectCode: "ECON", created_at: "2026-02-25Z", updated_at: "2026-02-25Z" },
  { id: "mark-5", student_id: "student-123", assessment_id: "m-mar-1", marks_obtained: 91, grade: "A", monthName: "March", subjectCode: "ICT", created_at: "2026-03-15Z", updated_at: "2026-03-15Z" },
  { id: "mark-6", student_id: "student-123", assessment_id: "m-mar-2", marks_obtained: 86, grade: "A", monthName: "March", subjectCode: "ICT", created_at: "2026-03-25Z", updated_at: "2026-03-25Z" },
];

export const MOCK_TERM_EXAMS: TermExamination[] = [
  { id: "t1", title: "Term 01 Examination", year: 2026, term_number: 1, created_at: "2026-04-01Z" },
  { id: "t2", title: "Term 02 Examination", year: 2026, term_number: 2, created_at: "2026-07-01Z" },
  { id: "t3", title: "Term 03 Examination", year: 2026, term_number: 3, created_at: "2026-10-01Z" },
  { id: "t4", title: "Term 04 Examination", year: 2026, term_number: 4, created_at: "2026-12-01Z" },
];

export const MOCK_TERM_MARKS: TermMark[] = [
  { id: "tm-1", student_id: "student-123", term_exam_id: "t1", subject_id: "11111111-1111-1111-1111-111111111111", marks_obtained: 78, grade: "A", created_at: "2026-04-10Z", updated_at: "2026-04-10Z" },
  { id: "tm-2", student_id: "student-123", term_exam_id: "t1", subject_id: "22222222-2222-2222-2222-222222222222", marks_obtained: 81, grade: "A", created_at: "2026-04-10Z", updated_at: "2026-04-10Z" },
  { id: "tm-3", student_id: "student-123", term_exam_id: "t1", subject_id: "33333333-3333-3333-3333-333333333333", marks_obtained: 89, grade: "A", created_at: "2026-04-10Z", updated_at: "2026-04-10Z" },
  
  { id: "tm-4", student_id: "student-123", term_exam_id: "t2", subject_id: "11111111-1111-1111-1111-111111111111", marks_obtained: 82, grade: "A", created_at: "2026-07-10Z", updated_at: "2026-07-10Z" },
  { id: "tm-5", student_id: "student-123", term_exam_id: "t2", subject_id: "22222222-2222-2222-2222-222222222222", marks_obtained: 79, grade: "A", created_at: "2026-07-10Z", updated_at: "2026-07-10Z" },
  { id: "tm-6", student_id: "student-123", term_exam_id: "t2", subject_id: "33333333-3333-3333-3333-333333333333", marks_obtained: 91, grade: "A", created_at: "2026-07-10Z", updated_at: "2026-07-10Z" },

  { id: "tm-7", student_id: "student-123", term_exam_id: "t3", subject_id: "11111111-1111-1111-1111-111111111111", marks_obtained: 85, grade: "A", created_at: "2026-10-10Z", updated_at: "2026-10-10Z" },
  { id: "tm-8", student_id: "student-123", term_exam_id: "t3", subject_id: "22222222-2222-2222-2222-222222222222", marks_obtained: 87, grade: "A", created_at: "2026-10-10Z", updated_at: "2026-10-10Z" },
  { id: "tm-9", student_id: "student-123", term_exam_id: "t3", subject_id: "33333333-3333-3333-3333-333333333333", marks_obtained: 88, grade: "A", created_at: "2026-10-10Z", updated_at: "2026-10-10Z" },

  { id: "tm-10", student_id: "student-123", term_exam_id: "t4", subject_id: "11111111-1111-1111-1111-111111111111", marks_obtained: 88, grade: "A", created_at: "2026-12-10Z", updated_at: "2026-12-10Z" },
  { id: "tm-11", student_id: "student-123", term_exam_id: "t4", subject_id: "22222222-2222-2222-2222-222222222222", marks_obtained: 90, grade: "A", created_at: "2026-12-10Z", updated_at: "2026-12-10Z" },
  { id: "tm-12", student_id: "student-123", term_exam_id: "t4", subject_id: "33333333-3333-3333-3333-333333333333", marks_obtained: 93, grade: "A", created_at: "2026-12-10Z", updated_at: "2026-12-10Z" },
];

export const MOCK_RESOURCES: Resource[] = [
  { id: "res-1", title: "Accounting Financial Statements Full Note 2026", description: "Comprehensive notes covering Company Accounting & Statements.", subject_id: "11111111-1111-1111-1111-111111111111", category: "notes", visibility: "combination", file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", storage_provider: "supabase", file_size: "2.4 MB", created_at: "2026-01-12Z" },
  { id: "res-2", title: "2025 A/L Accounting Past Paper - English & Sinhala Medium", description: "Official G.C.E. A/L Accounting past paper with marking scheme.", subject_id: "11111111-1111-1111-1111-111111111111", category: "past_papers", visibility: "combination", file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", storage_provider: "gdrive", file_size: "4.1 MB", created_at: "2026-01-20Z" },
  { id: "res-3", title: "Economics Macroeconomics Theory & Diagrams", description: "In-depth revision note for Sri Lanka economy & macro balances.", subject_id: "22222222-2222-2222-2222-222222222222", category: "notes", visibility: "combination", file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", storage_provider: "supabase", file_size: "3.8 MB", created_at: "2026-02-01Z" },
  { id: "res-4", title: "2025 A/L Economics Model Paper & Solutions", description: "Target model paper with detailed answer key.", subject_id: "22222222-2222-2222-2222-222222222222", category: "model_papers", visibility: "public", file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", storage_provider: "supabase", file_size: "1.9 MB", created_at: "2026-02-15Z" },
  { id: "res-5", title: "A/L ICT Database Systems & SQL Guide", description: "Complete ERD, SQL query guide & past questions.", subject_id: "33333333-3333-3333-3333-333333333333", category: "notes", visibility: "combination", file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", storage_provider: "supabase", file_size: "5.2 MB", created_at: "2026-03-01Z" },
  { id: "res-6", title: "Business Studies Marketing Management Revision Pack", description: "Short revision notes and case study breakdown.", subject_id: "44444444-4444-4444-4444-444444444444", category: "revision", visibility: "public", file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", storage_provider: "gdrive", file_size: "2.1 MB", created_at: "2026-03-05Z" },
];
