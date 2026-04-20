-- Phase A schema. All timestamps are unix epoch milliseconds.

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  display_name TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE student_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  phase_a_edition TEXT NOT NULL
    CHECK (phase_a_edition IN ('Basic', 'Competent', 'Mastery'))
);

CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  objective_code TEXT NOT NULL,
  edition TEXT NOT NULL
    CHECK (edition IN ('Basic', 'Competent', 'Mastery')),
  type TEXT NOT NULL
    CHECK (type IN ('numeric', 'multipleChoice')),
  prompt TEXT NOT NULL,
  numeric_answer REAL,
  numeric_tolerance REAL,
  choices TEXT,
  explanation TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_questions_objective_edition
  ON questions (objective_code, edition);

CREATE TABLE attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  submitted_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL CHECK (is_correct IN (0, 1)),
  submitted_at INTEGER NOT NULL
);

CREATE INDEX idx_attempts_student ON attempts (student_id);
CREATE INDEX idx_attempts_question ON attempts (question_id);
CREATE INDEX idx_attempts_student_question
  ON attempts (student_id, question_id);
