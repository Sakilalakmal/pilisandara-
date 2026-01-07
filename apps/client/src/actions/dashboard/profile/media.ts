"use server";

import { requireUser } from "@/data/user/require-user";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

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
    fileId: fileId as any, // we'll strongly type later with generated types
  });
}

export async function setCoverAction(fileId: string) {
  const user = await requireUser();
  return fetchMutation(api.profiles_media.setCover, {
    userId: user.id,
    fileId: fileId as any,
  });
}

export async function getMyMediaUrlsAction() {
  const user = await requireUser();
  return fetchQuery(api.profiles_media.getMediaUrls, { userId: user.id });
}

