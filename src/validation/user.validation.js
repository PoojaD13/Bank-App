const Joi = require("joi");
const { userType, userTypeValues } = require("../constant/user-type");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
    userType: Joi.string()
      .required()
      .valid(...userTypeValues),
    roleId: Joi.string().when("userType", {
      is: userType.employee,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  }),
};

const getUser = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAllUser = {
  query: Joi.object().keys({
    email: Joi.string().email(),
    userType: Joi.string().valid(...userTypeValues),
    roleId: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().min(8),
    name: Joi.string(),
    roleId: Joi.string(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  createUser,
  getUser,
  deleteUser,
  updateUser,
  getAllUser,
};
