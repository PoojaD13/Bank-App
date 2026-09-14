const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");
const { Role, User } = require("../models");

const createRole = async (body) => {
  const result = await Role.create(body);
  return result;
};

const getById = async (id) => {
  const data = await Role.findOne({ _id: id, isArchive: false });
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role Not Found");
  }
  return data;
};
const getAllRole = async (filter, options) => {
  filter.isArchive = false;
  const data = await Role.paginate(filter, options);
  return data;
};

const updateRole = async (id, body) => {
  const result = await Role.findOneAndUpdate(
    { _id: id, isArchive: false },
    { ...body },
    { new: true },
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role ID Not found/deleted");
  }
  return result;
};

const deleteRole = async (id) => {
  const user = await User.findOne({ roleId: id, isActive: true });
  if (user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Role is assigned to a user, cannot delete",
    );
  }

  const result = await Role.findOneAndUpdate(
    { _id: id, isArchive: false },
    { isArchive: true },
    { new: true },
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role ID Not found/deleted");
  }
  return result;
};

module.exports = {
  createRole,
  updateRole,
  getAllRole,
  getById,
  deleteRole,
};
