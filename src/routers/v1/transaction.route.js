const express = require("express");
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validation");
const { modulesName } = require("../../constant/permission");
const checkRights = require("../../middlewares/check-rights.middleware");
const { transactionValidation } = require("../../validation");
const { transactionController } = require("../../controllers");

const router = express.Router();

router
  .route("/")
  .post(
    auth,
    checkRights(modulesName.transaction, ["DEPOSIT", "WITHDRAWAL"]),
    validate(transactionValidation.createTransaction),
    transactionController.createTransaction,
  );

router
  .route("/transfer")
  .post(
    auth,
    validate(transactionValidation.createTransaction),
    transactionController.createTransaction,
  );

router
  .route("/:accNo")
  .get(
    auth,
    checkRights(modulesName.transaction, ["READ"]),
    validate(transactionValidation.getAllTransaction),
    transactionController.getAllTransaction,
  );

router
  .route("/:id/process-transaction")
  .patch(
    auth,
    checkRights(modulesName.transaction, ["DEPOSIT", "WITHDRAWAL"]),
    validate(transactionValidation.processTnx),
    transactionController.excuteTxn,
  );

router
  .route("/id/:id")
  .get(
    auth,
    validate(transactionValidation.getTxn),
    transactionController.getTransactionById,
  );

module.exports = router;
