const Joi = require("joi");

const createUser = Joi.object().keys({
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
  },
});

module.exports = {
  createUser,
};
