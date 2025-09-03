const mongoose = require("mongoose");

const availabilitySchema = mongoose.Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    unique: true
  },
  day: {
    type: Map,
    of: new mongoose.Schema({
      start: {
        type: String,
        required: true,
      },
      end: {
        type: String,
        required: true,
      },
    }),
    required: true,
  },
  totalChairs: {
    type: Number,
    required: true,
  },
});

const Availability = mongoose.model("Availability", availabilitySchema);
module.exports = Availability;
