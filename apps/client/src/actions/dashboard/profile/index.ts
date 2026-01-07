"use server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { updateProfileSchema, type UpdateProfileInput } from "./schema";
import { requireUser } from "@/data/user/require-user";
import { api } from "../../../../convex/_generated/api";

export async function getMyProfileAction() {
  const user = await requireUser();

  return fetchQuery(api.profiles.getMe, {
    userId: user.id,
  });
}

export async function updateMyProfileAction(input: UpdateProfileInput) {
  const user = await requireUser();

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    const result = await fetchMutation(api.profiles.upsertMe, {
      userId: user.id,
      ...parsed.data,
    });

    return { ok: true as const, result };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update profile";
    return { ok: false as const, error: message };
  }
}
