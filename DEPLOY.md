# Selihom Charity — Deployment Guide (Plesk + MySQL)

## Overview

The server is a plain Node.js Express app (`server.js`) that reads all
data from a **MySQL** database.  The front-end is a static Vite build
served from `dist/`.

---

## 1. Build the front-end locally

```bash
npm run build        # produces dist/
```

---

## 2. Files to upload to Plesk

Upload the following to your Plesk document root (e.g. `/var/www/selihom`):

```
dist/               ← Vite build output (the React app)
server.js           ← Express server (MySQL backend)
database/
  db.js             ← Connection pool
  selihom_schema.sql
  seed.js
package.json
package-lock.json
.env                ← Create this on the server (see step 4)
```

> **Do NOT** upload `node_modules/` — Plesk will run `npm install`.

---

## 3. Create the MySQL database in Plesk

1. In the Plesk panel go to **Databases → Add Database**.
2. Set a database name (e.g. `selihom`), a username, and a strong password.
3. Note down: host (usually `localhost`), port (`3306`), db name, username, password.

---

## 4. Create `.env` on the server

SSH into your Plesk server and create `/var/www/selihom/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_plesk_db_user
DB_PASSWORD=your_plesk_db_password
DB_NAME=selihom
DB_POOL_MAX=10

PORT=3000
NODE_ENV=production
```

> In Plesk you can also set these as **Environment Variables** in the
> Node.js app settings — they take precedence over `.env`.

---

## 5. Run the schema migration

SSH into the server and run:

```bash
cd /var/www/selihom
mysql -u YOUR_USER -pYOUR_PASSWORD YOUR_DB < database/selihom_schema.sql
```

This creates all 18 tables.  Safe to re-run — uses `CREATE TABLE IF NOT EXISTS`.

---

## 6. Seed initial data (first deploy only)

```bash
node database/seed.js
```

This migrates the default medicine list, supply categories, volunteer
roles, and any existing records.  Uses `INSERT IGNORE` / `ON DUPLICATE KEY`
so it is safe to re-run without duplicating data.

---

## 7. Configure Plesk Node.js app

In Plesk → **Node.js**:

| Setting | Value |
|---------|-------|
| Node.js version | 20 LTS or higher |
| Application root | `/var/www/selihom` |
| Application startup file | `server.js` |
| NPM install | Run after upload |

Click **Restart** after saving.

---

## 8. Verify

Visit `https://yourdomain.com/api/health` — you should see:

```json
{
  "status": "ok",
  "db": "mysql",
  "timestamp": "..."
}
```

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Set up .env (copy example)
cp .env.example .env
# Edit .env with your local MySQL credentials

# 3. Create database + tables
npm run db:setup     # runs selihom_schema.sql

# 4. Seed data
npm run db:seed      # migrates data/db.json → MySQL

# 5. Start dev server (Vite + Express in watch mode)
npm run dev

# Full reset (drop + recreate + seed)
npm run db:reset
```

---

## Database tables

| Table | Purpose |
|-------|---------|
| `admin_profile` | Single admin login record |
| `availability_slots` | Visit booking time slots |
| `bookings` | Visitor booking requests |
| `pledges` + `pledge_items` | Legacy in-kind/bank pledges |
| `volunteers` | Volunteer applications |
| `inkind_needs` | Admin-managed supply needs list |
| `medicine_items` | Monthly medicine list with patient counts |
| `medicine_pledges` + `medicine_pledge_items` | Medicine donation pledges |
| `supply_categories` + `supply_items` | Admin-managed supply categories |
| `supplies_pledges` + `supplies_pledge_items` | Supply donation pledges |
| `event_pledges` | Birthday/wedding celebration requests |
| `volunteer_categories` + `volunteer_roles` | Volunteer role taxonomy |
| `news` | News articles (bilingual EN/AM) |

---

## Environment variables reference

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | MySQL server host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | *(empty)* | MySQL password |
| `DB_NAME` | `selihom` | Database name |
| `DB_POOL_MAX` | `10` | Max pool connections |
| `PORT` | `3000` | HTTP server port |
| `NODE_ENV` | `development` | `production` on Plesk |
