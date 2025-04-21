// config/dbConnection.js
require("dotenv").config({ path: process.env.ENV_PATH || ".env" });
const { Sequelize } = require("sequelize");
const { supportedDbTypes } = require("../utils/staticData");

const connectPostgres = async () => {
  const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      dialect: process.env.POSTGRES_DIALECT,
      dialectOptions: {
        ssl: {
          require: true, // This will enforce using SSL
          rejectUnauthorized: false, // This might be needed if using self-signed certificates
        },
        // ssl: false,
      },
    }
  );

  await sequelize
    .authenticate()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Unable to connect to PostgreSQL:", err));

  return sequelize;
};

const connectMysql = async () => {
  const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      dialect: process.env.MYSQL_DIALECT,
    }
  );

  await sequelize
    .authenticate()
    .then(() => console.log("Connected to MySQL"))
    .catch((err) => console.error("Unable to connect to MySQL:", err));
  return sequelize;
};

const connectMssql = async () => {
  const sequelize = new Sequelize(
    process.env.MSSQL_DB,
    process.env.MSSQL_USER,
    process.env.MSSQL_PASSWORD,
    {
      host: process.env.MSSQL_HOST, // Ensure this is a valid hostname
      port: process.env.MSSQL_PORT,
      dialect: process.env.MSSQL_DIALECT, // or 'postgres', 'sqlite', etc.
      dialectOptions: {
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
      },
      logging: true,
    }
  );

  await sequelize
    .authenticate()
    .then(() => console.log("Connected to MsSQL"))
    .catch((err) => console.error("Unable to connect to MsSQL:", err));
  return sequelize;
};

const connectDatabase = async (dbType) => {
  switch (dbType) {
    case supportedDbTypes.postgres:
      return connectPostgres();
    case supportedDbTypes.mysql:
      return connectMysql();
    case supportedDbTypes.mssql:
      return connectMssql();
    default:
      throw new Error("Unsupported database type");
  }
};

module.exports = connectDatabase;
