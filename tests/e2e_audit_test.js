/**
 * tests/e2e_audit_test.js
 * End-to-End Integration & Unit Test Suite for Selihom Charity
 * Tests against live MySQL database and API routes.
 */

import pool from "../database/db.js";
import assert from "assert";
import app from "../server.js";
import http from "http";

console.log("\n=======================================================");
console.log("🧪 STARTING SELIHOM CHARITY END-TO-END AUDIT & TEST SUITE");
console.log("=======================================================\n");

let passed = 0;
let failed = 0;
let testServer = null;
let baseUrl = "";

async function runTest(name, fn) {
  try {
    process.stdout.write(`⏳ Running: ${name}... `);
    await fn();
    console.log("✅ PASS");
    passed++;
  } catch (err) {
    console.log(`❌ FAIL`);
    console.error(`   Error: ${err.message}`);
    if (err.stack) console.error(`   Stack: ${err.stack.split("\n")[1]}`);
    failed++;
  }
}

// ── Overdue calculation test helper ──
function isPledgeOverdue(status, estimatedDeliveryDate) {
  if ((status || "pledged") !== "pledged" || !estimatedDeliveryDate) return false;
  const estTs = new Date(estimatedDeliveryDate).setHours(23, 59, 59, 999);
  return !isNaN(estTs) && estTs < Date.now();
}

