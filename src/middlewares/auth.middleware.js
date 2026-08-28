const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const { userService } = require("../services");

const auth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await userService.getUserById(decoded.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error details", err);

    if (err.name === "TokenExpiredError") {
      return next(new ApiError(httpStatus.UNAUTHORIZED, "Token expired"));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
    }
    return next(
      new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal server error try again later",
      ),
    );
  }
};

module.exports = auth;
