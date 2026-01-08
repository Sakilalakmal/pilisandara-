"use server";

import { requireUser } from "@/data/user/require-user";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export async function generateAvatarUploadUrlAction() {
  await requireUser();
  return fetchMutation(api.upload.generateAvatarUploadUrl, {});
}

export async function generateCoverUploadUrlAction() {
  await requireUser();
  return fetchMutation(api.upload.generateCoverUploadUrl, {});
}

export async function setAvatarAction(fileId: string) {
  const user = await requireUser();
  return fetchMutation(api.profiles_media.setAvatar, {
    userId: user.id,
    fileId: fileId as Id<"_storage">,
  });
}

export async function setCoverAction(fileId: string) {
  const user = await requireUser();
  return fetchMutation(api.profiles_media.setCover, {
    userId: user.id,
    fileId: fileId as Id<"_storage">,
  });
}

export async function getMyMediaUrlsAction() {
  const user = await requireUser();
  return fetchQuery(api.profiles_media.getMediaUrls, { userId: user.id });
}

export async function clearAvatarAction() {
  const user = await requireUser();
  return fetchMutation(api.profiles_media.clearAvatar, { userId: user.id });
}

export async function clearCoverAction() {
  const user = await requireUser();
  return fetchMutation(api.profiles_media.clearCover, { userId: user.id });
}
