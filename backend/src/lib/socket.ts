import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export { io, server, app };

const userSocketMap: Record<string, string> = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("User added to online map:", userId);
    console.log("Current online users:", Object.keys(userSocketMap));
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (userId) {
      delete userSocketMap[userId];
      console.log("User removed from online map:", userId);
      console.log("Current online users:", Object.keys(userSocketMap));
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//io.emit used for sending events to all connected users
