import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { Socket } from "socket.io";

const PORT = 3000;
const app = express();
const server = new createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

io.on("connection", (socket) => {
  console.log("User connected");
  console.log("Id", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
