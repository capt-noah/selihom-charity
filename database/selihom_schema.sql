-- ============================================================
--  Selihom Charity — MySQL Schema
--  Compatible with MySQL 8+ / MariaDB 10.6+
--  Run: mysql -u root selihom < database/selihom_schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS selihom
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE selihom;

-- ─── 1. admin_profile ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_profile (
  id            INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL DEFAULT '',
  email         VARCHAR(120) NOT NULL DEFAULT '',
  role          VARCHAR(120) NOT NULL DEFAULT '',
  phone         VARCHAR(30)  NOT NULL DEFAULT '',
  username      VARCHAR(60)  NOT NULL UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2. availability_slots ───────────────────────────────────
CREATE TABLE IF NOT EXISTS availability_slots (
  id               VARCHAR(40)  NOT NULL PRIMARY KEY,
  slot_date        VARCHAR(80)  NOT NULL,
  start_time       VARCHAR(40)  NOT NULL,
  end_time         VARCHAR(40)  NOT NULL,
  label            VARCHAR(120) NOT NULL DEFAULT '',
  max_bookings     INT          NOT NULL DEFAULT 10,
  current_bookings INT          NOT NULL DEFAULT 0,
  is_active        TINYINT(1)   NOT NULL DEFAULT 1,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 3. bookings ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                VARCHAR(40)  NOT NULL PRIMARY KEY,
  name              VARCHAR(120) NOT NULL,
  email             VARCHAR(120) NOT NULL DEFAULT '',
  phone             VARCHAR(30)  NOT NULL,
  visit_date        VARCHAR(80)  NOT NULL DEFAULT '',
  time_slot         VARCHAR(80)  NOT NULL DEFAULT '',
  visit_type        VARCHAR(20)  NOT NULL DEFAULT 'individual',
  visitor_count     INT          NOT NULL DEFAULT 1,
  notes             TEXT,
  status            VARCHAR(20)  NOT NULL DEFAULT 'pending',
  contact_type      VARCHAR(20)  NOT NULL DEFAULT 'individual',
  organization_name VARCHAR(120) NOT NULL DEFAULT '',
  slot_id           VARCHAR(40)  DEFAULT NULL,
  created_at        VARCHAR(40)  NOT NULL DEFAULT '',
  CONSTRAINT fk_booking_slot
    FOREIGN KEY (slot_id) REFERENCES availability_slots(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 4. pledges (legacy in-kind / bank pledges) ──────────────
CREATE TABLE IF NOT EXISTS pledges (
  id           VARCHAR(40)  NOT NULL PRIMARY KEY,
  donor_name   VARCHAR(120) NOT NULL,
  donor_email  VARCHAR(120) NOT NULL DEFAULT '',
  donor_phone  VARCHAR(30)  NOT NULL DEFAULT '',
  type         VARCHAR(20)  NOT NULL DEFAULT 'inkind',
  date         VARCHAR(80)  NOT NULL DEFAULT '',
  status       VARCHAR(20)  NOT NULL DEFAULT 'pledged',
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- pledged items belong to a pledge
CREATE TABLE IF NOT EXISTS pledge_items (
  id         INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  pledge_id  VARCHAR(40)  NOT NULL,
  item_id    VARCHAR(60)  NOT NULL DEFAULT '',
  item_name  VARCHAR(200) NOT NULL DEFAULT '',
  quantity   INT          NOT NULL DEFAULT 0,
  CONSTRAINT fk_pledge_item FOREIGN KEY (pledge_id) REFERENCES pledges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 5. volunteers ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteers (
  id            VARCHAR(40)  NOT NULL PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(120) NOT NULL DEFAULT '',
  phone         VARCHAR(30)  NOT NULL DEFAULT '',
  interest_area VARCHAR(40)  NOT NULL DEFAULT 'general',
  availability  VARCHAR(20)  NOT NULL DEFAULT 'flexible',
  experience    TEXT,
  status        VARCHAR(20)  NOT NULL DEFAULT 'new',
  category_id   VARCHAR(40)  NOT NULL DEFAULT '',
  role_id       VARCHAR(40)  NOT NULL DEFAULT '',
  role_name     VARCHAR(120) NOT NULL DEFAULT '',
  submitted_at  VARCHAR(40)  NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 6. inkind_needs ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inkind_needs (
  id             VARCHAR(40)  NOT NULL PRIMARY KEY,
  name_en        VARCHAR(200) NOT NULL,
  name_am        VARCHAR(200) NOT NULL DEFAULT '',
  category       VARCHAR(40)  NOT NULL DEFAULT 'Other',
  needed_qty_en  VARCHAR(100) NOT NULL DEFAULT '',
  needed_qty_am  VARCHAR(100) NOT NULL DEFAULT '',
  urgency        VARCHAR(20)  NOT NULL DEFAULT 'Medium',
  description_en TEXT,
  description_am TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 7. medicine_items ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS medicine_items (
  id              VARCHAR(40)   NOT NULL PRIMARY KEY,
  name            VARCHAR(120)  NOT NULL,
  monthly_qty     INT           NOT NULL DEFAULT 0,
  unit_price      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_monthly   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  patients_helped INT           NOT NULL DEFAULT 0,
  urgency         VARCHAR(20)   NOT NULL DEFAULT 'Medium',
  description_en  TEXT,
  description_am  TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 8. medicine_pledges ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS medicine_pledges (
  id           VARCHAR(40)  NOT NULL PRIMARY KEY,
  donor_name   VARCHAR(120) NOT NULL,
  donor_phone  VARCHAR(30)  NOT NULL DEFAULT '',
  donor_email  VARCHAR(120) NOT NULL DEFAULT '',
  date         VARCHAR(80)  NOT NULL DEFAULT '',
  status       VARCHAR(20)  NOT NULL DEFAULT 'pledged',
  notes        TEXT,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS medicine_pledge_items (
  id               INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  pledge_id        VARCHAR(40)  NOT NULL,
  medicine_id      VARCHAR(40)  NOT NULL DEFAULT '',
  medicine_name    VARCHAR(120) NOT NULL DEFAULT '',
  quantity         INT          NOT NULL DEFAULT 1,
  CONSTRAINT fk_med_pledge FOREIGN KEY (pledge_id) REFERENCES medicine_pledges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 9. supply_categories ────────────────────────────────────
CREATE TABLE IF NOT EXISTS supply_categories (
  id       VARCHAR(40)  NOT NULL PRIMARY KEY,
  name_en  VARCHAR(120) NOT NULL,
  name_am  VARCHAR(120) NOT NULL DEFAULT '',
  icon     VARCHAR(60)  NOT NULL DEFAULT 'Package',
  color    VARCHAR(60)  NOT NULL DEFAULT 'bg-brand-sky-400',
  sort_order INT        NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS supply_items (
  id             VARCHAR(40)  NOT NULL PRIMARY KEY,
  category_id    VARCHAR(40)  NOT NULL,
  name_en        VARCHAR(200) NOT NULL,
  name_am        VARCHAR(200) NOT NULL DEFAULT '',
  needed_qty_en  VARCHAR(100) NOT NULL DEFAULT '',
  needed_qty_am  VARCHAR(100) NOT NULL DEFAULT '',
  urgency        VARCHAR(20)  NOT NULL DEFAULT 'Medium',
  impact_desc_en VARCHAR(300) NOT NULL DEFAULT '',
  impact_desc_am VARCHAR(300) NOT NULL DEFAULT '',
  sort_order     INT          NOT NULL DEFAULT 0,
  CONSTRAINT fk_supply_item_cat FOREIGN KEY (category_id) REFERENCES supply_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 10. supplies_pledges ────────────────────────────────────
CREATE TABLE IF NOT EXISTS supplies_pledges (
  id           VARCHAR(40)  NOT NULL PRIMARY KEY,
  donor_name   VARCHAR(120) NOT NULL,
  donor_phone  VARCHAR(30)  NOT NULL DEFAULT '',
  donor_email  VARCHAR(120) NOT NULL DEFAULT '',
  category_id  VARCHAR(40)  NOT NULL DEFAULT '',
  date         VARCHAR(80)  NOT NULL DEFAULT '',
  status       VARCHAR(20)  NOT NULL DEFAULT 'pledged',
  notes        TEXT,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS supplies_pledge_items (
  id         INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  pledge_id  VARCHAR(40)  NOT NULL,
  item_id    VARCHAR(40)  NOT NULL DEFAULT '',
  item_name  VARCHAR(120) NOT NULL DEFAULT '',
  quantity   INT          NOT NULL DEFAULT 1,
  custom     VARCHAR(200) NOT NULL DEFAULT '',
  CONSTRAINT fk_sup_pledge FOREIGN KEY (pledge_id) REFERENCES supplies_pledges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 11. event_pledges ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_pledges (
  id             VARCHAR(40)  NOT NULL PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  phone          VARCHAR(30)  NOT NULL DEFAULT '',
  email          VARCHAR(120) NOT NULL DEFAULT '',
  event_type     VARCHAR(20)  NOT NULL DEFAULT 'other',
  custom_type    VARCHAR(80)  NOT NULL DEFAULT '',
  preferred_date VARCHAR(80)  NOT NULL DEFAULT '',
  message        TEXT,
  status         VARCHAR(20)  NOT NULL DEFAULT 'pending',
  submitted_at   VARCHAR(40)  NOT NULL DEFAULT '',
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 12. volunteer_categories ────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteer_categories (
  id         VARCHAR(40)  NOT NULL PRIMARY KEY,
  name_en    VARCHAR(120) NOT NULL,
  name_am    VARCHAR(120) NOT NULL DEFAULT '',
  icon       VARCHAR(60)  NOT NULL DEFAULT 'Users',
  color      VARCHAR(60)  NOT NULL DEFAULT 'bg-brand-sky-400',
  sort_order INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS volunteer_roles (
  id             VARCHAR(40)  NOT NULL PRIMARY KEY,
  category_id    VARCHAR(40)  NOT NULL,
  name_en        VARCHAR(120) NOT NULL,
  name_am        VARCHAR(120) NOT NULL DEFAULT '',
  description_en VARCHAR(300) NOT NULL DEFAULT '',
  description_am VARCHAR(300) NOT NULL DEFAULT '',
  sort_order     INT          NOT NULL DEFAULT 0,
  CONSTRAINT fk_vol_role_cat FOREIGN KEY (category_id) REFERENCES volunteer_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 13. news ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id           VARCHAR(40)   NOT NULL PRIMARY KEY,
  slug         VARCHAR(80)   NOT NULL UNIQUE,
  title_en     VARCHAR(200)  NOT NULL,
  title_am     VARCHAR(200)  NOT NULL DEFAULT '',
  excerpt_en   TEXT,
  excerpt_am   TEXT,
  body_en      LONGTEXT,
  body_am      LONGTEXT,
  category     VARCHAR(40)   NOT NULL DEFAULT 'Community',
  cover_image  VARCHAR(500)  NOT NULL DEFAULT '',
  author       VARCHAR(80)   NOT NULL DEFAULT '',
  published_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_published TINYINT(1)    NOT NULL DEFAULT 0,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Useful indexes ───────────────────────────────────────────
CREATE INDEX idx_bookings_status     ON bookings(status);
CREATE INDEX idx_bookings_slot       ON bookings(slot_id);
CREATE INDEX idx_volunteers_status   ON volunteers(status);
CREATE INDEX idx_med_pledges_status  ON medicine_pledges(status);
CREATE INDEX idx_sup_pledges_status  ON supplies_pledges(status);
CREATE INDEX idx_evt_pledges_status  ON event_pledges(status);
CREATE INDEX idx_news_slug           ON news(slug);
CREATE INDEX idx_news_published      ON news(is_published, published_at);
CREATE INDEX idx_slots_active        ON availability_slots(is_active, slot_date);
