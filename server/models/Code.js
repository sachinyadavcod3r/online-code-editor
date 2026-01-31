const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String,
  language: String,
  code: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Code", codeSchema);
