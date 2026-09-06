/**
 * database/db.js
 * MySQL connection pool for Selihom.
 *
 * Configuration is read from environment variables so the same file
 * works on local dev (no password) and on Plesk (credentials set in
 * the Plesk Node.js app environment).
 *
 * Environment variables (set in .env or Plesk panel):
 *   DB_HOST      — default: localhost
 *   DB_PORT      — default: 3306
 *   DB_USER      — default: root
 *   DB_PASSWORD  — default: (empty)
 *   DB_NAME      — default: selihom
 *   DB_POOL_MAX  — default: 10
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// =========================================================================
// DATABASE CREDENTIALS CONFIGURATION
// =========================================================================
// [OPTION A: Plesk Hosted Temporary Database - Shared with Portfolio]
const PLESK_DB_HOST     = "mysql-db02.remote";
const PLESK_DB_PORT     = 32636;
const PLESK_DB_USER     = "capt_noah";
const PLESK_DB_PASSWORD = "5RDPrt#xe67gx@bv";
const PLESK_DB_NAME     = "portfolio_db";

// [OPTION B: Standalone / Local Dev Database (Uncomment when hosted on its own)]
// const STANDALONE_DB_HOST     = "localhost";
// const STANDALONE_DB_PORT     = 3306;
// const STANDALONE_DB_USER     = "selihom";
// const STANDALONE_DB_PASSWORD = "Selihom@2026#Secure!";
// const STANDALONE_DB_NAME     = "selihom";

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || PLESK_DB_HOST,
  port:               parseInt(process.env.DB_PORT || String(PLESK_DB_PORT), 10),
  user:               process.env.DB_USER     || PLESK_DB_USER,
  password:           process.env.DB_PASSWORD || PLESK_DB_PASSWORD,
  database:           process.env.DB_NAME     || PLESK_DB_NAME,
  waitForConnections: true,
  connectionLimit:    parseInt(process.env.DB_POOL_MAX || "10", 10),
  queueLimit:         0,
  connectTimeout:     5000,
  // Keep connections alive on Plesk (avoids "connection lost" after idle)
  enableKeepAlive:    true,
  keepAliveInitialDelay: 30000,
  // Automatically cast BIT(1) → boolean, DECIMAL → number
  typeCast(field, next) {
    if (field.type === "TINY" && field.length === 1) return field.string() === "1";
    if (field.type === "DECIMAL" || field.type === "NEWDECIMAL") return parseFloat(field.string());
    return next();
  },
  // Stringify Date objects sent to MySQL
  dateStrings: false,
  timezone: "Z",
});

// Test connection at startup and log result
pool.getConnection()
  .then(conn => {
    console.log(`✓ MySQL connected — ${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || "selihom"}`);
    conn.release();
  })
  .catch(err => {
    console.error("✗ MySQL connection failed:", err.message);
    console.error("  Check DB_HOST / DB_USER / DB_PASSWORD / DB_NAME in .env");
  });

export default pool;
