import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { exec } from "child_process";

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
    const filename = uuidv4();

    fs.writeFileSync(`codeFiles/${filename}.js`, code);

    exec(`node codeFiles/${filename}.js`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        res.json({
          status: "ERROR",
          error: error,
        });
        return;
      }

      if (stderr) {
        console.log(`stderr: ${stderr}`);
        res.json({
          status: "ERROR",
          error: error,
        });
        return;
      }

      res.json({
        status: "SUCCESS",
        data: stdout,
      });
      return;
    });
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
