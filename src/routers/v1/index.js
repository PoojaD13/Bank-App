const express = require("express");
const router = express.Router();

const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const accountRoute = require("./account.route");

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
];

defaultRoute.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
