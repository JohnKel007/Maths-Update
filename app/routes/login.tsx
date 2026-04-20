import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";

import { dashboardPathFor, getCurrentUser } from "~/lib/auth.server";
import { verifyPassword } from "~/lib/password.server";
import {
  isLocked,
  registerFailure,
  secondsUntilUnlock,
  clear as clearRateLimit,
} from "~/lib/rate-limit.server";
import { createUserSession } from "~/lib/session.server";
import { getUserByUsername } from "~/lib/users.server";

const LoginSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(256),
});

type ActionData = { error: string };

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getCurrentUser(request);
  if (user) return redirect(dashboardPathFor(user.role));
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const parsed = LoginSchema.safeParse({
    username: form.get("username"),
    password: form.get("password"),
  });

  if (!parsed.success) {
    return json<ActionData>(
      { error: "Username or password incorrect." },
      { status: 400 },
    );
  }

  const { username, password } = parsed.data;

  if (isLocked(username)) {
    const secs = secondsUntilUnlock(username);
    return json<ActionData>(
      {
        error: `Too many attempts. Try again in ${Math.ceil(secs / 60)} minute(s).`,
      },
      { status: 429 },
    );
  }

  const row = getUserByUsername(username);
  const ok = row ? await verifyPassword(password, row.password_hash) : false;

  if (!row || !ok) {
    registerFailure(username);
    return json<ActionData>(
      { error: "Username or password incorrect." },
      { status: 401 },
    );
  }

  clearRateLimit(username);
  return createUserSession(row.id, row.role, dashboardPathFor(row.role));
}

export default function LoginRoute() {
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  const submitting = nav.state === "submitting";

  return (
    <main className="mx-auto flex min-h-full max-w-md items-center px-6 py-10">
      <div className="w-full rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900">
          Maths Practice
        </h1>
        <p className="mt-1 text-sm text-neutral-600">Sign in to continue.</p>

        <Form method="post" className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              required
              className="field"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="field"
            />
          </div>

          {result?.error ? (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {result.error}
            </p>
          ) : null}

          <button type="submit" className="btn w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Log in"}
          </button>
        </Form>
      </div>
    </main>
  );
}
