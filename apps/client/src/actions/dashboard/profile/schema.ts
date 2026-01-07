import { z } from "zod";

export const intentEnum = z.enum([
  "learn",
  "share",
  "network",
  "find_friends",
  "get_help",
  "teach",
]);

export type Intent = z.infer<typeof intentEnum>;


export const visibilityEnum = z.enum(["public", "server_only", "private"]);

const tagArray = z
  .array(z.string())
  .default([])
  .transform((arr) =>
    arr
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 30)
  );

export const moodSchema = z
  .object({
    label: z.string().trim().min(1).max(20),
    emoji: z.string().trim().max(4).optional(),
  })
  .optional();

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(50).optional(),
  username: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and _ allowed")
    .optional(),
  bio: z.string().trim().max(200).optional(),
  pronouns: z.string().trim().max(20).optional(),

  interests: tagArray.optional(),
  intent: z.array(intentEnum).optional(),

  contentPreferences: z
    .object({
      textPosts: z.boolean(),
      shortVideos: z.boolean(),
      longVideos: z.boolean(),
      liveSessions: z.boolean(),
      voiceChat: z.boolean(),
      fileSharing: z.boolean(),
      events: z.boolean(),
    })
    .optional(),

  communityPreferences: z
    .object({
      beginnerFriendly: z.boolean(),
      seriousOnly: z.boolean(),
      casual: z.boolean(),
      strictModeration: z.boolean(),
      smallGroups: z.boolean(),
      largeCommunities: z.boolean(),
    })
    .optional(),

  profileVisibility: visibilityEnum.optional(),
  allowDMs: z.boolean().optional(),
  languages: tagArray.optional(),

  mood: moodSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
