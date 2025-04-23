const { supportedDbTypes } = require("../utils/staticData");

require("dotenv").config({ path: process.env.ENV_PATH || ".env" });

const getDConfig = () => {
  let obj = {
    username: "",
    password: "",
    database: "",
    host: "",
    port: 0,
    dialect: "",
  };
  switch (process.env.DB_TYPE) {
    case supportedDbTypes.postgres:
      obj.username = process.env.POSTGRES_USER;
      obj.password = process.env.POSTGRES_PASSWORD;
      obj.database = process.env.POSTGRES_DB;
      obj.host = process.env.POSTGRES_HOST;
      obj.port = process.env.POSTGRES_PORT;
      obj.dialect = process.env.POSTGRES_DIALECT;
      obj.dialectOptions = {
        ssl: {
          require: false, // This will enforce using SSL
          rejectUnauthorized: false, // This might be needed if using self-signed certificates
        },
        ssl: false,
      };
      return obj;
    case supportedDbTypes.mysql:
      obj.username = process.env.MYSQL_USER;
      obj.password = process.env.MYSQL_PASSWORD;
      obj.database = process.env.MYSQL_DB;
      obj.host = process.env.MYSQL_HOST;
      obj.port = process.env.MYSQL_PORT;
      obj.dialect = process.env.MYSQL_DIALECT;
      return obj;
    case supportedDbTypes.mssql:
      obj.username = process.env.MSSQL_USER;
      obj.password = process.env.MSSQL_PASSWORD;
      obj.database = process.env.MSSQL_DB;
      obj.host = process.env.MSSQL_HOST;
      obj.port = process.env.MSSQL_PORT;
      obj.dialect = process.env.MSSQL_DIALECT;
      obj.dialectOptions = {
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
      };
      return obj;
    default:
      throw new Error("Unsupported database type");
  }
};

module.exports = {
  development: getDConfig(),
};
