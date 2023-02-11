const express = require("express");
const app = express();
require("dotenv").config();
const { connection } = require("./connection");
const { userRoute } = require("./routes/UserRoute");

const rooms = ["general", "tech", "finance", "crypto"];
const cors = require("cors");
const { MessageModel } = require("./models/Message");
const { UserModel } = require("./models/User");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.send({ message: "welcome to home page" });
});

const server = require("http").createServer(app);
const PORT = process.env.PORT || 8080;
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// get rooms
app.get("/rooms", (req, res) => {
  res.json(rooms);
});

//get Messages from rooms
async function getLastMessagesFromRoom(room) {
  let roomMessages = await MessageModel.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messageByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

// socket connection

io.on("connection", (socket) => {
  // new user.
  socket.on("new-user", async () => {
    const members = await UserModel.find();
    io.emit("new-user", members);
  });

  // join room.
  socket.on("join-room", async (room) => {
    socket.join(room);
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });
});

server.listen(PORT, async () => {
  try {
    console.log("connecting with db");
    await connection;
    console.log("connected with db");
  } catch (err) {
    console.log("db connection error👇");
    console.log(err.message);
  }
  console.log("listening on port", PORT);
});

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];
    return date1 - date2 ? -1 : 1;
  });
}
