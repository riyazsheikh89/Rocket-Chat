const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const asyncHandler = require("express-async-handler");

const authenticate = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      // Find the user without password and attach the userInfo to req.
      req.user = await User.findById(decodedData.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Authentication failed! invalid token");
    }
  } else {
    res.status(401);
    throw new Error("No authentication token found!");
  }
});

module.exports = { authenticate };
