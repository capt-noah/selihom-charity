/**
 * server.js  —  Selihom Charity Express API
 *
 * Storage backend: MySQL via database/db.js connection pool.
 * All API endpoints are identical to the previous JSON implementation
 * so the frontend requires zero changes.
 *
 * Environment variables (see .env.example):
 *   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, PORT
 */

import express   from "express";
import path      from "path";
import { fileURLToPath } from "url";
import dotenv    from "dotenv";
import pool      from "./database/db.js";

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app  = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "200kb" }));

// ─── INPUT SANITISATION ────────────────────────────────────────────────────

function sanitize(value, maxLen = 500) {
  if (value == null) return "";
  return String(value).replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, maxLen);
}
function sanitizePhone(v)  { return sanitize(v, 30).replace(/[^\d+\-\s()]/g, ""); }
function isValidEmail(v)   { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function whitelist(v, arr, fb) { return arr.includes(v) ? v : fb; }

const BOOKING_STATUSES   = ["pending","approved","completed","cancelled"];
const PLEDGE_STATUSES    = ["pledged","received","cancelled"];
const VOLUNTEER_STATUSES = ["new","reviewed","accepted","declined"];
const VISIT_TYPES        = ["individual","group","corporate","school","volunteer"];
const VOLUNTEER_AREAS    = ["kitchen","medical","education","psychology","general"];
const VOLUNTEER_AVAIL    = ["weekdays","weekends","flexible"];
const INKIND_CATEGORIES  = ["Food","Clothing","Education","Medical","Hygiene","Other"];
const INKIND_URGENCIES   = ["High","Medium","Low"];
const EVENT_TYPES        = ["birthday","wedding","anniversary","other"];
const EVENT_STATUSES     = ["pending","confirmed","completed","cancelled"];
const NEWS_CATEGORIES    = ["Health","Community","Events","Announcements","Stories"];

// ─── DB HELPERS ────────────────────────────────────────────────────────────

/** Run a query and return rows. */
async function q(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/** Run a query and return the first row or null. */
async function q1(sql, params = []) {
  const rows = await q(sql, params);
  return rows[0] || null;
}

/** Convert DB row → camelCase booking object (matches old JSON shape). */
function rowToBooking(r) {
  if (!r) return null;
  return {
    id:               r.id,
    name:             r.name,
    email:            r.email,
    phone:            r.phone,
    date:             r.visit_date,
    timeSlot:         r.time_slot,
    visitType:        r.visit_type,
    visitorCount:     r.visitor_count,
    notes:            r.notes || "",
    status:           r.status,
    contactType:      r.contact_type,
    organizationName: r.organization_name,
    slotId:           r.slot_id || null,
    createdAt:        r.created_at,
  };
}

function rowToSlot(r) {
  if (!r) return null;
  return {
    id:              r.id,
    date:            r.slot_date,
    startTime:       r.start_time,
    endTime:         r.end_time,
    label:           r.label,
    maxBookings:     r.max_bookings,
    currentBookings: r.current_bookings,
    isActive:        !!r.is_active,
  };
}

function rowToVolunteer(r) {
  if (!r) return null;
  return {
    id:           r.id,
    fullName:     r.full_name,
    email:        r.email,
    phone:        r.phone,
    interestArea: r.interest_area,
    availability: r.availability,
    experience:   r.experience || "",
    status:       r.status,
    categoryId:   r.category_id,
    roleId:       r.role_id,
    roleName:     r.role_name,
    submittedAt:  r.submitted_at,
  };
}

function rowToNeed(r) {
  if (!r) return null;
  return {
    id:             r.id,
    name:           { en: r.name_en, am: r.name_am },
    category:       r.category,
    neededQuantity: { en: r.needed_qty_en, am: r.needed_qty_am },
    urgency:        r.urgency,
    description:    { en: r.description_en, am: r.description_am },
  };
}

function rowToMed(r) {
  if (!r) return null;
  return {
    id:             r.id,
    name:           r.name,
    monthlyQty:     r.monthly_qty,
    unitPrice:      r.unit_price,
    totalMonthly:   r.total_monthly,
    patientsHelped: r.patients_helped,
    urgency:        r.urgency,
    description:    { en: r.description_en || "", am: r.description_am || "" },
  };
}

function rowToNews(r) {
  if (!r) return null;
  return {
    id:          r.id,
    slug:        r.slug,
    title:       { en: r.title_en,   am: r.title_am   },
    excerpt:     { en: r.excerpt_en || "", am: r.excerpt_am || "" },
    body:        { en: r.body_en    || "", am: r.body_am    || "" },
    category:    r.category,
    coverImage:  r.cover_image,
    author:      r.author,
    publishedAt: r.published_at instanceof Date ? r.published_at.toISOString() : r.published_at,
    isPublished: !!r.is_published,
  };
}

// Build supply category object with its items
async function buildCategory(catRow) {
  const items = await q(
    "SELECT * FROM supply_items WHERE category_id=? ORDER BY sort_order", [catRow.id]);
  return {
    id:    catRow.id,
    name:  { en: catRow.name_en, am: catRow.name_am },
    icon:  catRow.icon,
    color: catRow.color,
    items: items.map(it => ({
      id:           it.id,
      name:         { en: it.name_en,        am: it.name_am        },
      neededQty:    { en: it.needed_qty_en,   am: it.needed_qty_am  },
      urgency:      it.urgency,
      impactDesc:   { en: it.impact_desc_en,  am: it.impact_desc_am },
    })),
  };
}

// Build volunteer category with its roles
async function buildVolCategory(catRow) {
  const roles = await q(
    "SELECT * FROM volunteer_roles WHERE category_id=? ORDER BY sort_order", [catRow.id]);
  return {
    id:    catRow.id,
    name:  { en: catRow.name_en, am: catRow.name_am },
    icon:  catRow.icon,
    color: catRow.color,
    roles: roles.map(r => ({
      id:          r.id,
      name:        { en: r.name_en,        am: r.name_am        },
      description: { en: r.description_en, am: r.description_am },
    })),
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── API ROUTES ───────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    await pool.execute("SELECT 1");
    res.json({ status: "ok", db: "mysql", timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

app.get("/api/bookings", async (_req, res) => {
  try {
    const rows = await q("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(rows.map(rowToBooking));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const b = req.body;
    const name  = sanitize(b.name, 120);
    const phone = sanitizePhone(b.phone);
    if (!name)  return res.status(400).json({ error: "name is required" });
    if (!phone) return res.status(400).json({ error: "phone is required" });
    const email   = sanitize(b.email, 120);
    if (email && !isValidEmail(email)) return res.status(400).json({ error: "invalid email format" });

    const id          = sanitize(b.id, 40) || `TKT-${Date.now()}`;
    const visitDate   = sanitize(b.date, 80);
    const timeSlot    = sanitize(b.timeSlot, 80);
    const notes       = sanitize(b.notes, 600);
    const visitType   = whitelist(b.visitType, VISIT_TYPES, "individual");
    const visitorCount= Math.max(1, Math.min(100, parseInt(b.visitorCount)||1));
    const status      = whitelist(b.status, BOOKING_STATUSES, "pending");
    const createdAt   = sanitize(b.createdAt, 40) || new Date().toLocaleDateString();
    const contactType = sanitize(b.contactType, 20) || "individual";
    const orgName     = sanitize(b.organizationName, 120);
    const slotId      = sanitize(b.slotId, 40) || null;

    await pool.execute(`
      INSERT INTO bookings
        (id,name,email,phone,visit_date,time_slot,visit_type,visitor_count,
         notes,status,contact_type,organization_name,slot_id,created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name), email=VALUES(email), phone=VALUES(phone),
        visit_date=VALUES(visit_date), time_slot=VALUES(time_slot),
        visit_type=VALUES(visit_type), visitor_count=VALUES(visitor_count),
        notes=VALUES(notes), status=VALUES(status), contact_type=VALUES(contact_type),
        organization_name=VALUES(organization_name), slot_id=VALUES(slot_id)
    `, [id,name,email,phone,visitDate,timeSlot,visitType,visitorCount,
        notes,status,contactType,orgName,slotId,createdAt]);

    // Increment slot booking count if a slotId is provided
    if (slotId) {
      await pool.execute(
        "UPDATE availability_slots SET current_bookings=current_bookings+1 WHERE id=?",
        [slotId]);
    }

    const rows = await q("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(rows.map(rowToBooking));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/bookings/:id/status", async (req, res) => {
  try {
    const status = whitelist(req.body?.status, BOOKING_STATUSES, null);
    if (!status) return res.status(400).json({ error: "invalid status value" });
    await pool.execute("UPDATE bookings SET status=? WHERE id=?", [status, req.params.id]);
    const rows = await q("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(rows.map(rowToBooking));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    // Decrement slot counter if booking had a slot
    const bk = await q1("SELECT slot_id FROM bookings WHERE id=?", [req.params.id]);
    if (bk?.slot_id) {
      await pool.execute(
        "UPDATE availability_slots SET current_bookings=GREATEST(current_bookings-1,0) WHERE id=?",
        [bk.slot_id]);
    }
    await pool.execute("DELETE FROM bookings WHERE id=?", [req.params.id]);
    const rows = await q("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(rows.map(rowToBooking));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── PLEDGES ──────────────────────────────────────────────────────────────────

app.get("/api/pledges", async (_req, res) => {
  try {
    const pledges = await q("SELECT * FROM pledges ORDER BY created_at DESC");
    const result  = [];
    for (const p of pledges) {
      const items = await q("SELECT * FROM pledge_items WHERE pledge_id=?", [p.id]);
      result.push({
        id:          p.id,
        donorName:   p.donor_name,
        donorEmail:  p.donor_email,
        donorPhone:  p.donor_phone,
        type:        p.type,
        date:        p.date,
        status:      p.status,
        pledgedItems: items.map(it => ({ itemId: it.item_id, name: it.item_name, quantity: it.quantity })),
      });
    }
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/pledges", async (req, res) => {
  try {
    const b = req.body;
    const donorName  = sanitize(b.donorName, 120);
    const donorPhone = sanitizePhone(b.donorPhone);
    const donorEmail = sanitize(b.donorEmail, 120);
    if (!donorName)                  return res.status(400).json({ error: "donorName is required" });
    if (!donorPhone && !donorEmail)  return res.status(400).json({ error: "phone or email required" });
    if (donorEmail && !isValidEmail(donorEmail)) return res.status(400).json({ error: "invalid email" });
    const id     = sanitize(b.id, 40) || `PLG-${Date.now()}`;
    const date   = sanitize(b.date, 80);
    const status = whitelist(b.status, PLEDGE_STATUSES, "pledged");
    const type   = whitelist(b.type, ["money","inkind"], "inkind");
    await pool.execute(`
      INSERT INTO pledges (id,donor_name,donor_email,donor_phone,type,date,status)
      VALUES (?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        donor_name=VALUES(donor_name),donor_email=VALUES(donor_email),
        donor_phone=VALUES(donor_phone),type=VALUES(type),date=VALUES(date),status=VALUES(status)
    `, [id,donorName,donorEmail,donorPhone,type,date,status]);
    await pool.execute("DELETE FROM pledge_items WHERE pledge_id=?", [id]);
    for (const it of (Array.isArray(b.pledgedItems)?b.pledgedItems:[])) {
      await pool.execute(
        "INSERT INTO pledge_items (pledge_id,item_id,item_name,quantity) VALUES (?,?,?,?)",
        [id, sanitize(it.itemId,60), sanitize(it.name,200), Math.max(0,parseInt(it.quantity)||0)]);
    }
    // Return full list (matches old JSON server behaviour)
    const pledges = await q("SELECT * FROM pledges ORDER BY created_at DESC");
    const result  = [];
    for (const p of pledges) {
      const items = await q("SELECT * FROM pledge_items WHERE pledge_id=?", [p.id]);
      result.push({
        id:p.id, donorName:p.donor_name, donorEmail:p.donor_email, donorPhone:p.donor_phone,
        type:p.type, date:p.date, status:p.status,
        pledgedItems: items.map(it => ({ itemId:it.item_id, name:it.item_name, quantity:it.quantity })),
      });
    }
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/pledges/:id/status", async (req, res) => {
  try {
    const status = whitelist(req.body?.status, PLEDGE_STATUSES, null);
    if (!status) return res.status(400).json({ error: "invalid status" });
    await pool.execute("UPDATE pledges SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ id: req.params.id, status });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/pledges/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM pledges WHERE id=?", [req.params.id]);
    res.json({ deleted: req.params.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── VOLUNTEERS ───────────────────────────────────────────────────────────────

app.get("/api/volunteers", async (_req, res) => {
  try {
    const rows = await q("SELECT * FROM volunteers ORDER BY submitted_at DESC");
    res.json(rows.map(rowToVolunteer));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/volunteers", async (req, res) => {
  try {
    const b = req.body;
    const fullName = sanitize(b.fullName, 120);
    const phone    = sanitizePhone(b.phone);
    const email    = sanitize(b.email, 120);
    if (!fullName)          return res.status(400).json({ error: "fullName is required" });
    if (!phone && !email)   return res.status(400).json({ error: "phone or email required" });
    if (email && !isValidEmail(email)) return res.status(400).json({ error: "invalid email" });
    const id           = sanitize(b.id, 40) || `VOL-${Date.now()}`;
    const interestArea = whitelist(b.interestArea, VOLUNTEER_AREAS, "general");
    const availability = whitelist(b.availability, VOLUNTEER_AVAIL, "flexible");
    const status       = whitelist(b.status, VOLUNTEER_STATUSES, "new");
    const submittedAt  = sanitize(b.submittedAt, 40);
    await pool.execute(`
      INSERT INTO volunteers
        (id,full_name,email,phone,interest_area,availability,
         experience,status,category_id,role_id,role_name,submitted_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        full_name=VALUES(full_name),email=VALUES(email),phone=VALUES(phone),
        interest_area=VALUES(interest_area),availability=VALUES(availability),
        experience=VALUES(experience),status=VALUES(status),
        category_id=VALUES(category_id),role_id=VALUES(role_id),role_name=VALUES(role_name)
    `, [id,fullName,email,phone,interestArea,availability,
        sanitize(b.experience,1000),status,
        sanitize(b.categoryId,40),sanitize(b.roleId,40),sanitize(b.roleName,120),
        submittedAt]);
    const rows = await q("SELECT * FROM volunteers ORDER BY submitted_at DESC");
    res.json(rows.map(rowToVolunteer));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/volunteers/:id/status", async (req, res) => {
  try {
    const status = whitelist(req.body?.status, VOLUNTEER_STATUSES, null);
    if (!status) return res.status(400).json({ error: "invalid status" });
    await pool.execute("UPDATE volunteers SET status=? WHERE id=?", [status, req.params.id]);
    const rows = await q("SELECT * FROM volunteers ORDER BY submitted_at DESC");
    res.json(rows.map(rowToVolunteer));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/volunteers/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM volunteers WHERE id=?", [req.params.id]);
    const rows = await q("SELECT * FROM volunteers ORDER BY submitted_at DESC");
    res.json(rows.map(rowToVolunteer));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── INKIND NEEDS ─────────────────────────────────────────────────────────────

app.get("/api/inkind_needs", async (_req, res) => {
  try {
    res.json((await q("SELECT * FROM inkind_needs")).map(rowToNeed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/inkind_needs", async (req, res) => {
  try {
    const b      = req.body;
    const nameEn = sanitize(b.name?.en, 200);
    if (!nameEn) return res.status(400).json({ error: "name.en is required" });
    const id       = sanitize(b.id, 40) || `ik-${Date.now()}`;
    const category = whitelist(b.category, INKIND_CATEGORIES, "Other");
    const urgency  = whitelist(b.urgency, INKIND_URGENCIES, "Medium");
    await pool.execute(`
      INSERT INTO inkind_needs
        (id,name_en,name_am,category,needed_qty_en,needed_qty_am,urgency,description_en,description_am)
      VALUES (?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name_en=VALUES(name_en),name_am=VALUES(name_am),category=VALUES(category),
        needed_qty_en=VALUES(needed_qty_en),needed_qty_am=VALUES(needed_qty_am),
        urgency=VALUES(urgency),description_en=VALUES(description_en),description_am=VALUES(description_am)
    `, [id, nameEn, sanitize(b.name?.am,200), category,
        sanitize(b.neededQuantity?.en,100), sanitize(b.neededQuantity?.am,100),
        urgency, sanitize(b.description?.en,600), sanitize(b.description?.am,600)]);
    res.json((await q("SELECT * FROM inkind_needs")).map(rowToNeed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/inkind_needs/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM inkind_needs WHERE id=?", [req.params.id]);
    res.json((await q("SELECT * FROM inkind_needs")).map(rowToNeed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/inkind_needs/reset", async (_req, res) => {
  try {
    res.json((await q("SELECT * FROM inkind_needs")).map(rowToNeed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── ADMIN PROFILE ────────────────────────────────────────────────────────────

app.get("/api/admin_profile", async (_req, res) => {
  try {
    const row = await q1("SELECT * FROM admin_profile LIMIT 1");
    if (!row) return res.status(404).json({ error: "Admin profile not found" });
    res.json({
      name: row.name, email: row.email, role: row.role,
      phone: row.phone, username: row.username, passwordHash: row.password_hash,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin_profile", async (req, res) => {
  try {
    const b        = req.body;
    const username = sanitize(b.username, 60);
    const password = sanitize(b.passwordHash, 200);
    if (!username) return res.status(400).json({ error: "username is required" });
    if (!password) return res.status(400).json({ error: "password is required" });
    await pool.execute(`
      INSERT INTO admin_profile (name,email,role,phone,username,password_hash)
      VALUES (?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name),email=VALUES(email),role=VALUES(role),
        phone=VALUES(phone),password_hash=VALUES(password_hash)
    `, [sanitize(b.name,120), sanitize(b.email,120), sanitize(b.role,120),
        sanitizePhone(b.phone), username, password]);
    const row = await q1("SELECT * FROM admin_profile LIMIT 1");
    res.json({ name:row.name, email:row.email, role:row.role,
               phone:row.phone, username:row.username, passwordHash:row.password_hash });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── AVAILABILITY SLOTS ───────────────────────────────────────────────────────

app.get("/api/availability_slots", async (_req, res) => {
  try {
    res.json((await q("SELECT * FROM availability_slots ORDER BY slot_date, start_time")).map(rowToSlot));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/availability_slots/available", async (_req, res) => {
  try {
    const rows = await q(
      "SELECT * FROM availability_slots WHERE is_active=1 AND current_bookings<max_bookings ORDER BY slot_date, start_time");
    res.json(rows.map(rowToSlot));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/availability_slots", async (req, res) => {
  try {
    const b = req.body;
    const date      = sanitize(b.date, 80);
    const startTime = sanitize(b.startTime, 40);
    const endTime   = sanitize(b.endTime, 40);
    if (!date || !startTime || !endTime)
      return res.status(400).json({ error: "date, startTime and endTime are required" });
    const id             = sanitize(b.id, 40) || `slot-${Date.now()}`;
    const maxBookings    = Math.max(1, Math.min(200, parseInt(b.maxBookings)||10));
    const currentBookings= Math.max(0, parseInt(b.currentBookings)||0);
    const isActive       = b.isActive !== false ? 1 : 0;
    await pool.execute(`
      INSERT INTO availability_slots
        (id,slot_date,start_time,end_time,label,max_bookings,current_bookings,is_active)
      VALUES (?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        slot_date=VALUES(slot_date),start_time=VALUES(start_time),end_time=VALUES(end_time),
        label=VALUES(label),max_bookings=VALUES(max_bookings),
        current_bookings=VALUES(current_bookings),is_active=VALUES(is_active)
    `, [id,date,startTime,endTime,sanitize(b.label,120),maxBookings,currentBookings,isActive]);
    res.json((await q("SELECT * FROM availability_slots ORDER BY slot_date, start_time")).map(rowToSlot));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/availability_slots/:id", async (req, res) => {
  try {
    const existing = await q1("SELECT * FROM availability_slots WHERE id=?", [req.params.id]);
    if (!existing) return res.status(404).json({ error: "Slot not found" });
    const b = { ...existing, ...req.body };
    await pool.execute(`
      UPDATE availability_slots
      SET slot_date=?,start_time=?,end_time=?,label=?,max_bookings=?,current_bookings=?,is_active=?
      WHERE id=?
    `, [sanitize(b.date||b.slot_date,80), sanitize(b.startTime||b.start_time,40),
        sanitize(b.endTime||b.end_time,40), sanitize(b.label,120),
        Math.max(1,parseInt(b.maxBookings||b.max_bookings)||10),
        Math.max(0,parseInt(b.currentBookings||b.current_bookings)||0),
        b.isActive!==false && b.is_active!==0 ? 1 : 0,
        req.params.id]);
    res.json((await q("SELECT * FROM availability_slots ORDER BY slot_date, start_time")).map(rowToSlot));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/availability_slots/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM availability_slots WHERE id=?", [req.params.id]);
    res.json((await q("SELECT * FROM availability_slots ORDER BY slot_date, start_time")).map(rowToSlot));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── MEDICINE ITEMS ───────────────────────────────────────────────────────────

app.get("/api/medicine_items", async (_req, res) => {
  try {
    res.json((await q("SELECT * FROM medicine_items ORDER BY total_monthly DESC")).map(rowToMed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/medicine_items", async (req, res) => {
  try {
    const b    = req.body;
    const name = sanitize(b.name, 120);
    if (!name) return res.status(400).json({ error: "name is required" });
    const id = sanitize(b.id, 40) || `med-${Date.now()}`;
    await pool.execute(`
      INSERT INTO medicine_items
        (id,name,monthly_qty,unit_price,total_monthly,patients_helped,urgency,description_en,description_am)
      VALUES (?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name),monthly_qty=VALUES(monthly_qty),unit_price=VALUES(unit_price),
        total_monthly=VALUES(total_monthly),patients_helped=VALUES(patients_helped),
        urgency=VALUES(urgency),description_en=VALUES(description_en),description_am=VALUES(description_am)
    `, [id, name,
        Math.max(0,parseInt(b.monthlyQty)||0), Math.max(0,parseFloat(b.unitPrice)||0),
        Math.max(0,parseFloat(b.totalMonthly)||0), Math.max(0,parseInt(b.patientsHelped)||0),
        whitelist(b.urgency, INKIND_URGENCIES, "Medium"),
        sanitize(b.description?.en,500), sanitize(b.description?.am,500)]);
    res.json((await q("SELECT * FROM medicine_items ORDER BY total_monthly DESC")).map(rowToMed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/medicine_items/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM medicine_items WHERE id=?", [req.params.id]);
    res.json((await q("SELECT * FROM medicine_items ORDER BY total_monthly DESC")).map(rowToMed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── MEDICINE PLEDGES ─────────────────────────────────────────────────────────

async function allMedPledges() {
  const pledges = await q("SELECT * FROM medicine_pledges ORDER BY created_at DESC");
  const result  = [];
  for (const p of pledges) {
    const items = await q("SELECT * FROM medicine_pledge_items WHERE pledge_id=?", [p.id]);
    result.push({
      id: p.id, donorName: p.donor_name, donorPhone: p.donor_phone, donorEmail: p.donor_email,
      date: p.date, status: p.status, notes: p.notes,
      items: items.map(it => ({ medicineId: it.medicine_id, medicineName: it.medicine_name, quantity: it.quantity })),
    });
  }
  return result;
}

app.get("/api/medicine_pledges", async (_req, res) => {
  try { res.json(await allMedPledges()); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/medicine_pledges", async (req, res) => {
  try {
    const b = req.body;
    const donorName  = sanitize(b.donorName, 120);
    const donorPhone = sanitizePhone(b.donorPhone);
    const donorEmail = sanitize(b.donorEmail, 120);
    if (!donorName) return res.status(400).json({ error: "donorName is required" });
    if (!donorPhone && !donorEmail) return res.status(400).json({ error: "phone or email required" });
    const id = sanitize(b.id, 40) || `MED-${Date.now()}`;
    await pool.execute(`
      INSERT INTO medicine_pledges (id,donor_name,donor_phone,donor_email,date,status,notes)
      VALUES (?,?,?,?,?,?,?)
    `, [id,donorName,donorPhone,donorEmail,sanitize(b.date,80),
        whitelist(b.status,["pledged","received","cancelled"],"pledged"),sanitize(b.notes,500)]);
    for (const it of (Array.isArray(b.items)?b.items:[])) {
      await pool.execute(
        "INSERT INTO medicine_pledge_items (pledge_id,medicine_id,medicine_name,quantity) VALUES (?,?,?,?)",
        [id, sanitize(it.medicineId,40), sanitize(it.medicineName,120), Math.max(1,parseInt(it.quantity)||1)]);
    }
    res.json(await allMedPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/medicine_pledges/:id/status", async (req, res) => {
  try {
    const status = whitelist(req.body?.status,["pledged","received","cancelled"],null);
    if (!status) return res.status(400).json({ error: "invalid status" });
    await pool.execute("UPDATE medicine_pledges SET status=? WHERE id=?", [status,req.params.id]);
    res.json(await allMedPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/medicine_pledges/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM medicine_pledges WHERE id=?", [req.params.id]);
    res.json(await allMedPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── SUPPLY CATEGORIES ────────────────────────────────────────────────────────

async function allSupplyCategories() {
  const cats   = await q("SELECT * FROM supply_categories ORDER BY sort_order");
  const result = [];
  for (const c of cats) result.push(await buildCategory(c));
  return result;
}

app.get("/api/supply_categories", async (_req, res) => {
  try { res.json(await allSupplyCategories()); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/supply_categories", async (req, res) => {
  try {
    const b      = req.body;
    const nameEn = sanitize(b.name?.en, 120);
    if (!nameEn) return res.status(400).json({ error: "name.en is required" });
    const id = sanitize(b.id, 40) || `cat-${Date.now()}`;
    await pool.execute(`
      INSERT INTO supply_categories (id,name_en,name_am,icon,color)
      VALUES (?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name_en=VALUES(name_en),name_am=VALUES(name_am),icon=VALUES(icon),color=VALUES(color)
    `, [id, nameEn, sanitize(b.name?.am,120), sanitize(b.icon,60)||"Package", sanitize(b.color,60)||"bg-brand-sky-400"]);

    // Replace all items for this category
    await pool.execute("DELETE FROM supply_items WHERE category_id=?", [id]);
    const items = Array.isArray(b.items) ? b.items : [];
    for (let ii = 0; ii < items.length; ii++) {
      const it = items[ii];
      const itId = sanitize(it.id, 40) || `itm-${Date.now()}-${ii}`;
      await pool.execute(`
        INSERT INTO supply_items
          (id,category_id,name_en,name_am,needed_qty_en,needed_qty_am,urgency,impact_desc_en,impact_desc_am,sort_order)
        VALUES (?,?,?,?,?,?,?,?,?,?)
      `, [itId, id, sanitize(it.name?.en,200), sanitize(it.name?.am,200),
          sanitize(it.neededQty?.en,100), sanitize(it.neededQty?.am,100),
          whitelist(it.urgency,INKIND_URGENCIES,"Medium"),
          sanitize(it.impactDesc?.en,300), sanitize(it.impactDesc?.am,300), ii]);
    }
    res.json(await allSupplyCategories());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/supply_categories/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM supply_categories WHERE id=?", [req.params.id]);
    res.json(await allSupplyCategories());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── SUPPLIES PLEDGES ─────────────────────────────────────────────────────────

async function allSuppliesPledges() {
  const pledges = await q("SELECT * FROM supplies_pledges ORDER BY created_at DESC");
  const result  = [];
  for (const p of pledges) {
    const items = await q("SELECT * FROM supplies_pledge_items WHERE pledge_id=?", [p.id]);
    result.push({
      id: p.id, donorName: p.donor_name, donorPhone: p.donor_phone, donorEmail: p.donor_email,
      categoryId: p.category_id, date: p.date, status: p.status, notes: p.notes,
      items: items.map(it => ({ itemId:it.item_id, itemName:it.item_name, quantity:it.quantity, custom:it.custom })),
    });
  }
  return result;
}

app.get("/api/supplies_pledges", async (_req, res) => {
  try { res.json(await allSuppliesPledges()); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/supplies_pledges", async (req, res) => {
  try {
    const b = req.body;
    const donorName  = sanitize(b.donorName, 120);
    const donorPhone = sanitizePhone(b.donorPhone);
    const donorEmail = sanitize(b.donorEmail, 120);
    if (!donorName) return res.status(400).json({ error: "donorName is required" });
    if (!donorPhone && !donorEmail) return res.status(400).json({ error: "phone or email required" });
    const id = sanitize(b.id, 40) || `SUP-${Date.now()}`;
    await pool.execute(`
      INSERT INTO supplies_pledges (id,donor_name,donor_phone,donor_email,category_id,date,status,notes)
      VALUES (?,?,?,?,?,?,?,?)
    `, [id,donorName,donorPhone,donorEmail,sanitize(b.categoryId,40),sanitize(b.date,80),
        whitelist(b.status,PLEDGE_STATUSES,"pledged"),sanitize(b.notes,500)]);
    for (const it of (Array.isArray(b.items)?b.items:[])) {
      await pool.execute(
        "INSERT INTO supplies_pledge_items (pledge_id,item_id,item_name,quantity,custom) VALUES (?,?,?,?,?)",
        [id, sanitize(it.itemId,40), sanitize(it.itemName,120), Math.max(1,parseInt(it.quantity)||1), sanitize(it.custom,200)]);
    }
    res.json(await allSuppliesPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/supplies_pledges/:id/status", async (req, res) => {
  try {
    const status = whitelist(req.body?.status, PLEDGE_STATUSES, null);
    if (!status) return res.status(400).json({ error: "invalid status" });
    await pool.execute("UPDATE supplies_pledges SET status=? WHERE id=?", [status,req.params.id]);
    res.json(await allSuppliesPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/supplies_pledges/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM supplies_pledges WHERE id=?", [req.params.id]);
    res.json(await allSuppliesPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── EVENT PLEDGES ────────────────────────────────────────────────────────────

function rowToEvent(r) {
  return {
    id: r.id, name: r.name, phone: r.phone, email: r.email,
    eventType: r.event_type, customType: r.custom_type,
    preferredDate: r.preferred_date, message: r.message,
    status: r.status, submittedAt: r.submitted_at,
  };
}

app.get("/api/event_pledges", async (_req, res) => {
  try {
    res.json((await q("SELECT * FROM event_pledges ORDER BY created_at DESC")).map(rowToEvent));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/event_pledges", async (req, res) => {
  try {
    const b = req.body;
    const name  = sanitize(b.name, 120);
    const phone = sanitizePhone(b.phone);
    const email = sanitize(b.email, 120);
    if (!name) return res.status(400).json({ error: "name is required" });
    if (!phone && !email) return res.status(400).json({ error: "phone or email required" });
    const id = sanitize(b.id, 40) || `EVT-${Date.now()}`;
    await pool.execute(`
      INSERT INTO event_pledges
        (id,name,phone,email,event_type,custom_type,preferred_date,message,status,submitted_at)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `, [id,name,phone,email,
        whitelist(b.eventType,EVENT_TYPES,"other"), sanitize(b.customType,80),
        sanitize(b.preferredDate,80), sanitize(b.message,600),
        whitelist(b.status,EVENT_STATUSES,"pending"), sanitize(b.submittedAt,40)]);
    res.json((await q("SELECT * FROM event_pledges ORDER BY created_at DESC")).map(rowToEvent));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/event_pledges/:id/status", async (req, res) => {
  try {
    const status = whitelist(req.body?.status, EVENT_STATUSES, null);
    if (!status) return res.status(400).json({ error: "invalid status" });
    await pool.execute("UPDATE event_pledges SET status=? WHERE id=?", [status,req.params.id]);
    res.json((await q("SELECT * FROM event_pledges ORDER BY created_at DESC")).map(rowToEvent));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/event_pledges/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM event_pledges WHERE id=?", [req.params.id]);
    res.json((await q("SELECT * FROM event_pledges ORDER BY created_at DESC")).map(rowToEvent));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── VOLUNTEER ROLES ──────────────────────────────────────────────────────────

async function allVolunteerRoles() {
  const cats   = await q("SELECT * FROM volunteer_categories ORDER BY sort_order");
  const result = [];
  for (const c of cats) result.push(await buildVolCategory(c));
  return result;
}

app.get("/api/volunteer_roles", async (_req, res) => {
  try { res.json(await allVolunteerRoles()); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/volunteer_roles", async (req, res) => {
  try {
    const b      = req.body;
    const nameEn = sanitize(b.name?.en, 120);
    if (!nameEn) return res.status(400).json({ error: "name.en is required" });
    const id = sanitize(b.id, 40) || `vcat-${Date.now()}`;
    await pool.execute(`
      INSERT INTO volunteer_categories (id,name_en,name_am,icon,color)
      VALUES (?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name_en=VALUES(name_en),name_am=VALUES(name_am),icon=VALUES(icon),color=VALUES(color)
    `, [id, nameEn, sanitize(b.name?.am,120), sanitize(b.icon,60)||"Users", sanitize(b.color,60)||"bg-brand-sky-400"]);

    // Replace roles
    await pool.execute("DELETE FROM volunteer_roles WHERE category_id=?", [id]);
    const roles = Array.isArray(b.roles) ? b.roles : [];
    for (let ri = 0; ri < roles.length; ri++) {
      const r  = roles[ri];
      const rid = sanitize(r.id, 40) || `vr-${Date.now()}-${ri}`;
      await pool.execute(`
        INSERT INTO volunteer_roles
          (id,category_id,name_en,name_am,description_en,description_am,sort_order)
        VALUES (?,?,?,?,?,?,?)
      `, [rid,id, sanitize(r.name?.en,120), sanitize(r.name?.am,120),
          sanitize(r.description?.en,300), sanitize(r.description?.am,300), ri]);
    }
    res.json(await allVolunteerRoles());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/volunteer_roles/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM volunteer_categories WHERE id=?", [req.params.id]);
    res.json(await allVolunteerRoles());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── NEWS ─────────────────────────────────────────────────────────────────────

app.get("/api/news", async (req, res) => {
  try {
    const rows = req.query.all === "true"
      ? await q("SELECT * FROM news ORDER BY published_at DESC")
      : await q("SELECT * FROM news WHERE is_published=1 ORDER BY published_at DESC");
    res.json(rows.map(rowToNews));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/news/:slug", async (req, res) => {
  try {
    const row = await q1("SELECT * FROM news WHERE slug=?", [req.params.slug]);
    if (!row) return res.status(404).json({ error: "Article not found" });
    res.json(rowToNews(row));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/news", async (req, res) => {
  try {
    const b       = req.body;
    const titleEn = sanitize(b.title?.en, 200);
    if (!titleEn) return res.status(400).json({ error: "title.en is required" });
    const id      = sanitize(b.id, 40) || `news-${Date.now()}`;
    const rawSlug = (sanitize(b.slug || titleEn, 200))
      .toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9\-]/g,"").slice(0,80)
      || `article-${Date.now()}`;
    const publishedAt = b.publishedAt ? new Date(b.publishedAt) : new Date();
    await pool.execute(`
      INSERT INTO news
        (id,slug,title_en,title_am,excerpt_en,excerpt_am,body_en,body_am,
         category,cover_image,author,published_at,is_published)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        slug=VALUES(slug),title_en=VALUES(title_en),title_am=VALUES(title_am),
        excerpt_en=VALUES(excerpt_en),excerpt_am=VALUES(excerpt_am),
        body_en=VALUES(body_en),body_am=VALUES(body_am),
        category=VALUES(category),cover_image=VALUES(cover_image),
        author=VALUES(author),published_at=VALUES(published_at),is_published=VALUES(is_published)
    `, [id, rawSlug, titleEn, sanitize(b.title?.am,200),
        sanitize(b.excerpt?.en,400), sanitize(b.excerpt?.am,400),
        b.body?.en||"", b.body?.am||"",
        whitelist(b.category, NEWS_CATEGORIES, "Community"),
        sanitize(b.coverImage,500), sanitize(b.author,80),
        publishedAt, b.isPublished===true ? 1 : 0]);
    const row = await q1("SELECT * FROM news WHERE id=?", [id]);
    res.json(rowToNews(row));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/news/:id/publish", async (req, res) => {
  try {
    const isPublished = req.body.isPublished === true ? 1 : 0;
    await pool.execute("UPDATE news SET is_published=? WHERE id=?", [isPublished,req.params.id]);
    const rows = await q("SELECT * FROM news ORDER BY published_at DESC");
    res.json(rows.map(rowToNews));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/news/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM news WHERE id=?", [req.params.id]);
    const rows = await q("SELECT * FROM news ORDER BY published_at DESC");
    res.json(rows.map(rowToNews));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── LEGACY FULL-DB EXPORT (admin uses this to download backup) ───────────────

app.get(["/api/db","/api/db/download"], async (req, res) => {
  try {
    const [bookingRows, pledgeRows, volRows, needRows, slotRows, medRows,
           medPledgeRows, catRows, supPledgeRows, evtRows, volCatRows, newsRows,
           apRow] = await Promise.all([
      q("SELECT * FROM bookings ORDER BY created_at DESC"),
      q("SELECT * FROM pledges ORDER BY created_at DESC"),
      q("SELECT * FROM volunteers ORDER BY submitted_at DESC"),
      q("SELECT * FROM inkind_needs"),
      q("SELECT * FROM availability_slots ORDER BY slot_date"),
      q("SELECT * FROM medicine_items ORDER BY total_monthly DESC"),
      q("SELECT * FROM medicine_pledges ORDER BY created_at DESC"),
      q("SELECT * FROM supply_categories ORDER BY sort_order"),
      q("SELECT * FROM supplies_pledges ORDER BY created_at DESC"),
      q("SELECT * FROM event_pledges ORDER BY created_at DESC"),
      q("SELECT * FROM volunteer_categories ORDER BY sort_order"),
      q("SELECT * FROM news ORDER BY published_at DESC"),
      q1("SELECT * FROM admin_profile LIMIT 1"),
    ]);
    // Build full db shape
    const out = {
      bookings:        bookingRows.map(rowToBooking),
      pledges:         pledgeRows.map(r => ({id:r.id,donorName:r.donor_name,donorEmail:r.donor_email,donorPhone:r.donor_phone,type:r.type,date:r.date,status:r.status,pledgedItems:[]})),
      volunteers:      volRows.map(rowToVolunteer),
      inKindNeeds:     needRows.map(rowToNeed),
      availabilitySlots: slotRows.map(rowToSlot),
      medicineItems:   medRows.map(rowToMed),
      medicinePledges: await allMedPledges(),
      supplyCategories:await allSupplyCategories(),
      suppliesPledges: await allSuppliesPledges(),
      eventPledges:    evtRows.map(rowToEvent),
      volunteerRoles:  await allVolunteerRoles(),
      news:            newsRows.map(rowToNews),
      adminProfile:    apRow ? { name:apRow.name,email:apRow.email,role:apRow.role,phone:apRow.phone,username:apRow.username,passwordHash:apRow.password_hash } : null,
    };
    if (req.query.download==="true" || req.path.includes("download")) {
      res.setHeader("Content-Type","application/json");
      res.setHeader("Content-Disposition",'attachment; filename="selihom_backup.json"');
      return res.send(JSON.stringify(out, null, 2));
    }
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── STATIC FILES + SPA FALLBACK ──────────────────────────────────────────────

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ─── START ────────────────────────────────────────────────────────────────────

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\nSelihom server  →  http://0.0.0.0:${PORT}  (MySQL backend)\n`);
});
