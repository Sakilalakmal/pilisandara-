import http from "node:http";
import type { AddressInfo } from "node:net";
import { createApp } from "./app";
import { env } from "./config/env";

export type RunningServer = {
  port: number;
  close: () => Promise<void>;
};

export async function startHttpServer(): Promise<RunningServer> {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(env.PORT, resolve);
  });

  const address = server.address() as AddressInfo | null;
  const port = address?.port ?? env.PORT;

  return {
    port,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}