async function main() {
  // Start ephemeral HTTP server for API testing
  await new Promise((resolve) => {
    testServer = http.createServer(app);
    testServer.listen(0, "127.0.0.1", () => {
      const addr = testServer.address();
      baseUrl = `http://127.0.0.1:${addr.port}`;
      console.log(`📡 Test HTTP Server listening at ${baseUrl}\n`);
      resolve();
    });
  });

  // Test 1: MySQL Database Connection & Table Schema
  await runTest("Database Connection & Table Integrity", async () => {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    assert.strictEqual(rows[0].result, 2, "MySQL should execute simple math query");

    const requiredTables = [
      "pledges", "pledge_items",
      "medicine_pledges", "medicine_pledge_items", "medicine_items",
      "supplies_pledges", "supplies_pledge_items", "supply_categories", "supply_items",
      "bank_accounts", "site_settings", "admin_profile"
    ];

    const [tables] = await pool.query("SHOW TABLES");
    const tableNames = tables.map(t => Object.values(t)[0]);

    for (const table of requiredTables) {
      assert.ok(tableNames.includes(table), `Table ${table} must exist in MySQL database`);
    }
  });

  // Test 2: Estimated Delivery Date Column Verification across all pledge tables
  await runTest("Estimated Delivery Date Columns in DB", async () => {
    const pledgeTables = ["pledges", "medicine_pledges", "supplies_pledges"];
    for (const table of pledgeTables) {
      const [cols] = await pool.query(`SHOW COLUMNS FROM ${table} LIKE 'estimated_delivery_date'`);
      assert.strictEqual(cols.length, 1, `Table ${table} must have 'estimated_delivery_date' column`);
    }
  });

  // Test 3: In-Kind Pledges CRUD & Relational Integrity
  await runTest("In-Kind Pledges: Insert, Query, Update, Cascade Delete", async () => {
    const testId = `TEST-PLG-${Date.now()}`;
    const testDate = new Date().toISOString().split("T")[0];
    const testEstDate = "2026-10-15";

    // 1. Insert pledge
    await pool.execute(`
      INSERT INTO pledges (id, donor_name, donor_email, donor_phone, type, date, estimated_delivery_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [testId, "Abebe Bikila", "abebe@example.com", "+251911223344", "inkind", testDate, testEstDate, "pledged"]);

    // 2. Insert items
    await pool.execute(`
      INSERT INTO pledge_items (pledge_id, item_id, item_name, quantity)
      VALUES (?, ?, ?, ?), (?, ?, ?, ?)
    `, [testId, "itm-1", "Rice 25kg", 2, testId, "itm-2", "Cooking Oil 5L", 4]);

    // 3. Verify in DB
    const [rows] = await pool.execute("SELECT * FROM pledges WHERE id = ?", [testId]);
    assert.strictEqual(rows.length, 1, "Pledge should be found in DB");
    assert.strictEqual(rows[0].donor_name, "Abebe Bikila");
    assert.strictEqual(rows[0].estimated_delivery_date, testEstDate);

    const [itemRows] = await pool.execute("SELECT * FROM pledge_items WHERE pledge_id = ?", [testId]);
    assert.strictEqual(itemRows.length, 2, "Should have 2 pledge items");

    // 4. Update status
    await pool.execute("UPDATE pledges SET status = ? WHERE id = ?", ["received", testId]);
    const [updated] = await pool.execute("SELECT status FROM pledges WHERE id = ?", [testId]);
    assert.strictEqual(updated[0].status, "received");

    // 5. Delete and test CASCADE
    await pool.execute("DELETE FROM pledges WHERE id = ?", [testId]);
    const [deletedPledge] = await pool.execute("SELECT * FROM pledges WHERE id = ?", [testId]);
    assert.strictEqual(deletedPledge.length, 0, "Pledge should be deleted");
    const [orphanedItems] = await pool.execute("SELECT * FROM pledge_items WHERE pledge_id = ?", [testId]);
    assert.strictEqual(orphanedItems.length, 0, "Cascade delete should remove all pledge_items");
  });

  // Test 4: Medicine Pledges CRUD & Relational Integrity
  await runTest("Medicine Pledges: Insert, Items Relational Integrity, Cascade Delete", async () => {
    const testId = `TEST-MED-${Date.now()}`;
    const testDate = new Date().toISOString().split("T")[0];
    const testEstDate = "2026-11-01";

    // Insert medicine pledge
    await pool.execute(`
      INSERT INTO medicine_pledges (id, donor_name, donor_phone, donor_email, date, estimated_delivery_date, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [testId, "Dr. Kebede", "+251922334455", "kebede@hospital.et", testDate, testEstDate, "pledged", "Urgent delivery"]);

    // Insert medicine pledge items
    await pool.execute(`
      INSERT INTO medicine_pledge_items (pledge_id, medicine_id, medicine_name, quantity)
      VALUES (?, ?, ?, ?), (?, ?, ?, ?)
    `, [testId, "med-1", "Haloperidol 5mg", 50, testId, "med-2", "Chlorpromazine 100mg", 30]);

    // Verify in DB
    const [rows] = await pool.execute("SELECT * FROM medicine_pledges WHERE id = ?", [testId]);
    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].estimated_delivery_date, testEstDate);

    const [items] = await pool.execute("SELECT * FROM medicine_pledge_items WHERE pledge_id = ?", [testId]);
    assert.strictEqual(items.length, 2);

    // Delete and test CASCADE
    await pool.execute("DELETE FROM medicine_pledges WHERE id = ?", [testId]);
    const [deletedItems] = await pool.execute("SELECT * FROM medicine_pledge_items WHERE pledge_id = ?", [testId]);
    assert.strictEqual(deletedItems.length, 0, "Medicine pledge items must be deleted on cascade");
  });

  // Test 5: Supplies Pledges CRUD & 5 Categories Verification
  await runTest("Supplies Pledges: 5 Categories Support & Relational Integrity", async () => {
    const testId = `TEST-SUP-${Date.now()}`;
    const testDate = new Date().toISOString().split("T")[0];
    const testEstDate = "2026-10-20";

    // Insert supplies pledge with custom items
    await pool.execute(`
      INSERT INTO supplies_pledges (id, donor_name, donor_phone, donor_email, category_id, date, estimated_delivery_date, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [testId, "Tigist Haile", "+251933445566", "tigist@example.com", "hygiene", testDate, testEstDate, "pledged", "Hand soap boxes"]);

    await pool.execute(`
      INSERT INTO supplies_pledge_items (pledge_id, item_id, item_name, quantity, custom)
      VALUES (?, ?, ?, ?, ?)
    `, [testId, "custom", "Special Antiseptic Soap", 10, "Special Antiseptic Soap"]);

    // Verify in DB
    const [rows] = await pool.execute("SELECT * FROM supplies_pledges WHERE id = ?", [testId]);
    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].category_id, "hygiene");
    assert.strictEqual(rows[0].estimated_delivery_date, testEstDate);

    const [items] = await pool.execute("SELECT * FROM supplies_pledge_items WHERE pledge_id = ?", [testId]);
    assert.strictEqual(items.length, 1);
    assert.strictEqual(items[0].custom, "Special Antiseptic Soap");

    // Cleanup
    await pool.execute("DELETE FROM supplies_pledges WHERE id = ?", [testId]);
    const [deletedItems] = await pool.execute("SELECT * FROM supplies_pledge_items WHERE pledge_id = ?", [testId]);
    assert.strictEqual(deletedItems.length, 0, "Supplies pledge items must cascade delete");
  });

  // Test 6: Overdue Calculation Unit Tests
  await runTest("Overdue Detection Business Logic", () => {
    assert.strictEqual(isPledgeOverdue("pledged", "2020-01-01"), true, "2020-01-01 pledged should be overdue");
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString().split("T")[0];
    assert.strictEqual(isPledgeOverdue("pledged", yesterday), true, "Past date must be overdue");
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000 * 30).toISOString().split("T")[0];
    assert.strictEqual(isPledgeOverdue("pledged", future), false, "Future date must NOT be overdue");
    assert.strictEqual(isPledgeOverdue("received", "2020-01-01"), false, "Received pledge should never be overdue");
    assert.strictEqual(isPledgeOverdue("cancelled", "2020-01-01"), false, "Cancelled pledge should never be overdue");
    assert.strictEqual(isPledgeOverdue("pledged", ""), false, "Empty date should not be overdue");
    assert.strictEqual(isPledgeOverdue("pledged", undefined), false, "Undefined date should not be overdue");
  });

  // Test 7: Medicine Items Dynamic Goal Data Integrity
  await runTest("Medicine Items Dynamic Goals & Pricing Structure", async () => {
    const [meds] = await pool.query("SELECT * FROM medicine_items");
    assert.ok(meds.length > 0, "There should be medicine items configured in DB");

    for (const med of meds) {
      assert.ok(med.id, "Medicine must have an id");
      assert.ok(med.name, "Medicine must have a name");
      assert.ok(typeof med.monthly_qty === "number" || !isNaN(Number(med.monthly_qty)), "Monthly qty must be a number");
      assert.ok(Number(med.unit_price) >= 0, "Unit price must be >= 0");
      assert.ok(Number(med.patients_helped) >= 0, "Patients helped must be >= 0");
      assert.ok(["High", "Medium", "Low"].includes(med.urgency), "Urgency must be High, Medium, or Low");
    }
  });

  // Test 8: Bank Accounts & Site Settings in DB
  await runTest("Bank Accounts & Site Settings Verification", async () => {
    const [bankRows] = await pool.query("SELECT * FROM bank_accounts WHERE is_active = 1");
    assert.ok(bankRows.length > 0, "Active bank accounts must exist in DB");

    const [settings] = await pool.query("SELECT * FROM site_settings WHERE setting_key = 'global'");
    assert.strictEqual(settings.length, 1, "Global site settings must exist");
    assert.ok(settings[0].email, "Site settings must contain contact email");
  });

  // Test 9: HTTP API - POST /api/pledges & GET /api/pledges
  await runTest("HTTP API: POST & GET In-Kind Pledges", async () => {
    const resPost = await fetch(`${baseUrl}/api/pledges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorName: "Marta Tesfaye",
        donorPhone: "+251911998877",
        donorEmail: "marta@test.com",
        estimatedDeliveryDate: "2026-10-30",
        date: "2026-09-26",
        type: "inkind",
        pledgedItems: [{ itemId: "itm-flour", name: "Wheat Flour 50kg", quantity: 3 }]
      })
    });
    assert.strictEqual(resPost.status, 200, "POST /api/pledges should return 200 OK");
    const list = await resPost.json();
    assert.ok(Array.isArray(list), "Response should be an array of pledges");
    const created = list.find(p => p.donorName === "Marta Tesfaye");
    assert.ok(created, "Created pledge must be in returned list");
    assert.strictEqual(created.estimatedDeliveryDate, "2026-10-30");
    assert.strictEqual(created.pledgedItems.length, 1);
    assert.strictEqual(created.pledgedItems[0].name, "Wheat Flour 50kg");

    // Cleanup
    await pool.execute("DELETE FROM pledges WHERE id = ?", [created.id]);
  });

  // Test 10: HTTP API - POST /api/medicine_pledges & GET /api/medicine_pledges
  await runTest("HTTP API: POST & GET Medicine Pledges", async () => {
    const resPost = await fetch(`${baseUrl}/api/medicine_pledges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorName: "Yared Pharma",
        donorPhone: "+251944556677",
        donorEmail: "yared@pharma.et",
        date: "2026-09-26",
        estimatedDeliveryDate: "2026-11-15",
        status: "pledged",
        notes: "Direct dispensary drop-off",
        items: [{ medicineId: "med-fluoxetine", medicineName: "Fluoxetine 20mg", quantity: 100 }]
      })
    });
    assert.strictEqual(resPost.status, 200);
    const list = await resPost.json();
    assert.ok(Array.isArray(list));
    const created = list.find(p => p.donorName === "Yared Pharma");
    assert.ok(created);
    assert.strictEqual(created.estimatedDeliveryDate, "2026-11-15");
    assert.strictEqual(created.items[0].medicineName, "Fluoxetine 20mg");

    // Cleanup
    await pool.execute("DELETE FROM medicine_pledges WHERE id = ?", [created.id]);
  });

  // Test 11: HTTP API - POST /api/supplies_pledges & GET /api/supplies_pledges
  await runTest("HTTP API: POST & GET Supplies Pledges", async () => {
    const resPost = await fetch(`${baseUrl}/api/supplies_pledges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorName: "Sara Berhanu",
        donorPhone: "+251955667788",
        donorEmail: "sara@berhanu.com",
        categoryId: "psychiatry",
        date: "2026-09-26",
        estimatedDeliveryDate: "2026-10-25",
        status: "pledged",
        notes: "Art therapy drawing supplies",
        items: [{ itemId: "custom", itemName: "Art Therapy Sketchbooks", quantity: 20, custom: "Art Therapy Sketchbooks" }]
      })
    });
    assert.strictEqual(resPost.status, 200);
    const list = await resPost.json();
    assert.ok(Array.isArray(list));
    const created = list.find(p => p.donorName === "Sara Berhanu");
    assert.ok(created);
    assert.strictEqual(created.categoryId, "psychiatry");
    assert.strictEqual(created.estimatedDeliveryDate, "2026-10-25");

    // Cleanup
    await pool.execute("DELETE FROM supplies_pledges WHERE id = ?", [created.id]);
  });

  // Test 12: HTTP API - GET /api/settings & GET /api/bank_accounts
  await runTest("HTTP API: GET Site Settings & Bank Accounts", async () => {
    const resSettings = await fetch(`${baseUrl}/api/settings`);
    assert.strictEqual(resSettings.status, 200);
    const settings = await resSettings.json();
    assert.ok(settings.contact);
    assert.ok(Array.isArray(settings.contact.phones));
    assert.ok(Array.isArray(settings.bankAccounts));
    assert.ok(settings.bankAccounts.length > 0);

    const resBanks = await fetch(`${baseUrl}/api/bank_accounts`);
    assert.strictEqual(resBanks.status, 200);
    const banks = await resBanks.json();
    assert.ok(Array.isArray(banks));
    assert.ok(banks.length > 0);
  });

  console.log("\n=======================================================");
  console.log(`📊 TOTAL AUDIT TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (testServer) {
    await new Promise(r => testServer.close(r));
  }
  await pool.end();

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error("Fatal Test Runner Error:", err);
  if (testServer) testServer.close();
  process.exit(1);
});
