const jwt = require("jsonwebtoken");

const signToken = async (userId, type, secret, expiresIn) => {
  const payload = {
    userId: userId,
    type: type,
  };
  return jwt.sign(payload, secret, { expiresIn });
};

const generateAccessToken = async (user) => {
  return await signToken(
    user._id,
    "access",
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRE_IN,
  );
};

const generateRefreshToken = async (user) => {
  return await signToken(
    user._id,
    "refresh",
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_EXPIRE_IN,
  );
};

const generateToken = async (user) => {
  // const accessToken = await signToken(
  //   user._id,
  //   "access",
  //   process.env.ACCESS_TOKEN_SECRET,
  //   process.env.ACCESS_TOKEN_EXPIRE_IN,
  // );
  // const refreshToken = await signToken(
  //   user._id,
  //   "refresh",
  //   process.env.REFRESH_TOKEN_SECRET,
  //   process.env.REFRESH_TOKEN_EXPIRE_IN,
  // );
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return {
    token: accessToken,
    refreshToken: refreshToken,
  };
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
};
