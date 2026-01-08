import type { EventType } from "./eventTypes";

export type EventEnvelope<TType extends EventType, TPayload> = {
  eventId: string;
  type: TType;
  occurredAt: string;
  payload: TPayload;
};

