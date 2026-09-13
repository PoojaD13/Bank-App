const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");
const { modulesName } = require("../constant/permission");
const {
  approvalActionValues,
  approvalAction,
} = require("../constant/approval-action");

// Schema for a single approval level/step in the workflow
const approvalStepSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true, // Example: 1 for Manager, 2 for Director
      min: 1,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true, // The specific role responsible for this specific level
    },
    actions: [
      {
        type: String,
        required: true,
        uppercase: true,
        enum: approvalActionValues,
        default: approvalAction.pending,
      },
    ],
  },
  { _id: false },
);

const requestApprovalSchema = new mongoose.Schema(
  {
    moduleName: {
      type: String,
      required: true,
      enum: [modulesName.loan, modulesName.transaction],
    },
    refrenceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // can be a loan entry or a transaction Id
    ruleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankRuleEngine",
      required: true,
    },

    approvalSnapshot: {
      approvalSteps: {
        type: [approvalStepSchema],
        required: true,
        minLength: 1,
      },
    },
    status: {
      type: String,
      required: true,
      enum: approvalActionValues,
      default: approvalAction.PENDING,
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

requestApprovalSchema.index({ modulesName: 1, refrenceId: 1, status: 1 });
requestApprovalSchema.index({ modulesName: 1 });
requestApprovalSchema.index({ refrenceId: 1, status: 1 });

requestApprovalSchema.plugin(mongoosePagination);

const RequestApproval = mongoose.model(
  "RequestApproval",
  requestApprovalSchema,
);
module.exports = RequestApproval;
