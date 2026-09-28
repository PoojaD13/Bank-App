const { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } = require("../constants");

const { emailService } = require("../../services");

const MAX_RETRIES = process.env.RABBITMQ_MAX_RETRY || 3;

function parseMessage(message) {
  try {
    return JSON.parse(message.content.toString());
  } catch (error) {
    error.permanent = true;
    throw error;
  }
}

function validateMessage(data) {
  if (!data || typeof data !== "object") {
    const error = new Error("Invalid message body");

    error.permanent = true;
    throw error;
  }

  if (!data.eventId || !data.eventType) {
    const error = new Error("eventId or eventType is missing");

    error.permanent = true;
    throw error;
  }

  if (!data.user || !data.transaction) {
    const error = new Error("user or transaction is missing");

    error.permanent = true;
    throw error;
  }
}

function getRetryCount(message) {
  const headers = message.properties.headers || {};

  return Number(headers["x-retry-count"] || 0);
}

async function publishRetry(channel, message, retryCount) {
  const headers = {
    ...(message.properties.headers || {}),
    "x-retry-count": retryCount,
  };

  const published = channel.publish(
    EXCHANGE_NAME.RETRY,
    ROUTING_KEY.TRANSACTION_RETRY,
    message.content,
    {
      persistent: true,
      contentType: message.properties.contentType || "application/json",
      messageId: message.properties.messageId,
      headers,
    },
  );

  if (!published) {
    throw new Error("RabbitMQ publisher buffer is full");
  }

  /*
   * Waiting until RabbitMQ confirms
   * that the retry message was accepted.
   */
  await channel.waitForConfirms();
}

async function startTransactionConsumer(channel) {
  await channel.prefetch(10);

  await channel.consume(
    QUEUE_NAME.TRANSACTION,

    async (message) => {
      if (!message) {
        return;
      }

      try {
        /*
         * 1. Parse
         */
        const data = parseMessage(message);

        /*
         * 2. Validate
         */
        validateMessage(data);

        /*Testing purpose */

        // console.log(
        //   "transaction.consumer.js file data",
        //   data,
        //   data.user,
        //   data.transaction,
        // );
        await emailService.sendTransactionEmail(data.user, data.transaction);

        /*
         * 4. Processing successful
         */
        channel.ack(message);

        console.log(`Message processed successfully: ${data.eventId}`);
      } catch (error) {
        console.error("Message processing failed:", error);

        const retryCount = getRetryCount(message);

        /*
         * =====================================
         * PERMANENT ERROR / MAX RETRIES
         * =====================================
         *
         * requeue = false
         *
         * Main queue's
         * x-dead-letter-exchange
         * will route the message to DLQ.
         */
        if (error.permanent === true || retryCount >= MAX_RETRIES) {
          channel.nack(message, false, false);

          console.log(
            `Message sent to DLQ: ${message.properties.messageId || "unknown"}`,
          );

          return;
        }

        /*
         * =====================================
         * RETRY AVAILABLE
         * =====================================
         */
        try {
          const nextRetry = retryCount + 1;

          /*
           * Publish original message
           * to retry exchange.
           */
          await publishRetry(channel, message, nextRetry);

          /*
           * Retry publication was
           * confirmed by RabbitMQ.
           *
           * Now it is safe to ACK
           * the original message.
           */
          channel.ack(message);

          console.log(
            `Message scheduled for retry ${nextRetry}/${MAX_RETRIES}`,
          );
        } catch (retryError) {
          /*
           * Retry publication was not
           * confirmed.
           *
           * DO NOT ACK original message.
           *
           * Requeue it so the message
           * cannot be lost.
           */
          console.error("Retry publication failed:", retryError);

          channel.nack(message, false, true);
        }
      }
    },
    {
      noAck: false,
    },
  );

  console.log(`Transaction consumer started: ${QUEUE_NAME.TRANSACTION}`);
}

module.exports = {
  startTransactionConsumer,
};
