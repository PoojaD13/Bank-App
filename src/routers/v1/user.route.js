const express = require("express");
const validate = require("../../middlewares/validation");
const { userController } = require("../../controllers");
const { userValidation } = require("../../validation");

const router = express.Router();

router.post(
  "/",
  validate(userValidation.createUser),
  userController.createUser,
);

router.get("/", userController.getUser);

module.exports = router;
