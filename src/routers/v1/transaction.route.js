const express = require("express");
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validation");
const { transactionValidation } = require("../../validation");
const { transactionController } = require("../../controllers");

const router = express.Router();

router
  .route("/")
  .post(
    auth,
    validate(transactionValidation.createTransaction),
    transactionController.createTransaction,
  );

module.exports = router;
