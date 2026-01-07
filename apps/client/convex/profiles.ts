import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const intentValues = v.union(
  v.literal("learn"),
  v.literal("share"),
  v.literal("network"),
  v.literal("find_friends"),
  v.literal("get_help"),
  v.literal("teach")
);

const visibilityValues = v.union(
  v.literal("public"),
  v.literal("server_only"),
  v.literal("private")
);

const moodValue = v.object({
  label: v.string(),
  emoji: v.optional(v.string()),
});

export const getMe = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    return profile ?? null;
  },
});

export const upsertMe = mutation({
  args: {
    userId: v.string(),

    // Public basics
    displayName: v.optional(v.string()),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    pronouns: v.optional(v.string()),

    // Signals
    interests: v.optional(v.array(v.string())),
    intent: v.optional(v.array(intentValues)),

    contentPreferences: v.optional(
      v.object({
        textPosts: v.boolean(),
        shortVideos: v.boolean(),
        longVideos: v.boolean(),
        liveSessions: v.boolean(),
        voiceChat: v.boolean(),
        fileSharing: v.boolean(),
        events: v.boolean(),
      })
    ),

    communityPreferences: v.optional(
      v.object({
        beginnerFriendly: v.boolean(),
        seriousOnly: v.boolean(),
        casual: v.boolean(),
        strictModeration: v.boolean(),
        smallGroups: v.boolean(),
        largeCommunities: v.boolean(),
      })
    ),

    profileVisibility: v.optional(visibilityValues),
    allowDMs: v.optional(v.boolean()),
    languages: v.optional(v.array(v.string())),

    // Mood (badge)
    mood: v.optional(moodValue),
  },

  handler: async (ctx, args) => {
    const now = Date.now();

    // Username uniqueness (only if provided)
    if (args.username) {
      const conflict = await ctx.db
        .query("profiles")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .unique();

      if (conflict && conflict.userId !== args.userId) {
        throw new Error("Username is already taken.");
      }
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!existing) {
      const id = await ctx.db.insert("profiles", {
        userId: args.userId,

        displayName: args.displayName,
        username: args.username,
        bio: args.bio,
        pronouns: args.pronouns,

        interests: args.interests,
        intent: args.intent,

        contentPreferences: args.contentPreferences ?? {
          textPosts: true,
          shortVideos: false,
          longVideos: false,
          liveSessions: false,
          voiceChat: true,
          fileSharing: true,
          events: false,
        },

        communityPreferences: args.communityPreferences ?? {
          beginnerFriendly: true,
          seriousOnly: false,
          casual: true,
          strictModeration: true,
          smallGroups: true,
          largeCommunities: false,
        },

        profileVisibility: args.profileVisibility ?? "server_only",
        allowDMs: args.allowDMs ?? true,
        languages: args.languages ?? ["English"],

        mood: args.mood,

        createdAt: now,
        updatedAt: now,
      });

      return { id, created: true };
    }

    await ctx.db.patch(existing._id, {
      displayName: args.displayName,
      username: args.username,
      bio: args.bio,
      pronouns: args.pronouns,

      interests: args.interests,
      intent: args.intent,

      contentPreferences: args.contentPreferences,
      communityPreferences: args.communityPreferences,

      profileVisibility: args.profileVisibility,
      allowDMs: args.allowDMs,
      languages: args.languages,

      mood: args.mood,

      updatedAt: now,
    });

    return { id: existing._id, created: false };
  },
});
