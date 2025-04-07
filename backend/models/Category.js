// models/Category.js
const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
  },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Category", CategorySchema);
