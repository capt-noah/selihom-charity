import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "100kb" }));

// DB_PATH is resolved from process.cwd() — always run the server from the
// project root (e.g. `node dist/server.cjs`) so this resolves correctly.
const DB_PATH = path.join(process.cwd(), "data", "db.json");

const DEFAULT_DB = {
  bookings: [],
  pledges: [],
  volunteers: [],
  inKindNeeds: [],
  adminProfile: null,
};

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
      return structuredClone(DEFAULT_DB);
    }
    const content = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading db.json:", err);
    return structuredClone(DEFAULT_DB);
  }
}

// Serialised write queue — prevents concurrent requests from overwriting each other.
// All mutations go through this instead of calling fs.writeFileSync directly.
let writeQueue: Promise<void> = Promise.resolve();

function writeDB(data: any): Promise<boolean> {
  writeQueue = writeQueue.then(() => {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing db.json:", err);
    }
  });
  return writeQueue.then(() => true).catch(() => false);
}

// --- INPUT SANITIZATION & VALIDATION HELPERS ---

/** Strip control characters, trim, and cap length. */
function sanitize(value: unknown, maxLen = 500): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, maxLen);
}

function sanitizePhone(value: unknown): string {
  return sanitize(value, 30).replace(/[^\d+\-\s()]/g, "");
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

const BOOKING_STATUSES = ["pending", "approved", "completed", "cancelled"] as const;
const PLEDGE_STATUSES  = ["pledged", "received", "cancelled"] as const;
const VOLUNTEER_STATUSES = ["new", "reviewed", "accepted", "declined"] as const;
const VISIT_TYPES = ["individual", "group", "corporate", "school", "volunteer"] as const;
const VOLUNTEER_AREAS = ["kitchen", "medical", "education", "psychology", "general"] as const;
const VOLUNTEER_AVAIL = ["weekdays", "weekends", "flexible"] as const;
const INKIND_CATEGORIES = ["Food", "Clothing", "Education", "Medical", "Hygiene", "Other"] as const;
const INKIND_URGENCIES  = ["High", "Medium", "Low"] as const;

function whitelist<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(v as string) ? (v as T) : fallback;
}

/** Validate and sanitize a booking body. Returns cleaned object or throws. */
function parseBooking(body: any) {
  const name  = sanitize(body.name, 120);
  const phone = sanitizePhone(body.phone);
  if (!name)  throw new Error("name is required");
  if (!phone) throw new Error("phone is required");

  const email      = sanitize(body.email, 120);
  const date       = sanitize(body.date, 80);
  const timeSlot   = sanitize(body.timeSlot, 80);
  const notes      = sanitize(body.notes, 600);
  const visitType  = whitelist(body.visitType, VISIT_TYPES, "individual");
  const visitorCount = Math.max(1, Math.min(100, parseInt(body.visitorCount) || 1));
  const id         = sanitize(body.id, 40) || `TKT-${Date.now()}`;
  const status     = whitelist(body.status, BOOKING_STATUSES, "pending");
  const createdAt  = sanitize(body.createdAt, 40);

  if (email && !isValidEmail(email)) throw new Error("invalid email format");
  return { id, name, email, phone, date, timeSlot, visitType, visitorCount, notes, status, createdAt };
}

/** Validate and sanitize a pledge body. Returns cleaned object or throws. */
function parsePledge(body: any) {
  const donorName  = sanitize(body.donorName, 120);
  const donorPhone = sanitizePhone(body.donorPhone);
  const donorEmail = sanitize(body.donorEmail, 120);
  if (!donorName) throw new Error("donorName is required");
  if (!donorPhone && !donorEmail) throw new Error("phone or email is required");
  if (donorEmail && !isValidEmail(donorEmail)) throw new Error("invalid email format");

  const id     = sanitize(body.id, 40) || `PLG-${Date.now()}`;
  const date   = sanitize(body.date, 80);
  const status = whitelist(body.status, PLEDGE_STATUSES, "pledged");
  const type   = whitelist(body.type, ["money", "inkind"] as const, "inkind");

  // Sanitize pledgedItems array
  const pledgedItems = Array.isArray(body.pledgedItems)
    ? body.pledgedItems.slice(0, 50).map((it: any) => ({
        itemId:   sanitize(it.itemId, 60),
        name:     sanitize(it.name, 200),
        quantity: Math.max(0, Math.min(10000, parseInt(it.quantity) || 0)),
      }))
    : [];

  return { id, donorName, donorEmail, donorPhone, type, pledgedItems, date, status };
}

