const { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } = require("../constants");

const setupTransactionRetryQueue = async (channel) => {
  // Exchange setup
  await channel.assertExchange(EXCHANGE_NAME.RETRY, "direct", {
    durable: true,
  });

  // queue setup
  await channel.assertQueue(QUEUE_NAME.TRANSACTION_RETRY, {
    durable: true,
    arguments: {
      "x-queue-type": "quorum",
      "x-message-ttl": 10000,
      "x-dead-letter-exchange": EXCHANGE_NAME.TRANSACTION,
      "x-dead-letter-routing-key": ROUTING_KEY.TRANSACTION_COMPLETED,
    },
  });

  // binding exchange to queue
  await channel.bindQueue(
    QUEUE_NAME.TRANSACTION_RETRY,
    EXCHANGE_NAME.RETRY,
    ROUTING_KEY.TRANSACTION_RETRY,
  );
};

module.exports = {
  setupTransactionRetryQueue,
};
