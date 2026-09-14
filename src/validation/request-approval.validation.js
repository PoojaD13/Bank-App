const Joi = require("joi");
const { modulesName } = require("../constant/permission");
const { approvalActionValues } = require("../constant/approval-action");

// Custom helper to validate MongoDB ObjectIds
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const createApproval = {
  body: Joi.object().keys({
    moduleName: Joi.string()
      .valid(modulesName.loan, modulesName.transaction)
      .required(),
    refrenceId: Joi.string().custom(objectId).required(),
    amount: Joi.number().required().min(0),
  }),
};

const processStepAction = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    actionChoice: Joi.string()
      .valid(...approvalActionValues)
      .required(),
  }),
};

const queryApprovalsWithPagination = {
  query: Joi.object().keys({
    moduleName: Joi.string().valid(modulesName.loan, modulesName.transaction),
    status: Joi.string().valid(...approvalActionValues),
    refrenceId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createApproval,
  processStepAction,
  queryApprovalsWithPagination,
};
