const Joi = require("joi");
const {
  transactionStatusValues,
  transactionTypes,
  transactionTypesValues,
} = require("../constant/transaction");

const createTransaction = {
  body: Joi.object().keys({
    transferType: Joi.string()
      .valid(...transactionTypesValues)
      .required(),
    fromAccountNo: Joi.string().when("transferType", {
      is: Joi.valid(transactionTypes.transfer, transactionTypes.withdrawal),
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    toAccountNo: Joi.string().when("transferType", {
      is: Joi.valid(
        transactionTypes.transfer,
        transactionTypes.deposit,
        // transactionTypes.initial_balance,
      ),
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    //  status: Joi.string().valid(...transactionStatusValues),
    idempotencyKey: Joi.string().required(),
    amount: Joi.number().required().min(1),
  }),
};

const getAllTransaction = {
  params: Joi.object().keys({
    accNo: Joi.string().required(),
  }),
  query: Joi.object().keys({
    transferType: Joi.string().valid(...transactionTypesValues),
    startDate: Joi.date(),
    endDate: Joi.date().when("startDate", {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref("startDate")),
    }),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createTransaction,
  getAllTransaction,
};
