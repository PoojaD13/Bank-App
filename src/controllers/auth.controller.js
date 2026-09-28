const httpStatus = require("http-status").default;
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { authService, tokenService } = require("../services");

const register = catchAsync(async (req, res) => {
  const { body } = req;
  const user = await authService.register(body);
  if (!user) {
    return new ApiError(httpStatus.BAD_REQUEST, "User registration failed");
  }
  res.status(httpStatus.CREATED).send(user);
});

const login = catchAsync(async (req, res) => {
  const { body } = req;
  const { user, token } = await authService.login(body);

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

const refresh = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refresh;
  const token = await authService.refreshAccessToken(refreshToken);

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
  res.send({ accessToken: token.token });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie("refresh", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.send({ message: "Logged out successfully" });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
};
