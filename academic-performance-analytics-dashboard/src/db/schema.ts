/**
 * Drizzle schema for the analytics dashboard.
 * Mirrors analytics_sql/schema.sql 1:1 (which mirrors the MHS schema.sql),
 * so `drizzle-kit push` and the raw SQL bootstrap never disagree.
 */
import { sql } from "drizzle-orm";
import { date, decimal, index, json, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: varchar("id", { length: 50 }).primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique("students_username_key"),
  password: varchar("password", { length: 255 }).notNull().default(""),
  fullname: varchar("fullname", { length: 150 }).notNull(),
  email: varchar("email", { length: 100 }),
  stream: varchar("stream", { length: 50 }),
  class: varchar("class", { length: 50 }),
  createdat: timestamp("createdat").default(sql`CURRENT_TIMESTAMP`),
  gender: varchar("gender", { length: 10 }),
});

export const teachers = pgTable("teachers", {
  id: varchar("id", { length: 50 }).primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique("teachers_username_key"),
  password: varchar("password", { length: 255 }).notNull().default(""),
  fullname: varchar("fullname", { length: 150 }).notNull(),
  email: varchar("email", { length: 100 }),
  subjects: varchar("subjects", { length: 255 }),
  stream: varchar("stream", { length: 50 }),
  class: varchar("class", { length: 50 }),
  role: varchar("role", { length: 100 }),
  createdat: timestamp("createdat").default(sql`CURRENT_TIMESTAMP`),
});

export const studentPerformance = pgTable(
  "student_performance",
  {
    id: serial("id").primaryKey(),
    studentId: varchar("student_id", { length: 50 }).notNull(),
    subject: varchar("subject", { length: 100 }),
    score: decimal("score", { precision: 5, scale: 2 }),
    weaknesses: json("weaknesses"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    examType: varchar("exam_type", { length: 50 }).default("Test"),
  },
  (t) => [index("perf_student_idx").on(t.studentId), index("perf_created_idx").on(t.createdAt)],
);

export const attendance = pgTable(
  "attendance",
  {
    id: serial("id").primaryKey(),
    studentId: varchar("student_id", { length: 50 }).notNull(),
    date: date("date").notNull(),
    status: varchar("status", { length: 20 }).notNull(),
  },
  (t) => [index("att_student_idx").on(t.studentId), index("att_date_idx").on(t.date)],
);

export const assignmentSubmissions = pgTable(
  "assignment_submissions",
  {
    id: serial("id").primaryKey(),
    studentId: varchar("student_id", { length: 50 }).notNull(),
    subject: varchar("subject", { length: 100 }).notNull(),
    dueDate: date("due_date").notNull(),
    status: varchar("status", { length: 20 }).notNull(),
  },
  (t) => [index("asg_student_idx").on(t.studentId), index("asg_due_idx").on(t.dueDate)],
);

