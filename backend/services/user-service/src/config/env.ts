import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .optional()
    .default("development"),
  PORT: z.coerce.number().int().positive().optional().default(4001),

  DATABASE_URL: z.string().min(1),

  RABBITMQ_URL: z
    .string()
    .min(1)
    .optional()
    .default("amqp://guest:guest@localhost:5672"),
  RABBITMQ_EXCHANGE: z.string().min(1).optional().default("events"),
});

function formatEnvError(error: z.ZodError): string {
  const missingKeys = error.issues
    .filter((issue) => issue.code === "invalid_type" && issue.received === "undefined")
    .map((issue) => issue.path.join("."));

  const lines = [
    "[user-service] Missing/invalid environment variables.",
    missingKeys.length > 0 ? `Missing: ${missingKeys.join(", ")}` : "",
    "Create `backend/services/user-service/.env` (you can copy `.env.example`).",
  ].filter((line) => line.trim().length > 0);

  return lines.join("\n");
}

export const env = (() => {
  try {
    return EnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(formatEnvError(error));
    }
    throw error;
  }
})();

export type Env = typeof env;
