const { redisClient } = require("../config/redis");
const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");

const setCacheData = async (key, value, expireAt = null) => {
  const jsonData = JSON.stringify(value);
  const ttlmillis = expireAt?.getTime() - Date.now();
  try {
    if (expireAt) {
      return await redisClient.set(key, jsonData, { PX: ttlmillis });
    } else {
      return await redisClient.set(key, jsonData);
    }
  } catch (error) {
    console.error("Error setting data in Redis:", error);
  }
};

const getCachedData = async (key) => {
  if (typeof key !== "string") return null;

  if (key.includes("undefined" || key.includes("null"))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid cache key:" + key);
  }

  const cachedRes = await redisClient.get(key);

  if (cachedRes) {
    return JSON.parse(cachedRes);
  }
  return null;
};

module.exports = { setCacheData, getCachedData };
