import type { EventEnvelope } from "./eventEnvelope";

export const EVENT_TYPES = {
  UserOnboarded: "user.onboarded",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export type UserOnboardedPayload = {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
};

export type UserOnboardedEvent = EventEnvelope<
  typeof EVENT_TYPES.UserOnboarded,
  UserOnboardedPayload
>;

