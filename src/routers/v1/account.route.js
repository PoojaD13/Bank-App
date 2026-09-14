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

router.get("/myAccount", auth, accountController.getAccountOfLogginedUser);
router.get("/myBalance", auth, accountController.getBalanceOfLogginedUserById);

router
  .route("/:accountNumber")
  .get(
    auth,
    checkRights(modulesName.account, ["READ"]),
    validate(accountValidation.getAccountByAccountNumber),
    accountController.getAccountByAccountNumber,
  )
  .patch(
    auth,
    checkRights(modulesName.account, ["UPDATE"]),
    validate(accountValidation.updateAccounts),
    accountController.updateAccount,
  );

  router.route("/close/:accountNumber").patch(
    auth,
    checkRights(modulesName.account, ["CLOSE"]),
    validate(accountValidation.closeAccounts),
    accountController.closeAccount,
  );

module.exports = router;
