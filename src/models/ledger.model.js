const mongoose = require("mongoose");
const { ledgerTypesValues } = require("../constant/ledger-types");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status").default;

const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
    index: true,
    immutable: true,
  },

  amount: {
    type: Number,
    required: true,
    immutable: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
    index: true,
    immutable: true,
  },
  type: { type: String, enum: ledgerTypesValues, required: true },
});

function preventLedgerModification(next) {
  return next(
    new ApiError(httpStatus.BAD_REQUEST, "Ledger entries cannot be modified"),
  );
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);

ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);

ledgerSchema.index({ account: 1, type: 1 });

const Ledger = mongoose.model("Ledger", ledgerSchema);

module.exports = Ledger;
