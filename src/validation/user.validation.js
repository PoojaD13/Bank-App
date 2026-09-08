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

module.exports = {
  createUser,
};
