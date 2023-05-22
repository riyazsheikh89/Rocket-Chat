const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "https://www.flaticon.com/free-icon/man_2202112",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = Message;
