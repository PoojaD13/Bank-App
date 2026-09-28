require("dotenv").config();

/***
 * This file acts as a dedicated, long-running background process.
 * worker process that sits in the background, waits for messages to arrive in RabbitMQ, and passes them to your consumer files to be processed. It does not do anything else.
 */

const { connectRabbitMQ, closeRabbitMQ } = require("../config/rabbitmq");

const { initializeRabbitMQ } = require("./index");

const {
  startTransactionConsumer,
} = require("./consumers/transaction-consumer");
const { startRegisterConsumer } = require("./consumers/register-consumer");

let shuttingDown = false;

async function startWorker() {
  try {
    /*
     * 1. Connect to RabbitMQ
     */
    const channel = await connectRabbitMQ();

    /*
     * 2. Create exchanges,
     *    queues and bindings
     */
    await initializeRabbitMQ();

    /*
     * 3. Start all consumers
     */
    await startTransactionConsumer(channel);
    await startRegisterConsumer(channel);

    // Add future consumers here
    //
    // await startNotificationConsumer(channel);
    // await startSomethingConsumer(channel);

    console.log("RabbitMQ worker started successfully");
  } catch (error) {
    console.error("RabbitMQ worker startup failed:", error);

    await closeRabbitMQ();

    process.exit(1);
  }
}

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  console.log(`${signal} received. Shutting down worker...`);

  try {
    /*
     * Closing the RabbitMQ connection
     * also closes the consumer channel.
     *
     * Unacknowledged messages can then
     * be redelivered by RabbitMQ.
     */
    await closeRabbitMQ();

    console.log("RabbitMQ worker stopped gracefully");

    process.exit(0);
  } catch (error) {
    console.error("Worker shutdown failed:", error);

    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

startWorker();
