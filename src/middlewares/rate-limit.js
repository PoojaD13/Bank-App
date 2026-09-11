const rateLimti = require("express-rate-limit");

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
});

module.exports = {
  authLimit,
};
