const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please Provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please Provide Valid Email",
    },
  },
  password: {
    type: String,
    required: [true, "Please Provide password"],
    minlength: 6,
    maxlength: 50,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (typePassword) {
  const isPasswordMatch = await bcrypt.compare(typePassword, this.password);
  return isPasswordMatch;
};

module.exports = {
  User: mongoose.model("User", userSchema),
};
