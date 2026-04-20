import { ulid } from "ulid";

import { db } from "~/lib/db.server";

export type Role = "student" | "teacher";
export type Edition = "Basic" | "Competent" | "Mastery";

export type UserRow = {
  id: string;
  username: string;
  password_hash: string;
  role: Role;
  display_name: string;
  created_at: number;
};

export type User = {
  id: string;
  username: string;
  role: Role;
  displayName: string;
  createdAt: number;
};

function toUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    displayName: row.display_name,
    createdAt: row.created_at,
  };
}

export function getUserById(id: string): User | null {
  const row = db
    .prepare(`SELECT * FROM users WHERE id = ?`)
    .get(id) as UserRow | undefined;
  return row ? toUser(row) : null;
}

export function getUserByUsername(username: string): UserRow | null {
  const row = db
    .prepare(`SELECT * FROM users WHERE username = ? COLLATE NOCASE`)
    .get(username.trim()) as UserRow | undefined;
  return row ?? null;
}

export function createUser(input: {
  username: string;
  passwordHash: string;
  role: Role;
  displayName: string;
}): User {
  const id = ulid();
  const now = Date.now();
  db.prepare(
    `INSERT INTO users (id, username, password_hash, role, display_name, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.username.trim(),
    input.passwordHash,
    input.role,
    input.displayName,
    now,
  );
  return {
    id,
    username: input.username.trim(),
    role: input.role,
    displayName: input.displayName,
    createdAt: now,
  };
}

export function setStudentEdition(userId: string, edition: Edition): void {
  db.prepare(
    `INSERT INTO student_profiles (user_id, phase_a_edition)
     VALUES (?, ?)
     ON CONFLICT(user_id) DO UPDATE SET phase_a_edition = excluded.phase_a_edition`,
  ).run(userId, edition);
}

export function getStudentEdition(userId: string): Edition | null {
  const row = db
    .prepare(`SELECT phase_a_edition FROM student_profiles WHERE user_id = ?`)
    .get(userId) as { phase_a_edition: Edition } | undefined;
  return row ? row.phase_a_edition : null;
}

export function countUsers(): number {
  const row = db.prepare(`SELECT COUNT(*) AS n FROM users`).get() as {
    n: number;
  };
  return row.n;
}
