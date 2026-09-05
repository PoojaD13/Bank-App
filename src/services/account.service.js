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
  return Account.findById(id);
};

const getAccountDetails = async (accountNumber) => {
  return Account.findOne({ accountNumber, status: accountStatus.active });
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
};
