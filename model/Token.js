const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
