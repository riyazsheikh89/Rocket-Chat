const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "https://www.flaticon.com/free-icon/man_2202112",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const SALT = await bcrypt.genSalt(9);
  const hash = await bcrypt.hash(this.password, SALT);
  this.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const response = await bcrypt.compare(password, this.password);
  return response;
};

userSchema.methods.generateJWT = function generate() {
  const token = jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
