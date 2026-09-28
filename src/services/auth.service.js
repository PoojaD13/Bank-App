const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");

const userService = require("./user.service");
const tokenService = require("./token.service");
const {
  publishRegister,
} = require("../rabbitMQ/publishers/register-publisher");

const register = async (body) => {
  const user = await userService.createUser(body);
  await publishRegister(user);
  return user;
};

const login = async (body) => {
  const user = await userService.getUserByEamilAndPassword(body.email);
  if (!user || !user.comparePassword(body.password)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email or password is wrong");
  }
  const token = await tokenService.generateToken(user);
  return { user, token };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token is required");
  }
  let decode;
  try {
    decode = tokenService.verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "invalid refresh token");
  }
  if (decode.type !== "refresh") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "invalid refresh token");
  }
  const user = await userService.getUserById(decode.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User no longer exist");
  }
  const token = await tokenService.generateToken(user);
  return token;
};
module.exports = {
  register,
  login,
  refreshAccessToken,
};
