const { BankRuleEngine } = require("../models");
const httpStatus = require("'http-status").default;
const ApiError = require("../utils/ApiError");

const createRule = async (ruleBody) => {
  return BankRuleEngine.create(ruleBody);
};

const queryRules = async (filter, options) => {
  filter.isArchive = false;
  const data = await BankRuleEngine.paginate(filter, options);
  return data;
};

const getRuleById = async (id) => {
  const data = await BankRuleEngine.findOne({ id, isArchive: false }).populate(
    "approvalSteps.roleId",
    "name",
  );
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rule not found ");
  }
  return data;
};

const updateRuleById = async (params, body) => {
  const data = await BankRuleEngine.findOneAndUpdate(
    { _id: params.id, isArchive: false },
    { $set: body },
    { new: true },
  );

  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, "UNable to update");
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
