const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a pet name"],
  },
  category: {
    type: String,
    required: [true, "Please provide a pet category"],
  },
  status: {
    type: String,
    enum: ["available", "pending", "sold"],
    default: "available",
  },
  quantity: { type: Number, required: [true, "Please provide a pet stock"] }, // to use in auctions
  tags: [
    {
      type: String,
      required: [true, "Please provide a pet tag"],
    },
  ],
  photoUrls: [String],
  ownerId: { type: mongoose.Schema.Types.ObjectId }, // to make authorization on each pet "no one can delete or modify other pets"
  bids: [{ bidder: String, amount: Number }],
});

module.exports = mongoose.model("Pet", PetSchema);
