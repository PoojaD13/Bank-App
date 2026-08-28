const express = require("express");

const validate = require("../../middlewares/validation");
const { accountController } = require("../../controllers");
const { accountValidation } = require("../../validation");
const auth = require("../../middlewares/auth.middleware");

const router = express.Router();

router
  .route("/")
  .post(
    auth,
     validate(accountValidation.createAccount),
    accountController.createAccount,
  );

module.exports = router;
