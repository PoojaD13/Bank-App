// const amqp = require("amqplib");
const { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } = require("../constants");

const setUpRegisterationQueue = async (channel) => {
  // setup exchange
 await channel.assertExchange(EXCHANGE_NAME.REGISTER, "direct", { durable: true });

  // set up queue
 await channel.assertQueue(QUEUE_NAME.REGISTER, { durable: true });

  // binding the exchange with queue
  await channel.bindQueue(
    QUEUE_NAME.REGISTER,
    EXCHANGE_NAME.REGISTER,
    ROUTING_KEY.REGISTER,
  );
};

module.exports = { setUpRegisterationQueue };
