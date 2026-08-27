/** ==========================================
 *  APPLICATION CONFIGURATION & ROUTING LAYER
 * =========================================
 * - Registers middleware (CORS, Parsers, Auth).
 * - Defines routes and global error handlers.
 * - Exports the app instance without starting the server (for easy testing).
 */

const express = require("express");
const router = require("./routers/v1");
const httpStatus = require("http-status").default;
const ApiError = require("./utils/ApiError");
const cookieParser = require("cookie-parser");
const { errorHandler, errorConverter } = require("./middlewares/error");

const app = express();

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// route mounting
app.use("/api/v1", router);

// send back if unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
