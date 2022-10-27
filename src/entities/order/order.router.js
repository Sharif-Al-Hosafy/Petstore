const router = require("express").Router();
const {
  placeOrder,
  deleteOrder,
  getOrderById,
  inventory,
} = require("./order.controller");

// post --> place order, get --> get order
router
  .route("order/:id")
  .post(placeOrder)
  .get(getOrderById)
  .delete(deleteOrder);
router.route("/inventory").get(inventory);

module.exports = router;
