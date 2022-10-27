const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    maxlength: 20,
    minlength: 4,
    unique: true,
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
    unique: true,
  },
  userType: {
    type: String,
    enum: ["owner", "customer"],
    default: "customer",
  },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }], // if the user is owner
});

UserSchema.methods.CreateJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.username, userType: this.userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

module.exports = mongoose.model("User", UserSchema);
