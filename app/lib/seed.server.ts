import crypto from "node:crypto";

import { hashPassword } from "~/lib/password.server";
import {
  countUsers,
  createUser,
  setStudentEdition,
} from "~/lib/users.server";
import type { Edition } from "~/lib/users.server";

type SeededStudent = {
  username: string;
  displayName: string;
  edition: Edition;
};

const SEED_STUDENTS: SeededStudent[] = [
  { username: "ana.g", displayName: "Ana G", edition: "Basic" },
  { username: "luis.r", displayName: "Luis R", edition: "Competent" },
  { username: "maria.s", displayName: "Maria S", edition: "Mastery" },
];

const TEACHER_USERNAME = "teacher";
const TEACHER_DISPLAY_NAME = "Teacher";

// Cryptographically random password. Letters + digits, no look-alike chars.
function generatePassword(length: number): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

function banner(lines: string[]): void {
  const bar = "=".repeat(72);
  // eslint-disable-next-line no-console
  console.log(`\n${bar}`);
  for (const line of lines) {
    // eslint-disable-next-line no-console
    console.log(line);
  }
  // eslint-disable-next-line no-console
  console.log(`${bar}\n`);
}

export async function seedIfEmpty(): Promise<void> {
  if (countUsers() > 0) return;

  const teacherPassword = generatePassword(16);
  createUser({
    username: TEACHER_USERNAME,
    passwordHash: await hashPassword(teacherPassword),
    role: "teacher",
    displayName: TEACHER_DISPLAY_NAME,
  });

  const studentCreds: Array<{ username: string; password: string }> = [];
  for (const s of SEED_STUDENTS) {
    const pwd = generatePassword(8);
    const user = createUser({
      username: s.username,
      passwordHash: await hashPassword(pwd),
      role: "student",
      displayName: s.displayName,
    });
    setStudentEdition(user.id, s.edition);
    studentCreds.push({ username: s.username, password: pwd });
  }

  banner([
    "FIRST-RUN SEED — save these credentials now. They are not stored anywhere else.",
    "",
    `Teacher:`,
    `  username: ${TEACHER_USERNAME}`,
    `  password: ${teacherPassword}`,
    "",
    "Test students:",
    ...studentCreds.map(
      (c) => `  username: ${c.username.padEnd(10)} password: ${c.password}`,
    ),
  ]);
}
