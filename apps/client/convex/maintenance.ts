import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Maintenance mutation to clean up invalid storage IDs
 * Run this once to fix any existing profiles with broken image references
 */
export const cleanupInvalidMedia = mutation({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let profiles;
    
    if (args.userId) {
      // Clean up specific user
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId as string))
        .unique();
      profiles = profile ? [profile] : [];
    } else {
      // Clean up all profiles (use with caution!)
      profiles = await ctx.db.query("profiles").collect();
    }

    let cleaned = 0;
    
    for (const profile of profiles) {
      let needsUpdate = false;
      const updates: {
        avatarFileId?: undefined;
        coverFileId?: undefined;
        updatedAt?: number;
      } = {};
      
      // Check avatar
      if (profile.avatarFileId) {
        try {
          const avatarUrl = await ctx.storage.getUrl(profile.avatarFileId);
          if (!avatarUrl) {
            updates.avatarFileId = undefined;
            needsUpdate = true;
          }
        } catch (error) {
          console.error(`Invalid avatar for profile ${profile._id}:`, error);
          updates.avatarFileId = undefined;
          needsUpdate = true;
        }
      }
      
      // Check cover
      if (profile.coverFileId) {
        try {
          const coverUrl = await ctx.storage.getUrl(profile.coverFileId);
          if (!coverUrl) {
            updates.coverFileId = undefined;
            needsUpdate = true;
          }
        } catch (error) {
          console.error(`Invalid cover for profile ${profile._id}:`, error);
          updates.coverFileId = undefined;
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        await ctx.db.patch(profile._id, {
          ...updates,
          updatedAt: Date.now(),
        });
        cleaned++;
      }
    }
    
    return { 
      message: `Cleaned up ${cleaned} profile(s)`,
      cleanedCount: cleaned,
      totalChecked: profiles.length,
    };
  },
});
