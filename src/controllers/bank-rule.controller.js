const httpStatus = require("http-status").default;
const catchAsync = require("../utils/catch-async");
const pick = require("../utils/pick");
const { bankRuleService } = require("../services");

const createRule = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user.id;
  const rule = await bankRuleService.createRule(body);
  res.status(201).send(rule);
});

const getRules = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "moduleName",
    "isActive",
    "CreatedBy",
    "updatedBy",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);

  const rules = await bankRuleService.queryRules(filter, options);
  res.send(rules);
});

const getRuleById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const rule = await bankRuleService.getRuleById(id);

  res.send(rule);
});

const updateRule = catchAsync(async (req, res) => {
  const { body, params } = req;
  body.updatedBy = req.user.id;
  const rule = await bankRuleService.updateRuleById(params, body);
  res.send(rule);
});

const deleteRule = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = await bankRuleService.deleteRuleById(id);
  res.send(data);
});

module.exports = {
  createRule,
  getRules,
  getRuleById,
  updateRule,
  deleteRule,
};
