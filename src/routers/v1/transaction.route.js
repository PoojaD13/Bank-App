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
    checkRights(modulesName.transaction, "DEPOSIT"),
    validate(transactionValidation.createTransaction),
    transactionController.createTransaction,
  );

module.exports = router;
