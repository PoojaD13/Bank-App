const express = require("express");
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validation");
const { modulesName } = require("../../constant/permission");
const checkRights = require("../../middlewares/check-rights.middleware");
const { userController } = require("../../controllers");
const { userValidation } = require("../../validation");

const router = express.Router();

router
  .route("/management/")
  .post(
    auth,
    checkRights(modulesName.employee, ["CREATE"]),
    validate(userValidation.createUser),
    userController.createUser,
  )
  .get(
    auth,
    checkRights(modulesName.employee, ["READ"]),
    validate(userValidation.getUser),
    userController.getUser,
  );

router
  .route("/management/:id")
  .delete(
    auth,
    checkRights(modulesName.employee, ["DELETE"]),
    validate(userValidation.deleteUser),
    userController.deleteUser,
  );

  router
  .route("/management/all")
  .delete(
    auth,
    checkRights(modulesName.employee, ["READ"]),
    validate(userValidation.getAllUser),
    userController.getAllUser,
  );
module.exports = router;
