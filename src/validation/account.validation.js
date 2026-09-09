const Joi = require("joi");
const { currencyValues } = require("../constant/currency");

const createAccount = {
  body: Joi.object().keys({
    currency: Joi.string()
      .valid(...currencyValues)
      .required(),
  }),
};

const getAccountByAccountNumber = {
  params: Joi.object().keys({
    accountNumber: Joi.string().required(),
  }),
};

const getAccounts = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createAccount,
  getAccountByAccountNumber,
  getAccounts,
};
