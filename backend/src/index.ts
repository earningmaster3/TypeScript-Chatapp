import dotenv from "dotenv";
dotenv.config();
import { Express } from "express";
import express from "express";
import authRoute from "./routes/authRoute";
import { isDatabaseConnected } from "./prisma/prisma";
import { redis } from "./lib/createClient";
import messageRoute from "./routes/messageRoute";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); //middle ware for json files
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("", (req, res) => {
  res.send("You are in home route");
});

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

app.listen(PORT, async () => {
  console.log(`Server is running on ${PORT} port`);
  console.log("Database is connected", await isDatabaseConnected());
  console.log("redis is connected", await redis.set("foo", "bar"));
});
