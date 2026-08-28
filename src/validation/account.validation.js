const Joi = require("joi");
const { currencyValues } = require("../constant/currency");

const createAccount = {
  body: Joi.object().keys({
    currency: Joi.string()
      .valid(...currencyValues)
      .required(),
  }),
};

module.exports = {
  createAccount,
};
