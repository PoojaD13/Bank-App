const express = require("express");
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validation");
const { userController } = require("../../controllers");
const { userValidation } = require("../../validation");


const router = express.Router();

router.post(
  "/",
  validate(userValidation.createUser),
  userController.createUser,
);

router.get("/", auth, userController.getUser);

module.exports = router;
