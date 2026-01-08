import { startHttpServer } from "./server";
import { connectRabbitMQ, consumeTopic } from "./messaging/rabbitmq";
import { prisma } from "./config/prisma";
import { EVENT_TYPES } from "../../../shared/messaging/eventTypes";
import { parseUserOnboardedEvent, handleUserOnboardedEvent } from "./messaging/consumers/userOnboarded.consumer";

/**
 * User Service (domain service)
 * - Does NOT implement authentication
 * - Does NOT read/write auth tables
 * - Trusts `userId` as verified upstream by the Next.js app layer
 */
async function main() {
  const server = await startHttpServer();
  console.log(`[user-service] http listening on :${server.port}`);

  const rabbit = await connectRabbitMQ();
  console.log("[user-service] rabbitmq connected");

  await consumeTopic({
    client: rabbit,
    queueName: "user-service.user.onboarded",
    routingKey: EVENT_TYPES.UserOnboarded,
    handler: async (message) => {
      try {
        const raw = JSON.parse(message.content.toString("utf8")) as unknown;
        const event = parseUserOnboardedEvent(raw);
        await handleUserOnboardedEvent(event);
        rabbit.channel.ack(message);
      } catch (error) {
        console.error("[user-service] failed to process message", error);
        rabbit.channel.nack(message, false, false);
      }
    },
  });

  const shutdown = async (signal: string) => {
    console.log(`[user-service] received ${signal}, shutting down...`);
    await Promise.allSettled([rabbit.close(), server.close(), prisma.$disconnect()]);
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

void main().catch((error: unknown) => {
  console.error("[user-service] fatal error", error);
  process.exit(1);
});
