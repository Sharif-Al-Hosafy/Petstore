const createError = require("../../utils/errors/error.module");
const User = require("./user.model");

const signUp = async (req, res) => {
  const newUser = await User.create({ ...req.body });
  const token = newUser.CreateJWT();
  res.status(201).json({ user: { username: newUser.username }, token });
};

module.exports = {
  signUp,
};
