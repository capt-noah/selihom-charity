import pool from "../database/db.js";

async function seed() {
  console.log("Seeding realistic sample data...");

  // 1. Seed News Articles
  const articles = [
    {
      id: "news-001",
      slug: "selihom-expands-mental-health-outreach",
      title_en: "Selihom Rehabilitation Centre Expands Mental Health Outreach Across Addis Ababa",
      title_am: "የሰሊሆም ማገገሚያ ማዕከል በአዲስ አበባ የአእምሮ ጤና አገልግሎቱን በስፋት አስፋፋ",
      excerpt_en: "A newly renovated wing and specialized medical supplies allow Selihom to care for over 150 additional patients in need of psychiatric and dignified rehabilitation.",
      excerpt_am: "አዲሱ የተሻሻለው ክፍል እና ልዩ የህክምና አቅርቦቶች ሰሊሆም ተጨማሪ ከ150 በላይ የአእምሮ ህክምና ለሚያስፈልጋቸው ወገኖች እንክብካቤ እንዲሰጥ አስችሎታል።",
      body_en: `ADDIS ABABA — Selihom Rehabilitation Centre has officially opened its expanded psychiatric rehabilitation ward, marking a major milestone in humanitarian care for mentally ill and homeless individuals across Ethiopia.

Founded with the mission of restoring human dignity to those living on the streets, the association provides full-time shelter, psychiatric medication, nutritious meals, and vocational training.

The new expansion includes twenty additional beds, dedicated consultation suites for volunteer medical professionals, and an expanded kitchen facility supported by community donations.

"Our goal is not merely to provide temporary shelter, but to walk alongside each individual until they achieve true recovery and reintegration," noted the association leadership. "Every donation and volunteer hour makes this restoration possible."`,
      body_am: `አዲስ አበባ — የሰሊሆም የአእምሮ ህሙማን መርጃ ማህበር በአዲስ አበባ እና በአካባቢዋ ባሉ ጎዳናዎች ላይ የሚገኙ የአእምሮ ህሙማንን ክብር ለመመለስ አዲስ የተስፋፋውን የማገገሚያ ክፍል በይፋ ከፍቷል።

ማህበሩ ጎዳና ላይ ለወደቁ ወገኖች ሙሉ ጊዜ መጠለያ፣ የአእምሮ ህክምና መድሃኒቶች፣ የተመጣጠነ ምግብ እና የስነ-ልቦና ድጋፍ ይሰጣል።

አዲሱ ማስፋፊያ ሃያ ተጨማሪ አልጋዎችን፣ ለበጎፈቃደኛ ሀኪሞች የማማከሪያ ክፍሎችን እና በማህበረሰቡ ድጋፍ የተገነባ ሰፊ የወጥ ቤት አገልግሎትን ያካትታል።`,
      category: "Health",
      cover_image: "/uploads/img-rehabilitation-outreach.jpg",
      image_paths: JSON.stringify(["/uploads/img-rehabilitation-outreach.jpg", "/uploads/img-charity-owner.jpg"]),
      author: "Selihom Media Desk",
      published_at: new Date(Date.now() - 3600000 * 4), // 4h ago
      is_published: 1,
    },
    {
      id: "news-002",
      slug: "community-leaders-rally-support-selihom",
      title_en: "Community Leaders Rally Support for Vulnerable Residents at Selihom",
      title_am: "የማህበረሰብ መሪዎች ለሰሊሆም ተረጂዎች አስፈላጊውን ድጋፍ አደረጉ",
      excerpt_en: "Local businesses, faith groups, and volunteers gathered to pledge essential medical supplies, clothing, and daily nutritional meals.",
      excerpt_am: "የአካባቢው የንግድ ተቋማት፣ የእምነት ተቋማት እና በጎፈቃደኞች አስፈላጊ የህክምና ቁሳቁሶችን፣ አልባሳትን እና የምግብ ድጋፍ አደረጉ።",
      body_en: `Local community organizers and civic leaders assembled this weekend to reinforce ongoing humanitarian support for Selihom Charity Association.

The coalition pledged monthly provisions of essential hygiene products, non-perishable foodstuffs, and continuous nursing support to strengthen long-term patient recovery.

The initiative highlights the enduring spirit of mutual compassion and solidarity that sustains Selihom's day-to-day operations.`,
      body_am: `የአካባቢው ማህበረሰብ መሪዎች በዚህ ሳምንት ለሰሊሆም በጎ አድራጎት ማህበር ቀጣይነት ያለው ሰብአዊ ድጋፍ ለማድረግ ተሰባስበዋል።

ህብረቱ የወርሃዊ የንጽህና መጠበቂያ ቁሳቁሶችን፣ የምግብ አቅርቦቶችን እና የበጎ ፈቃድ ነርስ ድጋፍን ለመስጠት ቃል ገብቷል።`,
      category: "Community",
      cover_image: "/uploads/img-award-ceremony.jpg",
      image_paths: JSON.stringify(["/uploads/img-award-ceremony.jpg"]),
      author: "Community Liaison",
      published_at: new Date(Date.now() - 86400000 * 2), // 2 days ago
      is_published: 1,
    },
    {
      id: "news-003",
      slug: "annual-love-feasts-calendar-announced",
      title_en: "Annual Love Feasts Calendar Announced: Celebrate Life's Milestones with Our Residents",
      title_am: "የዓመታዊው የፍቅር ድግስ መርሃ ግብር ይፋ ተደረገ፡ የህይወትዎን ልዩ ቀናት ከተረጂዎች ጋር ያክብሩ",
      excerpt_en: "Families and individuals are invited to celebrate birthdays, anniversaries, and holidays by sponsoring and sharing festive meals.",
      excerpt_am: "ቤተሰቦች እና ግለሰቦች የልደት፣ የሰርግ እና ሌሎች በዓላትን ከተረጂዎቻችን ጋር በማክበር ፍቅርን እንዲያካፍሉ ተጋብዘዋል።",
      body_en: `Selihom has officially opened registration for its signature Love Feasts (የፍቅር ድግስ) calendar.

Through this unique program, sponsors coordinate with Selihom to prepare celebratory lunches or dinners for over 100 residents, sharing fellowship and dignity across the table.

Registration is now available online through the Events Pledge section.`,
      body_am: `ሰሊሆም ለተከታታይ የፍቅር ድግስ መርሃ ግብሮች ምዝገባውን በይፋ ከፍቷል።

በዚህ መርሃ ግብር ደጋፊዎች ከሰሊሆም ጋር በመተባበር ለተረጂዎች የበዓል ምሳ ወይም እራት በማዘጋጀት ፍቅርንና ደስታን ያካፍላሉ።`,
      category: "Events",
      cover_image: "/uploads/img-medical-outreach.jpg",
      image_paths: JSON.stringify(["/uploads/img-medical-outreach.jpg"]),
      author: "Event Coordinator",
      published_at: new Date(Date.now() - 86400000 * 5),
      is_published: 1,
    },
    {
      id: "news-004",
      slug: "draft-vocational-workshop-initiative",
      title_en: "Draft: Vocational Skills Workshop Plan for Recovered Residents",
      title_am: "ረቂቅ፡ ያገገሙ ወገኖችን በሙያ ለማብቃት የተዘጋጀ እቅድ",
      excerpt_en: "Internal draft detailing vocational carpentry, tailoring, and urban gardening programs.",
      excerpt_am: "ለማገገም በደረሱ ወገኖች የዕደ ጥበብ፣ የልብስ ስፌት እና የጓሮ አትክልት ስልጠና ለመስጠት የተዘጋጀ ውስጣዊ እቅድ።",
      body_en: `This document outlines the proposed 2026-2027 vocational rehabilitation initiative at Selihom.`,
      body_am: `ይህ ሰነድ ለ2026-2027 የሙያ ማገገሚያ ስልጠና እቅድን ያቀርባል።`,
      category: "Announcements",
      cover_image: "/uploads/img-charity-owner.jpg",
      image_paths: JSON.stringify(["/uploads/img-charity-owner.jpg"]),
      author: "Program Lead",
      published_at: new Date(),
      is_published: 0, // DRAFT to verify admin view
    }
  ];

  for (const a of articles) {
    await pool.execute(`
      INSERT INTO news
        (id,slug,title_en,title_am,excerpt_en,excerpt_am,body_en,body_am,category,cover_image,image_paths,author,published_at,is_published)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        title_en=VALUES(title_en),title_am=VALUES(title_am),excerpt_en=VALUES(excerpt_en),excerpt_am=VALUES(excerpt_am),
        body_en=VALUES(body_en),body_am=VALUES(body_am),category=VALUES(category),cover_image=VALUES(cover_image),
        image_paths=VALUES(image_paths),author=VALUES(author),published_at=VALUES(published_at),is_published=VALUES(is_published)
    `, [a.id, a.slug, a.title_en, a.title_am, a.excerpt_en, a.excerpt_am, a.body_en, a.body_am, a.category, a.cover_image, a.image_paths, a.author, a.published_at, a.is_published]);
  }
  console.log("  ✓ Seeded 4 news articles (3 published, 1 draft)");

  // 2. Seed Volunteer Applications
  const volunteers = [
    {
      id: "vol-001",
      full_name: "Dr. Aster Bekele",
      email: "dr.aster@gmail.com",
      phone: "+251911405060",
      interest_area: "medical",
      availability: "weekends",
      experience: "Consultant Psychiatrist with 8 years hospital experience",
      status: "accepted",
      category_id: "vol-cat-medical",
      role_id: "vol-role-psych",
      role_name: "Volunteer Psychiatrist",
      submitted_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "vol-002",
      full_name: "Yohannes Tadesse",
      email: "yohannes.t@outlook.com",
      phone: "+251922556677",
      interest_area: "kitchen",
      availability: "weekdays",
      experience: "Experienced in commercial food prep and meal distribution",
      status: "reviewed",
      category_id: "vol-cat-support",
      role_id: "vol-role-kitchen",
      role_name: "Kitchen & Nutrition Assistant",
      submitted_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: "vol-003",
      full_name: "Bethlehem Haile",
      email: "bethy.haile@yahoo.com",
      phone: "+251933778899",
      interest_area: "general",
      availability: "flexible",
      experience: "Passionate community volunteer, eager to help in any area",
      status: "new",
      category_id: "vol-cat-support",
      role_id: "vol-role-general",
      role_name: "General Community Support",
      submitted_at: new Date().toISOString(),
    }
  ];

  for (const v of volunteers) {
    await pool.execute(`
      INSERT INTO volunteers
        (id,full_name,email,phone,interest_area,availability,experience,status,category_id,role_id,role_name,submitted_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE status=VALUES(status)
    `, [v.id, v.full_name, v.email, v.phone, v.interest_area, v.availability, v.experience, v.status, v.category_id, v.role_id, v.role_name, v.submitted_at]);
  }
  console.log("  ✓ Seeded 3 volunteer applications (new, reviewed, accepted)");

  // 3. Seed Medicine Pledges
  const [medRows] = await pool.query("SELECT * FROM medicine_items LIMIT 2");
  if (medRows.length > 0) {
    const medPledgeId = "med-plg-001";
    await pool.execute(`
      INSERT INTO medicine_pledges (id, donor_name, donor_phone, donor_email, date, status, notes)
      VALUES (?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE status=VALUES(status)
    `, [medPledgeId, "Mekelle Pharma Suppliers", "+251911998877", "pharma@mekelle.et", new Date().toISOString().split("T")[0], "received", "Monthly donation of psychiatric medication"]);
    await pool.execute("DELETE FROM medicine_pledge_items WHERE pledge_id=?", [medPledgeId]);
    await pool.execute(`
      INSERT INTO medicine_pledge_items (pledge_id, medicine_id, medicine_name, quantity)
      VALUES (?,?,?,?)
    `, [medPledgeId, medRows[0].id, medRows[0].name, 20]);
    console.log("  ✓ Seeded medicine pledge with items");
  }

  // 4. Seed Supplies Pledges
  const [supCats] = await pool.query("SELECT * FROM supply_categories LIMIT 1");
  if (supCats.length > 0) {
    const supPledgeId = "sup-plg-001";
    await pool.execute(`
      INSERT INTO supplies_pledges (id, donor_name, donor_phone, donor_email, category_id, date, status, notes)
      VALUES (?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE status=VALUES(status)
    `, [supPledgeId, "Addis Cleaners Association", "+251944112233", "cleaners@addis.com", supCats[0].id, new Date().toISOString().split("T")[0], "pledged", "Hygiene supply bundle for patient dorms"]);
    await pool.execute("DELETE FROM supplies_pledge_items WHERE pledge_id=?", [supPledgeId]);
    await pool.execute(`
      INSERT INTO supplies_pledge_items (pledge_id, item_id, item_name, quantity, custom)
      VALUES (?,?,?,?,?)
    `, [supPledgeId, "soap-001", "Dorm Hygiene Pack", 30, "Extra sanitizer included"]);
    console.log("  ✓ Seeded supplies pledge with items");
  }

  // 5. Seed Event Celebration Pledges
  const eventPledges = [
    {
      id: "evt-plg-001",
      name: "Tewodros & Hanna Kassahun",
      phone: "+251911334455",
      email: "tewodros.k@gmail.com",
      event_type: "wedding",
      custom_type: "",
      preferred_date: new Date(Date.now() + 86400000 * 20).toISOString().split("T")[0],
      message: "We would like to share our 5th wedding anniversary feast with all 100+ residents at Selihom.",
      status: "confirmed",
      submitted_at: new Date().toISOString(),
    },
    {
      id: "evt-plg-002",
      name: "Selamawit Girma",
      phone: "+251922889900",
      email: "selam.girma@yahoo.com",
      event_type: "birthday",
      custom_type: "",
      preferred_date: new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
      message: "Honoring my mother's birthday by sponsoring holiday lunch and desserts.",
      status: "pending",
      submitted_at: new Date().toISOString(),
    }
  ];

  for (const ep of eventPledges) {
    await pool.execute(`
      INSERT INTO event_pledges (id,name,phone,email,event_type,custom_type,preferred_date,message,status,submitted_at)
      VALUES (?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE status=VALUES(status)
    `, [ep.id, ep.name, ep.phone, ep.email, ep.event_type, ep.custom_type, ep.preferred_date, ep.message, ep.status, ep.submitted_at]);
  }
  console.log("  ✓ Seeded 2 event celebration pledges (confirmed & pending)");

  console.log("\nDatabase seeded successfully with rich, realistic data!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
