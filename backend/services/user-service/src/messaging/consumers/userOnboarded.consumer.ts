import { z } from "zod";
import { prisma } from "../../config/prisma";
import {
  EVENT_TYPES,
  type UserOnboardedEvent,
} from "../../../../../shared/messaging/eventTypes";

const UserOnboardedEventSchema = z
  .object({
    eventId: z.string().min(1),
    type: z.literal(EVENT_TYPES.UserOnboarded),
    occurredAt: z.string().datetime(),
    payload: z
      .object({
        userId: z.string().min(1),
        username: z.string().min(1),
        displayName: z.string().min(1),
        avatarUrl: z.string().min(1).optional(),
      })
      .strict(),
  })
  .strict();

export function parseUserOnboardedEvent(raw: unknown): UserOnboardedEvent {
  const parsed = UserOnboardedEventSchema.parse(raw);
  const { avatarUrl, ...rest } = parsed.payload;

  return {
    ...parsed,
    payload: avatarUrl === undefined ? rest : { ...rest, avatarUrl },
  };
}

export async function handleUserOnboardedEvent(event: UserOnboardedEvent): Promise<void> {
  const { userId, username, displayName, avatarUrl } = event.payload;

  await prisma.user.upsert({
    where: { userId },
    create: {
      userId,
      username,
      displayName,
      avatarUrl: avatarUrl ?? null,
    },
    update: {
      username,
      displayName,
      avatarUrl: avatarUrl ?? null,
    },
  });
}
