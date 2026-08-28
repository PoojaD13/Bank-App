const httpStatus = require("http-status").default;
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");

const { accountService } = require("../services");

const createAccount = catchAsync(async (req, res) => {
  const id = req.user._id;
  const { body } = req;
  const account = await accountService.createAccount(id,body);
  res.status(httpStatus.CREATED).send(account);
});

module.exports = {
  createAccount,
};
