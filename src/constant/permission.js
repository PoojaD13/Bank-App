const modulesName = {
  account: "ACCOUNT",
  transaction: "TRANSACTION",
  loan: "LOAN",
  role: "ROLE",
  customer: "CUSTOMER",
  employee: "EMPLOYEE",
  bankRuleEngine: "BANK_RULE_ENGINE",
};

const moduleValues = Object.values(modulesName);

const modulePermissions = {
  ACCOUNT: ["READ", "CREATE", "UPDATE"], // this represent the bank account
  TRANSACTION: [
    "READ",
    "DEPOSIT",
    "WITHDRAW",
    "TRANSFER",
    "APPROVE_WITHDRAWAL",
    "REJECT_WITHDRAWAL",
  ],
  EMPLOYEE: ["CREATE", "READ", "UPDATE", "ACTIVATE", "DEACTIVATE"],
  BANK_RULE_ENGINE: ["READ", "CREATE", "UPDATE", "DELETE"],

  CUSTOMER: ["READ", "CREATE", "UPDATE"],

  ROLE: ["READ", "CREATE", "UPDATE", "DELETE"],
  BANK_RULE_ENGINE: ["READ", "CREATE", "UPDATE", "DELETE"],

  LOAN: ["READ", "CREATE", "UPDATE", "APPROVE", "REJECT"],
};

module.exports = {
  modulesName,
  moduleValues,
  modulePermissions,
};
