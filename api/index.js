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
app.use(helmet());

// const corsOptions = {
//   origin: "http://localhost:3001", // Frontend URL
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Allow credentials like cookies or Authorization headers
// };

app.use(cors({
  origin: '*',
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// process.on("uncaughtException", (err) => {
//   logger.error("Uncaught Exception:", err);
//   // process.exit(1); // Optionally exit after logging
//   process.exit(1);
// });

// process.on("unhandledRejection", (reason, promise) => {
//   logger.error("Unhandled Rejection at:", promise, "reason:", reason);
//   throw reason instanceof Error ? reason : new Error(String(reason));
// });

// Request logging middleware
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

// load the modules based on module.json
dynamicModuleLoader(app);
startReminderFollowupJob();

app.use(`/api/${apiVersion}`, routes);

// Serve Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(generateSwaggerJSONFromRouter(routes, fields))
);

// Error handling middleware
app.use(errorHandler);
app.set('trust proxy', 1);

app.use('/api/v1/stripe', require('../api/modules/stripe/routes/stripe'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(errorLogger);
// app.use(accessLogger);


app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
  console.log(`Server running at http://localhost:${port}`);
});
