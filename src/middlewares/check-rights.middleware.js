const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");

const checkRights = (requestedModule, requestedAction) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
  const permissions = req.user?.roleId?.permissions;
  console.log(permissions);

  const actions = permissions?.get(requestedModule) || [];
  console.log(actions);

  if (!actions || !actions.includes(requestedAction)) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You don't have permission to perform this action",
    );
  }

  next();
};

module.exports = checkRights;
