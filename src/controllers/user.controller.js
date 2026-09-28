const httpStatus = require("http-status").default;
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const pick = require("../utils/pick");
const { userService } = require("../services");

const createUser = catchAsync(async (req, res) => {
  const { body } = req;
  const user = await userService.createUser(body);
  res.status(httpStatus.CREATED).send(user);
});
const getUserById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = await userService.getUserById(id);
  res.send(user);
});

const getAllUser = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["email", "userType", "roleId"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const user = await userService.getAllUser(filter, options);

  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const { params, body } = req;

  const user = await userService.updateUser(params, body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  res.send(result);
});

// Loggined user

const getLogginedUser = catchAsync(async (req, res) => {
  const id = req.user._id;
  const user = await userService.getUserById(id);
  res.send(user);
});

module.exports = {
  createUser,
  getUserById,
  deleteUser,
  getAllUser,
  updateUser,
  getLogginedUser,
};
