const express = require("express");
const {
  register,
  login,
  findUsers,
} = require("../controllers/user-controller");
const { authenticate } = require("../middlewares/authentication");

const router = express.Router();

router.route("/register").post(register);
router.post("/login", login);
router.get("/find", authenticate, findUsers);

module.exports = router;
