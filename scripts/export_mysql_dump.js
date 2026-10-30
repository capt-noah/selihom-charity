/**
 * scripts/export_mysql_dump.js
 *
 * Exports all 20 Selihom production database tables and rows to clean, portable SQL files:
 *  - ~/Desktop/selihom_production_dump.sql  (Requested by user)
 *  - database/selihom_production_dump.sql
 *  - database/selihom_dump.sql
 *
 * Safe for importing over existing databases:
 *  - Includes DROP TABLE IF EXISTS for every table
 *  - Disables foreign key checks during import
 *  - Character set utf8mb4 preserved for full Amharic fidelity
 *  - Database-name agnostic (no hardcoded CREATE/USE DATABASE commands)
 *
 * Usage:
 *   node scripts/export_mysql_dump.js
 */

import pool from "../database/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function exportSql() {
  const conn = await pool.getConnection();

  // Explicit table order (child tables before parent tables when dropping/creating)
  const tables = [
    // 1. Transactional & Submissions (clean state)
    "bookings",
    "event_pledges",
    "volunteers",
    "pledge_items",
    "pledges",
    "medicine_pledge_items",
    "medicine_pledges",
    "supplies_pledge_items",
    "supplies_pledges",

    // 2. Reference & Core Production Data
    "admin_profile",
    "availability_slots",
    "bank_accounts",
    "inkind_needs",
    "medicine_items",
    "supply_items",
    "supply_categories",
    "volunteer_roles",
    "volunteer_categories",
    "news",
    "site_settings",
  ];

  let sql = "-- ============================================================\n";
  sql += "-- Selihom Charity - Full Production Database Dump\n";
  sql += "-- Generated: " + new Date().toISOString() + "\n";
  sql += "-- Character Set: utf8mb4 / utf8mb4_unicode_ci\n";
  sql += "-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10+\n";
  sql += "-- Note: Database name agnostic (safe to import on portfolio_db or selihom)\n";
  sql += "-- ============================================================\n\n";

  sql += "/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;\n";
  sql += "/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;\n";
  sql += "/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;\n";
  sql += "/*!50503 SET NAMES utf8mb4 */;\n";
  sql += "/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;\n";
  sql += "/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;\n";
  sql += "/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;\n";
  sql += "/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;\n\n";

  for (const t of tables) {
    const [createResult] = await conn.query("SHOW CREATE TABLE `" + t + "`");
    const createSql = createResult[0]["Create Table"];
    sql += "-- ------------------------------------------------------------\n";
    sql += "-- Table structure for `" + t + "`\n";
    sql += "-- ------------------------------------------------------------\n";
    sql += "DROP TABLE IF EXISTS `" + t + "`;\n";
    sql += createSql + ";\n\n";

    const [rows] = await conn.query("SELECT * FROM `" + t + "`");
    if (rows.length > 0) {
      sql += "-- ------------------------------------------------------------\n";
      sql += "-- Records of `" + t + "` (" + rows.length + " rows)\n";
      sql += "-- ------------------------------------------------------------\n";
      const cols = Object.keys(rows[0]).map((c) => "`" + c + "`").join(", ");

      const valuesList = [];
      for (const r of rows) {
        const vals = Object.values(r)
          .map((v) => {
            if (v === null || v === undefined) return "NULL";
            if (typeof v === "number") return v;
            if (typeof v === "boolean") return v ? 1 : 0;
            if (v instanceof Date) return "'" + v.toISOString().slice(0, 19).replace("T", " ") + "'";
            return pool.escape(v);
          })
          .join(", ");
        valuesList.push("  (" + vals + ")");
      }
      sql += "INSERT INTO `" + t + "` (" + cols + ") VALUES\n" + valuesList.join(",\n") + ";\n\n";
    }
  }

  sql += "/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;\n";
  sql += "/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;\n";
  sql += "/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;\n";
  sql += "/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\n";
  sql += "/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\n";
  sql += "/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;\n";
  sql += "/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;\n";

  // Destination paths
  const desktopPath = path.join(process.env.HOME || "/Users/Noah", "Desktop", "selihom_production_dump.sql");
  const projectDump1 = path.join(__dirname, "..", "database", "selihom_production_dump.sql");
  const projectDump2 = path.join(__dirname, "..", "database", "selihom_dump.sql");

  fs.writeFileSync(desktopPath, sql, "utf8");
  fs.writeFileSync(projectDump1, sql, "utf8");
  fs.writeFileSync(projectDump2, sql, "utf8");

  console.log(`\n✅ Production dump successfully generated and exported:`);
  console.log(`   📁 Desktop:  ${desktopPath} (${(Buffer.byteLength(sql) / 1024).toFixed(1)} KB)`);
  console.log(`   📁 Database: ${projectDump1}`);
  console.log(`   📁 Backup:   ${projectDump2}`);

  conn.release();
  await pool.end();
}

exportSql().catch((e) => {
  console.error("Export failed:", e);
  process.exit(1);
});
