"use server";

import { requireUser } from "@/data/user/require-user";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

/**
 * Clean up invalid media for the current user
 */
export async function cleanupMyInvalidMediaAction() {
  const user = await requireUser();
  return fetchMutation(api.maintenance.cleanupInvalidMedia, {
    userId: user.id,
  });
}
