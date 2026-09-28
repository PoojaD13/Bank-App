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

  if (!data.data.name || !data.data.email) {
    const error = new Error("user data is missing");

    error.permanent = true;
    throw error;
  }
}

// async function publishRetry(channel, message, retryCount) {
//   const headers = {
//     ...(message.properties.headers || {}),
//     "x-retry-count": retryCount,
//   };

//   const published = channel.publish(
//     EXCHANGE_NAME.RETRY,
//     ROUTING_KEY.TRANSACTION_RETRY,
//     message.content,
//     {
//       persistent: true,
//       contentType: message.properties.contentType || "application/json",
//       messageId: message.properties.messageId,
//       headers,
//     },
//   );

//   /*
//    * publish() returning false means
//    * the channel write buffer is full.
//    *
//    * Do not ACK the original message.
//    */
//   if (!published) {
//     throw new Error("RabbitMQ publisher buffer is full");
//   }

//   /*
//    * Wait until RabbitMQ confirms
//    * that the retry message was accepted.
//    */
//   await channel.waitForConfirms();
// }

async function startRegisterConsumer(channel) {
  await channel.prefetch(10);

  await channel.consume(
    QUEUE_NAME.REGISTER,

    async (message) => {
      if (!message) {
        return;
      }

      try {
        //1. Parse
        const data = parseMessage(message);
        // validate
        validateMessage(data);

        // for testing purpose

        console.log("register.consumer.js file data", data.data);
        await emailService.sendRegistrationEmail(
          data.data.email,
          data.data.name,
        );

        /*
         * 4. Processing successful
         */
        channel.ack(message);

        console.log(`Message processed successfully: ${data.eventId}`);
      } catch (error) {
        console.error("Message processing failed:", error);
      }
    },
    {
      noAck: false,
    },
  );

  console.log(`Transaction consumer started: ${QUEUE_NAME.TRANSACTION}`);
}

module.exports = {
  startRegisterConsumer,
};
