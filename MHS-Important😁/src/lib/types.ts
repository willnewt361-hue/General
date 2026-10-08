export type Role = "student" | "teacher" | "admin";
export type Plan = "free" | "plus" | "school";

export interface User {
  id: string;
  name: string;
  email: string;
  pass: string;
  role: Role;
  className?: string;
  subjects?: string[];
  plan: Plan;
  hue: number;
  createdAt: number;
  phone?: string;
}

export interface Answer {
  questionId: string;
  given: string;
  correct: boolean;
  marks: number;
  max: number;
}

export interface Attempt {
  id: string;
  userId: string;
  kind: "practice" | "assignment" | "mock";
  title: string;
  subjectId: string;
  topicIds: string[];
  answers: Answer[];
  score: number;
  total: number;
  percent: number;
  grade: string;
  durationSec: number;
  at: number;
  assignmentId?: string;
}

export interface Assignment {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  subjectId: string;
  topicIds: string[];
  questionIds: string[];
  classes: string[];
  dueAt: number;
  durationMin: number;
  createdAt: number;
  published: boolean;
  instructions?: string;
}

export interface Announcement {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  title: string;
  body: string;
  audience: "all" | "students" | "teachers";
  at: number;
  pinned?: boolean;
}

export interface ChatMessage {
  id: string;
  room: string;
  userId: string;
  name: string;
  role: Role;
  text: string;
  at: number;
  hue: number;
}

export interface Sim {
  id: string;
  subjectId: string;
  topicId?: string;
  title: string;
  url: string;
  provider: string;
  description: string;
  custom?: boolean;
}

export interface PlannerTask {
  id: string;
  userId: string;
  title: string;
  subjectId?: string;
  topicId?: string;
  minutes: number;
  done: boolean;
  day: string;
  auto?: boolean;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  title: string;
  subjectId: string;
  percent: number;
  grade: string;
  serial: string;
  at: number;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  plan: Plan;
  amount: number;
  method: string;
  phone: string;
  ref: string;
  at: number;
  status: "success" | "pending";
}

export interface Resource {
  id: string;
  title: string;
  subjectId: string;
  topicId?: string;
  kind: "notes" | "past-paper" | "slides" | "audio" | "video";
  by: string;
  at: number;
  size: string;
  downloaded?: boolean;
  body?: string;
}

export interface Progress {
  topicsRead: string[];
  bookmarks: string[];
  streak: number;
  lastActiveDay: string;
  xp: number;
}

export interface AppState {
  users: User[];
  attempts: Attempt[];
  assignments: Assignment[];
  announcements: Announcement[];
  messages: ChatMessage[];
  sims: Sim[];
  tasks: PlannerTask[];
  certificates: Certificate[];
  payments: Payment[];
  resources: Resource[];
  progress: Record<string, Progress>;
  sessionId: string | null;
  version: number;
}
