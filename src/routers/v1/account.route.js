const express = require("express");

const validate = require("../../middlewares/validation");
const checkRights = require("../../middlewares/check-rights.middleware");
const { modulesName } = require("../../constant/permission");

const { accountController } = require("../../controllers");
const { accountValidation } = require("../../validation");
const auth = require("../../middlewares/auth.middleware");

const router = express.Router();

router
  .route("/")
  .post(
    auth,
    checkRights(modulesName.account, ["CREATE"]),
    validate(accountValidation.createAccount),
    accountController.createAccount,
  )
  .get(
    auth,
    checkRights(modulesName.account, ["READ"]),
    validate(accountValidation.getAccounts),
    accountController.getAccounts,
  );

router.get(
  "/:accountNumber",
  auth,
  checkRights(modulesName.account, ["READ"]),
  validate(accountValidation.getAccountByAccountNumber),
  accountController.getAccountByAccountNumber,
);

module.exports = router;
