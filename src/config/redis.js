const { createClient } = require("redis");
const logger = require("./logger");

const redisURL = `redis://${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const redisClient = createClient({ url: redisURL });

redisClient.on("connect", () => {
  logger.info("Redis connected");
});

redisClient.on("ready", () => {
  logger.info("Redis ready ");
});

redisClient.on("end", () => {
  logger.info("Redis disconnected ");
});
redisClient.on("reconnecting", () => {
  logger.info("Redis reconnecting ");
});

redisClient.on("error", (e) => {
  logger.error("Redis connection error", e.message);
});

// Making connection
async function connectRedis() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Redis connection error:", error);
    // setTimeout(connectRedis, 5000); // Retry after 5 seconds
  }
}

const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
};
// connectRedis();
// if node js instance is terminated then we need to close the connection to redis
// process.on("SIGINT", async () => {
//   console.log("SIGINT signal received: closing Redis client");
//   await redisClient.quit();
//   process.exit(0);
// });

module.exports = { redisClient, connectRedis, disconnectRedis };
