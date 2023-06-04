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
  const token = await user.generateJWT();

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    admin: user.admin,
    image: user.image,
    token
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
        _id: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin,
        image: user.image,
        token
      });
    } else {
      res.status(400);
      throw new Error("Incorrect Password");
    }
  }
});

// Get all users
// query string: /api/user/getall?search=riyaz
const findUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search;
  const option = keyword
    ? {
        $or: [
          // search for the matching name or email, starts with
          { name: { $regex: "^" + keyword, $options: "i" } }, // i -> case insensitive
          { email: { $regex: "^" + keyword, $options: "i" } },
        ],
      }
    : {};
  // find all the matching users, execpt the loged in user
  const users = await User.find(option).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { register, login, findUsers };
