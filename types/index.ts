// Student profile — one row per student
export type Student = {
  id: string;
  full_name: string;
  nic: string;         // NIC number used to look up marks
  school: string | null;
  al_year: number;
  created_at: string;
};

// A subject (ACC, ECON, ICT, BS)
export type Subject = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};

// A term examination (e.g. 2026 First Term)
export type TermExamination = {
  id: string;
  title: string;
  year: number;
  term_number: number;
};

// A monthly assessment
export type MonthlyAssessment = {
  id: string;
  title: string;
  year: number;
  month: number;
  assessment_number: number;
  subject_id: string;
  max_marks: number;
};

// A student's mark for a monthly assessment
export type MonthlyMark = {
  id: string;
  student_id: string;
  assessment_id: string;
  marks_obtained: number;
  grade: string | null;
  // Joined fields from related tables
  assessment?: MonthlyAssessment;
  subject?: Subject;
};

// A student's mark for a term exam
export type TermMark = {
  id: string;
  student_id: string;
  term_exam_id: string;
  subject_id: string;
  marks_obtained: number;
  grade: string | null;
  // Joined fields from related tables
  term_exam?: TermExamination;
  subject?: Subject;
};

// A learning resource (notes, past papers etc.)
export type Resource = {
  id: string;
  title: string;
  description: string | null;
  subject_id: string;
  category: "notes" | "past_papers" | "model_papers" | "revision" | "other";
  file_url: string;
  file_size: string | null;
  created_at: string;
  subject?: Subject;
};
