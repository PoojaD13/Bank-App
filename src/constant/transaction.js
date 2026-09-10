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
};

const transactionTypesValues = Object.values(transactionTypes);

module.exports = {
  transactionStatus,
  transactionStatusValues,
  transactionTypes,
  transactionTypesValues,
};
