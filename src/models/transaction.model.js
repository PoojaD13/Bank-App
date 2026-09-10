const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const {
  transactionStatusValues,
  transactionStatus,
  transactionTypesValues,
  transactionTypes,
} = require("../constant/transaction");

const transactionSchema = new mongoose.Schema(
  {
    transferType: {
      type: String,
      enum: transactionTypesValues,
      required: true,
    },
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      index: true,
      required: function () {
        return (
          this.transferType === transactionTypes.transfer ||
          this.transferType === transactionTypes.withdrawal
        );
      },
    },
    fromAccountNo: {
      type: String,
      index: true,
      required: function () {
        return (
          this.transferType === transactionTypes.transfer ||
          this.transferType === transactionTypes.withdrawal
        );
      },
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      index: true,
      required: function () {
        return (
          this.transferType === transactionTypes.transfer ||
          this.transferType === transactionTypes.deposit
        );
      },
    },
    toAccountNo: {
      type: String,
      index: true,
      required: function () {
        return (
          this.transferType === transactionTypes.transfer ||
          this.transferType === transactionTypes.deposit
        );
      },
    },
    status: {
      type: String,
      enum: transactionStatusValues,
      required: true,
      default: transactionStatus.pending,
    },
    amount: { type: Number, required: true, min: 0 },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

transactionSchema.plugin(mongoosePaginate);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
