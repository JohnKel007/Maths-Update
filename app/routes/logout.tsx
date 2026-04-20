import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { destroySession } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(request) },
  });
}

export async function loader(_args: LoaderFunctionArgs) {
  return redirect("/login");
}
