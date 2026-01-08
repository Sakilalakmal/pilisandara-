import {
  connect,
  type Channel,
  type ChannelModel,
  type ConsumeMessage,
} from "amqplib";
import { env } from "../config/env";

export type RabbitMQClient = {
  connection: ChannelModel;
  channel: Channel;
  close: () => Promise<void>;
};

export type ConsumerHandler = (message: ConsumeMessage) => Promise<void>;

export async function connectRabbitMQ(): Promise<RabbitMQClient> {
  const connection = await connect(env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(env.RABBITMQ_EXCHANGE, "topic", {
    durable: true,
  });

  return {
    connection,
    channel,
    close: async () => {
      await channel.close();
      await connection.close();
    },
  };
}

export async function consumeTopic(options: {
  client: RabbitMQClient;
  queueName: string;
  routingKey: string;
  handler: ConsumerHandler;
}): Promise<void> {
  const { client, queueName, routingKey, handler } = options;

  const { queue } = await client.channel.assertQueue(queueName, {
    durable: true,
  });

  await client.channel.bindQueue(queue, env.RABBITMQ_EXCHANGE, routingKey);
  await client.channel.prefetch(10);

  await client.channel.consume(
    queue,
    (message) => {
      if (!message) return;
      void handler(message);
    },
    { noAck: false }
  );
}
