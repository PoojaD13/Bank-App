const jwt = require("jsonwebtoken");

const signToken = async (userId, type, secret, expiresIn) => {
  const payload = {
    sub: userId,
    type: type,
  };
  return jwt.sign(payload, secret, { expiresIn });
};

const generateToken = async (user) => {
  const accessToken = await signToken(
    user._id,
    "access",
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRE_IN,
  );
  const refreshToken = await signToken(
    user._id,
    "refresh",
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_EXPIRE_IN,
  );

  return {
    token: accessToken,
    refreshToken: refreshToken,
  };
};

// const generateRefreshToken = async (user) => {
//   const payload = {
//     sub: user._id,
//     type: "refresh",
//   };
//   return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
//     expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
//   });
// };

module.exports = {
  generateToken,
};
