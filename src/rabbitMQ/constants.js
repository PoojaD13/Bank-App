const EXCHANGE_NAME = {
  TRANSACTION: "band.transaction",
  RETRY: "bank.retry",
  DLX: "bank.dlx",
};

const QUEUE_NAME = {
  TRANSACTION: "bank.transaction",
  TRANSACTION_RETRY: "bank.transaction.retry",
  TRANSACTION_DLX: "bank.transaction.dlx",
};

const ROUTING_KEY = {
  TRANSACTION_COMPLETED: "transaction.completed",
  TRANSACTION_RETRY: "transaction.retry",
  TRANSACTION_DLX: "transaction.dlx",
};

module.exports = {
  EXCHANGE_NAME,
  QUEUE_NAME,
  ROUTING_KEY,
};
