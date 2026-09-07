const modules = {
  account: "ACCOUNT",
  transaction: "TRANSACTION",
  loan: "LOAN",
  employee: "EMPLOYEE",
  customer: "CUSTOMER",
};

const moduleValues = Object.values(modules);

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

  EMPLOYEE: ["READ", "CREATE", "UPDATE", "ACTIVATE", "DEACTIVATE"],

  LOAN: ["READ", "CREATE", "UPDATE", "APPROVE", "REJECT"],
};

module.exports = {
  modules,
  moduleValues,
  modulePermissions,
};
