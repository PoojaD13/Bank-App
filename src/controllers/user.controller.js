const httpStatus = require("http-status").default;
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const { userService } = require("../services");

const createUser = catchAsync(async (req, res) => {
  const { body } = req;
  const user = await userService.createUser(body);
  res.status(httpStatus.CREATED).send(user);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUser();

  res.send(user);
});

module.exports = {
  createUser,
  getUser
};
