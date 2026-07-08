// ─── User Types ──────────────────────────────────────────
export interface AcademicProfile {
  currentCgpa: number;
  targetCgpa: number;
  creditsEarned: number;
  totalCredits: number;
  currentSemester: number;
  predictedCgpa?: number;
  highestCgpa?: number;
  averageCgpa?: number;
  semesterGpas?: number[];
  hasActiveBacklogs?: boolean;
  subjects?: Array<{
    name: string;
    score: number;
    grade?: string;
    status?: "Pass" | "Fail" | "Re-appear";
  }>;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isProfileComplete?: boolean;
  academicProfile?: AcademicProfile;
  profileDetails?: {
    category?: string;
    income?: string;
    interests?: string;
  };
  documents?: {
    marksheets?: Record<string, string>;
    timetable?: string;
  };
  createdAt: string;
  profilePicture?: string;
  skills?: string[];
  dailyLearningGoal?: number;
  todayLearningTime?: number;
  learningStreak?: number;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// ─── Dashboard Types ─────────────────────────────────────
export interface DashboardCardData {
  icon: string;
  title: string;
  description: string;
  path: string;
  color: string;
  stats?: string;
}

export interface DashboardStats {
  cgpa: string;
  scholarships: number;
  applications: number;
}

// ─── Academic Types ──────────────────────────────────────

export interface StudyPlan {
  _id?: string;
  title: string;
  description: string;
}

export interface AcademicTask {
  _id: string;
  title: string;
  course: string;
  dueDate?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export interface AcademicResource {
  id: string;
  program: string;
  title: string;
  subject: string;
  university: string;
  type: string;
  size: string;
  url: string;
}

// ─── Opportunity Types ───────────────────────────────────
export interface Scholarship {
  id: number;
  title: string;
  amount: string;
  eligibility: string;
  deadline?: string;
  category?: string;
}

export interface GovernmentScheme {
  id: number;
  title: string;
  description: string;
  eligibility: string;
}

// ─── Career Types ────────────────────────────────────────
export interface InterviewQuestion {
  id: number;
  category: string;
  question: string;
  difficulty: string;
}

export interface InterviewAttempt {
  _id?: string;
  mode: "coding" | "behavioral" | "mock";
  problemId?: string;
  title: string;
  category: string;
  score: number;
  language?: string;
  difficulty?: string;
  feedback: string;
  strengths?: string[];
  improvements?: string[];
  answerSnippet?: string;
  createdAt: string;
}

export interface InterviewMock {
  _id?: string;
  mentorName: string;
  company: string;
  scheduledAt: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface InterviewPost {
  _id?: string;
  authorName: string;
  text: string;
  helpfulCount: number;
  createdAt: string;
}

export interface InternshipApplication {
  _id?: string;
  company: string;
  status: "applied" | "interviewing" | "offered" | "rejected" | "accepted";
}

// ─── AI Types ────────────────────────────────────────────
export interface AIChatMessage {
  prompt: string;
  response: string;
  timestamp: string;
}

// ─── API Types ───────────────────────────────────────────
export interface ModuleStatus {
  module: string;
  status: string;
  message: string;
  features: string[];
}
