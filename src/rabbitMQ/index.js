/***
 * RabbitMQ topology is set here
 * blueprint designer for your RabbitMQ infrastructure
 * It sets up the main communication channels, dead-letter queues (DLQ), and retry mechanisms
 * and main queue
 */

const { getChannel } = require("../config/rabbitmq");

const { setupTransactionQueue } = require("./queues/transaction-queue");
const { setUpRegisterationQueue } = require("./queues/register-queue");

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
  await setUpRegisterationQueue(channel);

  console.log("RabbitMQ topology initialized");
}

module.exports = {
  initializeRabbitMQ,
};
