export interface Lecture {
  id: string;
  title: string;
  description: string;
  pdf_url: string | null;
  order_index: number;
  created_at: string;
}

export interface Question {
  id: string;
  lecture_id: string;
  title: string;
  description: string;
  starter_code: string;
  order_index: number;
  created_at: string;
  question_type?: "coding" | "dry_run";
  code_sample?: string | null;
}

export interface Submission {
  id: string;
  user_id: string;
  question_id: string;
  code: string;
  output: string;
  status: "submitted" | "correct" | "incorrect";
  submitted_at: string;
  reviewed_at: string | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: "admin" | "student";
}

export interface StudentStats {
  total_questions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  not_attempted: number;
}
