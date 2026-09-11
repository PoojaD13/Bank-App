const Joi = require("joi");
const { currencyValues } = require("../constant/currency");
const { accountValues, accountStatus } = require("../constant/account-status");

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

const updateAccounts = {
  params: Joi.object().keys({
    accountNumber: Joi.string().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid(...accountValues).required(),
  }),
};

module.exports = {
  createAccount,
  getAccountByAccountNumber,
  getAccounts,
  updateAccounts,
};
