const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    name: String,
    mimetype: String,
    path: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);