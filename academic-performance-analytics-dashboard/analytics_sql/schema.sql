-- =====================================================================
--  MHS Analytics Dashboard - database schema (PostgreSQL)
-- ---------------------------------------------------------------------
--  Safe to run many times (IF NOT EXISTS everywhere).
--  * On a fresh database it creates every table the dashboard needs.
--  * On an existing MHS database it only ADDS what is missing:
--      - students.gender            (for gender filter)
--      - student_performance.exam_type (Quiz / Test / Mid-Term / End of Term)
--      - attendance table
--      - assignment_submissions table
--  Column names follow the MHS schema.sql (fullName -> fullname in Postgres).
-- =====================================================================

CREATE TABLE IF NOT EXISTS students (
    id          VARCHAR(50)  PRIMARY KEY,
    username    VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL DEFAULT '',
    fullname    VARCHAR(150) NOT NULL,
    email       VARCHAR(100),
    stream      VARCHAR(50),
    class       VARCHAR(50),
    createdat   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE students ADD COLUMN IF NOT EXISTS gender VARCHAR(10);

CREATE TABLE IF NOT EXISTS teachers (
    id          VARCHAR(50)  PRIMARY KEY,
    username    VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL DEFAULT '',
    fullname    VARCHAR(150) NOT NULL,
    email       VARCHAR(100),
    subjects    VARCHAR(255),
    stream      VARCHAR(50),
    class       VARCHAR(50),
    role        VARCHAR(100),
    createdat   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- One row = one mark a student got in one assessment.
CREATE TABLE IF NOT EXISTS student_performance (
    id          SERIAL PRIMARY KEY,
    student_id  VARCHAR(50) NOT NULL,
    subject     VARCHAR(100),
    score       DECIMAL(5, 2),
    weaknesses  JSON,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE student_performance ADD COLUMN IF NOT EXISTS exam_type VARCHAR(50) DEFAULT 'Test';

-- One row = one student on one school day.
CREATE TABLE IF NOT EXISTS attendance (
    id          SERIAL PRIMARY KEY,
    student_id  VARCHAR(50) NOT NULL,
    date        DATE NOT NULL,
    status      VARCHAR(20) NOT NULL      -- present | late | absent | excused
);

-- One row = one assignment handed out to one student.
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id          SERIAL PRIMARY KEY,
    student_id  VARCHAR(50) NOT NULL,
    subject     VARCHAR(100) NOT NULL,
    due_date    DATE NOT NULL,
    status      VARCHAR(20) NOT NULL      -- on_time | late | missing
);

CREATE INDEX IF NOT EXISTS perf_student_idx  ON student_performance (student_id);
CREATE INDEX IF NOT EXISTS perf_created_idx  ON student_performance (created_at);
CREATE INDEX IF NOT EXISTS att_student_idx   ON attendance (student_id);
CREATE INDEX IF NOT EXISTS att_date_idx      ON attendance (date);
CREATE INDEX IF NOT EXISTS asg_student_idx   ON assignment_submissions (student_id);
CREATE INDEX IF NOT EXISTS asg_due_idx       ON assignment_submissions (due_date);
