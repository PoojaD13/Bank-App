const amqp = require("amqplib");
const logger = require("./logger");
const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");

let connection;
let channel;

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

async function connectRabbitMQ() {
    console.log("Connecting to RabbitMQ...");
  if (connection & channel) {
    return channel;
  }

  connection = await amqp.connect(RABBITMQ_URL);

  connection.on("error ", (error) => {
    logger.error("Rabbitmq connection error", error);
  });

  connection.on("close", () => {
    logger.info("Rabbitmq connection closed");

    connection = null;
    channel = null;
  });

  channel = await connection.createConfirmChannel();

  logger.info("Rabbitmq connected");
  return channel;
}

function getChannel() {
  if (!channel) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Rabbitmq channel is not connected",
    );
  }
  return channel;
}

async function closeRabbitMQ() {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }

    if (connection) {
      await connection.close();
      connection = null;
    }

    logger.info("Rabbit mq connection closed gracefully");
  } catch (error) {
    logger.error("Error while closing RabbitMQ ", error);
  }
}
module.exports = {
  closeRabbitMQ,
  getChannel,
  connectRabbitMQ,
};
