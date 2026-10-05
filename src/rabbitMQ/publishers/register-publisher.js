const { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } = require("../constants");

const { getChannel } = require("../../config/rabbitmq");

const publishRegister = async (user) => {
  const channel = getChannel();
  const event = {
    eventId: user._id.toString(),
    eventType: "User registration message",
    data: {
      name: user.name,
      email: user.email,
    },
  };

  const msg = Buffer.from(JSON.stringify(event));

  const published = await channel.publish(
    EXCHANGE_NAME.REGISTER,
    ROUTING_KEY.REGISTER,
    msg,
    {
      persistent: true,
      contentType: "application/json",
      messageId: event.eventId,
    },
  );

  if (!published) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to publish transaction completed event",
    );
  }

  try {
    await channel.waitForConfirms();
    console.log("Register event published successfully");
  } catch (e) {
    console.error("Error while waiting for confirms: ", e);
  }
};


module.exports = {
  publishRegister,
};