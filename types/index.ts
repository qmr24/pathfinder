export interface Profile {
  id: string;
  full_name: string;
  student_id: string;
  email: string;
  phone_number?: string | null;
  school?: string | null;
  al_year: number;
  combination_id?: string | null;
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
  updated_at: string;
  combination?: SubjectCombination | null;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'super_admin' | 'academic_admin' | 'content_admin';
  granted_at: string;
  granted_by?: string | null;
}

export interface Subject {
  id: string;
  code: string; // ACC, ECON, ICT, BS
  name: string;
  description?: string | null;
}

export interface SubjectCombination {
  id: string;
  code: string; // COMB_1_ICT, COMB_2_BS
  name: string;
  description?: string | null;
  subjects?: Subject[];
}

export interface MonthlyAssessment {
  id: string;
  title: string;
  year: number;
  month: number;
  assessment_number: number; // 1 or 2
  subject_id: string;
  google_form_url?: string | null;
  max_marks: number;
  created_at: string;
  created_by?: string | null;
  subject?: Subject;
}

export interface MonthlyMark {
  id: string;
  student_id: string;
  assessment_id: string;
  marks_obtained: number;
  grade?: string | null;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
  updated_by?: string | null;
  assessment?: MonthlyAssessment;
}

export interface TermExamination {
  id: string;
  title: string;
  year: number;
  term_number: number; // 1, 2, 3, 4
  created_at: string;
}

export interface TermMark {
  id: string;
  student_id: string;
  term_exam_id: string;
  subject_id: string;
  marks_obtained: number;
  grade?: string | null;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
  updated_by?: string | null;
  term_exam?: TermExamination;
  subject?: Subject;
}

export interface Resource {
  id: string;
  title: string;
  description?: string | null;
  subject_id: string;
  category: 'notes' | 'past_papers' | 'model_papers' | 'revision' | 'other';
  visibility: 'public' | 'students' | 'combination';
  file_url: string;
  storage_provider: 'supabase' | 'gdrive';
  file_size?: string | null;
  created_at: string;
  created_by?: string | null;
  subject?: Subject;
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_data?: Record<string, any> | null;
  new_data?: Record<string, any> | null;
  performed_by?: string | null;
  created_at: string;
  performer_profile?: Profile;
}
