const express = require("express");
const dotenv = require("dotenv");
const data = require("./data/data");

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("<h1> Creating Chat Application using Socket.io </h1>");
});

app.get("/api/chats", (req, res) => {
  res.send(data);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
