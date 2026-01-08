import { query } from "./_generated/server";
import { v } from "convex/values";

export const getMyProfileStatus = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) {
      return {
        isComplete: false,
        percent: 0,
        missing: ["displayName", "username", "avatar"],
      };
    }

    const hasText = (value: string | undefined) =>
      typeof value === "string" && value.trim().length > 0;
    const hasArray = (value: unknown[] | undefined) =>
      Array.isArray(value) && value.length > 0;

    const hasDisplayName = hasText(profile.displayName);
    const hasUsername = hasText(profile.username);
    const hasAvatar = !!profile.avatarFileId;
    const hasAbout =
      hasText(profile.bio) ||
      hasArray(profile.interests) ||
      hasArray(profile.intent);

    const missing: string[] = [];
    if (!hasDisplayName) missing.push("displayName");
    if (!hasUsername) missing.push("username");
    if (!hasAvatar) missing.push("avatar");

    const percent =
      (hasDisplayName ? 25 : 0) +
      (hasUsername ? 25 : 0) +
      (hasAvatar ? 25 : 0) +
      (hasAbout ? 25 : 0);

    const isComplete = hasDisplayName && hasUsername && hasAvatar;

    return {
      isComplete,
      percent,
      missing,
    };
  },
});
