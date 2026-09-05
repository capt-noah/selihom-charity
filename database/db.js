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

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || "localhost",
  port:               parseInt(process.env.DB_PORT || "3306", 10),
  user:               process.env.DB_USER     || "selihom",
  password:           process.env.DB_PASSWORD || "Selihom@2026#Secure!",
  database:           process.env.DB_NAME     || "selihom",
  waitForConnections: true,
  connectionLimit:    parseInt(process.env.DB_POOL_MAX || "10", 10),
  queueLimit:         0,
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
