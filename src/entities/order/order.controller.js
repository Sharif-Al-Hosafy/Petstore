const createError = require("../../utils/errors/error.module");
const Order = require("./order.model");
const User = require("../users/user.model");
const Pet = require("../pets/pet.model");

const placeOrder = async (req, res) => {
  const { quantity, status, complete } = req.body;
  const order = await Order.create({
    buyerId: req.user.id,
    petId: req.params.id,
    quantity,
    status,
    complete,
  });
  res.status(201).json(order);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order.buyerId != req.user.id)
    throw createError(401, "Unauthorized attempt");
  if (!order) throw createError(404, "No Orders Found");

  res.status(200).json(order);
};

const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order.buyerId != req.user.id)
    throw createError(401, "Unauthorized attempt");

  const orderToDelete = await Order.findByIdAndDelete(req.params.id);
  if (!orderToDelete) throw createError(404, "No Orders Found");

  res.status(200).json(orderToDelete);
};

const inventory = async (req, res) => {
  const users = await User.find(); // get all users

  const pets = Promise.all(
    users.map(async (user) => {
      const thisUser = await User.findById(user.id).populate("pets");
      return thisUser.pets;
    })
  );
  const inventory = await pets;

  res.status(200).json(inventory.flat()); // getting all user's pets
};

module.exports = {
  placeOrder,
  getOrderById,
  deleteOrder,
  inventory,
};
