"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const requireUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    console.error("No user found in session");
    return redirect("/login");
  }

  //   console.log("User found in session:", session.user);
  return session.user;
});
