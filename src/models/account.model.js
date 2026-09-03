const mongoose = require("mongoose");
const { currencyValues, currencyTypes } = require("../constant/currency");
const { accountValues, accountStatus } = require("../constant/account-status");

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    accountNumber: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: accountValues,
      default: accountStatus.active,
    },
    currency: {
      type: String,
      required: true,
      enum: currencyValues,
      default: currencyTypes.INR,
    },
  },

  { timestamps: true },
);

accountSchema.index({ userId: 1, status: 1 }, { unique: true });

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
