import { redirect } from "@remix-run/node";

import { getUserSession } from "~/lib/session.server";
import type { Role, User } from "~/lib/users.server";
import { getUserById } from "~/lib/users.server";

export async function getCurrentUser(request: Request): Promise<User | null> {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (typeof userId !== "string") return null;
  const user = getUserById(userId);
  return user;
}

export async function requireUser(request: Request): Promise<User> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw redirect("/login");
  }
  return user;
}

export async function requireRole(
  request: Request,
  role: Role,
): Promise<User> {
  const user = await requireUser(request);
  if (user.role !== role) {
    // Send the user to their own dashboard, or 403 if we cannot infer.
    throw redirect(user.role === "teacher" ? "/teacher" : "/student", {
      status: 303,
    });
  }
  return user;
}

export function dashboardPathFor(role: Role): string {
  return role === "teacher" ? "/teacher" : "/student";
}
