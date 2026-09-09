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
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUser(req.params.id);
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
  
  const user = await  userService.updateUser(params, body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  res.send(result);
});

module.exports = {
  createUser,
  getUser,
  deleteUser,
  getAllUser,
  updateUser,
};
