const asyncHandler = require("express-async-handler");
const User = require("../models/user-model");

// Register a new User
const register = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Enter all the required feilds");
  }
  const user = await User.create({ name, email, password, image: pic });

  res.status(201).json({
    success: true,
    data: user,
    message: "Successfully created a user",
    err: {},
  });
});

// Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Enter all the required feilds");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("No user found with this email id");
  } else {
    if (await user.comparePassword(password)) {
      const token = await user.generateJWT();
      res.status(201).json({
        success: true,
        message: "Login Successful",
        err: {},
        data: token,
      });
    } else {
      res.status(400);
      throw new Error("Incorrect Password");
    }
  }
});

module.exports = { register, login };
