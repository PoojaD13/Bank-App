const approvalAction = {
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
};

const approvalActionValues = Object.values(approvalAction);

module.exports = {
  approvalAction,
  approvalActionValues,
};
