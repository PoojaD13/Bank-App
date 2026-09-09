const httpStatus = require("http-status").default;
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");

const { accountService } = require("../services");

const createAccount = catchAsync(async (req, res) => {
  const id = req.user._id;
  const { body } = req;
  const account = await accountService.createAccount(id, body);
  res.status(httpStatus.CREATED).send(account);
});

const getAccounts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["userId"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const accounts = await accountService.getAccounts(filter, options);
  res.send(accounts);
});

const getAccountByAccountNumber = catchAsync(async (req, res) => {
  const { accountNumber } = req.params;
  const account = await accountService.getAccountDetails(accountNumber);
  res.send(account);
});

module.exports = {
  createAccount,
  getAccountByAccountNumber,
  getAccounts,
};
