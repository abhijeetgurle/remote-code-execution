import amqp from "amqplib";

export const queueName = "codeSubmitted";
export let channel: amqp.Channel;

const createQueue = async () => {
  if (channel) return;
  const connection = await amqp.connect("amqp://localhost:5672");
  channel = await connection.createChannel();
  channel.assertQueue(queueName);
};

createQueue();
