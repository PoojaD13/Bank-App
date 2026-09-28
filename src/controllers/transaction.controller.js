const httpStatus = require("http-status").default;
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { transactionService } = require("../services");

const createTransaction = catchAsync(async (req, res) => {
  const { body } = req;
  const result = await transactionService.createTxn(body);
  res.status(httpStatus.CREATED).send(result);
});

const getAllTransaction = catchAsync(async (req, res) => {
  const accNo = req.params.accNo;

  const filter = pick(req.query, ["transferType", "startDate", "endDate"]);
  const options = pick(req.query, ["sortBy", "page", "limit"]);

  const data = await transactionService.getAllTransaction(
    accNo,
    filter,
    options,
  );
  res.send(data);
});

const excuteTxn = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await transactionService.excuteTransaction(id);
  res.send(result);
});


const getTransactionById = catchAsync(async (req, res) => {
  const id = req.params.id;

 const userId = req.user.id;
  const result = await transactionService.getTransactionById(id, userId);
  res.send(result);
});

module.exports = {
  createTransaction,
  getAllTransaction,
  excuteTxn,
  getTransactionById,
};
