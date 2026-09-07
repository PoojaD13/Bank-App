const express = require("express");
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validation");
const { roleController } = require("../../controllers");
const { roleValidation } = require("../../validation");

const router = express.Router();

router
  .route("/")
  .post(auth, validate(roleValidation.createRole), roleController.createRole);

module.exports = router;
