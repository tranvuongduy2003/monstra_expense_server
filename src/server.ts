import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import helmet from "helmet";
import { ErrorException } from "../error-handler/error-exception";
import { errorHandler } from "../error-handler/error-handler";

import firebaseAdminSdk from "../firebase-adminsdk.json";
const serviceAccount = firebaseAdminSdk as admin.ServiceAccount;

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${firebaseAdminSdk.project_id}.firebaseio.com`,
});

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(errorHandler);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ data: "Hello" });
});

app.post("/send-group-message", async (req: Request, res: Response) => {
  const { title, body, token } = req.body;
  console.log(req.body);

  const message = {
    token,
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ message: `Successfully sent message:", ${response}` });
  } catch (error) {
    throw new ErrorException("400", error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${process.env.PORT}!`);
});
