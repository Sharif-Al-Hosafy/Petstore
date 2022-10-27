const router = require("express").Router();
const {
  placeOrder,
  deleteOrder,
  getOrderById,
  inventory,
} = require("./order.controller");
const authenticationMiddleware = require("../../utils/authentication middleware/auth");

// post --> place order, get --> get order
router
  .route("/order/:id")
  .post(authenticationMiddleware, placeOrder)
  .get(authenticationMiddleware, getOrderById)
  .delete(authenticationMiddleware, deleteOrder);
router.route("/inventory").get(authenticationMiddleware, inventory);

module.exports = router;