/** Validate and sanitize a volunteer body. Returns cleaned object or throws. */
function parseVolunteer(body: any) {
  const fullName = sanitize(body.fullName, 120);
  const phone    = sanitizePhone(body.phone);
  const email    = sanitize(body.email, 120);
  if (!fullName) throw new Error("fullName is required");
  if (!phone && !email) throw new Error("phone or email is required");
  if (email && !isValidEmail(email)) throw new Error("invalid email format");

  const id           = sanitize(body.id, 40) || `VOL-${Date.now()}`;
  const experience   = sanitize(body.experience, 1000);
  const submittedAt  = sanitize(body.submittedAt, 40);
  const interestArea = whitelist(body.interestArea, VOLUNTEER_AREAS, "general");
  const availability = whitelist(body.availability, VOLUNTEER_AVAIL, "flexible");
  const status       = whitelist(body.status, VOLUNTEER_STATUSES, "new");

  return { id, fullName, email, phone, interestArea, availability, experience, status, submittedAt };
}

/** Validate and sanitize an in-kind need body. Returns cleaned object or throws. */
function parseInKindNeed(body: any) {
  const nameEn = sanitize(body.name?.en, 200);
  const nameAm = sanitize(body.name?.am, 200);
  const descEn = sanitize(body.description?.en, 600);
  const descAm = sanitize(body.description?.am, 600);
  const qtyEn  = sanitize(body.neededQuantity?.en, 100);
  const qtyAm  = sanitize(body.neededQuantity?.am, 100);
  if (!nameEn) throw new Error("name.en is required");

  const id       = sanitize(body.id, 40) || `ik-${Date.now()}`;
  const category = whitelist(body.category, INKIND_CATEGORIES, "Other");
  const urgency  = whitelist(body.urgency, INKIND_URGENCIES, "Medium");

  return {
    id,
    name:           { en: nameEn, am: nameAm },
    category,
    neededQuantity: { en: qtyEn,  am: qtyAm  },
    urgency,
    description:    { en: descEn, am: descAm },
  };
}

/** Validate and sanitize an admin profile body. Returns cleaned object or throws. */
function parseAdminProfile(body: any) {
  const username     = sanitize(body.username, 60);
  const passwordHash = sanitize(body.passwordHash, 200);
  if (!username)     throw new Error("username is required");
  if (!passwordHash) throw new Error("password is required");

  return {
    name:         sanitize(body.name, 120),
    email:        sanitize(body.email, 120),
    role:         sanitize(body.role, 120),
    phone:        sanitizePhone(body.phone),
    username,
    passwordHash,
  };
}

// --- API ENDPOINTS ---

// Full Database & Direct db.json File Downloads
app.get(["/api/db", "/data/db.json", "/db.json", "/api/db.json", "/api/db/download"], (req, res) => {
  const db = readDB();
  if (req.query.download === "true" || req.path.endsWith(".json") || req.path.includes("download")) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="db.json"');
    return res.send(JSON.stringify(db, null, 2));
  }
  res.json(db);
});

app.post("/api/db", async (req, res) => {
  const newDb = req.body;
  if (!newDb || typeof newDb !== "object") {
    return res.status(400).json({ error: "Invalid JSON database format" });
  }
  const current = readDB();
  const merged = { ...current, ...newDb };
  await writeDB(merged);
  res.json(merged);
});

// Bookings
app.get("/api/bookings", (req, res) => {
  const db = readDB();
  res.json(db.bookings || []);
});

app.post("/api/bookings", async (req, res) => {
  let newBooking: any;
  try { newBooking = parseBooking(req.body); }
  catch (e: any) { return res.status(400).json({ error: e.message }); }

  const db = readDB();
  const current = db.bookings || [];
  const index = current.findIndex((b: any) => b.id === newBooking.id);
  db.bookings = index >= 0
    ? current.map((b: any) => (b.id === newBooking.id ? newBooking : b))
    : [newBooking, ...current];
  await writeDB(db);
  res.json(db.bookings);
});

app.put("/api/bookings/:id/status", async (req, res) => {
  const status = whitelist(req.body?.status, BOOKING_STATUSES, null as any);
  if (!status) return res.status(400).json({ error: "invalid status value" });

  const db = readDB();
  const { id } = req.params;
  db.bookings = (db.bookings || []).map((b: any) =>
    b.id === id ? { ...b, status } : b
  );
  await writeDB(db);
  res.json(db.bookings);
});

