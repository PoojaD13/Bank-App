const httpStatus = require("http-status").default;
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { requestApprovalService } = require("../services");

const createApproval = catchAsync(async (req, res) => {
  const { body } = req;
  const result = await requestApprovalService.createApproval(body);
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No matching bank rule engine found for this amount criteria.",
    );
  }
  res.status(httpStatus.CREATED).send(result);
});

const processStepAction = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { actionChoice } = req.body;
  // Assumes user's role ID is attached to req.user by your auth middleware
  const userRoleId = req.user.roleId._id;

  if (!userRoleId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "User role identification is missing from the session context.",
    );
  }

  const result = await requestApprovalService.processStepAction(
    id,
    userRoleId,
    actionChoice,
  );
  res.send(result);
});

const getPendingApprovalsByRole = catchAsync(async (req, res) => {
  // Pulls role ID from the authenticated user context
  const userRoleId = req.user.roleId;

  if (!userRoleId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "User role identification is missing from the session context.",
    );
  }

  const result =
    await requestApprovalService.getPendingApprovalsByRole(userRoleId);
  res.send(result);
});

const queryApprovalsWithPagination = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["moduleName", "status", "refrenceId"]);
  const options = pick(req.query, ["sortBy", "page", "limit"]);

  const result = await requestApprovalService.queryApprovalsWithPagination(
    filter,
    options,
  );
  res.send(result);
});

module.exports = {
  createApproval,
  processStepAction,
  getPendingApprovalsByRole,
  queryApprovalsWithPagination,
};
