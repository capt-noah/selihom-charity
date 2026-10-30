/**
 * database/seed.js
 * Seeds the MySQL database with all data from data/db.json.
 *
 * Usage:  node database/seed.js
 *
 * Safe to re-run — uses INSERT IGNORE / INSERT … ON DUPLICATE KEY UPDATE
 * so existing rows are never duplicated.
 */

import pool from "./db.js";
import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH   = path.join(__dirname, "..", "data", "db.json");

// ── helpers ──────────────────────────────────────────────────────────────────

function s(v, max = 500) {
  if (v == null) return "";
  return String(v).replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, max);
}

function shortId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── main ─────────────────────────────────────────────────────────────────────

async function seed() {
  let conn;
  try {
    conn = await pool.getConnection();
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));

    console.log("Seeding Selihom database from db.json …\n");

    // ── 1. admin_profile ─────────────────────────────────────
    const ap = db.adminProfile;
    if (ap) {
      await conn.execute(`
        INSERT INTO admin_profile (name, email, role, phone, username, password_hash)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name), email = VALUES(email),
          role = VALUES(role), phone = VALUES(phone),
          password_hash = VALUES(password_hash)
      `, [s(ap.name,120), s(ap.email,120), s(ap.role,120), s(ap.phone,30), s(ap.username,60), s(ap.passwordHash,200)]);
      console.log("  ✓ admin_profile");
    }

    // ── 2. availability_slots ─────────────────────────────────
    const slots = db.availabilitySlots || [];
    for (const sl of slots) {
      await conn.execute(`
        INSERT IGNORE INTO availability_slots
          (id, slot_date, start_time, end_time, label, max_bookings, current_bookings, is_active)
        VALUES (?,?,?,?,?,?,?,?)
      `, [s(sl.id,40), s(sl.date,80), s(sl.startTime,40), s(sl.endTime,40),
          s(sl.label,120), sl.maxBookings||10, sl.currentBookings||0, sl.isActive!==false?1:0]);
    }
    console.log(`  ✓ availability_slots (${slots.length})`);

    // ── 3. bookings ───────────────────────────────────────────
    const bookings = db.bookings || [];
    for (const b of bookings) {
      await conn.execute(`
        INSERT IGNORE INTO bookings
          (id, name, email, phone, visit_date, time_slot, visit_type, visitor_count,
           notes, status, contact_type, organization_name, slot_id, created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `, [s(b.id,40), s(b.name,120), s(b.email,120), s(b.phone,30),
          s(b.date,80), s(b.timeSlot,80), s(b.visitType,20)||"individual",
          b.visitorCount||1, s(b.notes,600), s(b.status,20)||"pending",
          s(b.contactType,20)||"individual", s(b.organizationName,120),
          b.slotId||null, s(b.createdAt,40)]);
    }
    console.log(`  ✓ bookings (${bookings.length})`);

    // ── 4. pledges + pledge_items ─────────────────────────────
    const pledges = db.pledges || [];
    for (const p of pledges) {
      await conn.execute(`
        INSERT IGNORE INTO pledges (id, donor_name, donor_email, donor_phone, type, date, status)
        VALUES (?,?,?,?,?,?,?)
      `, [s(p.id,40), s(p.donorName,120), s(p.donorEmail,120), s(p.donorPhone,30),
          s(p.type,20)||"inkind", s(p.date,80), s(p.status,20)||"pledged"]);
      for (const it of (p.pledgedItems||[])) {
        await conn.execute(`
          INSERT IGNORE INTO pledge_items (pledge_id, item_id, item_name, quantity)
          VALUES (?,?,?,?)
        `, [s(p.id,40), s(it.itemId,60), s(it.name,200), it.quantity||0]);
      }
    }
    console.log(`  ✓ pledges (${pledges.length})`);

    // ── 5. volunteers ─────────────────────────────────────────
    const vols = db.volunteers || [];
    for (const v of vols) {
      await conn.execute(`
        INSERT IGNORE INTO volunteers
          (id, full_name, email, phone, interest_area, availability,
           experience, status, category_id, role_id, role_name, submitted_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
      `, [s(v.id,40), s(v.fullName,120), s(v.email,120), s(v.phone,30),
          s(v.interestArea,40)||"general", s(v.availability,20)||"flexible",
          s(v.experience,1000), s(v.status,20)||"new",
          s(v.categoryId,40), s(v.roleId,40), s(v.roleName,120),
          s(v.submittedAt,40)]);
    }
    console.log(`  ✓ volunteers (${vols.length})`);

    // ── 6. inkind_needs ───────────────────────────────────────
    const needs = db.inKindNeeds || [];
    for (const n of needs) {
      await conn.execute(`
        INSERT INTO inkind_needs
          (id, name_en, name_am, category, needed_qty_en, needed_qty_am,
           urgency, description_en, description_am)
        VALUES (?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          name_en=VALUES(name_en), name_am=VALUES(name_am),
          category=VALUES(category), needed_qty_en=VALUES(needed_qty_en),
          needed_qty_am=VALUES(needed_qty_am), urgency=VALUES(urgency),
          description_en=VALUES(description_en), description_am=VALUES(description_am)
      `, [s(n.id,40), s(n.name?.en,200), s(n.name?.am,200),
          s(n.category,40)||"Other", s(n.neededQuantity?.en,100), s(n.neededQuantity?.am,100),
          s(n.urgency,20)||"Medium", s(n.description?.en,600), s(n.description?.am,600)]);
    }
    console.log(`  ✓ inkind_needs (${needs.length})`);

    // ── 7. medicine_items ─────────────────────────────────────
    const meds = db.medicineItems || [];
    for (const m of meds) {
      await conn.execute(`
        INSERT INTO medicine_items
          (id, name, monthly_qty, unit_price, total_monthly, patients_helped,
           urgency, description_en, description_am)
        VALUES (?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          name=VALUES(name), monthly_qty=VALUES(monthly_qty),
          unit_price=VALUES(unit_price), total_monthly=VALUES(total_monthly),
          patients_helped=VALUES(patients_helped), urgency=VALUES(urgency),
          description_en=VALUES(description_en), description_am=VALUES(description_am)
      `, [s(m.id,40), s(m.name,120), m.monthlyQty||0, m.unitPrice||0,
          m.totalMonthly||0, m.patientsHelped||0, s(m.urgency,20)||"Medium",
          s(m.description?.en,500), s(m.description?.am,500)]);
    }
    console.log(`  ✓ medicine_items (${meds.length})`);

    // ── 8. medicine_pledges + items ───────────────────────────
    const medPledges = db.medicinePledges || [];
    for (const p of medPledges) {
      await conn.execute(`
        INSERT IGNORE INTO medicine_pledges
          (id, donor_name, donor_phone, donor_email, date, status, notes)
        VALUES (?,?,?,?,?,?,?)
      `, [s(p.id,40), s(p.donorName,120), s(p.donorPhone,30), s(p.donorEmail,120),
          s(p.date,80), s(p.status,20)||"pledged", s(p.notes,500)]);
      for (const it of (p.items||[])) {
        await conn.execute(`
          INSERT IGNORE INTO medicine_pledge_items
            (pledge_id, medicine_id, medicine_name, quantity)
          VALUES (?,?,?,?)
        `, [s(p.id,40), s(it.medicineId,40), s(it.medicineName,120), it.quantity||1]);
      }
    }
    console.log(`  ✓ medicine_pledges (${medPledges.length})`);

    // ── 9. supply_categories + supply_items ───────────────────
    const cats = db.supplyCategories || [];
    for (let ci = 0; ci < cats.length; ci++) {
      const c = cats[ci];
      await conn.execute(`
        INSERT INTO supply_categories (id, name_en, name_am, icon, color, sort_order)
        VALUES (?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          name_en=VALUES(name_en), name_am=VALUES(name_am),
          icon=VALUES(icon), color=VALUES(color), sort_order=VALUES(sort_order)
      `, [s(c.id,40), s(c.name?.en,120), s(c.name?.am,120),
          s(c.icon,60)||"Package", s(c.color,60)||"bg-brand-sky-400", ci]);

      const items = c.items || [];
      for (let ii = 0; ii < items.length; ii++) {
        const it = items[ii];
        await conn.execute(`
          INSERT INTO supply_items
            (id, category_id, name_en, name_am, needed_qty_en, needed_qty_am,
             urgency, impact_desc_en, impact_desc_am, sort_order)
          VALUES (?,?,?,?,?,?,?,?,?,?)
          ON DUPLICATE KEY UPDATE
            category_id=VALUES(category_id), name_en=VALUES(name_en),
            name_am=VALUES(name_am), needed_qty_en=VALUES(needed_qty_en),
            needed_qty_am=VALUES(needed_qty_am), urgency=VALUES(urgency),
            impact_desc_en=VALUES(impact_desc_en), impact_desc_am=VALUES(impact_desc_am),
            sort_order=VALUES(sort_order)
        `, [s(it.id,40), s(c.id,40), s(it.name?.en,200), s(it.name?.am,200),
            s(it.neededQty?.en,100), s(it.neededQty?.am,100), s(it.urgency,20)||"Medium",
            s(it.impactDesc?.en,300), s(it.impactDesc?.am,300), ii]);
      }
    }
    console.log(`  ✓ supply_categories (${cats.length}) + all items`);

    // ── 10. supplies_pledges + items ──────────────────────────
    const supPledges = db.suppliesPledges || [];
    for (const p of supPledges) {
      await conn.execute(`
        INSERT IGNORE INTO supplies_pledges
          (id, donor_name, donor_phone, donor_email, category_id, date, status, notes)
        VALUES (?,?,?,?,?,?,?,?)
      `, [s(p.id,40), s(p.donorName,120), s(p.donorPhone,30), s(p.donorEmail,120),
          s(p.categoryId,40), s(p.date,80), s(p.status,20)||"pledged", s(p.notes,500)]);
      for (const it of (p.items||[])) {
        await conn.execute(`
          INSERT IGNORE INTO supplies_pledge_items
            (pledge_id, item_id, item_name, quantity, custom)
          VALUES (?,?,?,?,?)
        `, [s(p.id,40), s(it.itemId,40), s(it.itemName,120), it.quantity||1, s(it.custom,200)]);
      }
    }
    console.log(`  ✓ supplies_pledges (${supPledges.length})`);

    // ── 11. event_pledges ─────────────────────────────────────
    const evts = db.eventPledges || [];
    for (const e of evts) {
      await conn.execute(`
        INSERT IGNORE INTO event_pledges
          (id, name, phone, email, event_type, custom_type,
           preferred_date, message, status, submitted_at)
        VALUES (?,?,?,?,?,?,?,?,?,?)
      `, [s(e.id,40), s(e.name,120), s(e.phone,30), s(e.email,120),
          s(e.eventType,20)||"other", s(e.customType,80), s(e.preferredDate,80),
          s(e.message,600), s(e.status,20)||"pending", s(e.submittedAt,40)]);
    }
    console.log(`  ✓ event_pledges (${evts.length})`);

    // ── 12. volunteer_categories + volunteer_roles ────────────
    const vcats = db.volunteerRoles || [];
    for (let vi = 0; vi < vcats.length; vi++) {
      const vc = vcats[vi];
      await conn.execute(`
        INSERT INTO volunteer_categories (id, name_en, name_am, icon, color, sort_order)
        VALUES (?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          name_en=VALUES(name_en), name_am=VALUES(name_am),
          icon=VALUES(icon), color=VALUES(color), sort_order=VALUES(sort_order)
      `, [s(vc.id,40), s(vc.name?.en,120), s(vc.name?.am,120),
          s(vc.icon,60)||"Users", s(vc.color,60)||"bg-brand-sky-400", vi]);

      const roles = vc.roles || [];
      for (let ri = 0; ri < roles.length; ri++) {
        const r = roles[ri];
        await conn.execute(`
          INSERT INTO volunteer_roles
            (id, category_id, name_en, name_am, description_en, description_am, sort_order)
          VALUES (?,?,?,?,?,?,?)
          ON DUPLICATE KEY UPDATE
            category_id=VALUES(category_id), name_en=VALUES(name_en),
            name_am=VALUES(name_am), description_en=VALUES(description_en),
            description_am=VALUES(description_am), sort_order=VALUES(sort_order)
        `, [s(r.id,40), s(vc.id,40), s(r.name?.en,120), s(r.name?.am,120),
            s(r.description?.en,300), s(r.description?.am,300), ri]);
      }
    }
    console.log(`  ✓ volunteer_categories (${vcats.length}) + all roles`);

    // ── 13. news ──────────────────────────────────────────────
    const newsItems = db.news || [];
    for (const a of newsItems) {
      await conn.execute(`
        INSERT INTO news
          (id, slug, title_en, title_am, excerpt_en, excerpt_am,
           body_en, body_am, category, cover_image, author,
           published_at, is_published)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          slug=VALUES(slug), title_en=VALUES(title_en), title_am=VALUES(title_am),
          excerpt_en=VALUES(excerpt_en), excerpt_am=VALUES(excerpt_am),
          body_en=VALUES(body_en), body_am=VALUES(body_am),
          category=VALUES(category), cover_image=VALUES(cover_image),
          author=VALUES(author), published_at=VALUES(published_at),
          is_published=VALUES(is_published)
      `, [s(a.id,40), s(a.slug,80), s(a.title?.en,200), s(a.title?.am,200),
          s(a.excerpt?.en,400), s(a.excerpt?.am,400),
          a.body?.en||"", a.body?.am||"",
          s(a.category,40)||"Community", s(a.coverImage,500), s(a.author,80),
          a.publishedAt ? new Date(a.publishedAt) : new Date(),
          a.isPublished ? 1 : 0]);
    }
    console.log(`  ✓ news (${newsItems.length})`);

    // ── 14. bank_accounts ─────────────────────────────────────
    const defaultBanks = [
      { id: "bank_cbe", nameEn: "Commercial Bank of Ethiopia (CBE)", nameAm: "የኢትዮጵያ ንግድ ባንክ", accNum: "1000275107518", accName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር" },
      { id: "bank_abyssinia", nameEn: "Bank of Abyssinia", nameAm: "አቢሲንያ ባንክ", accNum: "77984852", accName: "Selihom Support Association" },
      { id: "bank_awash", nameEn: "Awash Bank", nameAm: "አዋሽ ባንክ", accNum: "01303572131300", accName: "Selihom Support Association" },
      { id: "bank_telebirr", nameEn: "Telebirr (Mobile Money)", nameAm: "ቴሌብር (ሞባይል ገንዘብ)", accNum: "0911004903", accName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር (ሚኪያስ ለገሰ)" },
    ];
    for (let bi = 0; bi < defaultBanks.length; bi++) {
      const b = defaultBanks[bi];
      await conn.execute(`
        INSERT INTO bank_accounts
          (id, bank_name_en, bank_name_am, account_number, account_name, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE
          bank_name_en = VALUES(bank_name_en),
          bank_name_am = VALUES(bank_name_am),
          account_number = VALUES(account_number),
          account_name = VALUES(account_name),
          sort_order = VALUES(sort_order)
      `, [b.id, b.nameEn, b.nameAm, b.accNum, b.accName, bi]);
    }
    console.log(`  ✓ bank_accounts (${defaultBanks.length})`);

    // ── 15. site_settings ─────────────────────────────────────
    await conn.execute(`
      INSERT INTO site_settings (
        setting_key, org_name_en, org_name_am, motto_en, motto_am,
        phones, email, address_en, address_am,
        registration_number, registration_date, registration_agency_en, registration_agency_am,
        telegram_url, facebook_url, tiktok_url, youtube_url, instagram_url, linkedin_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        org_name_en = VALUES(org_name_en),
        org_name_am = VALUES(org_name_am),
        motto_en = VALUES(motto_en),
        motto_am = VALUES(motto_am),
        phones = VALUES(phones),
        email = VALUES(email),
        address_en = VALUES(address_en),
        address_am = VALUES(address_am),
        registration_number = VALUES(registration_number),
        registration_date = VALUES(registration_date),
        registration_agency_en = VALUES(registration_agency_en),
        registration_agency_am = VALUES(registration_agency_am),
        telegram_url = VALUES(telegram_url),
        facebook_url = VALUES(facebook_url),
        tiktok_url = VALUES(tiktok_url),
        youtube_url = VALUES(youtube_url),
        instagram_url = VALUES(instagram_url),
        linkedin_url = VALUES(linkedin_url)
    `, [
      "global",
      "Selihom Mentally Ill People Support Association",
      "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
      "Kind hearts excel beautiful faces!",
      "ደግ ልቦች ከውብ ፊቶች ይበልጣሉ!",
      JSON.stringify(["+251911004903", "+251953905050", "0118195444"]),
      "selihome@gmail.com",
      "Near Entoto St. Raguel and Elias Church, on the road leading toward Fetesha, Addis Ababa, Ethiopia",
      "ከእንጦጦ ቅዱስ ራጉኤል ወኤልያስ ቤተክርስትያን ወደ ፍተሻ በሚወስደው መንገድ፣ አዲስ አበባ",
      "1113/2019",
      "Feb 03, 2020",
      "Federal Democratic Republic of Ethiopia Agency for Civil Society Organizations",
      "የኢትዮጵያ ፌደራላዊ ዲሞክራሲያዊ ሪፐብሊክ የሲቪል ማህበረሰብ ድርጅቶች ኤጀንሲ",
      "https://t.me/Selihommentallyill",
      "https://facebook.com/SelihomSupport",
      "https://tiktok.com/@selihomcharity",
      "https://youtube.com/@selihomcharity",
      "",
      "",
    ]);
    console.log("  ✓ site_settings (global)");

    console.log("\n✓ Seed complete.\n");
  } catch (err) {
    console.error("Seed failed:", err.message);
    throw err;
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

seed().catch(() => process.exit(1));
