const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");

const { Account, Ledger } = require("../models");
const { ledgerTypes } = require("../constant/ledger-types");
const { accountStatus } = require("../constant/account-status");

const createAccount = async (id, body) => {
  const accountNumber = await generateAccountNumber();

  const account = await Account.create({
    accountNumber: accountNumber,
    userId: id,
    ...body,
  });

  return account;
};

const getAccountById = async (id) => {
  return Account.findOne({ _id: id, status: accountStatus.active });
};

const getAccountDetails = async (accountNumber) => {
  const acc = await Account.findOne({
    accountNumber,
    status: accountStatus.active,
  });
  if (!acc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Account not found");
  }
  return acc;
};

const getAccounts = async (filter, options) => {
  filter.status = accountStatus.active;
  return Account.paginate(filter, options);
};

const getAccountBalance = async (id) => {
  const balance = await Ledger.aggregate([
    {
      $match: { account: id },
    },
    {
      $group: {
        _id: null,
        balance: {
          $sum: {
            $cond: [
              { $eq: ["$type", ledgerTypes.credit] },
              "$amount",
              { $multiply: [-1, "$amount"] },
            ],
          },
        },
      },
    },
  ]);

  // check from here
  if (balance.length === 0) {
    return 0;
  }

  return balance[0].balance;
};

const generateAccountNumber = async () => {
  let accNo;
  let exists = true;
  while (exists) {
    accNo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    exists = await Account.findOne({ accountNumber: accNo });
  }
  return accNo;
};

module.exports = {
  createAccount,
  getAccountById,
  getAccountBalance,
  getAccountDetails,
  generateAccountNumber,
  getAccounts
};
