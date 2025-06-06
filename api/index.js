require("dotenv").config({ path: process.env.ENV_PATH || ".env" });

const express = require("express");
const logger = require("./config/logger");
const cors = require("cors");
const { routes, fields } = require("./routes");
const { default: helmet } = require("helmet");
const { default: rateLimit } = require("express-rate-limit");
const { dynamicModuleLoader } = require("./moduleLoader");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const { generateSwaggerJSONFromRouter } = require("./config/swagger");
const { exec } = require("child_process");
const app = express();
const path = require("path");
const accessLogger = require('./modules/log/middlewares/accessLogger');
const errorLogger = require('./modules/log/middlewares/errorLogger');
const startReminderFollowupJob = require('./modules/jobs/reminderFollowupJob');

const port = process.env.PORT || 3000;
const apiVersion = process.env.API_VERSION ? process.env.API_VERSION : "v1";

// 1. Stripe webhook routes FIRST! (before any body parser middleware)
app.use('/api/v1/stripe', require('../api/modules/stripe/routes/stripe'));

// 2. Now apply global middleware
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: '*' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  res.on("finish", () => {
    logger.info(
      `Completed request: ${req.method} ${req.url} - Status: ${res.statusCode}`
    );
  });
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  logger.info("Hello, Node.js is running");
  res.send("Hello, Node.js is running!");
});

app.get("/db-migrate", function (err, res) {
  exec("yarn db:migrate", (err) => {
    if (err) {
      console.error(`exec error: ${err}`);
      res.send(`exec error db:migrate: ${err}`);
      return;
    } else {
      res.send("SucessFull");
    }
  });
});

app.get("/db-seed", function (err, res) {
  exec("yarn db:seeds", (err2) => {
    if (err2) {
      console.error(`exec error: ${err2}`);
      res.send(`exec error db:seeds: ${err2}`);
      return;
    } else {
      res.send("SucessFull");
    }
  });
});

dynamicModuleLoader(app);
startReminderFollowupJob();

// 3. All your REST API routes after JSON/bodyparser
app.use(`/api/${apiVersion}`, routes);

// Swagger docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(generateSwaggerJSONFromRouter(routes, fields))
);

app.use(errorHandler);
app.set('trust proxy', 1);

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
  console.log(`Server running at http://localhost:${port}`);
});
