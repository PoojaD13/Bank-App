const express = require("express");
const router = express.Router();

const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const accountRoute = require("./account.route");
const transactionRoute = require("./transaction.route");
const roleRoute = require("./role.route");

const defaultRoute = [
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
];

defaultRoute.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
