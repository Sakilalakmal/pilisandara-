import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Profile completeness status query
 * Returns isComplete, percent, and missing fields
 */
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

    const missing: string[] = [];
    let percent = 0;

    // Required fields (25% each)
    if (profile.displayName && profile.displayName.trim() !== "") {
      percent += 25;
    } else {
      missing.push("displayName");
    }

    if (profile.username && profile.username.trim() !== "") {
      percent += 25;
    } else {
      missing.push("username");
    }

    if (profile.avatarFileId) {
      percent += 25;
    } else {
      missing.push("avatar");
    }

    // Optional bonus (25% if any of bio, interests, or intent exists)
    const hasBio = profile.bio && profile.bio.trim() !== "";
    const hasInterests = profile.interests && profile.interests.length > 0;
    const hasIntent = profile.intent && profile.intent.length > 0;

    if (hasBio || hasInterests || hasIntent) {
      percent += 25;
    }

    // Profile is complete only if all required fields exist
    const isComplete =
      missing.length === 0 &&
      !!profile.displayName &&
      !!profile.username &&
      !!profile.avatarFileId;

    return {
      isComplete,
      percent,
      missing,
    };
  },
});
