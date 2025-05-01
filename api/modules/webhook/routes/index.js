const webhookRoute = require("./webhook");

const routes = [
  {
    path: "/webhook",
    route: webhookRoute,
  },
];

module.exports = routes;
