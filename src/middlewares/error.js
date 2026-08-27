// const mongoose = require("mongoose");
// const httpStatus = require("http-status");
// const ApiError = require("../utils/ApiError");

// const errorConverter = (err, req, res, next) => {
// 	if (err instanceof ApiError) {
// 		return next(err);
// 	}

// 	const isMongooseError = err instanceof mongoose.Error;
// 	const statusCode =
// 		err.statusCode ||
// 		(isMongooseError
// 			? httpStatus.BAD_REQUEST
// 			: httpStatus.INTERNAL_SERVER_ERROR);

// 	const error = new ApiError(
// 		statusCode,
// 		err.message || "Internal server error",
// 		false,
// 		err.stack,
// 	);

// 	return next(error);
// };

// const errorHandler = (err, req, res, next) => {
// 	let { statusCode, message } = err;

// 	if (!statusCode) {
// 		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
// 	}

// 	if (process.env.NODE_ENV === "production" && !err.isOperational) {
// 		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
// 		message = "Internal server error";
// 	}

// 	const response = {
// 		code: statusCode,
// 		message: message || "Internal server error",
// 	};

// 	if (process.env.NODE_ENV === "development") {
// 		response.stack = err.stack;
// 	}

// 	return res.status(statusCode).send(response);
// };

// module.exports = {
// 	errorConverter,
// 	errorHandler,
// };


const mongoose = require("mongoose");
const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
