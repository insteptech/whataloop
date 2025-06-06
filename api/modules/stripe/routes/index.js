const stripeRoute = require("./stripe");

const routes = [
  {
    path: "/stripe",
    route: stripeRoute,
  },
];

module.exports = routes;
