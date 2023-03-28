import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

import { channel, queueName } from "./rabbitmq";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

const allowedOrigins = ["http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/code", async (req: Request, res: Response) => {
  try {
    const code = req.body.code;
    const id = uuidv4();
    const message = {
      id,
      code,
    };

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

    return res.json({
      status: "SUCCESS",
    });
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
