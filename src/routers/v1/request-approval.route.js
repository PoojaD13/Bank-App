const express = require("express");
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validation");
const { modulesName } = require("../../constant/permission");
const checkRights = require("../../middlewares/check-rights.middleware");
const { requestApprovalValidation } = require("../../validation");
const { requestApprovalController } = require("../../controllers");

const router = express.Router();

// Base collection endpoints for creating workflows and listing pages
router
  .route("/")
  .post(
    auth,
    checkRights(modulesName.transaction, ["WRITE"]), // Adjust permission actions as needed
    validate(requestApprovalValidation.createApproval),
    requestApprovalController.createApproval,
  )
  .get(
    auth,
    checkRights(modulesName.transaction, ["READ"]),
    validate(requestApprovalValidation.queryApprovalsWithPagination),
    requestApprovalController.queryApprovalsWithPagination,
  );

// Route for specific role step review queues
router
  .route("/pending-queue")
  .get(auth, requestApprovalController.getPendingApprovalsByRole);

// Route for committing an approval or rejection step action
router
  .route("/:id/action/transaction")
  .patch(
    auth,
    checkRights(modulesName.transaction, [
      "APPROVE_WITHDRAWAL",
      "REJECT_WITHDRAWAL",
    ]),
    validate(requestApprovalValidation.processStepAction),
    requestApprovalController.processStepAction,
  );

module.exports = router;
