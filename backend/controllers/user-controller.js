const asyncHandler = require("express-async-handler");
const User = require("../models/user-model");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, image } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Enter all the required feilds");
  }

  const user = await User.create({ name, email, password, image });

  res.status(201).json({
    success: true,
    data: user,
    message: "Successfully created a user",
    err: {},
  });
});

module.exports = { register };
