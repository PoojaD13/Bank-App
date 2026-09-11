const Joi = require("joi");
const { modulesName } = require("../constant/permission");
const { approvalActionValues } = require("../constant/approval-action");

// Custom helper to validate MongoDB ObjectIds
// const objectId = (value, helpers) => {
//   if (!value.match(/^[0-9a-fA-F]{24}$/)) {
//     return helpers.message('"{{#label}}" must be a valid mongo id');
//   }
//   return value;
// };

const approvalStepSchema = Joi.object({
  level: Joi.number().integer().min(1).required(),
  roleId: Joi.string().required(),
  // roleId: Joi.string().custom(objectId).required(),
  actions: Joi.array()
    .items(Joi.string().valid(...approvalActionValues))
    .default(["PENDING"]),
});

const createRule = {
  body: Joi.object().keys({
    ruleName: Joi.string().required().trim(),
    moduleName: Joi.string()
      .valid(modulesName.loan, modulesName.transaction)
      .required(),
    minAmount: Joi.number().min(0).default(0),
    maxAmount: Joi.number().min(Joi.ref("minAmount")).required(),
    approvalSteps: Joi.array().items(approvalStepSchema).min(1).required(),
    description: Joi.string().allow("", null).trim(),
  }),
};

const getRules = {
  query: Joi.object().keys({
    moduleName: Joi.string().valid(modulesName.loan, modulesName.transaction),
    isActive: Joi.boolean(),
    limit: Joi.number().integer().default(10),
    page: Joi.number().integer().default(1),
  }),
};

const getRuleById = {
  params: Joi.object().keys({
    ruleId: Joi.string().required(),
  }),
};

const updateRule = {
  params: Joi.object().keys({
    ruleId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      ruleName: Joi.string().trim(),
      moduleName: Joi.string().valid(modulesName.loan, modulesName.transaction),
      minAmount: Joi.number().min(0),
      maxAmount: Joi.number().min(0),
      approvalSteps: Joi.array().items(approvalStepSchema).min(1),
      isActive: Joi.boolean(),
      description: Joi.string().allow("", null).trim(),
    })
    .min(1), // Forces at least one property to be present during updates
};

const deleteRule = {
  params: Joi.object().keys({
    ruleId: Joi.string().required(),
  }),
};

module.exports = {
  createRule,
  getRules,
  getRuleById,
  updateRule,
  deleteRule,
};
