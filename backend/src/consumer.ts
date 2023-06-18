import amqp from "amqplib";

import fs from "fs";
import { exec } from "child_process";
import { redisClient } from "./redis";
import tests from "./tests";

const queueName = "codeSubmitted";

const getFinalCode = (code: string) => {
  let finalCode = code;

  for (const test of tests.add) {
    finalCode +=
      "\n" + `console.log(add(` + test.params.a + "," + test.params.b + "))";
  }

  return finalCode;
};

const executeCode = (code: string, filename: string) => {
  const finalCode = getFinalCode(code);
  fs.writeFileSync(`codeFiles/${filename}.js`, finalCode);

  exec(`node codeFiles/${filename}.js`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      const msg = {
        jobStatus: "ERROR",
        jobOutput: error.message,
      };
      redisClient.set(filename, JSON.stringify(msg));
      return;
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`);
      const msg = {
        jobStatus: "ERROR",
        jobOutput: stderr,
      };
      redisClient.set(filename, JSON.stringify(msg));
      return;
    }

    const results = stdout.split("\n");
    let jobStatus = "SUCCESS";
    for (let i = 0; i < tests.add.length; i++) {
      if (tests.add[i].result !== Number(results[i])) {
        jobStatus = "MISMATCHED";
        break;
      }
    }

    const msg = {
      jobStatus,
      jobOutput: stdout,
    };
    redisClient.set(filename, JSON.stringify(msg));

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

        const msg = {
          jobStatus: "PROCESSING",
          jobOutput: "PROCESSING",
        };
        redisClient.set(parsedMessage.id, JSON.stringify(msg));

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
