const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db-config");
const userRoute = require("./routes/user-route");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Chat Application using Socket.io </h1>");
});

app.use("/api/user", userRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Server started on PORT: ${PORT}`);
  await connectDB();
});
