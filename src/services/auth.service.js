const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");

const userService = require("./user.service");
const tokenService = require("./token.service");

const register = async (body) => {
  const user = await userService.createUser(body);
  return user;
};

const login = async (body) => {
  const user = await userService.getUserByEamilAndPassword(body.email);
  if (!user || !user.comparePassword(body.password)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email or password is wrong");
  }
  return user;
};

module.exports = {
  register,
  login,
};
