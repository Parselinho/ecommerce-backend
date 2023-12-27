const { User } = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { cookiesHandler, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";

  const newUser = await User.create({ email, name, password, role });
  const userToken = createTokenUser(newUser);
  cookiesHandler({ res, user: userToken });
  res.status(StatusCodes.CREATED).json({ newUser });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.NotFoundError("Invalid Credentials");
  }
  console.log(user);
  const userToken = createTokenUser(user);
  cookiesHandler({ res, user: userToken });
  res.status(200).json({ user });
};
const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: "logout!" });
};

module.exports = {
  register,
  login,
  logout,
};
