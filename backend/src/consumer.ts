import amqp from "amqplib";

import fs from "fs";
import { exec } from "child_process";
import { redisClient } from "./redis";

const queueName = "codeSubmitted";

const executeCode = (code: string, filename: string) => {
  redisClient.set(filename, "EXECUTING");

  fs.writeFileSync(`codeFiles/${filename}.js`, code);
  exec(`node codeFiles/${filename}.js`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      redisClient.set(filename, `ERROR: ${error.message}`);
      return;
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`);
      redisClient.set(filename, `ERROR: ${stderr}`);
      return;
    }

    console.log("stdout: ", stdout);
    redisClient.set(filename, `Successfully executed: ${stdout}`);

    return;
  });
};

async function connect() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    channel.consume(queueName, (message) => {
      if (message) {
        console.log(message.content.toString());
        const parsedMessage = JSON.parse(message.content.toString());

        redisClient.set(parsedMessage.id, "PROCESSING");
        executeCode(parsedMessage.code, parsedMessage.id);
        channel.ack(message);
      }
    });
    console.log(`Waiting for messages...`);
  } catch (ex) {
    console.error(ex);
  }
}

connect();
