const { EXCHANGE_NAME } = require("../constants");

const setupTransactionExchange = async (channel) => {
  await channel.assertExchange(EXCHANGE_NAME.TRANSACTION, "topic", {
    durable: true,
  });
};

module.exports = { setupTransactionExchange };
