const { Account } = require("../models");

const createAccount = async (id, body) => {
  const account = await Account.create({ userId: id, ...body });
  return account;
};

module.exports = {
  createAccount,
};
