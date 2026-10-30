-- ============================================================
-- Selihom Charity - Full Production Database Dump
-- Generated: 2026-10-30T18:42:16.627Z
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10+
-- Note: Database name agnostic (safe to import on portfolio_db or selihom)
-- ============================================================

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- ------------------------------------------------------------
-- Table structure for `bookings`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `visit_date` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `time_slot` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `visit_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'individual',
  `visitor_count` int NOT NULL DEFAULT '1',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `contact_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'individual',
  `organization_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `slot_id` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idx_bookings_status` (`status`),
  KEY `idx_bookings_slot` (`slot_id`),
  CONSTRAINT `fk_booking_slot` FOREIGN KEY (`slot_id`) REFERENCES `availability_slots` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `event_pledges`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `event_pledges`;
CREATE TABLE `event_pledges` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `event_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'other',
  `custom_type` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `preferred_date` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `submitted_at` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_evt_pledges_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `volunteers`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `volunteers`;
CREATE TABLE `volunteers` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `interest_area` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `availability` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'flexible',
  `experience` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `category_id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `role_id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `role_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `submitted_at` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idx_volunteers_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `pledge_items`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `pledge_items`;
CREATE TABLE `pledge_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pledge_id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_id` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `item_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `quantity` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_pledge_item` (`pledge_id`),
  CONSTRAINT `fk_pledge_item` FOREIGN KEY (`pledge_id`) REFERENCES `pledges` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `pledges`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `pledges`;
CREATE TABLE `pledges` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donor_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donor_email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `donor_phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inkind',
  `date` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pledged',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estimated_delivery_date` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `medicine_pledge_items`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `medicine_pledge_items`;
CREATE TABLE `medicine_pledge_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pledge_id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `medicine_id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `medicine_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_med_pledge` (`pledge_id`),
  CONSTRAINT `fk_med_pledge` FOREIGN KEY (`pledge_id`) REFERENCES `medicine_pledges` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `medicine_pledges`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `medicine_pledges`;
CREATE TABLE `medicine_pledges` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donor_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donor_phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `donor_email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `date` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pledged',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estimated_delivery_date` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idx_med_pledges_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `supplies_pledge_items`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `supplies_pledge_items`;
CREATE TABLE `supplies_pledge_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pledge_id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `item_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `quantity` int NOT NULL DEFAULT '1',
  `custom` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `fk_sup_pledge` (`pledge_id`),
  CONSTRAINT `fk_sup_pledge` FOREIGN KEY (`pledge_id`) REFERENCES `supplies_pledges` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `supplies_pledges`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `supplies_pledges`;
CREATE TABLE `supplies_pledges` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donor_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donor_phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `donor_email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `category_id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `date` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pledged',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estimated_delivery_date` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idx_sup_pledges_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `admin_profile`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `admin_profile`;
CREATE TABLE `admin_profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `role` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `username` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Records of `admin_profile` (1 rows)
-- ------------------------------------------------------------
INSERT INTO `admin_profile` (`id`, `name`, `email`, `role`, `phone`, `username`, `password_hash`, `updated_at`) VALUES
  (1, 'Selihom Administration', 'selihomc@gmail.com', 'Lead Administrator', '+251911004903', 'admin', 'selihom2026', '2026-10-30 20:52:53');

-- ------------------------------------------------------------
-- Table structure for `availability_slots`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `availability_slots`;
CREATE TABLE `availability_slots` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slot_date` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `end_time` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `max_bookings` int NOT NULL DEFAULT '10',
  `current_bookings` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slots_active` (`is_active`,`slot_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Records of `availability_slots` (28 rows)
