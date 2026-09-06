const httpStatus = require("http-status").default;
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { transactionService } = require("../services");



const createTransaction = catchAsync(async (req, res) => {
  const { body } = req;
  const result = await transactionService.createTxn(body);
  res.send(result);
});

module.exports = {
  createTransaction,
  initialTransaction,
};
