const { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } = require("../constants");

const setupTransactionDLQ = async (channel) => {
  await channel.assertExchange(EXCHANGE_NAME.DLX, "direct", {
    durable: true,
  });

  await channel.assertQueue(QUEUE_NAME.TRANSACTION_DLX, {
    durable: true,
    arguments: { "x-queue-type": "quorum" },
  });

  await channel.bindQueue(
    QUEUE_NAME.TRANSACTION_DLX,
    EXCHANGE_NAME.DLX,
    ROUTING_KEY.TRANSACTION_DLX,
  );
};

module.exports = {
  setupTransactionDLQ,
};
