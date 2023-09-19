const express = require("express");
const dotenv = require("dotenv");
const socketio = require('socket.io');

const connectDB = require("./config/db-config");
const userRoute = require("./routes/user-route");
const chatRoute = require("./routes/chat-route");
const messageRoute = require("./routes/message-route");
const { notFound, errorHandler } = require("./middlewares/error-handler");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Chat Application using Socket.io </h1>");
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, async () => {
  console.log(`Server started on PORT: ${PORT}`);
  await connectDB();
});

const io = socketio(server, {
  pingTimeout: 60000, // after 60s connection will broke
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  // takes user info from frontend, and creates a room exclusive to the user 
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log('userID: ', userData._id);
    socket.emit("connected");
  });

  // when you click a particular chat, it creates a room,
  // and other user can join the room using the roomID
  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log("User joined room: ", room);
  });

  socket.on("new_message", (newMsgRcvd) => {
    let chat = newMsgRcvd.chat;

    if (!chat.users)
      return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      // only send the messages to the other membesr of the grp
      if (user._id !== newMsgRcvd.sender._id)
        socket.in(user._id).emit("message_received", newMsgRcvd);
    });
  });


});
