const express = require('express');
const { authenticate } = require('../middlewares/authentication');
const { sendMessage, getMessages } = require('../controllers/message-controller');

const router = express.Router();

router.post('/', authenticate, sendMessage);    // send message
router.get('/:chatId', authenticate, getMessages);  // fetch messages of particular chatId

module.exports = router;