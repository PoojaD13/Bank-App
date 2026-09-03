const { Ledger } = require("../models");

const createLedgerEntry = async (data, session) => {
  const ledgerEntry = await Ledger.create([data], { session });
  return ledgerEntry;
};

module.exports = { createLedgerEntry };
