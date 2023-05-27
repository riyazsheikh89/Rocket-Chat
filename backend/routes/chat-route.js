const express = require("express");

const { authenticate } = require("../middlewares/authentication");
const {
  accessChat,
  fetchChats,
  createGroupChat,
} = require("../controllers/chat-controller");

const router = express.Router();

router.route("/").post(authenticate, accessChat);
router.route("/").get(authenticate, fetchChats);
router.route("/group").post(authenticate, createGroupChat);
// router.route("/rename").patch(authenticate, renameGroup);
// router.route("/remove-user").patch(authenticate, removeFromGroup);
// router.route("/add-user").patch(authenticate, addToGroup);

module.exports = router;
