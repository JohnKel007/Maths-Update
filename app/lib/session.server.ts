import { createCookieSessionStorage, redirect } from "@remix-run/node";

import type { Role } from "~/lib/users.server";

const SESSION_SECRET =
  process.env.SESSION_SECRET ??
  (process.env.NODE_ENV === "production"
    ? ""
    : "dev-only-insecure-session-secret");

if (process.env.NODE_ENV === "production" && !SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in production");
}

const TEACHER_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const STUDENT_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const storage = createCookieSessionStorage({
  cookie: {
    name: "__maths_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
  },
});

export async function createUserSession(
  userId: string,
  role: Role,
  redirectTo: string,
): Promise<Response> {
  const session = await storage.getSession();
  session.set("userId", userId);
  session.set("role", role);
  const maxAge = role === "teacher" ? TEACHER_MAX_AGE : STUDENT_MAX_AGE;
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session, { maxAge }),
    },
  });
}

export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function destroySession(request: Request): Promise<string> {
  const session = await getUserSession(request);
  return storage.destroySession(session);
}
