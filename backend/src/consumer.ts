import amqp from "amqplib";

import fs from "fs";
import { exec } from "child_process";

const queueName = "codeSubmitted";

const executeCode = (code: string, filename: string) => {
  fs.writeFileSync(`codeFiles/${filename}.js`, code);
  exec(`node codeFiles/${filename}.js`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("stdout: ", stdout);
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
        executeCode(parsedMessage.code, parsedMessage.id);
        // channel.ack(message);
      }
    });
    console.log(`Waiting for messages...`);
  } catch (ex) {
    console.error(ex);
  }
}
connect();
