const express = require("express");
const app = express();
require("dotenv").config();
const { connection } = require("./connection");
const { userRoute } = require("./routes/UserRoute");

const rooms = ["general", "tech", "finance", "crypto"];
const cors = require("cors");

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
