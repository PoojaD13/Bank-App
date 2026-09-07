const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");
const { Role } = require("../models");

const createRole = async (body) => {
  console.log(body);
  const result = await Role.create(body);
  return result;
};

module.exports = {
  createRole,
};
