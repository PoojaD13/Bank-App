const mongoose = require("mongoose");
const logger = require("./logger");

function connectDB() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      logger.info("MongoDB connected ");
    })
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
}

module.exports = connectDB;
