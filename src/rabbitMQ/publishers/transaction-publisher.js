const { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } = require("../constants");
const { getChannel } = require("../../config/rabbitmq");

const httpStatus = require("http-status").default;
const ApiError = require("../../utils/ApiError");

const publishTransactionCompleted = async (user, transaction) => {
  const channel = getChannel();

  const event = {
    eventId: transaction._id.toString(),
    eventType: "EVENTS.TRANSACTION_COMPLETED",
    user: {
      name: user.userId.name,
      email: user.userId.email,
    },
    transaction: {
      amount: transaction.amount,
      transferType: transaction.transferType, // dynamic safety fallback
      toAccountNo: transaction.toAccountNo || null,
    },
  };
  const msg = Buffer.from(JSON.stringify(event));

  const published = await channel.publish(
    EXCHANGE_NAME.TRANSACTION,
    ROUTING_KEY.TRANSACTION_COMPLETED,
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
    console.log("Transaction completed event published successfully");
  } catch (e) {
    console.error("Error while waiting for confirms: ", e);
  }
};
module.exports = {
  publishTransactionCompleted,
};
