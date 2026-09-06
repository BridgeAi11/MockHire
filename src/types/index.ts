// ============================================================
// MOCKHIRE CORE TYPESCRIPT DEFINITIONS
// ============================================================

export type UserRole = 'STUDENT' | 'TPO' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  collegeId?: string;
  collegeName?: string;
  department?: string;
  batch?: string;
  registerNumber?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  collegeCode: string;
  subscriptionPlan: 'STARTER' | 'GROWTH' | 'INSTITUTION';
  subscriptionEnd?: string;
  tpoUserId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  studentCount?: number;
}

export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'MCQ' | 'MULTI_SELECT' | 'CODING' | 'DESCRIPTIVE';

export interface SectionBlueprint {
  name: string;
  questionCount: number;
  durationMinutes?: number;
  difficulty?: {
    easy: number;
    medium: number;
    hard: number;
  };
  negativeMarkingRatio?: number; // e.g. 0.25 for -0.25 on wrong answer
}

export interface CompanyBlueprint {
  sections: SectionBlueprint[];
  durationMinutes: number;
  totalQuestions: number;
  negativeMarking: boolean;
  cutoffScorePercent?: number;
  instructions: string[];
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description: string;
  badge?: string;
  blueprint: CompanyBlueprint;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  isActive: boolean;
  sampleQuestionsCount: number;
  averageReadinessScore?: number;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Question {
  id: string;
  companyId?: string;
  companySlug?: string;
  category: string; // 'Aptitude' | 'Programming' | 'Technical' | 'Communication'
  topic: string;
  subtopic?: string;
  difficulty: QuestionDifficulty;
  questionType: QuestionType;
  questionText: string;
  codeSnippet?: string;
  options?: QuestionOption[];
  // NOTE: correct answer is strictly stored on server and removed for client test payloads
  correctAnswer?: string;
  explanation?: string;
  testCases?: TestCase[];
  sourceType: 'SME' | 'INTERNAL' | 'COMPANY_PATTERN' | 'VERIFIED_REFERENCE';
  sourceConfidence: number;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REPORTED' | 'RETIRED';
  timesUsed?: number;
  attemptCount?: number;
  correctCount?: number;
  averageTimeSeconds?: number;
}

export interface ClientQuestion {
  id: string;
  position: number;
  sectionName: string;
  category: string;
  topic: string;
  subtopic?: string;
  difficulty: QuestionDifficulty;
  questionType: QuestionType;
  questionText: string;
  codeSnippet?: string;
  options?: QuestionOption[];
  testCases?: { id: string; input: string; isHidden?: boolean }[];
}

export type CheatEventType =
  | 'TAB_SWITCH'
  | 'WINDOW_BLUR'
  | 'COPY'
  | 'PASTE'
  | 'UNUSUAL_SPEED'
  | 'ANSWER_PATTERN_ANOMALY'
  | 'SIMILARITY_FLAG';

export interface CheatEvent {
  id: string;
  sessionId: string;
  studentId: string;
  eventType: CheatEventType;
  eventData?: Record<string, unknown>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
}

export interface SectionScore {
  sectionName: string;
  score: number;
  totalPossible: number;
  accuracyPercent: number;
  timeSpentSeconds: number;
  questionsAnswered: number;
  totalQuestions: number;
}

export interface AIEvaluationResult {
  score: number; // 0-10
  strengths: string[];
  improvements: string[];
  feedback: string;
  communicationInsights?: string;
  similarityScore?: number;
}

export interface MockSession {
  id: string;
  studentId: string;
  studentName?: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  sessionType: 'SELF_MOCK' | 'COLLEGE_DRIVE' | 'PRACTICE';
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED' | 'ABANDONED';
  startedAt: string;
  durationMinutes: number;
  completedAt?: string;
  totalScore?: number;
  performanceScore?: number; // 0 - 100
  readinessScore?: number;   // 0 - 100
  integrityScore?: number;   // 0 - 100 (100 = clean signals)
  integrityStatus?: 'NORMAL' | 'REVIEW_RECOMMENDED' | 'HIGH_RISK_SIGNALS';
  sectionScores?: Record<string, SectionScore>;
  topicAccuracy?: Record<string, { correct: number; total: number; percent: number }>;
  questionsCount: number;
  answeredCount: number;
  markedForReviewCount: number;
  cheatEventsSummary?: {
    tabSwitches: number;
    windowBlurs: number;
    copyPastes: number;
    unusualSpeedFlags: number;
    totalFlags: number;
  };
}

export interface MockDrive {
  id: string;
  collegeId: string;
  collegeName: string;
  tpoId: string;
  companyId: string;
  companyName: string;
  driveName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  instructions?: string;
  totalStudentsAssigned: number;
  studentsCompleted: number;
  averageScore?: number;
  averageReadiness?: number;
}

export interface Subscription {
  id: string;
  collegeId: string;
  plan: 'STARTER' | 'GROWTH' | 'INSTITUTION';
  amountPaise: number;
  validFrom: string;
  validUntil: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}
