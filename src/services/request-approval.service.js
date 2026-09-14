const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");
const { BankRuleEngine, RequestApproval } = require("../models");
const { approvalAction } = require("../constant/approval-action");
const mongoose = require("mongoose");

// create Approval
const createApproval = async (payload) => {
  const matchingRule = await BankRuleEngine.findOne({
    moduleName: payload.moduleName,
    minAmount: { $lte: payload.amount },
    maxAmount: { $gte: payload.amount },
    isArchive: false,
  });

  if (!matchingRule) {
    return matchingRule;
  }

  const existingPendingApproval = await RequestApproval.findOne({
    moduleName: payload.moduleName,
    refrenceId: payload.refrenceId,
    status: approvalAction.pending,
  });

  if (existingPendingApproval) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "An active approval workflow is already running for this resource.",
    );
  }

  // Clone structural rule configurations to avoid breaking historical records if rules change later
  const snapshotSteps = matchingRule.approvalSteps.map((step) => ({
    level: step.level,
    roleId: step.roleId,
    actions: step.actions,
  }));

  // Create the tracking document
  const data = RequestApproval.create({
    moduleName: payload.moduleName,
    refrenceId: payload.refrenceId,
    ruleId: matchingRule._id,
    approvalSnapshot: {
      approvalSteps: snapshotSteps,
    },
    status: approvalAction.pending,
  });
  return data;
};

// action to the approval steps
const processStepAction = async (id, userRoleId, actionChoice) => {
  const approvalDoc = await RequestApproval.findById(id);
  if (!approvalDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Approval record not found.");
  }

  if (approvalDoc.status !== approvalAction.pending) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `This verification workflow has already been finalized with status: ${approvalDoc.status}`,
    );
  }

  const steps = approvalDoc.approvalSnapshot.approvalSteps;
  // Discover the lowest incomplete step (the current active level)
  const currentStep = steps.find((step) =>
    step.actions.includes(approvalAction.pending),
  );
  if (!currentStep) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No active pending verification slots are available on this document.",
    );
  }

  // Enforce Authorization: Ensure the logged-in supervisor belongs to the target role required at this step
  if (currentStep.roleId.toString() !== userRoleId.toString()) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Your authorization profile does not possess the mandatory clearance level to sign off on this step tier.",
    );
  }

  // Process Action Options
  if (actionChoice === approvalAction.rejected) {
    // Rejections break the entire chain immediately
    currentStep.actions = [approvalAction.rejected];
    approvalDoc.status = approvalAction.rejected;
    approvalDoc.completedAt = new Date();
  } else if (actionChoice === approvalAction.approved) {
    currentStep.actions = [approvalAction.approved];

    // Check if this was the final level in the snapshot array check this logic
    const totalLevels = steps.length;
    if (currentStep.level === totalLevels) {
      approvalDoc.status = approvalAction.approved;
      approvalDoc.completedAt = new Date();
    }
    // If more levels exist, global status stays PENDING, making the next step active naturally
  }

  // Tell Mongoose to check modifications inside subdocuments array rows
  approvalDoc.markModified("approvalSnapshot.approvalSteps");
  await approvalDoc.save();

  return approvalDoc;
};

const getPendingApprovalsByRole = async (userRoleId) => {
  const filter = { "approvalSnapshot.approvalSteps.roleId": userRoleId };
  return RequestApproval.find(filter);
};

const queryApprovalsWithPagination = async (filter, options) => {
  const query = {};

  if (filter.moduleName) query.moduleName = filter.moduleName;
  if (filter.status) query.status = filter.status;
  if (filter.refrenceId) query.refrenceId = filter.refrenceId;

  const paginateOptions = {
    page: options.page || 1,
    limit: options.limit || 10,
    sort: options.sort || { createdAt: -1 },
    populate: [
      { path: "refrenceId" },
      // { path: "approvalSnapshot.approvalSteps.roleId", select: "name" },
    ],
  };

  return RequestApproval.paginate(query, paginateOptions);
};

const getApprovalByRefrenceId = async(refrenceId) =>{
  const data = await RequestApproval.findOne(refrenceId);
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, "Approval record not found.");
  }
  return data;
}

module.exports = {
  createApproval,
  processStepAction,
  getPendingApprovalsByRole,
  queryApprovalsWithPagination,
  getApprovalByRefrenceId
};
