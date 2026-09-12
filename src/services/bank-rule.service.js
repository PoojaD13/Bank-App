const { BankRuleEngine, Role } = require("../models");
const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");

const createRule = async (body) => {
  const roleIds = [
    ...new Set(body.approvalSteps.map((step) => step.roleId.toString())),
  ];
  const isExits = await Role.countDocuments({ _id: { $in: roleIds } });
  if (roleIds.length != isExits) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "One or more roleIds are invalid",
    );
  }
  const rule = await BankRuleEngine.create(body);

  return rule;
};

const queryRules = async (filter, options) => {
  filter.isArchive = false;
  const data = await BankRuleEngine.paginate(filter, options);
  return data;
};

const getRuleById = async (id) => {
  console.log(id);
  const data = await BankRuleEngine.findOne({
    _id: id,
    isArchive: false,
  }).populate("approvalSteps.roleId", "name");
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rule not found ");
  }
  return data;
};

const updateRuleById = async (id, body) => {
  if (body.approvalSteps) {
    const roleIds = [
      ...new Set(body.approvalSteps.map((step) => step.roleId.toString())),
    ];
    const isExits = await Role.countDocuments({ _id: { $in: roleIds } });
    if (roleIds.length != isExits) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "One or more roleIds are invalid",
      );
    }
  }
  const data = await BankRuleEngine.findOneAndUpdate(
    { _id: id, isArchive: false },
    { $set: body },
    { new: true },
  );

  if (!data) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Unable to update/ ID not found",
    );
  }
  return data;
};

const deleteRuleById = async (id) => {
  const data = await BankRuleEngine.findOneAndUpdate(
    { _id: id, isArchive: false },
    { isArchive: true },
    { new: true },
  );
  if (!data) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      " Rule already delete/ doesnt exist ",
    );
  }
  return data;
};

module.exports = {
  createRule,
  queryRules,
  getRuleById,
  updateRuleById,
  deleteRuleById,
};
