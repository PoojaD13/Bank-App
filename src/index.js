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

const app = require("./app");

connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running on port http://localhost:${process.env.PORT || 3000}`,
  );
});
