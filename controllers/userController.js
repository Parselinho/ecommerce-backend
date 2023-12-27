const { User } = require("../models/User");
const CustomError = require("../errors");
const {
  createTokenUser,
  cookiesHandler,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const allUsers = await User.find({ role: "user" }).select("-password");
  res.status(200).json({ allUsers });
};

const getSingleUser = async (req, res) => {
  const singleUser = await User.findOne({ _id: req.params.id }).select(
    "-password"
  );
  if (!singleUser) {
    throw new CustomError.NotFoundError("User is not exist");
  }
  checkPermissions(req.user, singleUser._id);
  res.status(200).json({ singleUser });
};

const showCurrentUser = async (req, res) => {
  console.log(req.user);
  res.status(200).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email) {
    throw new CustomError.BadRequestError(
      "You have to provide atleast one field"
    );
  }
  const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
    new: true,
    runValidators: true,
  });
  const tokenUser = createTokenUser(user);
  cookiesHandler({ res, user: tokenUser });

  res.status(200).json({ user });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "please provide old and new passwords"
    );
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPassMatch = await user.comparePassword(oldPassword);
  if (!isPassMatch) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({ msg: "Password Changed" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
