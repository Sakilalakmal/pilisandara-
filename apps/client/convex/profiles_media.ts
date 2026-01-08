import { mutation, query, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

// Helper function to ensure profile exists
async function ensureProfile(ctx: MutationCtx, userId: string) {
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();

  if (!profile) {
    // Create a basic profile if it doesn't exist
    const now = Date.now();
    const newProfileId = await ctx.db.insert("profiles", {
      userId: userId,
      createdAt: now,
      updatedAt: now,
    });
    return await ctx.db.get(newProfileId);
  }

  return profile;
}

export const setAvatar = mutation({
  args: { userId: v.string(), fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Verify the file exists in storage
    const fileUrl = await ctx.storage.getUrl(args.fileId);
    if (!fileUrl) {
      throw new Error("File not found in storage - upload may have failed");
    }

    // Note: Content-type validation is done on client-side before upload
    // Convex storage sometimes doesn't preserve the correct MIME type

    // Ensure profile exists
    const profile = await ensureProfile(ctx, args.userId);
    if (!profile) {
      throw new Error("Failed to create or find profile");
    }

    await ctx.db.patch(profile._id, {
      avatarFileId: args.fileId,
      updatedAt: now,
    });

    return { ok: true, url: fileUrl };
  },
});

export const setCover = mutation({
  args: { userId: v.string(), fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Verify the file exists in storage
    const fileUrl = await ctx.storage.getUrl(args.fileId);
    if (!fileUrl) {
      throw new Error("File not found in storage - upload may have failed");
    }

    // Note: Content-type validation is done on client-side before upload
    // Convex storage sometimes doesn't preserve the correct MIME type

    // Ensure profile exists
    const profile = await ensureProfile(ctx, args.userId);
    if (!profile) {
      throw new Error("Failed to create or find profile");
    }

    await ctx.db.patch(profile._id, {
      coverFileId: args.fileId,
      updatedAt: now,
    });

    return { ok: true, url: fileUrl };
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

    let avatarUrl = null;
    let coverUrl = null;

    // Only fetch URLs if the fileIds exist
    if (profile.avatarFileId) {
      try {
        const url = await ctx.storage.getUrl(profile.avatarFileId);
        // Only set if URL is valid and not null
        avatarUrl = url && url !== null ? url : null;
      } catch (error) {
        console.error("Failed to get avatar URL:", error);
        avatarUrl = null;
      }
    }

    if (profile.coverFileId) {
      try {
        const url = await ctx.storage.getUrl(profile.coverFileId);
        // Only set if URL is valid and not null
        coverUrl = url && url !== null ? url : null;
      } catch (error) {
        console.error("Failed to get cover URL:", error);
        coverUrl = null;
      }
    }

    return { avatarUrl, coverUrl };
  },
});

// Mutation to clear invalid avatar
export const clearAvatar = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      avatarFileId: undefined,
      updatedAt: Date.now(),
    });

    return { ok: true };
  },
});

// Mutation to clear invalid cover
export const clearCover = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      coverFileId: undefined,
      updatedAt: Date.now(),
    });

    return { ok: true };
  },
});
