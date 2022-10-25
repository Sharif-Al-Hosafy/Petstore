const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    maxlength: 20,
    minlength: 4,
  },
  firstName: {
    type: String,
    required: [true, "Please provide your first name"],
    maxlength: 20,
    minlength: 4,
  },
  lastName: {
    type: String,
    required: [true, "Please provide your last name"],
    maxlength: 20,
    minlength: 4,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
    minlength: 11,
  },
});

UserSchema.pre("save", async function () {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

UserSchema.methods.CreateJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.comparePass = async function (userPass) {
  const isMatch = await bcrypt.compare(userPass, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
