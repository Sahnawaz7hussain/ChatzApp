const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserScheme = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Can't be empty"] },
    email: {
      type: String,
      lowerCase: true,
      required: [true, "Can't be empty"],
      index: true,
      unique: true,
      validator: [isEmail, "invalidEmail"],
    },
    password: { type: String, required: [true, "Can't be empty"] },
    picture: { type: String },
    status: { type: String, default: "online" },
    newMessages: { type: Object, default: {} },
  },
  { minimise: false }
);

UserScheme.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash;
      next();
    });
  });
});

UserScheme.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

UserScheme.statics.findByCredentials = async function (email, password) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");
  return user;
};

const UserModel = mongoose.model("User", UserScheme);

module.exports = { UserModel };
