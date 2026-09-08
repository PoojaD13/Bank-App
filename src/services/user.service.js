const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");

const { User } = require("../models");

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserById = async (id) => {
  return User.findById(id).populate("roleId");
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
  return User.find();
};

module.exports = {
  createUser,
  getUser,
  getUserByEamilAndPassword,
  getUserByEmail,
  getUserById,
};
