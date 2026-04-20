import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { requireRole } from "~/lib/auth.server";
import { getStudentEdition } from "~/lib/users.server";

const EDITION_NUMBER: Record<string, number> = {
  Basic: 1,
  Competent: 2,
  Mastery: 3,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireRole(request, "student");
  const edition = getStudentEdition(user.id);
  return json({
    displayName: user.displayName,
    editionNumber: edition ? EDITION_NUMBER[edition] : null,
  });
}

export default function StudentDashboard() {
  const { displayName, editionNumber } = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">Maths Practice</p>
          <h1 className="text-2xl font-semibold">Hi, {displayName}</h1>
          {editionNumber ? (
            <p className="mt-1 text-sm text-neutral-700">
              You are working at Edition {editionNumber} for Phase A.
            </p>
          ) : (
            <p className="mt-1 text-sm text-neutral-700">
              Your edition has not been set. Please ask your teacher.
            </p>
          )}
        </div>
        <Form method="post" action="/logout">
          <button type="submit" className="btn-ghost">
            Log out
          </button>
        </Form>
      </header>

      <section className="rounded-lg border border-dashed border-neutral-300 bg-white p-6 text-sm text-neutral-600">
        Objectives list will appear here in Phase 3.
      </section>
    </main>
  );
}
