const { getChannel } = require("../config/rabbitmq");



const { setupTransactionQueue } = require("./queues/transaction-queue");

const { setupTransactionRetryQueue } = require("./retry/transaction-retry");

const { setupTransactionDLQ } = require("./dlq/transaction-dlq");

async function initializeRabbitMQ() {
  const channel = getChannel();


  /*
   * DLX + DLQ
   */
  await setupTransactionDLQ(channel);

  /*
   * Retry exchange + retry queue
   */
  await setupTransactionRetryQueue(channel);

  /*
   * Main queue
   */
  await setupTransactionQueue(channel);

  console.log("RabbitMQ topology initialized");
}

module.exports = {
  initializeRabbitMQ,
};
