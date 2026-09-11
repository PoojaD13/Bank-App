const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validation");
const checkRights = require("../../middlewares/check-rights.middleware");
const auth = require("../../middlewares/auth.middleware");

const { bankRuleEngineController } = require("../../controllers");
const { bankRuleEngineValidation } = require("../../validation");
const { modulesName } = require("../../constant/permission");

router
  .route("/")
  .post(
    auth,
    checkRights(modulesName.bankRuleEngine, ["CREATE"]),
    validate(bankRuleEngineValidation.createRule),
    bankRuleEngineController.createRule,
  )
  .get(
    auth,
    checkRights(modulesName.bankRuleEngine, ["READ"]),
    validate(bankRuleEngineValidation.getRules),
    bankRuleEngineController.getRules,
  );

router
  .route("/:ruleId")
  .get(
    auth,
    checkRights(modulesName.bankRuleEngine, ["READ"]),
    validate(bankRuleEngineValidation.getRuleById),
    bankRuleEngineController.getRuleById,
  )
  .patch(
    auth,
    checkRights(modulesName.bankRuleEngine, ["UPDATE"]),
    validate(bankRuleEngineValidation.updateRule),
    bankRuleEngineController.updateRule,
  )
  .delete(
    auth,
    checkRights(modulesName.bankRuleEngine, ["DELETE"]),
    validate(bankRuleEngineValidation.deleteRule),
    bankRuleEngineController.deleteRule,
  );

module.exports = router;
