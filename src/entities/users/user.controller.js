const createError = require("../../utils/errors/error.module");
const User = require("./user.model");

const signUp = async (req, res) => {
  const newUser = await User.create({ ...req.body });
  const token = newUser.CreateJWT();
  res.status(201).json({ user: { username: newUser.username }, token });
};

const logIn = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    throw createError(400, "Please provide your name & your password");

  const user = await User.findOne({ username });
  if (!user) throw createError(401, "user is not found");

  const isPasswordMatch = await user.comparePass(password);
  if (!isPasswordMatch)
    throw createError(401, "Username or Password is incorrect");

  const token = user.CreateJWT();

  res.status(200).json({ token });
};

const getUser = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username }, "-password"); // get all user data without the password
  if (!user) throw createError(404, "user is not found");

  res.status(201).json(user);
};

const updateUser = async (req, res) => {
  const newUser = await User.create({ ...req.body });
  const token = newUser.CreateJWT();
  res.status(201).json({ user: { username: newUser.username }, token });
};

const deleteUser = async (req, res) => {
  const username = req.params.username;
  const deleted = await User.findOneAndDelete({ username });
  if (!deleted) throw createError(404, "user is not found"); // if username is not exist

  res.status(201).json({ message: `${username} is deleted` });
};

module.exports = {
  signUp,
  logIn,
  getUser,
  updateUser,
  deleteUser,
};
