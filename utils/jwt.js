const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const cookiesHandler = ({ res, user }) => {
  const createToken = createJWT({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", createToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });

  //   res.status(201).json({ user });
};

const createTokenUser = (user) => {
  const userToken = {
    name: user.name,
    userId: user._id,
    role: user.role,
  };
  return userToken;
};

module.exports = { createJWT, isTokenValid, cookiesHandler, createTokenUser };
