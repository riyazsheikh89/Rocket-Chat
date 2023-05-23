const express = require("express");
const { register } = require("../controllers/user-controller");

const router = express.Router();

router.route("/register").post(register);
// router.post('/login', authUser);

module.exports = router;
