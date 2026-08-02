# Selihom NGO Web Application Documentation

Welcome to the technical and operational documentation for the **Selihom Mental Health & Humanitarian Association** web application. This document provides a comprehensive guide to the architecture, data structures, component hierarchy, state management, and administrative features powering the platform.

---

## 📋 Table of Contents
1. [Overview & Purpose](#1-overview--purpose)
2. [Technology Stack](#2-technology-stack)
3. [Project Directory Structure](#3-project-directory-structure)
4. [Internationalization & Language Context](#4-internationalization--language-context)
5. [Data Models & Types](#5-data-models--types)
6. [Component Breakdown](#6-component-breakdown)
   - [Navbar & Navigation](#navbar--navigation)
   - [Hero Section](#hero-section)
   - [Hero Carousel](#hero-carousel)
   - [Achievements & Honors Section](#achievements--honors-section)
   - [Transformations & Rehabilitation Stories](#transformations--rehabilitation-stories)
   - [Initiatives & Programs Section](#initiatives--programs-section)
   - [Core Values Section](#core-values-section)
   - [Impact Counters](#impact-counters)
   - [About Section](#about-section)
   - [Testimonials Section](#testimonials-section)
   - [Get Involved / Volunteer Section](#get-involved--volunteer-section)
   - [Donation Section](#donation-section)
   - [Visit Booking Section](#visit-booking-section)
   - [Gallery Section](#gallery-section)
   - [Contact Section](#contact-section)
   - [Admin Dashboard](#admin-dashboard)
   - [Footer](#footer)
   - [Helper & Design Components](#helper--design-components)
7. [State Management & Data Persistence](#7-state-management--data-persistence)
8. [Backend API Routes](#8-backend-api-routes)
9. [User Workflows](#9-user-workflows)

---

## 1. Overview & Purpose

The **Selihom Mental Health & Humanitarian Association** website is a modern, responsive, bilingual web application designed to support Selihom's mission in Addis Ababa, Ethiopia. Selihom provides psychiatric care, daily feeding programs, shelter, child education, and elderly support for vulnerable citizens.

### Primary Objectives:
- **Public Awareness & Storytelling:** Share real rehabilitation success stories, founder leadership, official government certifications, and daily operations.
- **Direct Donations:** Enable donors in Ethiopia and abroad to pledge monetary support via Commercial Bank of Ethiopia (CBE), Awash Bank, Bank of Abyssinia, Telebirr, and In-Kind goods.
- **Volunteer & Visit Scheduling:** Allow supporters to register as volunteers or book guided visits to the Entoto center.
- **Bilingual Accessibility:** Provide seamless 1-click toggling between **Amharic (አማርኛ)** and **English**.
- **Admin Management:** Offer a protected Admin Dashboard for operations staff to review pledges, visit bookings, volunteer applications, update needed supplies, and export/import database records.

---

## 2. Technology Stack

- **Frontend Framework:** React 18 with TypeScript & Vite
- **Styling & UI Design:** Tailwind CSS with custom branding (`brand-green`, `brand-yellow`, `brand-cream`)
- **Animations:** Motion (`motion/react`) for smooth scroll animations, transitions, and modals
- **Icons:** Lucide React (`lucide-react`)
- **Backend & Storage:** Node.js Express server with JSON-file persistence (`data/db.json`) and client-side `localStorage` sync fallback
- **Language System:** React Context API (`LanguageContext.tsx`)

---

## 3. Project Directory Structure

```
├── DOCUMENTATION.md               # Complete documentation file
├── package.json                   # Dependencies and npm scripts
├── server.ts                      # Express API backend server
├── src/
│   ├── App.tsx                    # Main root component & section orchestrator
│   ├── main.tsx                   # Entry point rendering App wrapped in LanguageProvider
│   ├── index.css                  # Global CSS and Tailwind imports
│   ├── types.ts                   # Global TypeScript interface definitions
│   ├── data.ts                    # Application static data (stories, programs, gallery items)
│   ├── assets/
│   │   └── images/                # Local photos (awards, transformation stories, logo, etc.)
│   ├── context/
│   │   └── LanguageContext.tsx    # Amharic/English language toggle context
│   ├── utils/
│   │   └── adminStorage.ts        # Client storage & REST API sync utilities
│   └── components/
│       ├── AboutSection.tsx       # NGO history, vision, mission & objectives
│       ├── AchievementsSection.tsx# Founder leadership, honors & dignitary visits
│       ├── AdminDashboard.tsx     # Operations control panel (bookings, pledges, volunteers, in-kind)
│       ├── BookingSection.tsx     # Visit scheduling form
│       ├── ContactSection.tsx     # Address, phone numbers, map & bank accounts
│       ├── CoreValuesSection.tsx  # Organizational values grid
│       ├── DonateSection.tsx      # Monetary & in-kind donation portal
│       ├── Footer.tsx             # Site footer with quick links & admin trigger
│       ├── GallerySection.tsx     # Paginated photo gallery with lightbox modal
│       ├── GetInvolvedSection.tsx # Volunteer signup & partnership form
│       ├── HeroCarousel.tsx       # Auto-rotating hero slider highlighting awards & transformations
│       ├── ImpactCounters.tsx     # Animated impact metrics & statistics
│       ├── InitiativesSection.tsx # Core shelter programs and preset donation triggers
│       ├── Navbar.tsx             # Sticky header with navigation links & language toggle
│       ├── Sketches.tsx           # Custom hand-drawn vector background artwork
│       ├── TestimonialsSection.tsx# Community and volunteer quotes
│       ├── TransformationsSection.tsx # Before & after rehabilitation case studies
│       └── TransparentImage.tsx   # Image wrapper handling background transparency
```

---

## 4. Internationalization & Language Context

The application features full bilingual capability (**Amharic** and **English**).

### `LanguageContext.tsx`
- **Hook:** `useLanguage()`
- **State:** `language` (`'am'` | `'en'`)
- **Methods:**
  - `setLanguage(lang)`: Switch active language and store preference in `localStorage`.
  - `t(bilingualObject)`: Helper function that accepts a `{ am: string, en: string }` object and returns the text corresponding to the currently selected language.

---

## 5. Data Models & Types (`src/types.ts`)

Key interface contracts used across the application:

- **`BilingualText`**: `{ am: string; en: string }`
- **`InitiativeItem`**: Defines a shelter program (id, title, description, image, icon, targetGoal, raisedAmount, etc.).
- **`AchievementItem`**: Defines official awards, certifications, and guest visits (id, title, year, image, description, category).
- **`TransformationStory`**: Defines rehabilitation case studies (id, name, age, storyBefore, storyAfter, image, status, imagePosition).
- **`GalleryItem`**: Defines gallery images (id, type, title, category, url, description, imagePosition).
- **`Booking`**: Defines a visit booking request (id, fullName, phone, email, date, timeSlot, groupSize, notes, status, createdAt).
- **`DonationPledge`**: Defines a donor pledge (id, donorName, phone, amount, bankName, transactionRef, initiativeId, status, createdAt).
- **`VolunteerApplication`**: Defines volunteer registrations (id, fullName, phone, email, role, availability, notes, status, createdAt).
- **`InKindItem`**: Defines needed physical items (id, category, itemName, priority, quantityNeeded, quantityReceived).
- **`AdminProfile`**: Defines credentials and profile for administrative access.

---

## 6. Component Breakdown

### Navbar & Navigation (`src/components/Navbar.tsx`)
- **Features:** Sticky header with blur backdrop, Selihom logo, smooth scroll section links, mobile slide-out drawer, language toggle switch (`አማ / EN`), and a prominent "Donate Now" CTA button.
- **Props:** `onNavigate(sectionId: string)`, `activeSection: string`.

### Hero Section (`src/App.tsx`)
- **Features:** High-impact intro banner featuring the main slogan (*EMPOWERING HOPE & UNITY IN ETHIOPIA*), brief mission description, direct action buttons (*Donate Now*, *Book Guided Visit*), official NGO registration badge (`Reg 6131`), and an integrated 2-column hero grid embedding the responsive Hero Carousel alongside headline copy.

### Hero Carousel (`src/components/HeroCarousel.tsx`)
- **Features:** Auto-rotating media slider embedded within the main Hero section showcasing official government honors, founder awards, and key transformation stories. Features smooth motion fade/scale transitions, interactive slide indicators, pause-on-hover behavior, and action buttons to view full honors. Formatted with responsive dimensions (`h-[380px]` to `h-[460px]`) and optimized width limits (`max-w-lg` / `max-w-xl`) for balanced framing across all screen sizes.
- **Props:** `onNavigateAchievements: () => void`.

### Achievements & Honors Section (`src/components/AchievementsSection.tsx`)
- **Features:** Showcases Selihom's founder Mr. Mikiyas Legesse, official government registration certificates, NGO excellence awards, and notable VIP guest visits. Includes an interactive inspection modal (lightbox) to view original certificates and historical photos up close.

### Initiatives & Programs Section (`src/components/InitiativesSection.tsx`)
- **Features:** Detailed cards for Selihom's key programs:
  1. Psychiatric Care & Medical Treatment
  2. Entoto Community Feeding Kitchen
  3. Child Education & Material Support
  4. Elderly Shelter & Compassionate Care
- Includes fundraising progress bars and direct "Support This Program" buttons that pre-select the initiative in the donation form.

### Core Values Section (`src/components/CoreValuesSection.tsx`)
- **Features:** Grid highlighting Selihom's core guiding principles: *Empathy & Love*, *Human Dignity*, *Integrity & Transparency*, and *Community Empowerment*.

### Impact Counters (`src/components/ImpactCounters.tsx`)
- **Features:** Key quantitative statistics highlighting real community impact (e.g., 500+ citizens rescued, 200+ daily meals served, 150+ reunited with families).

### About Section (`src/components/AboutSection.tsx`)
- **Features:** Tabbed narrative detailing Selihom's history, vision statement, mission, strategic objectives, and organization leadership.

### Transformations & Rehabilitation Stories (`src/components/TransformationsSection.tsx`)
- **Features:** Real before-and-after case studies of individuals rescued from street life (e.g., Sister Aster, Brother Abebe, Sister Worknesh, Brother Worku). Configured with precise focal image positioning (`object-center`, `object-top`) to present full, un-cropped portraits.

### Testimonials Section (`src/components/TestimonialsSection.tsx`)
- **Features:** Quotes and endorsements from community partners, medical professionals, volunteers, and benefactors.

### Get Involved / Volunteer Section (`src/components/GetInvolvedSection.tsx`)
- **Features:** Interactive volunteer registration form where users can apply for roles (Meal Serving, Medical Assistance, Teaching, Event Support) and submit applications directly to the Admin storage system.

### Donation Section (`src/components/DonateSection.tsx`)
- **Features:**
  - **Monetary Tab:** Provides verified bank account numbers for Commercial Bank of Ethiopia (CBE), Awash Bank, Bank of Abyssinia, and Telebirr with 1-click copy-to-clipboard functionality. Users can enter their pledge details and submit transaction reference numbers.
  - **In-Kind Tab:** Interactive checklist of urgent physical needs (e.g., Tef/Flour, Cooking Oil, Hygiene Packs, Medicines, Blankets) with real-time status tracking.

### Visit Booking Section (`src/components/BookingSection.tsx`)
- **Features:** Form for scheduling guided visits or volunteer orientation sessions at the Entoto shelter. Captures date, time slot, group size, and contact details.

### Gallery Section (`src/components/GallerySection.tsx`)
- **Features:** Filterable photo grid of shelter activities, VIP visits, awards, and daily meals.
- **Pagination System:** Displays 2 rows (6 items) by default, with a "Load More Pictures" / "Show Fewer Pictures" button.
- **Lightbox:** Clicking any photo opens an expanded modal with full caption and description in the active language.

### Contact Section (`src/components/ContactSection.tsx`)
- **Features:** Complete contact information including physical shelter address in Entoto (Addis Ababa), official phone numbers, email address, interactive Google Maps embed, and social media links.

### Admin Dashboard (`src/components/AdminDashboard.tsx`)
- **Features:**
  - **Access Control:** Protected by password login.
  - **Bookings Management:** View, search, approve, or cancel visit requests.
  - **Pledges Management:** Track donor pledges and confirm payment transactions.
  - **Volunteers Management:** Review volunteer applications and update statuses.
  - **In-Kind Needs Manager:** Add, edit, or remove required physical items.
  - **Data Export & Import:** Download full database backups as JSON or restore state from uploaded JSON files.

### Footer (`src/components/Footer.tsx`)
- **Features:** Navigation quick links, organizational details, NGO registration number, copyright statement, and discrete link to open the Admin Portal.

### Helper & Design Components
- **`TransparentImage.tsx`**: Utility component that strips background noise and ensures clean rendering for cutout PNG images.
- **`Sketches.tsx`**: Hand-crafted SVG sketches (Helping Hands, Feeding Bowl, Book, Healthcare) rendered semi-translucently in the background.

---

## 7. State Management & Data Persistence

The application employs a dual-layer state management system implemented in `src/utils/adminStorage.ts`:

1. **Client Storage (LocalStorage):** Ensures instant UI response and offline capability for bookings, pledges, volunteer applications, and admin credentials.
2. **Server Storage (REST API):** Asynchronous sync with the Node.js Express server (`/api/db`) to write persistent changes to `data/db.json`.

---

## 8. Backend API Routes (`server.ts`)

The Express server handles the following API endpoints:

- `GET /api/db`: Retrieve current database state (bookings, pledges, volunteers, in-kind needs, admin profile).
- `POST /api/db`: Replace complete database state (JSON import).
- `POST /api/bookings`: Create a new visit booking.
- `PUT /api/bookings/:id/status`: Update booking status (`pending`, `confirmed`, `completed`, `cancelled`).
- `DELETE /api/bookings/:id`: Remove a booking entry.
- `POST /api/pledges`: Submit a donation pledge.
- `PUT /api/pledges/:id/status`: Update pledge status (`pending`, `verified`, `rejected`).
- `DELETE /api/pledges/:id`: Remove a pledge.
- `POST /api/volunteers`: Submit a volunteer application.
- `PUT /api/volunteers/:id/status`: Update volunteer application status.
- `DELETE /api/volunteers/:id`: Remove a volunteer record.
- `POST /api/inkind_needs`: Add or update an in-kind needed supply item.
- `DELETE /api/inkind_needs/:id`: Remove an in-kind item.
- `POST /api/admin_profile`: Update admin account credentials and profile info.

---

## 9. User Workflows

### A. Browsing & Language Switching
1. User opens the website (default language is Amharic or saved preference).
2. User clicks the `አማ / EN` button in the Navbar to instantly toggle all text between Amharic and English.

### B. Making a Donation
1. User clicks "Donate Now" or selects a program card in the Initiatives section.
2. The page smooth-scrolls to the Donation section with the selected initiative pre-filled.
3. User copies bank details (CBE, Awash, Abyssinia, or Telebirr) and completes transfer.
4. User submits the donation pledge form with their transaction reference number.

### C. Booking a Visit
1. User navigates to the Visit Booking section.
2. Selects date, time slot (Morning / Afternoon), group size, and enters contact info.
3. Upon submission, the booking is sent to the server and saved for admin review.

### D. Managing Operations in Admin Dashboard
1. Operations staff opens `/admin` or clicks "Admin Portal" in the footer.
2. Enters admin password (`selihom2026`).
3. Reviews pending visit requests, verifies bank transaction references for donation pledges, approves volunteer applications, and updates needed food or medical supplies.

---

*Document compiled for Selihom NGO Web Application. All rights reserved.*
