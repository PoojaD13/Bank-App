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
  )
  .get(
    auth,
    checkRights(modulesName.role, ["READ"]),
    validate(roleValidation.getAllRole),
    roleController.getAllRole,
  );

router
  .route("/:id")
  .get(
    auth,
    checkRights(modulesName.role, ["READ"]),
    validate(roleValidation.getById),
    roleController.getById,
  )
  .patch(
    auth,
    checkRights(modulesName.role, ["UPDATE"]),
    validate(roleValidation.updateRole),
    roleController.updateRole,
  )
  .delete(
    auth,
    checkRights(modulesName.role, ["DELETE"]),
    validate(roleValidation.deleteRole),
    roleController.deleteRole,
  );

module.exports = router;
