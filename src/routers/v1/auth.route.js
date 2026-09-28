const express = require("express");

const validate = require("../../middlewares/validation");
const { authValidation } = require("../../validation");
const { authController } = require("../../controllers");

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register,
);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/refresh", authController.refresh);

router.post("/logout", authController.logout);

// refresh token and logout enpoint

module.exports = router;
