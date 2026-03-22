import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoute from "./routes/authRoute";
import { isDatabaseConnected } from "./prisma/prisma";
import { redis } from "./lib/createClient";
import messageRoute from "./routes/messageRoute";
import cookieParser from "cookie-parser";
import cors from "cors";
import { io, server, app } from "./lib/socket";

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" })); //middle ware for json files
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("", (req, res) => {
  res.send("You are in home route");  
});

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);


server.listen(PORT, async () => {
  console.log(`Server is running on ${PORT} port`);
  console.log("Database is connected", await isDatabaseConnected());
  console.log("redis is connected", await redis.set("foo", "bar"));
});
