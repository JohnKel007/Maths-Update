import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { requireRole } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireRole(request, "teacher");
  return json({ displayName: user.displayName });
}

export default function TeacherDashboard() {
  const { displayName } = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">Maths Practice — Teacher</p>
          <h1 className="text-2xl font-semibold">Hi, {displayName}</h1>
        </div>
        <Form method="post" action="/logout">
          <button type="submit" className="btn-ghost">
            Log out
          </button>
        </Form>
      </header>

      <section className="rounded-lg border border-dashed border-neutral-300 bg-white p-6 text-sm text-neutral-600">
        Cohort and per-objective dashboards will appear here in Phase 4.
      </section>
    </main>
  );
}
