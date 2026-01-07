import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    userId: v.string(),

    // Public basics
    displayName: v.optional(v.string()),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    image: v.optional(v.string()),
    pronouns: v.optional(v.string()),

    // Broad interests (main signal)
    interests: v.optional(v.array(v.string())),

    // What they want to do in communities
    intent: v.optional(
      v.array(
        v.union(
          v.literal("learn"),
          v.literal("share"),
          v.literal("network"),
          v.literal("find_friends"),
          v.literal("get_help"),
          v.literal("teach")
        )
      )
    ),

    avatarFileId: v.optional(v.id("_storage")),
    coverFileId: v.optional(v.id("_storage")),

    mood: v.optional(
      v.object({
        label: v.string(),
        emoji: v.optional(v.string()),
      })
    ),

    // How they prefer content
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

    // Community vibe preferences
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

    // Discovery & privacy
    profileVisibility: v.optional(
      v.union(
        v.literal("public"),
        v.literal("server_only"),
        v.literal("private")
      )
    ),
    allowDMs: v.optional(v.boolean()),

    // Locale
    languages: v.optional(v.array(v.string())),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"]),
});
