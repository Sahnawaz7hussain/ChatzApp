import expres from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = expres();
const httpServer = http.createServer(app);
const port = process.env.PORT || 8080;
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// base route of the server
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// socket connection
io.on("connection", (socket) => {
  console.log(`a user connected with id ${socket.id}`);
  socket.on("send-message", (data) => {
    socket.broadcast.emit("message-from-server", data);
    console.log("message received", data);
  });
  socket.on("disconnect", () => {
    // socket.rooms.size === 0
    console.log("socket disconnected");
  });
  // console.log("a user connected with reat app");
});

// server listening
httpServer.listen(port, () => {
  console.log("listening on port", port);
});
