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
    validate(userValidation.getAllUser),
    userController.getAllUser,
  );

router
  .route("/management/:id")
  .get(
    auth,
    checkRights(modulesName.employee, ["READ"]),
    validate(userValidation.getUserById),
    userController.getUserById,
  )
  .patch(
    auth,
    checkRights(modulesName.employee, ["UPDATE"]),
    validate(userValidation.updateUser),
    userController.updateUser,
  )
  .delete(
    auth,
    checkRights(modulesName.employee, ["DELETE"]),
    validate(userValidation.deleteUser),
    userController.deleteUser,
  );

// router
//   .route("/management/all")
// .get(
//   auth,
//   checkRights(modulesName.employee, ["READ"]),
//   validate(userValidation.getAllUser),
//   userController.getAllUser,
// );

router.route("/profile").get(auth, userController.getLogginedUser);
module.exports = router;
