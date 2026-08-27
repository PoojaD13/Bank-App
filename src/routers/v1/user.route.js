const express = require("express");
const { userController } = require("../../controllers");
const { userValidation } = require("../../validation");
const router = express.Router();

router.post("/", //userValidation.createUser,
     userController.createUser);

router.get("/", userController.getUser);

module.exports = router;
