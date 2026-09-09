const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");

const roleService = require("./role.service");
const { User } = require("../models");
const { userType } = require("../constant/user-type");

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserById = async (id) => {
  return User.findOne({ _id: id, isActive: true }).populate("roleId");
};

const getUserByEamilAndPassword = async (email) => {
  return User.findOne({ email }).select("+password");
};

/**
 * - Create a new user
 */
const createUser = async (body) => {
  const existingUser = await getUserByEmail(body.email);
  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "User with this email already exists",
    );
  }

  if (body.roleId) {
    const role = await roleService.getById(body.roleId);
    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, "Role Not Found");
    }
  }

  const user = await User.create(body);

  return user;
};

const getUser = async () => {
  return User.find({ isActive: true });
};

const getAllUser = async (filter, options) => {
  filter.isActive = true;
  return User.paginate(filter, options);
  // return User.find({ isActive: true });
};

const updateUser = async (params, body) => {
  let user = await getUserById(params.id);
  if (body?.roleId && user.userType !== userType.employee) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Only employee can have role");
  }
  return User.findByIdAndUpdate({ _id: params.id }, body, { new: true });
};
const deleteUser = async (id) => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found/ doesnt exist");
  }
  return User.findByIdAndUpdate(
    { _id: id },
    { isActive: false },
    { new: true },
  );
};

module.exports = {
  createUser,
  getUser,
  getUserByEamilAndPassword,
  getUserByEmail,
  getUserById,
  deleteUser,
  getAllUser,
  updateUser,
};
