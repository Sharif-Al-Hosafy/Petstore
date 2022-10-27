const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId },
  quantity: Number,
  shipDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["placed", "approved", "delivered"],
    default: "placed",
  },
  complete: Boolean,
});

module.exports = mongoose.model("Order", OrderSchema);
