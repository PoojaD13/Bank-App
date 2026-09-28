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
       // console.log("register.consumer.js file data", data.data);


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