app.delete("/api/bookings/:id", async (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.bookings = (db.bookings || []).filter((b: any) => b.id !== id);
  await writeDB(db);
  res.json(db.bookings);
});

// Pledges
app.get("/api/pledges", (req, res) => {
  const db = readDB();
  res.json(db.pledges || []);
});

app.post("/api/pledges", async (req, res) => {
  let newPledge: any;
  try { newPledge = parsePledge(req.body); }
  catch (e: any) { return res.status(400).json({ error: e.message }); }

  const db = readDB();
  const current = db.pledges || [];
  const index = current.findIndex((p: any) => p.id === newPledge.id);
  db.pledges = index >= 0
    ? current.map((p: any) => (p.id === newPledge.id ? newPledge : p))
    : [newPledge, ...current];
  await writeDB(db);
  res.json(db.pledges);
});

app.put("/api/pledges/:id/status", async (req, res) => {
  const status = whitelist(req.body?.status, PLEDGE_STATUSES, null as any);
  if (!status) return res.status(400).json({ error: "invalid status value" });

  const db = readDB();
  const { id } = req.params;
  db.pledges = (db.pledges || []).map((p: any) =>
    p.id === id ? { ...p, status } : p
  );
  await writeDB(db);
  res.json(db.pledges);
});

app.delete("/api/pledges/:id", async (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.pledges = (db.pledges || []).filter((p: any) => p.id !== id);
  await writeDB(db);
  res.json(db.pledges);
});

// Volunteers
app.get("/api/volunteers", (req, res) => {
  const db = readDB();
  res.json(db.volunteers || []);
});

app.post("/api/volunteers", async (req, res) => {
  let newVol: any;
  try { newVol = parseVolunteer(req.body); }
  catch (e: any) { return res.status(400).json({ error: e.message }); }

  const db = readDB();
  const current = db.volunteers || [];
  const index = current.findIndex((v: any) => v.id === newVol.id);
  db.volunteers = index >= 0
    ? current.map((v: any) => (v.id === newVol.id ? newVol : v))
    : [newVol, ...current];
  await writeDB(db);
  res.json(db.volunteers);
});

app.put("/api/volunteers/:id/status", async (req, res) => {
  const status = whitelist(req.body?.status, VOLUNTEER_STATUSES, null as any);
  if (!status) return res.status(400).json({ error: "invalid status value" });

  const db = readDB();
  const { id } = req.params;
  db.volunteers = (db.volunteers || []).map((v: any) =>
    v.id === id ? { ...v, status } : v
  );
  await writeDB(db);
  res.json(db.volunteers);
});

app.delete("/api/volunteers/:id", async (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.volunteers = (db.volunteers || []).filter((v: any) => v.id !== id);
  await writeDB(db);
  res.json(db.volunteers);
});

// In-Kind Needs
app.get("/api/inkind_needs", (req, res) => {
  const db = readDB();
  res.json(db.inKindNeeds || []);
});

app.post("/api/inkind_needs", async (req, res) => {
  let newItem: any;
  try { newItem = parseInKindNeed(req.body); }
  catch (e: any) { return res.status(400).json({ error: e.message }); }

  const db = readDB();
  const current = db.inKindNeeds || [];
  const index = current.findIndex((it: any) => it.id === newItem.id);
  db.inKindNeeds = index >= 0
    ? current.map((it: any) => (it.id === newItem.id ? newItem : it))
    : [newItem, ...current];
  await writeDB(db);
  res.json(db.inKindNeeds);
});

app.delete("/api/inkind_needs/:id", async (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.inKindNeeds = (db.inKindNeeds || []).filter((it: any) => it.id !== id);
  await writeDB(db);
  res.json(db.inKindNeeds);
});

app.post("/api/inkind_needs/reset", async (req, res) => {
  // Returns the current inKindNeeds from db.json — the source of truth is the file itself.
  const db = readDB();
  res.json(db.inKindNeeds || []);
});

// Admin Profile
app.get("/api/admin_profile", (req, res) => {
  const db = readDB();
  if (!db.adminProfile) {
    return res.status(404).json({ error: "Admin profile not found in db.json" });
  }
  res.json(db.adminProfile);
});

app.post("/api/admin_profile", async (req, res) => {
  let profile: any;
  try { profile = parseAdminProfile(req.body); }
  catch (e: any) { return res.status(400).json({ error: e.message }); }

  const db = readDB();
  db.adminProfile = profile;
  await writeDB(db);
  res.json(db.adminProfile);
});

// --- VITE / STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
