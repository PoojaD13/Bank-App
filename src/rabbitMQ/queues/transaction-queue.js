const { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } = require("../constants");


const setupTransactionQueue = async (channel) => {
  // Exchange setup
  await channel.assertExchange(EXCHANGE_NAME.TRANSACTION, "topic", {
    durable: true,
  });

  // Queue setup
  await channel.assertQueue(QUEUE_NAME.TRANSACTION, {
    durable: true,
    arguments: {
      "x-queue-type": "quorum",
      "x-dead-letter-exchange": EXCHANGE_NAME.DLX,
      "x-dead-letter-routing-key": ROUTING_KEY.TRANSACTION_DLX,
    },
  });

  // Bind queue to exchange
  await channel.bindQueue(
    QUEUE_NAME.TRANSACTION,
    EXCHANGE_NAME.TRANSACTION,
    ROUTING_KEY.TRANSACTION_COMPLETED,
  );
};

module.exports = {
  setupTransactionQueue,
};
