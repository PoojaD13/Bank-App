const httpStatus = require("http-status").default;
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { transactionService } = require("../services");

const createTransaction = catchAsync(async (req, res) => {
  const { body } = req;
  const result = await transactionService.createTxn(body);
  res.send(result);
});

const getAllTransaction = catchAsync(async (req, res) => {
  const accNo = req.params.accNo;
  const filter = pick(req.query, ["transferType"]);
  const options = pick(req.query, ["sortBy", "page", "limit"]);
  const data = await transactionService.getAllTransaction(accNo,filter, options);
  res.send(data);
});

module.exports = {
  createTransaction,
  getAllTransaction,
};
