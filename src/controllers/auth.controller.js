const httpStatus = require("http-status").default;
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { authService, tokenService, emailService } = require("../services");

const register = catchAsync(async (req, res) => {
  const { body } = req;
  const user = await authService.register(body);
  if (!user) {
    return (new ApiError(httpStatus.BAD_REQUEST, "User registration failed"));
  }
  res.status(httpStatus.CREATED).send(user);
  await emailService.sendRegistrationEmail(user.email, user.name);
});

const login = catchAsync(async (req, res) => {
  const { body } = req;
  const user = await authService.login(body);

  const token = await tokenService.generateToken(user);

  const jwtCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(
      Date.now() +
        parseInt(process.env.REFRESH_TOKEN_EXPIRE_IN) * 24 * 60 * 60 * 1000,
    ),
  };
  res.cookie("refresh", token.refreshToken, jwtCookieOptions);
  res.send({ user: user, accessToken: token.token });
});

module.exports = {
  register,
  login,
};
