const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status").default;

const { roleService, accountService } = require("../services");

const createRole = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user.id;
  if (!body.createdBy) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  const result = await roleService.createRole(body);
  res.status(httpStatus.CREATED).send(result);
});

const getAllRole = async (req, res) => {
  const filter = pick(req.query, ["name"]);
  const options = pick(req.query, ["sortBy", "page", "limit"]);

  const result = await roleService.getAllRole(filter, options);
  res.send(result);
};

const getById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const role = await roleService.getById(id);
  res.send(role);
});

const updateRole = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { body } = req;
  const role = await roleService.updateRole(id, body);
  res.send(role);
});

const deleteRole = catchAsync(async (req, res) => {
  const id = req.params.id;
  const role = await roleService.deleteRole(id);
  res.send(role);
});

module.exports = {
  createRole,
  getAllRole,
  updateRole,
  getById,
  deleteRole,
};
