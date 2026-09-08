const modulesName = {
  account: "ACCOUNT",
  transaction: "TRANSACTION",
  loan: "LOAN",
  role: "ROLE",
  customer: "CUSTOMER",
};

const moduleValues = Object.values(modulesName);

const modulePermissions = {
  ACCOUNT: ["READ", "CREATE", "UPDATE", "FREEZE", "UNFREEZE", "CLOSE"],
  TRANSACTION: [
    "READ",
    "DEPOSIT",
    "WITHDRAW",
    "TRANSFER",
    "APPROVE_WITHDRAWAL",
    "REJECT_WITHDRAWAL",
  ],

  CUSTOMER: ["READ", "CREATE", "UPDATE"],

  ROLE: ["READ", "CREATE", "UPDATE", "ACTIVATE", "DEACTIVATE"],

  LOAN: ["READ", "CREATE", "UPDATE", "APPROVE", "REJECT"],
};

module.exports = {
  modulesName,
  moduleValues,
  modulePermissions,
};
