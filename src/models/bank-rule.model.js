const mongoose = require("mongoose");
const {
  approvalAction,
  approvalActionValues,
} = require("../constant/approval-action");

const { modulesName } = require("../constant/permission");
const mongoosePaginate = require("mongoose-paginate-v2");

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

// Main Rule Schema for a specific Banking Module and Amount Range
const bankRuleEngineSchema = new mongoose.Schema(
  {
    ruleName: {
      type: String,
      required: true,
      trim: true, // Example: "High Value Loan Approval Matrix"
    },
    moduleName: {
      type: String,
      required: true,
      //enum: ["WITHDRAWAL", "LOAN", "TRANSFER"], // Target module
      enum: [modulesName.loan, modulesName.transaction],
    },
    // Financial Thresholds
    minAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    maxAmount: {
      type: Number,
      required: true,
      min: 0, // Use a massive number like 999999999999 for "No Upper Limit"
    },
    // Multi-level approval steps ordered by 'level' (Step 1 -> Step 2 -> Step 3)
    approvalSteps: [approvalStepSchema],

    // Basic Audit & Meta Fields
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

bankRuleEngineSchema.index({
  moduleName: 1,
  minAmount: 1,
  maxAmount: 1,
  isActive: 1,
});

bankRuleEngineSchema.plugin(mongoosePaginate);

const BankRuleEngine = mongoose.model("BankRuleEngine", BankRuleEngineSchema);

module.exports = BankRuleEngine;
