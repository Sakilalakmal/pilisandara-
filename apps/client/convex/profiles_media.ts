import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const setAvatar = mutation({
  args: { userId: v.string(), fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    const now = Date.now();

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      avatarFileId: args.fileId,
      updatedAt: now,
    });

    return { ok: true };
  },
});

export const setCover = mutation({
  args: { userId: v.string(), fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    const now = Date.now();

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      coverFileId: args.fileId,
      updatedAt: now,
    });

    return { ok: true };
  },
});

export const getMediaUrls = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) return null;

    const avatarUrl = profile.avatarFileId
      ? await ctx.storage.getUrl(profile.avatarFileId)
      : null;

    const coverUrl = profile.coverFileId
      ? await ctx.storage.getUrl(profile.coverFileId)
      : null;

    return { avatarUrl, coverUrl };
  },
});
