const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status").default;

const { roleService } = require("../services");

const createRole = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user.id;
  if (!body.createdBy) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  const result = await roleService.createRole(body);
  res.send(result);
});

module.exports = {
  createRole,
};
