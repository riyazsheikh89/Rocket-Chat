const express = require("express");
const dotenv = require("dotenv");
const socketio = require('socket.io');
const path = require('path');
const cors = require("cors");

const connectDB = require("./config/db-config");
const userRoute = require("./routes/user-route");
const chatRoute = require("./routes/chat-route");
const messageRoute = require("./routes/message-route");
const { notFound, errorHandler } = require("./middlewares/error-handler");

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

// -------------  DEPLOYMENT -------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} 
else {
  // this is to just showcase the user that backend running successfully,
  // but, this is not inside PRODUCTION MODE
  app.use("/*", (req, res) => {
    res.send(`Backend is running successfuly on PORT: ${PORT}. Warning! This is a not inside PRODUCTION MODE`);
  });
}

// -------------  DEPLOYMENT -------------

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
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
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

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop_typing", (room) => socket.in(room).emit("stop_typing"));

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

  // Disconnect the socket connection to save bandwidth
  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(user._id);
  });


});
