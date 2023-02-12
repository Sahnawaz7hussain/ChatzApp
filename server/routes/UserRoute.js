const userRoute = require("express").Router();
const { UserModel } = require("../models/User");

userRoute.post("/", async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    //console.log(req.body);

    const user = await UserModel.create({ name, email, password, picture });
    res.status(201).json(user);
  } catch (e) {
    let msg;
    if (e.code == 11000) {
      msg = "User already exists";
    } else {
      msg = e.message;
    }
    res.status(400).json(msg);
    console.log("err: ", e.message);
  }
});

// login user.;

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log(req.body, "elll");
    const user = await UserModel.findByCredentials(email, password);
    user.status = "online";
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

module.exports = { userRoute };
