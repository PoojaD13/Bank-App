/**==========================================
 * APPLICATION ENTRY POINT & PROCESS LIFECYCLE
 * ==========================================
 * - Validates environment variables.
 * - Connects to databases and external services.
 * - Starts the HTTP server and binds to the network port.
 * - Handles process events (SIGTERM) for graceful shutdowns.
 */

require("dotenv").config();
const connectDB = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq");
const logger = require("./config/logger");
const { connectRedis } = require("./config/redis");

const app = require("./app");

connectDB();

connectRedis();

connectRabbitMQ();

app.listen(process.env.PORT || 3000, () => {
  logger.info(
    `Server is running on port http://localhost:${process.env.PORT || 3000}`,
  );
});
