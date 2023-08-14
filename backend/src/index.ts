import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

import { channel, queueName } from "./rabbitmq";
import { redisClient } from "./redis";

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
    const { code, problemId } = req.body;
    const id = uuidv4();
    const message = {
      id,
      code,
      problemId,
    };

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

    return res.json({
      status: "SUCCESS",
      data: {
        jobId: id,
      },
    });
  } catch (err) {
    console.error(err);
  }
});

app.get("/job/:jobId", async (req: Request, res: Response) => {
  try {
    const msg: any = await redisClient.get(req.params.jobId);

    return res.json({
      status: "SUCCESS",
      data: JSON.parse(msg),
    });
  } catch (err) {
    console.error(err);
    return res.json({
      status: "ERROR",
    });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
