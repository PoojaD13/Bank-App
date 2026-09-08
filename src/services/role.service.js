const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");
const { Role } = require("../models");

const createRole = async (body) => {
  const result = await Role.create(body);
  return result;
};

const updateRole = async (id, body) => {
  const result = await Role.findByIdAndUpdate(id, { ...body }, { new: true });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role ID Not found");
  }
  return result;
};

module.exports = {
  createRole,
  updateRole,
};