-- ------------------------------------------------------------
INSERT INTO `availability_slots` (`id`, `slot_date`, `start_time`, `end_time`, `label`, `max_bookings`, `current_bookings`, `is_active`, `created_at`) VALUES
  ('slot-fri-1', 'Every Fri', '07:30 AM', '10:00 AM', 'Morning Care & Breakfast Service / የጧት ቁርስና ጉብኝት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-fri-2', 'Every Fri', '10:00 AM', '12:30 PM', 'Midday Visit & Fellowship / የቀን ጉብኝትና ህብረት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-fri-3', 'Every Fri', '01:30 PM', '03:30 PM', 'Afternoon Therapy & Activity / የከሰዓት ቴራፒና እንቅስቃሴ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-fri-4', 'Every Fri', '03:30 PM', '06:00 PM', 'Evening Fellowship & Dinner / የማታ እራትና መስተንግዶ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-mon-1', 'Every Mon', '07:30 AM', '10:00 AM', 'Morning Care & Breakfast Service / የጧት ቁርስና ጉብኝት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-mon-2', 'Every Mon', '10:00 AM', '12:30 PM', 'Midday Visit & Fellowship / የቀን ጉብኝትና ህብረት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-mon-3', 'Every Mon', '01:30 PM', '03:30 PM', 'Afternoon Therapy & Activity / የከሰዓት ቴራፒና እንቅስቃሴ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-mon-4', 'Every Mon', '03:30 PM', '06:00 PM', 'Evening Fellowship & Dinner / የማታ እራትና መስተንግዶ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-sat-1', 'Every Sat', '07:30 AM', '10:00 AM', 'Morning Care & Breakfast Service / የጧት ቁርስና ጉብኝት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-sat-2', 'Every Sat', '10:00 AM', '12:30 PM', 'Midday Visit & Fellowship / የቀን ጉብኝትና ህብረት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-sat-3', 'Every Sat', '01:30 PM', '03:30 PM', 'Afternoon Therapy & Activity / የከሰዓት ቴራፒና እንቅስቃሴ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-sat-4', 'Every Sat', '03:30 PM', '06:00 PM', 'Evening Fellowship & Dinner / የማታ እራትና መስተንግዶ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-sun-1', 'Every Sun', '07:30 AM', '10:00 AM', 'Morning Care & Breakfast Service / የጧት ቁርስና ጉብኝት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-sun-2', 'Every Sun', '10:00 AM', '12:30 PM', 'Midday Visit & Fellowship / የቀን ጉብኝትና ህብረት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-sun-3', 'Every Sun', '01:30 PM', '03:30 PM', 'Afternoon Therapy & Activity / የከሰዓት ቴራፒና እንቅስቃሴ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-sun-4', 'Every Sun', '03:30 PM', '06:00 PM', 'Evening Fellowship & Dinner / የማታ እራትና መስተንግዶ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-thu-1', 'Every Thu', '07:30 AM', '10:00 AM', 'Morning Care & Breakfast Service / የጧት ቁርስና ጉብኝት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-thu-2', 'Every Thu', '10:00 AM', '12:30 PM', 'Midday Visit & Fellowship / የቀን ጉብኝትና ህብረት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-thu-3', 'Every Thu', '01:30 PM', '03:30 PM', 'Afternoon Therapy & Activity / የከሰዓት ቴራፒና እንቅስቃሴ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-thu-4', 'Every Thu', '03:30 PM', '06:00 PM', 'Evening Fellowship & Dinner / የማታ እራትና መስተንግዶ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-tue-1', 'Every Tue', '07:30 AM', '10:00 AM', 'Morning Care & Breakfast Service / የጧት ቁርስና ጉብኝት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-tue-2', 'Every Tue', '10:00 AM', '12:30 PM', 'Midday Visit & Fellowship / የቀን ጉብኝትና ህብረት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-tue-3', 'Every Tue', '01:30 PM', '03:30 PM', 'Afternoon Therapy & Activity / የከሰዓት ቴራፒና እንቅስቃሴ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-tue-4', 'Every Tue', '03:30 PM', '06:00 PM', 'Evening Fellowship & Dinner / የማታ እራትና መስተንግዶ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-wed-1', 'Every Wed', '07:30 AM', '10:00 AM', 'Morning Care & Breakfast Service / የጧት ቁርስና ጉብኝት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-wed-2', 'Every Wed', '10:00 AM', '12:30 PM', 'Midday Visit & Fellowship / የቀን ጉብኝትና ህብረት', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-wed-3', 'Every Wed', '01:30 PM', '03:30 PM', 'Afternoon Therapy & Activity / የከሰዓት ቴራፒና እንቅስቃሴ', 15, 0, 1, '2026-10-29 21:09:22'),
  ('slot-wed-4', 'Every Wed', '03:30 PM', '06:00 PM', 'Evening Fellowship & Dinner / የማታ እራትና መስተንግዶ', 15, 0, 1, '2026-10-29 21:09:22');

-- ------------------------------------------------------------
-- Table structure for `bank_accounts`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `bank_accounts`;
CREATE TABLE `bank_accounts` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_name_en` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_name_am` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `account_number` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Records of `bank_accounts` (6 rows)
-- ------------------------------------------------------------
INSERT INTO `bank_accounts` (`id`, `bank_name_en`, `bank_name_am`, `account_number`, `account_name`, `logo`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
  ('bank_abyssinia', 'Bank of Abyssinia', 'አቢሲንያ ባንክ', '77984852', 'ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር', '', 1, 1, '2026-10-29 21:09:22', '2026-10-29 21:09:22'),
  ('bank_awash', 'Awash Bank', 'አዋሽ ባንክ', '01303572131300', 'ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር', '', 2, 1, '2026-10-29 21:09:22', '2026-10-29 21:09:22'),
  ('bank_bunna', 'Bunna Bank', 'ቡና ባንክ', '2919601000145', 'ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር', '', 3, 1, '2026-10-29 21:09:22', '2026-10-29 21:09:22'),
  ('bank_cbe', 'Commercial Bank of Ethiopia (CBE)', 'የኢትዮጵያ ንግድ ባንክ', '1000275107518', 'ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር', '', 0, 1, '2026-10-29 21:09:22', '2026-10-29 21:09:22'),
  ('bank_sinqee', 'Sinquee Bank', 'ስንቄ ባንክ', '1106177681225', 'ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር', '', 4, 1, '2026-10-29 21:09:22', '2026-10-29 21:09:22'),
  ('bank_telebirr', 'Telebirr (Mobile Money)', 'ቴሌብር (ሞባይል ገንዘብ)', '0911004903', 'ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር (ሚኪያስ ለገሰ)', '', 5, 1, '2026-10-29 21:09:22', '2026-10-29 21:09:22');

-- ------------------------------------------------------------
-- Table structure for `inkind_needs`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `inkind_needs`;
CREATE TABLE `inkind_needs` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_am` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `category` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Other',
  `needed_qty_en` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `needed_qty_am` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `urgency` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Medium',
  `description_en` text COLLATE utf8mb4_unicode_ci,
  `description_am` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Records of `inkind_needs` (4 rows)
-- ------------------------------------------------------------
INSERT INTO `inkind_needs` (`id`, `name_en`, `name_am`, `category`, `needed_qty_en`, `needed_qty_am`, `urgency`, `description_en`, `description_am`) VALUES
  ('ik-1', 'Teff & Food Grains (Quintals)', 'ጤፍና የምግብ እህል', 'Food', '50 Quintals / month', '50 ኩንታል ጤፍ / ወር', 'High', 'Teff grain, cooking oil, lentils, split peas, and wheat flour to feed 400 beneficiaries daily.', 'ለ400 ተጠቃሚዎች ዕለታዊ ትኩስ እንጀራና ምግብ ለማዘጋጀት የሚሆን ጤፍ፣ ምስር፣ ስንዴና ዘይት።'),
  ('ik-2', 'Psychiatric & Medical Supplies', 'የህክምናና መድሃኒት አቅርቦት', 'Medical', '48 Core Medicines Inventory', 'የ48 ዓይነት መድሃኒቶች አቅርቦት', 'High', '48 essential psychiatric and clinical medications, wound dressing plaster, and surgical antiseptics.', 'ለአእምሮ ህሙማን አስፈላጊ የሆኑ 48 ዓይነት ሳይካትሪና ሜዲካል መድሃኒቶች፣ ቁስል ማከሚያና አልኮል።'),
  ('ik-3', 'Warm Clothing & Heavy Blankets', 'የአልባሳትና ብርድልብስ ድጋፍ', 'Clothing', '150 Blankets & 200 Clothes', '150 ብርድልብሶችና 200 አልባሳት', 'High', 'Warm heavy blankets, winter jackets, walking shoes, and clean clothes for rescued residents.', 'የእንጦጦን ቅዝቃዜ ለመቋቋም የሚሆኑ ወፍራም ብርድልብሶች፣ ጃኬቶች፣ ጫማዎችና ንጹህ ልብሶች።'),
  ('ik-4', 'Hygiene & Sanitation Kits', 'የንፅህና መጠበቂያ እቃዎች', 'Hygiene', '600 Soaps, 50 Diaper Packs', '600 ሳሙና፣ 50 ፓኬት ዳይፐር', 'High', 'Adult and child diapers, wet wipes, bath soap bars, laundry detergent, and toilet paper.', 'የአዋቂ ዳይፐር፣ ዋይፕስ፣ የገላና የልብስ ሳሙና፣ ኦሞና ሶፍት።');

-- ------------------------------------------------------------
-- Table structure for `medicine_items`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `medicine_items`;
CREATE TABLE `medicine_items` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `monthly_qty` int NOT NULL DEFAULT '0',
  `unit_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_monthly` decimal(12,2) NOT NULL DEFAULT '0.00',
  `patients_helped` int NOT NULL DEFAULT '0',
  `urgency` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Medium',
  `description_en` text COLLATE utf8mb4_unicode_ci,
  `description_am` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Records of `medicine_items` (48 rows)
-- ------------------------------------------------------------
INSERT INTO `medicine_items` (`id`, `name`, `monthly_qty`, `unit_price`, `total_monthly`, `patients_helped`, `urgency`, `description_en`, `description_am`) VALUES
  ('med-01', 'Olanzapine 5mg', 1100, 8.5, 9350, 45, 'High', 'Atypical antipsychotic for psychiatric mood stabilization and schizophrenia', 'ለአእምሮ ስነ-ልቦና መረጋጋትና ስኪዞፈሪንያ ማከሚያ ሳይካትሪ መድሃኒት'),
  ('med-02', 'Resperidone 4mg', 3000, 12, 36000, 65, 'High', 'Antipsychotic for psychiatric behavioral and cognitive recovery', 'ለአእምሮ ጤናና ባህሪ ማረጋጊያ የሚሆን ከፍተኛ ሳይካትሪ መድሃኒት'),
  ('med-03', 'Haloperidol 1.5mg', 750, 4, 3000, 30, 'High', 'Essential antipsychotic for acute psychosis and restlessness', 'ለከፍተኛ አእምሮ ህመም እና መረበሽ ማረጋጊያ'),
  ('med-04', 'Pregabaline 75mg', 150, 15, 2250, 15, 'High', 'Nerve pain stabilizer and severe psychiatric anxiety relief', 'ለነርቭ ህመም እና ለአእምሮ ጭንቀት ማስታገሻ'),
  ('med-05', 'Azithromycine 500mg', 160, 22, 3520, 25, 'High', 'Broad spectrum antibiotic for respiratory and bacterial infections', 'ለባክቴሪያና ሳንባ ኢንፌክሽን ማከሚያ አንቲባዮቲክ'),
  ('med-06', 'Omeprazol 20mg', 30, 5, 150, 10, 'High', 'Gastric acid reflux and stomach ulcer treatment', 'ለጨጓራ ህመም እና አሲድ ማስታገሻ'),
  ('med-07', 'Amlodipine 10mg', 120, 6, 720, 20, 'High', 'Hypertension and high blood pressure regulation for residents', 'ለደም ግፊት መቆጣጠሪያ የሚሆን መድሃኒት'),
  ('med-08', 'Amoxacilline 250mg (syrup)', 8, 85, 680, 8, 'High', 'Pediatric antibiotic oral suspension for infections', 'ለህጻናት ኢንፌክሽን ማከሚያ አንቲባዮቲክ ሽሮፕ'),
  ('med-09', 'Albendazol 400mg', 40, 10, 400, 40, 'High', 'Anti-parasitic deworming treatment for residents', 'ለሆድ ውስጥ ጥገኛ ትላትሎች ማከሚያ'),
  ('med-10', 'Amoxacilline 125mg (syrup)', 4, 75, 300, 4, 'High', 'Pediatric antibiotic syrup for young children', 'ለህጻናት ህመም ማከሚያ አንቲባዮቲክ ፈሳሽ'),
  ('med-11', 'Cotrimoxazole 240mg (syrup)', 6, 80, 480, 6, 'High', 'Antibacterial pediatric oral suspension', 'ለህጻናት የባክቴሪያ ህመም ማከሚያ ሽሮፕ'),
  ('med-12', 'Paracetamol suppository 250mg', 20, 25, 500, 10, 'High', 'Fever and acute pain relief for bedridden patients', 'ለአልጋ ቁራኛ ህሙማን ትኩሳትና ህመም ማስታገሻ'),
  ('med-13', 'Sodium valproate 200mg', 3500, 8, 28000, 70, 'High', 'Essential mood stabilizer and anticonvulsant for bipolar disorder and epilepsy', 'ለአእምሮ መረበሽና ለሚጥል ህመም መከላከያ ዋና መድሃኒት'),
  ('med-14', 'Pantoprazole 20mg', 100, 7, 700, 20, 'High', 'Treatment for severe gastritis and stomach irritation', 'ለከባድ የጨጓራ ህመም ማስታገሻና መከላከያ'),
  ('med-15', 'Adhesive plaster (large)', 6, 350, 2100, 60, 'High', 'Surgical adhesive plaster for street rescue wound dressing', 'ለቁስል ማሰሪያና ማከሚያ የሚሆን ትልቅ ፕላስተር'),
  ('med-16', 'Denatured alcohol 70% (1 L)', 6, 220, 1320, 200, 'High', 'Medical sterilization and wound disinfection alcohol', 'ለህክምና ክፍል ንጽህናና ቁስል ማከሚያ አልኮል'),
  ('med-17', 'Multi vitamin po', 40, 180, 7200, 120, 'High', 'Daily vitamin recovery for malnourished street beneficiaries', 'ለተጎሳቆሉ ህሙማን የሰውነት አቅም ማጎልበቻ ቫይታሚን'),
  ('med-18', 'Ketoconazole cream', 10, 95, 950, 25, 'High', 'Antifungal topical cream for street dermatitis and skin rashes', 'ለቆዳ ህመም፣ ፈንገስና እከክ ማከሚያ ቅባት'),
  ('med-19', 'Diazepam 10mg injection PRN', 30, 45, 1350, 15, 'High', 'Emergency sedative injection for severe acute agitation and seizures', 'ለድንገተኛ አእምሮ መረበሽና የሚጥል በሽታ ማስታገሻ መርፌ'),
  ('med-20', 'Haloperidol 5mg injection PRN', 500, 40, 20000, 80, 'High', 'Emergency psychiatric sedative for violent street rescue cases', 'ለከፍተኛ አእምሮ ህመም እና መረበሽ ድንገተኛ መርፌ'),
  ('med-21', 'Clonazepam 2mg', 30, 18, 540, 10, 'High', 'Anticonvulsant and severe panic/anxiety treatment', 'ለከፍተኛ ጭንቀትና የሚጥል በሽታ መከላከያ'),
  ('med-22', 'Lorazepam 1mg', 15, 16, 240, 8, 'High', 'Fast-acting calming sedative for restless psychiatric patients', 'ለተረበሹ ህሙማን ፈጣን ማረጋጊያ መድሃኒት'),
  ('med-23', 'Multivitamin syrup', 4, 120, 480, 15, 'High', 'Nutritional liquid vitamins for recovering children and seniors', 'ለህጻናትና አረጋውያን የቫይታሚን ፈሳሽ'),
  ('med-24', 'Vitamin B complex injection', 10, 65, 650, 10, 'High', 'Nerve recovery injection for alcohol-induced and malnutrition trauma', 'ለነርቭ መዳከምና አቅም ማነስ የሚሰጥ መርፌ'),
  ('med-25', 'Risperidone 2mg po', 1500, 9, 13500, 50, 'High', 'Maintenance psychiatric medication for cognitive clarity', 'የአእምሮ ጤናን ወደ ነበረበት ለመመለስ የሚሰጥ ሳይካትሪ መድሃኒት'),
  ('med-26', 'CalciDenk 1000mg/800IU PO', 20, 320, 6400, 30, 'High', 'Calcium and Vitamin D3 bone support for vulnerable seniors', 'ለአረጋውያን የአጥንት ጥንካሬ ካልሲየምና ቫይታሚን ዲ'),
  ('med-27', 'Sodium valproate 500mg', 2100, 14, 29400, 55, 'High', 'High-dose mood stabilizer for severe bipolar disorder', 'ለከፍተኛ የአእምሮ መረበሽና ንዴት መቆጣጠሪያ'),
  ('med-28', 'Amoxacilline 500mg', 800, 7, 5600, 60, 'High', 'Everyday antibacterial medication for general clinical care', 'ለተለያዩ የባክቴሪያ ህመሞች የሚሆን አንቲባዮቲክ'),
  ('med-29', 'Amlodipine 5mg po', 100, 5, 500, 20, 'High', 'Cardiovascular blood pressure regulation for shelter residents', 'የደም ግፊት መቆጣጠሪያ መድሃኒት'),
  ('med-30', 'Fluoxetine 20mg po', 500, 8, 4000, 35, 'High', 'Antidepressant for severe clinical trauma and depressive disorders', 'ለከፍተኛ ድብርትና የአእምሮ ጭንቀት ማከሚያ'),
  ('med-31', 'Sertraline 50mg po', 20, 24, 480, 10, 'High', 'Targeted psychiatric antidepressant for obsessive anxiety', 'ለአእምሮ ጭንቀትና ድብርት ማከሚያ'),
  ('med-32', 'Chlorpromazine 100mg po', 600, 6, 3600, 30, 'High', 'Sedative antipsychotic for severe psychosis and sleeplessness', 'ለአእምሮ እረፍት ማጣትና እንቅልፍ ማጣት ማከሚያ'),
  ('med-33', 'Co-amoxacilline 625mg po', 50, 25, 1250, 15, 'High', 'Augmented antibiotic for resistant infections', 'ለከባድ ኢንፌክሽኖች የሚሰጥ ጠንካራ አንቲባዮቲክ'),
  ('med-34', 'Metronidazole 500mg po', 30, 4.5, 135, 10, 'High', 'Treatment for waterborne parasitic infections and diarrhea', 'ለሆድ ቁርጠትና አሜባ ማከሚያ'),
  ('med-35', 'Fluphenazine 25ml injection', 20, 180, 3600, 20, 'High', 'Long-acting depot injection for long-term psychiatric adherence', 'ለረጅም ጊዜ የአእምሮ ህመም መረጋጊያ መርፌ'),
  ('med-36', 'Phenobarbitone 100mg po', 120, 4, 480, 15, 'High', 'Antiepileptic medication for regular seizure prevention', 'የሚጥል በሽታ ድንገተኛ ጥቃትን መከላከያ'),
  ('med-37', 'Phenobarbitone 30mg po', 250, 3, 750, 20, 'High', 'Low-dose antiepileptic control for vulnerable residents', 'ለሚጥል በሽታ መቆጣጠሪያ አነስተኛ መጠን ክኒን'),
  ('med-38', 'Phenytoin 100mg po', 240, 5, 1200, 20, 'High', 'Anticonvulsant for recurrent seizure episodes', 'ለሚጥል ህመም መከላከያ መድሃኒት'),
  ('med-39', 'Phenytoin 50mg po', 1000, 3.5, 3500, 40, 'High', 'Maintenance anticonvulsant for neurological stability', 'ለነርቭና የሚጥል በሽታ መረጋጊያ መድሃኒት'),
  ('med-40', 'Gabapentine 300mg po', 50, 12, 600, 12, 'High', 'Neuropathic pain modulator and psychiatric anxiety adjunct', 'ለነርቭ ህመም እና ስነ-ልቦና መረበሽ ማስታገሻ'),
  ('med-41', 'Meloxicam 15mg & Fusidic cream', 50, 70, 3500, 25, 'High', 'Anti-inflammatory pain relief and antibacterial skin infection cream', 'ለህመም ማስታገሻና ለቆዳ ቁስል ማከሚያ ቅባት'),
  ('med-42', 'Enalapril 5mg po', 20, 5, 100, 10, 'High', 'Cardiovascular ACE inhibitor for heart and kidney health', 'ለልብና ደም ግፊት ጤና መጠበቂያ'),
  ('med-43', 'Glucose 40%', 20, 45, 900, 20, 'High', 'Emergency treatment for acute hypoglycemia and collapse', 'ለድንገተኛ የስኳር መጠን ማነስ ማከሚያ ግሉኮስ'),
  ('med-44', 'Cloxacillin 500mg', 100, 7.5, 750, 20, 'High', 'Antibiotic for skin, wound, and soft tissue infections', 'ለቆዳና ቁስል ኢንፌክሽን ማከሚያ አንቲባዮቲክ'),
  ('med-45', 'Norfloxacin 400mg', 100, 8, 800, 20, 'High', 'Urinary tract and gastrointestinal infection antibiotic', 'ለሽንት ቧንቧና ሆድ ኢንፌክሽን ማከሚያ'),
  ('med-46', 'Ibuprofen 400mg PRN', 100, 4, 400, 30, 'High', 'Pain relief and fever reduction for daily medical dispensary', 'ለራስ ምታት፣ ህመም እና ትኩሳት ማስታገሻ'),
  ('med-47', 'Paracetamol 500mg', 100, 3, 300, 35, 'High', 'Essential first-line painkiller and fever reducer', 'ለህመም እና ትኩሳት የመጀመሪያ ህክምና ክኒን'),
  ('med-48', 'Ciprofloxaciline & Dexa eye drop', 120, 85, 10200, 60, 'High', 'Ophthalmic antibacterial and anti-inflammatory eye treatment', 'ለአይን ኢንፌክሽን፣ መቅላትና ማሳከክ ማከሚያ ጠብታ');

-- ------------------------------------------------------------
-- Table structure for `supply_items`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `supply_items`;
CREATE TABLE `supply_items` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_am` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `needed_qty_en` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `needed_qty_am` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `urgency` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Medium',
  `impact_desc_en` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `impact_desc_am` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_supply_item_cat` (`category_id`),
  CONSTRAINT `fk_supply_item_cat` FOREIGN KEY (`category_id`) REFERENCES `supply_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Records of `supply_items` (38 rows)
-- ------------------------------------------------------------
INSERT INTO `supply_items` (`id`, `category_id`, `name_en`, `name_am`, `needed_qty_en`, `needed_qty_am`, `urgency`, `impact_desc_en`, `impact_desc_am`, `sort_order`) VALUES
  ('sup-food-01', 'cat-food', 'Teff Grain (Sacks)', 'ጤፍ (ኩንታል/ጆንያ)', '50 Quintals / month', '50 ኩንታል/ወር', 'High', 'Daily fresh injera baking for all 400+ residents and street intakes', 'ለ400+ ተጠቃሚዎች ዕለታዊ ትኩስ እንጀራ ጋገራ የሚሆን', 0),
  ('sup-food-02', 'cat-food', 'Cooking Oil (Jerrycans)', 'የምግብ ዘይት (ጄሪካን)', '25 Jerrycans (20L) / month', '25 ጄሪካን (20ሊ)/ወር', 'High', 'Daily stew and vegetable meal cooking in shelter central kitchen', 'ለዕለታዊ ወጥና ምግብ ማዘጋጃ የሚውል የምግብ ዘይት', 1),
  ('sup-food-03', 'cat-food', 'Red Lentils (Misir)', 'ምስር ክክ', '15 Quintals / month', '15 ኩንታል/ወር', 'High', 'Essential protein nutrition for daily lunch and dinner meals', 'ለዕለታዊ ምሳና እራት ወጥ ዝግጅት ፕሮቲን ያለው ምስር', 2),
  ('sup-food-04', 'cat-food', 'Split Peas (Ater Kik)', 'አተር ክክ', '15 Quintals / month', '15 ኩንታል/ወር', 'High', 'Nutritious split pea stew for daily resident nourishment', 'ለዕለታዊ አልሚ ክክ ወጥ ዝግጅት', 3),
  ('sup-food-05', 'cat-food', 'Berbere (Red Pepper Spice)', 'በርበሬ', '5 Quintals / month', '5 ኩንታል/ወር', 'High', 'Traditional Ethiopian meal preparation spice', 'ለዕለታዊ ወጥ ማጣፈጫና ማዘጋጃ', 4),
  ('sup-food-06', 'cat-food', 'Shiro Flour', 'ሽሮ', '10 Quintals / month', '10 ኩንታል/ወር', 'High', 'Daily staple vegetarian stew flour for all residents', 'ለዕለታዊ የሽሮ ወጥ ዝግጅት ዋና ግብአት', 5),
  ('sup-food-07', 'cat-food', 'Sugar', 'ስኳር', '10 Quintals / month', '10 ኩንታል/ወር', 'High', 'Warm morning and evening tea service for residents and elderly', 'ለጧትና ማታ ሻይ አገልግሎት የሚውል', 6),
  ('sup-food-08', 'cat-food', 'Table Salt', 'ጨው', '5 Bags / month', '5 ከረጢት/ወር', 'High', 'Essential kitchen seasoning for daily dining', 'ለምግብ ማጣፈጫ', 7),
  ('sup-food-09', 'cat-food', 'Nutritional Porridge Flour (Atmit)', 'የአጥሚት እህል', '10 Quintals / month', '10 ኩንታል/ወር', 'High', 'Nutrient-dense warm porridge for bedridden and frail beneficiaries', 'ለተዳከሙና አልጋ ላይ ላሉ ህሙማን አልሚ አጥሚት', 8),
  ('sup-food-10', 'cat-food', 'Beso Grain (Roasted Barley)', 'የበሶ እህል', '8 Quintals / month', '8 ኩንታል/ወር', 'High', 'High-energy traditional recovery drink for patients', 'ለህሙማን ጉልበት የሚሰጥ ባህላዊ የበሶ እህል', 9),
  ('sup-food-11', 'cat-food', 'Wheat Baking Flour (Firno)', 'ፍርኖ ዱቄት', '20 Quintals / month', '20 ኩንታል/ወር', 'High', 'Fresh bread baking for daily resident breakfast', 'ለጧት ቁርስ ዳቦ መጋገሪያ የሚሆን', 10),
  ('sup-food-12', 'cat-food', 'Pasta', 'ፓስታ', '30 Cartons / month', '30 ካርቶን/ወር', 'High', 'Nutritious meal variation for lunch and dinner', 'ለምግብ ልዩነትና ለተመጣጠነ ምግብ', 11),
  ('sup-food-13', 'cat-food', 'Rice', 'ሩዝ', '15 Quintals / month', '15 ኩንታል/ወር', 'High', 'Digestible warm meals for recovering residents', 'ለቀላልና ተመጣጣኝ የምግብ ዝግጅት', 12),
  ('sup-food-14', 'cat-food', 'Macaroni', 'መኮረኒ', '30 Cartons / month', '30 ካርቶን/ወር', 'High', 'Daily communal meal preparation', 'ለዕለታዊ ምግብ ዝግጅት', 13),
  ('sup-food-15', 'cat-food', 'Red Onions', 'ቀይ ሽንኩርት', '20 Quintals / month', '20 ኩንታል/ወር', 'High', 'Fresh vegetable stew base for shelter kitchens', 'ለዕለታዊ ወጥ ዝግጅት መሰረታዊ ግብአት', 14),
  ('sup-food-16', 'cat-food', 'Fresh Carrots', 'ካሮት', '10 Quintals / month', '10 ኩንታል/ወር', 'High', 'Vitamin-rich vegetable stew addition for immunity', 'ለተመጣጣኝ አልሚ ምግብ', 15),
  ('sup-food-17', 'cat-food', 'Green Peppers (Qariya)', 'ቃሪያ', '5 Sacks / month', '5 ከረጢት/ወር', 'High', 'Fresh kitchen ingredient for daily stews', 'ለምግብ ዝግጅት ማጣፈጫ', 16),
  ('sup-food-18', 'cat-food', 'Fresh Potatoes', 'ድንች', '25 Quintals / month', '25 ኩንታል/ወር', 'High', 'Staple hearty vegetable stew for resident meals', 'ለዕለታዊ አልሚ ድንች ወጥ ዝግጅት', 17),
  ('sup-food-19', 'cat-food', 'Fresh Fruit Crates', 'ፍራፍሬዎች', '20 Crates / month', '20 ሳጥን/ወር', 'High', 'Fresh fruit vitamins for 43 fragile senior and child intakes', 'ለ43 ተጋላጭ ህጻናትና አረጋውያን የቫይታሚን ድጋፍ', 18),
  ('sup-food-20', 'cat-food', 'Cerifam Cereal', 'ሴሪፋም', '40 Packs / month', '40 ፓኬት/ወር', 'High', 'Easy-to-digest baby and convalescent cereal for 43 vulnerable intakes', 'ለህጻናትና ልዩ እንክብካቤ ለሚሹ ህሙማን', 19),
  ('sup-food-21', 'cat-food', 'Fresh Farm Eggs', 'እንቁላል', '50 Crates / month', '50 ሳህን/ወር', 'High', 'High-protein breakfast eggs for resident recovery', 'ለጧት ቁርስ ፕሮቲን ሰጪ እንቁላል', 20),
  ('sup-food-22', 'cat-food', 'Canned Powdered Milk', 'የቆርቆሮ ወተት', '30 Large Cans / month', '30 ቆርቆሮ/ወር', 'High', 'Infant and frail senior daily milk nutrition for 43 intakes', 'ለህጻናትና አረጋውያን ዕለታዊ የወተት አልሚ ምግብ', 21),
  ('sup-hyg-01', 'cat-hygiene', 'Adult & Senior Diapers', 'የአዋቂ ዳይፐር', '50 Packs / month', '50 ፓኬት/ወር', 'High', 'Dignified personal hygiene for bedridden, disabled, and elderly residents', 'ለአልጋ ቁራኛና አረጋውያን ክብርና ንጽህና መጠበቂያ', 0),
  ('sup-hyg-02', 'cat-hygiene', 'Sanitary Wet Wipes', 'ዋይፕስ', '60 Packs / month', '60 ፓኬት/ወር', 'High', 'Gentle hygiene cleaning for immobile residents', 'ለአልጋ ቁራኛና ለህሙማን ፈጣን የንጽህና መጠበቂያ', 1),
  ('sup-hyg-03', 'cat-hygiene', 'Bath Body Soap', 'የገላ ሳሙና', '600 Bars / month', '600 ፍሬ/ወር', 'High', 'Daily resident bathing, handwashing, and skin sanitation for 400+ people', 'ለ400+ ተጠቃሚዎች ዕለታዊ ገላ መታጠቢያ', 2),
  ('sup-hyg-04', 'cat-hygiene', 'Laundry Soap & Detergent', 'የልብስ ሳሙናና ኦሞ', '40 Large Boxes / month', '40 ትላልቅ ካርቶን/ወር', 'High', 'Daily washing and sterilization of clothes, bedding, and blankets', 'ለዕለታዊ ልብስ፣ ብርድልብስና አንሶላ ማጠቢያ', 3),
  ('sup-hyg-05', 'cat-hygiene', 'Soft Toilet Paper & Tissues', 'ሶፍት', '50 Packs / month', '50 ፓኬት/ወር', 'High', 'Communal shelter and restroom sanitation maintenance', 'ለማእከሉ መጸዳጃና የግል ንጽህና መጠበቂያ', 4),
  ('sup-mat-01', 'cat-supplies', 'Warm Heavy Blankets', 'ወፍራም ብርድ ልብስ', '150 Blankets / season', '150 ብርድልብስ/ወቅት', 'High', 'Essential protection against the cold Entoto mountain climate', 'የእንጦጦን ቅዝቃዜ ለመቋቋም የሚሆን ወፍራም ብርድልብስ', 0),
  ('sup-mat-02', 'cat-supplies', 'Clean Clothes & Warm Jackets', 'አልባሳትና ጃኬቶች', '200 Sets / season', '200 ልብሶች/ወቅት', 'High', 'Clean, dignified clothing and sweaters for rescued beneficiaries', 'ለተረዱ ወገኖች ንጹህና ሞቅ ያለ ልብስ', 1),
  ('sup-mat-03', 'cat-supplies', 'Durable Shoes', 'ጫማ', '150 Pairs / season', '150 ጥንድ/ወቅት', 'High', 'Footwear for street intake rescues who arrived barefoot or in rags', 'እግራቸው ተጎድቶ ለሚገቡ ህሙማን ጠንካራ ጫማ', 2),
  ('sup-mat-04', 'cat-supplies', 'High-Density Foam Mattresses', 'የስፖንጅ ፍራሽ', '40 Mattresses', '40 ፍራሾች', 'High', 'Clean, comfortable bedding for newly rescued residents in dormitories', 'ለማገገሚያ ማእከሉ አዲስ አልጋዎች ንጹህ ፍራሽ', 3),
  ('sup-mat-05', 'cat-supplies', 'Bed Sheets & Pillowcases', 'አንሶላና የትራስ ጨርቅ', '150 Pairs', '150 ጥንድ', 'Medium', 'Dormitory bed sanitation, regular rotation, and peaceful sleep', 'ለመኝታ ክፍል ንጽህናና የተሟላ እረፍት', 4),
  ('sup-med-01', 'cat-medical', 'First Aid & Wound Dressing Kits', 'የመጀመሪያ እርዳታና ባንዴጅ', '50 Kits / month', '50 ስብስብ/ወር', 'High', 'Immediate wound cleaning and physical trauma treatment for street intakes', 'ከጎዳና ሲገቡ የተጎዱ ህሙማንን ቁስል ማከሚያ', 0),
  ('sup-med-02', 'cat-medical', 'Blood Pressure & Glucose Monitors', 'የደም ግፊትና ስኳር መለኪያ', '10 Device Kits', '10 መሳሪያዎች', 'Medium', 'Routine vital monitoring for elderly and chronic hypertensive patients', 'ለአረጋውያንና ለህሙማን የጤና ክትትል', 1),
  ('sup-med-03', 'cat-medical', 'Surgical Gloves & Antiseptics', 'ጓንትና ሳቭሎን', '30 Boxes / month', '30 ካርቶን/ወር', 'High', 'Dispensary hygiene and infection control during wound care', 'በህክምና ወቅት ኢንፌክሽን መከላከያ', 2),
  ('sup-psy-01', 'cat-psychiatric', 'Art Therapy Sketchbooks & Paints', 'የስዕል ደብተሮችና ቀለሞች', '100 Sets / month', '100 ስብስብ/ወር', 'Medium', 'Cognitive rehabilitation and creative psychological healing sessions', 'ለአእምሮ እረፍትና ስነ-ጥበብ ቴራፒ', 0),
  ('sup-psy-02', 'cat-psychiatric', 'Board Games, Chess & Dominoes', 'ቼዝ፣ ዶሚኖና ጠረጴዛ ጨዋታዎች', '25 Sets', '25 ጨዋታዎች', 'Medium', 'Mental stimulation, social cohesion, and focus rehabilitation', 'ለአእምሮ ንቃትና ማህበራዊ ትስስር ማጎልበቻ', 1),
  ('sup-psy-03', 'cat-psychiatric', 'Calming Music & Audio Therapy', 'የሙዚቃና ኦዲዮ ማዳመጫ', '10 Audio Sets', '10 እቃዎች', 'Low', 'Auditory relaxation and peaceful meditation for agitated residents', 'ለተረበሹ ህሙማን ሰላምና እረፍት ሰጪ', 2);

-- ------------------------------------------------------------
-- Table structure for `supply_categories`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `supply_categories`;
CREATE TABLE `supply_categories` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_am` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `icon` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Package',
  `color` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'bg-brand-sky-400',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Records of `supply_categories` (5 rows)
-- ------------------------------------------------------------
INSERT INTO `supply_categories` (`id`, `name_en`, `name_am`, `icon`, `color`, `sort_order`) VALUES
  ('cat-food', 'Food & Nutrition', 'ምግብና ተመጣጣኝ ምግብ', 'UtensilsCrossed', 'bg-brand-yellow-400', 0),
  ('cat-hygiene', 'Hygiene & Sanitation', 'ንፅህናና ሳኒቴሽን', 'Droplets', 'bg-brand-sky-400', 1),
  ('cat-medical', 'Medical Equipment & Dispensary', 'የህክምና ቁሳቁሶች', 'Stethoscope', 'bg-brand-red-400', 3),
  ('cat-psychiatric', 'Psychiatric & Therapy Supplies', 'ስነ-አእምሮና ቴራፒ', 'Brain', 'bg-brand-orange-400', 4),
  ('cat-supplies', 'Supplies, Bedding & Clothing', 'ቁሳቁስና አልባሳት', 'Package', 'bg-brand-green-400', 2);

-- ------------------------------------------------------------
-- Table structure for `volunteer_roles`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `volunteer_roles`;
CREATE TABLE `volunteer_roles` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_am` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `description_en` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `description_am` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_vol_role_cat` (`category_id`),
  CONSTRAINT `fk_vol_role_cat` FOREIGN KEY (`category_id`) REFERENCES `volunteer_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Records of `volunteer_roles` (10 rows)
-- ------------------------------------------------------------
INSERT INTO `volunteer_roles` (`id`, `category_id`, `name_en`, `name_am`, `description_en`, `description_am`, `sort_order`) VALUES
  ('vrole-barber', 'vcat-grooming', 'Hair Cutting & Barbering', 'ጸጉር መቁረጥና መስራት', 'Give clean, dignified haircuts and grooming for male and female recovering beneficiaries.', 'ለወንዶችና ሴቶች ተጠቃሚዎች ጸጉር መቁረጥና ማስተካከል።', 0),
  ('vrole-bathing', 'vcat-grooming', 'Bathing & Personal Grooming', 'ገላ ማጠብና የግል ንጽህና', 'Assist bedridden or elderly residents with gentle, compassionate warm bathing and clean dressing.', 'አረጋውያንንና ታማሚዎችን ገላ ማጠብና ንጹህ ልብስ ማልበስ።', 1),
  ('vrole-companion', 'vcat-care', 'Elderly Companionship & Listening', 'የአዛውንት እንክብካቤና ጨዋታ', 'Spend quality time listening, sharing stories, and offering warm emotional presence to abandoned seniors.', 'ከአዛውንቶች ጋር ጊዜ ማሳለፍ፣ ማዳመጥና የፍቅር ወዳጅ መሆን።', 0),
  ('vrole-cook', 'vcat-kitchen', 'Meal Preparation & Cooking', 'ምግብ ማዘጋጀት', 'Help chop vegetables, bake injera/bread, and prepare nutritious daily meals for 400+ residents.', 'ለ400+ ተጠቃሚዎች ዕለታዊ ምግብና እንጀራ ማዘጋጀት።', 0),
  ('vrole-laundry', 'vcat-operations', 'Laundry & Linen Washing', 'ልብስና አንሶላ ማጠብ', 'Wash, sanitize, and fold dormitory bedsheets, blankets, and resident clothes.', 'የህሙማንን ልብሶች፣ ብርድልብሶችና አንሶላዎችን ማጠብ።', 1),
  ('vrole-med-assist', 'vcat-medical', 'Clinical Assistant / Nurse Volunteer', 'የጤና እርዳታና ክሊኒካል ድጋፍ', 'Assist dispensary staff with vital signs check, wound dressing, and medication administration.', 'በማእከሉ ክሊኒክ የደም ግፊት መለካት፣ ቁስል ማጠብና የመጀመሪያ እርዳታ መስጠት።', 0),
  ('vrole-patient-care', 'vcat-care', 'Patient Recovery Accompaniment', 'ህሙማንን መንከባከብ', 'Accompany residents during daily walks, recreational therapy, and peaceful courtyard activities.', 'በግቢ ውስጥ ከህሙማን ጋር አብሮ መራመድና ማጽናናት።', 1),
  ('vrole-serve', 'vcat-kitchen', 'Meal Service & Dining Support', 'ምግብ ማቅረብና መመገብ', 'Serve warm meals with love and assist frail or elderly residents during breakfast, lunch, and dinner.', 'ለተጠቃሚዎች ምግብ በክብር ማቅረብና አቅም የሌላቸውን መመገብ።', 1),
  ('vrole-water', 'vcat-operations', 'Water Fetching & Storage', 'ዉሃ መቅዳት', 'Help transport, store, and manage water distribution throughout the shelter facility.', 'ለማእከሉ የውሃ ማጠራቀሚያዎች ውሃ መቅዳትና ማቅረብ።', 2),
  ('vrole-wood', 'vcat-operations', 'Firewood Chopping & Heating', 'እንጨት መፍለጥ', 'Chop firewood and manage kitchen hearths for daily large-scale cooking in the mountain shelter.', 'ለምግብ ማብሰያና ለማሞቂያ የሚሆን እንጨት መፍለጥ።', 0);

-- ------------------------------------------------------------
-- Table structure for `volunteer_categories`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `volunteer_categories`;
CREATE TABLE `volunteer_categories` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_am` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `icon` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Users',
  `color` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'bg-brand-sky-400',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Records of `volunteer_categories` (5 rows)
-- ------------------------------------------------------------
INSERT INTO `volunteer_categories` (`id`, `name_en`, `name_am`, `icon`, `color`, `sort_order`) VALUES
  ('vcat-care', 'Elderly & Resident Care', 'የአዛውንቶችና ህሙማን እንክብካቤ', 'HeartHandshake', 'bg-brand-green-400', 2),
  ('vcat-grooming', 'Hygiene & Barbering', 'ንጽህናና ጸጉር ማስተካከል', 'Droplets', 'bg-brand-sky-400', 1),
  ('vcat-kitchen', 'Kitchen & Meal Service', 'ምግብ ዝግጅትና መስተንግዶ', 'UtensilsCrossed', 'bg-brand-yellow-400', 0),
  ('vcat-medical', 'Health & Medical Aid', 'የጤናና የህክምና እርዳታ', 'Stethoscope', 'bg-brand-red-400', 4),
  ('vcat-operations', 'Shelter Maintenance & Utilities', 'የግቢ ስራዎችና እንጨት መፍለጥ', 'Settings', 'bg-brand-orange-400', 3);

-- ------------------------------------------------------------
-- Table structure for `news`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title_en` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title_am` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `excerpt_en` text COLLATE utf8mb4_unicode_ci,
  `excerpt_am` text COLLATE utf8mb4_unicode_ci,
  `body_en` longtext COLLATE utf8mb4_unicode_ci,
  `body_am` longtext COLLATE utf8mb4_unicode_ci,
  `category` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Community',
  `cover_image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `image_paths` text COLLATE utf8mb4_unicode_ci,
  `author` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `published_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_news_slug` (`slug`),
  KEY `idx_news_published` (`is_published`,`published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Records of `news` (4 rows)
-- ------------------------------------------------------------
INSERT INTO `news` (`id`, `slug`, `title_en`, `title_am`, `excerpt_en`, `excerpt_am`, `body_en`, `body_am`, `category`, `cover_image`, `image_paths`, `author`, `published_at`, `is_published`, `created_at`, `updated_at`) VALUES
  ('news-001', 'selihom-expands-mental-health-outreach', 'Selihom Rehabilitation Centre Expands Mental Health Outreach Across Addis Ababa', 'የሰሊሆም ማገገሚያ ማዕከል በአዲስ አበባ የአእምሮ ጤና አገልግሎቱን በስፋት አስፋፋ', 'A newly renovated wing and specialized medical supplies allow Selihom to care for over 150 additional patients in need of psychiatric and dignified rehabilitation.', 'አዲሱ የተሻሻለው ክፍል እና ልዩ የህክምና አቅርቦቶች ሰሊሆም ተጨማሪ ከ150 በላይ የአእምሮ ህክምና ለሚያስፈልጋቸው ወገኖች እንክብካቤ እንዲሰጥ አስችሎታል።', 'ADDIS ABABA — Selihom Rehabilitation Centre has officially opened its expanded psychiatric rehabilitation ward, marking a major milestone in humanitarian care for mentally ill and homeless individuals across Ethiopia.\n\nFounded with the mission of restoring human dignity to those living on the streets, the association provides full-time shelter, psychiatric medication, nutritious meals, and vocational training.\n\nThe new expansion includes twenty additional beds, dedicated consultation suites for volunteer medical professionals, and an expanded kitchen facility supported by community donations.\n\n\"Our goal is not merely to provide temporary shelter, but to walk alongside each individual until they achieve true recovery and reintegration,\" noted the association leadership. \"Every donation and volunteer hour makes this restoration possible.\"', 'አዲስ አበባ — የሰሊሆም የአእምሮ ህሙማን መርጃ ማህበር በአዲስ አበባ እና በአካባቢዋ ባሉ ጎዳናዎች ላይ የሚገኙ የአእምሮ ህሙማንን ክብር ለመመለስ አዲስ የተስፋፋውን የማገገሚያ ክፍል በይፋ ከፍቷል።\n\nማህበሩ ጎዳና ላይ ለወደቁ ወገኖች ሙሉ ጊዜ መጠለያ፣ የአእምሮ ህክምና መድሃኒቶች፣ የተመጣጠነ ምግብ እና የስነ-ልቦና ድጋፍ ይሰጣል።\n\nአዲሱ ማስፋፊያ ሃያ ተጨማሪ አልጋዎችን፣ ለበጎፈቃደኛ ሀኪሞች የማማከሪያ ክፍሎችን እና በማህበረሰቡ ድጋፍ የተገነባ ሰፊ የወጥ ቤት አገልግሎትን ያካትታል።', 'Health', '/uploads/img-rehabilitation-outreach.jpg', '[\"/uploads/img-rehabilitation-outreach.jpg\",\"/uploads/img-charity-owner.jpg\"]', 'Selihom Media Desk', '2026-09-06 03:26:05', 1, '2026-09-06 10:26:04', '2026-09-06 19:53:05'),
  ('news-002', 'community-leaders-rally-support-selihom', 'Community Leaders Rally Support for Vulnerable Residents at Selihom', 'የማህበረሰብ መሪዎች ለሰሊሆም ተረጂዎች አስፈላጊውን ድጋፍ አደረጉ', 'Local businesses, faith groups, and volunteers gathered to pledge essential medical supplies, clothing, and daily nutritional meals.', 'የአካባቢው የንግድ ተቋማት፣ የእምነት ተቋማት እና በጎፈቃደኞች አስፈላጊ የህክምና ቁሳቁሶችን፣ አልባሳትን እና የምግብ ድጋፍ አደረጉ።', 'Local community organizers and civic leaders assembled this weekend to reinforce ongoing humanitarian support for Selihom Charity Association.\n\nThe coalition pledged monthly provisions of essential hygiene products, non-perishable foodstuffs, and continuous nursing support to strengthen long-term patient recovery.\n\nThe initiative highlights the enduring spirit of mutual compassion and solidarity that sustains Selihom\'s day-to-day operations.', 'የአካባቢው ማህበረሰብ መሪዎች በዚህ ሳምንት ለሰሊሆም በጎ አድራጎት ማህበር ቀጣይነት ያለው ሰብአዊ ድጋፍ ለማድረግ ተሰባስበዋል።\n\nህብረቱ የወርሃዊ የንጽህና መጠበቂያ ቁሳቁሶችን፣ የምግብ አቅርቦቶችን እና የበጎ ፈቃድ ነርስ ድጋፍን ለመስጠት ቃል ገብቷል።', 'Community', '/uploads/img-award-ceremony.jpg', '[\"/uploads/img-award-ceremony.jpg\"]', 'Community Liaison', '2026-09-04 07:26:05', 1, '2026-09-06 10:26:04', '2026-09-06 10:26:04'),
  ('news-003', 'annual-love-feasts-calendar-announced', 'Annual Love Feasts Calendar Announced: Celebrate Life\'s Milestones with Our Residents', 'የዓመታዊው የፍቅር ድግስ መርሃ ግብር ይፋ ተደረገ፡ የህይወትዎን ልዩ ቀናት ከተረጂዎች ጋር ያክብሩ', 'Families and individuals are invited to celebrate birthdays, anniversaries, and holidays by sponsoring and sharing festive meals.', 'ቤተሰቦች እና ግለሰቦች የልደት፣ የሰርግ እና ሌሎች በዓላትን ከተረጂዎቻችን ጋር በማክበር ፍቅርን እንዲያካፍሉ ተጋብዘዋል።', 'Selihom has officially opened registration for its signature Love Feasts (የፍቅር ድግስ) calendar.\n\nThrough this unique program, sponsors coordinate with Selihom to prepare celebratory lunches or dinners for over 100 residents, sharing fellowship and dignity across the table.\n\nRegistration is now available online through the Events Pledge section.', 'ሰሊሆም ለተከታታይ የፍቅር ድግስ መርሃ ግብሮች ምዝገባውን በይፋ ከፍቷል።\n\nበዚህ መርሃ ግብር ደጋፊዎች ከሰሊሆም ጋር በመተባበር ለተረጂዎች የበዓል ምሳ ወይም እራት በማዘጋጀት ፍቅርንና ደስታን ያካፍላሉ።', 'Events', '/uploads/img-medical-outreach.jpg', '[\"/uploads/img-medical-outreach.jpg\"]', 'Event Coordinator', '2026-09-01 07:26:05', 1, '2026-09-06 10:26:04', '2026-09-06 10:26:04'),
  ('news-004', 'draft-vocational-workshop-initiative', 'Draft: Vocational Skills Workshop Plan for Recovered Residents', 'ረቂቅ፡ ያገገሙ ወገኖችን በሙያ ለማብቃት የተዘጋጀ እቅድ', 'Internal draft detailing vocational carpentry, tailoring, and urban gardening programs.', 'ለማገገም በደረሱ ወገኖች የዕደ ጥበብ፣ የልብስ ስፌት እና የጓሮ አትክልት ስልጠና ለመስጠት የተዘጋጀ ውስጣዊ እቅድ።', 'This document outlines the proposed 2026-2027 vocational rehabilitation initiative at Selihom.', 'ይህ ሰነድ ለ2026-2027 የሙያ ማገገሚያ ስልጠና እቅድን ያቀርባል።', 'Announcements', '/uploads/img-charity-owner.jpg', '[\"/uploads/img-charity-owner.jpg\"]', 'Program Lead', '2026-09-06 07:26:05', 0, '2026-09-06 10:26:04', '2026-09-06 10:26:04');

-- ------------------------------------------------------------
-- Table structure for `site_settings`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'global',
  `org_name_en` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Selihom Mentally Ill People Support Association',
  `org_name_am` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር',
  `motto_en` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Kind hearts excel beautiful faces!',
  `motto_am` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ደግ ልቦች ከውብ ፊቶች ይበልጣሉ!',
  `phones` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'selihomc@gmail.com',
  `address_en` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_am` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_number` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1113/2019',
  `registration_date` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '30/02/2011 ዓ.ም (Oct 30, 2018)',
  `registration_agency_en` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Federal Democratic Republic of Ethiopia Agency for Civil Society Organizations',
  `registration_agency_am` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'የኢትዮጵያ ፌደራላዊ ዲሞክራሲያዊ ሪፐብሊክ የሲቪል ማህበረሰብ ድርጅቶች ኤጀንሲ',
  `telegram_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'https://t.me/Selihommentallyill',
  `facebook_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'https://facebook.com/SelihomSupport',
  `tiktok_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'https://tiktok.com/@selihomcharity',
  `youtube_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'https://youtube.com/@selihomcharity',
  `instagram_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `linkedin_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Records of `site_settings` (1 rows)
-- ------------------------------------------------------------
INSERT INTO `site_settings` (`id`, `setting_key`, `org_name_en`, `org_name_am`, `motto_en`, `motto_am`, `phones`, `email`, `address_en`, `address_am`, `registration_number`, `registration_date`, `registration_agency_en`, `registration_agency_am`, `telegram_url`, `facebook_url`, `tiktok_url`, `youtube_url`, `instagram_url`, `linkedin_url`, `updated_at`) VALUES
  (1, 'global', 'Selihom Mentally Ill People Support Association', 'ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር', 'Kind hearts excel beautiful faces!', 'ደግ ልቦች ከውብ ፊቶች ይበልጣሉ!', '[\"+251911004903\",\"+251953905050\",\"0118195444\",\"0904440157\"]', 'selihomc@gmail.com', 'Near Entoto St. Raguel & Elias Church, 300 meters down on the road towards Fetesha, Addis Ababa, Ethiopia', 'ከእንጦጦ ቅዱስ ራጉኤል ወኤልያስ ቤተክርስቲያን ወደ ፍተሻ በሚወስደው መንገድ 300 ሜትር ዝቅ ብሎ፣ አዲስ አበባ', '1113/2019', '30/02/2011 ዓ.ም (Oct 30, 2018)', 'Federal Democratic Republic of Ethiopia Agency for Civil Society Organizations', 'የኢትዮጵያ ፌደራላዊ ዲሞክራሲያዊ ሪፐብሊክ የሲቪል ማህበረሰብ ድርጅቶች ኤጀንሲ', 'https://t.me/Selihommentallyill', 'https://facebook.com/SelihomSupport', 'https://tiktok.com/@selihomcharity', 'https://youtube.com/@selihomcharity', '', '', '2026-10-29 21:09:22');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
