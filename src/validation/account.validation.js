const Joi = require("joi");
const { currencyValues } = require("../constant/currency");
const { accountValues, accountStatus } = require("../constant/account-status");

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};
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
    status: Joi.string()
      .valid(...accountValues)
      .required(),
  }),
};

const closeAccounts = {
  params: Joi.object().keys({
    accountNumber: Joi.string().required(),
  }),
};

module.exports = {
  createAccount,
  getAccountByAccountNumber,
  getAccounts,
  updateAccounts,
  closeAccounts,
};
