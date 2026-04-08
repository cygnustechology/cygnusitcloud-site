const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "cygnus_cloud",
  user: process.env.DB_USER || "cygnus_user",
  password: process.env.DB_PASSWORD || "CygnusDB@2026",
});

module.exports = pool;
