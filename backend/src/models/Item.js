const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);
