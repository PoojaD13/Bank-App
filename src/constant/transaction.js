const transactionStatus = {
  pending: "PENDING",
  completed: "COMPLETED",
  failed: "FAILED",
  reverse: "REVERSE",
};

const transactionStatusValues = Object.values(transactionStatus);

const transactionTypes = {
  transfer: "TRANSFER",
  deposit: "DEPOSIT",
  withdrawal: "WITHDRAWAL",
  initial_balance: "INITIAL_BALANCE",
};

const transactionTypesValues = Object.values(transactionTypes);

module.exports = {
  transactionStatus,
  transactionStatusValues,
  transactionTypes,
  transactionTypesValues,
};
