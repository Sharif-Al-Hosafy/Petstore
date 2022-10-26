const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
  tags: [
    {
      type: String,
      required: [true, "Please provide a pet tag"],
    },
  ],
  photoUrls: [String],
});

module.exports = mongoose.model("Pet", UserSchema);
