const express = require("express");
const router = express.Router();

const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const accountRoute = require("./account.route");
const transactionRoute = require("./transaction.route");
const roleRoute = require("./role.route");
const bankRuleEngineRoute = require("./bank-rule.route");
const requestApprovalRoute = require("./request-approval.route");
const healthRoute = require("./health.route");
const metricsRoutes = require("./metrics.route");
const defaultRoute = [
  {
    path: "/health",
    route: healthRoute,
  },
  {
    path: "/metrics",
    route: metricsRoutes,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/accounts",
    route: accountRoute,
  },
  {
    path: "/transactions",
    route: transactionRoute,
  },
  {
    path: "/roles",
    route: roleRoute,
  },
  {
    path: "/bank-rule-engine",
    route: bankRuleEngineRoute,
  },
  {
    path: "/request-approval",
    route: requestApprovalRoute,
  },
];

defaultRoute.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
