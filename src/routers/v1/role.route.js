const express = require("express");
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validation");
const checkRights = require("../../middlewares/check-rights.middleware");
const { modulesName } = require("../../constant/permission");
const { roleController } = require("../../controllers");
const { roleValidation } = require("../../validation");

const router = express.Router();

router
  .route("/")
  .post(
    auth,
    checkRights(modulesName.role, "CREATE"),
    validate(roleValidation.createRole),
    roleController.createRole,
  );

router
  .route("/:id")
  .patch(auth, validate(roleValidation.updateRole), roleController.updateRole);

module.exports = router;
