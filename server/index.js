const express = require("express");
const app = express();
require("dotenv").config();
const { connection } = require("./connection");
const { userRoute } = require("./routes/UserRoute");

const rooms = ["general", "tech", "finance", "crypto","The Boyes"];
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
    //   //origin: "*",
    //   methods: ["GET", "POST"],
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
  socket.on("join-room", async (newRoom, previousRoom) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  // message room.
  socket.on("message-room", async (room, content, sender, time, date) => {
    // console.log("new-message sender: ", sender);
    const newMessage = await MessageModel.create({
      content,
      from: sender,
      time,
      date,
      to: room,
      sender,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room.
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });

  app.delete("/logout", async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      const user = await UserModel.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();

      const members = await UserModel.find();
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });
});

server.listen(PORT, async () => {
  try {
    console.log("connecting with db...");
    await connection;
    console.log("connected with db");
    console.log("listening on port", PORT);
  } catch (err) {
    console.log("db connection error👇");
    console.log(err.message);
  }
});

// SORT MESSAGES BY DATE.
function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];
    return date1 < date2 ? -1 : 1;
  });
}
