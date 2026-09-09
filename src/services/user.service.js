const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");

const { User } = require("../models");

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
};
