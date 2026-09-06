import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";

async function req(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) };
  } catch {
    return { ok: res.ok, status: res.status, data: text };
  }
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("STARTING FULL END-TO-END FUNCTIONALITY VERIFICATION");
  console.log("=======================================================\n");

  const timestamp = Date.now();

  // 1. HEALTH CHECK
  console.log("--- 1. Testing System & Database Health ---");
  const health = await req("/api/health");
  assert(health.ok && health.data.status === "ok", "API /api/health returned ok with MySQL");

  // 2. AVAILABILITY SLOTS (ADMIN & USER)
  console.log("\n--- 2. Testing Availability Slots (Admin & User) ---");
  const slotDate = new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0];
  const newSlot = {
    date: slotDate,
    startTime: "09:00",
    endTime: "11:00",
    label: `Test Morning Slot ${timestamp}`,
    maxBookings: 5,
    isActive: true,
  };
  const createSlotRes = await req("/api/availability_slots", "POST", newSlot);
  assert(createSlotRes.ok, "Admin created availability slot");
  const createdSlot = createSlotRes.data.find(s => s.date === slotDate && s.label === newSlot.label);
  assert(createdSlot && createdSlot.id, `Slot created with ID: ${createdSlot?.id}`);

  // User queries available slots
  const userSlotsRes = await req("/api/availability_slots/available");
  assert(userSlotsRes.ok, "User can query available slots");
  const userSeesSlot = userSlotsRes.data.some(s => s.id === createdSlot.id);
  assert(userSeesSlot, "Created slot appears in user-facing available slots list");

  // 3. BOOKINGS (USER BOOKING & ADMIN MANAGEMENT)
  console.log("\n--- 3. Testing Visit Bookings (User Booking & Admin Management) ---");
  const newBooking = {
    name: `E2E Test Visitor ${timestamp}`,
    email: `visitor_${timestamp}@example.com`,
    phone: "+251911223344",
    date: slotDate,
    timeSlot: "09:00 - 11:00",
    visitType: "individual",
    visitorCount: 2,
    notes: "E2E testing visit booking functionality",
    slotId: createdSlot.id,
  };
  const bookRes = await req("/api/bookings", "POST", newBooking);
  assert(bookRes.ok, "User successfully submitted booking");
  const foundInList = Array.isArray(bookRes.data) ? bookRes.data.find(b => b.name === newBooking.name) : bookRes.data;
  assert(foundInList && foundInList.id, "Booking registered and returned in bookings list");
  const bookingId = foundInList.id;

  // Admin verifies booking shows up in admin bookings list
  const adminBookings = await req("/api/bookings");
  assert(adminBookings.ok, "Admin fetched all bookings");
  const foundBooking = adminBookings.data.find(b => b.id === bookingId);
  assert(foundBooking !== undefined, "User booking is visible in Admin bookings list");
  assert(foundBooking.status === "pending", "New booking has default status 'pending'");

  // Admin updates booking status to 'approved'
  const updateBookingStatus = await req(`/api/bookings/${encodeURIComponent(bookingId)}/status`, "PUT", { status: "approved" });
  assert(updateBookingStatus.ok, "Admin updated booking status to 'approved'");
  const updatedB = updateBookingStatus.data.find(b => b.id === bookingId);
  assert(updatedB && updatedB.status === "approved", "Booking status confirmed as 'approved'");

  // Clean up booking & slot
  await req(`/api/bookings/${encodeURIComponent(bookingId)}`, "DELETE");
  await req(`/api/availability_slots/${encodeURIComponent(createdSlot.id)}`, "DELETE");
  console.log("  ✓ Cleaned up test booking and slot");

  // 4. IN-KIND NEEDS & PLEDGES
  console.log("\n--- 4. Testing In-Kind Needs & Pledges (Admin & User) ---");
  const inKindNeed = {
    name: { en: `Cooking Oil ${timestamp}`, am: `የምግብ ዘይት ${timestamp}` },
    category: "Food",
    urgency: "High",
    monthlyTarget: 10,
    currentPledged: 2,
    unit: "liters",
    estimatedCostPerUnit: 250,
  };
  const createNeedRes = await req("/api/inkind_needs", "POST", inKindNeed);
  assert(createNeedRes.ok, "Admin created in-kind need item");
  const createdNeed = createNeedRes.data.find(n => n.name.en === inKindNeed.name.en);
  assert(createdNeed !== undefined, "In-kind need exists in database");

  // User submits in-kind pledge
  const inKindPledge = {
    donorName: `InKind Donor ${timestamp}`,
    donorPhone: "+251922334455",
    donorEmail: `inkind_${timestamp}@example.com`,
    type: "inkind",
    date: new Date().toISOString().split("T")[0],
    pledgedItems: [
      { itemId: createdNeed.id, name: createdNeed.name.en, quantity: 4 }
    ],
  };
  const pledgeRes = await req("/api/pledges", "POST", inKindPledge);
  assert(pledgeRes.ok, "User submitted in-kind pledge");
  const createdPledge = Array.isArray(pledgeRes.data)
    ? pledgeRes.data.find(p => p.donorName === inKindPledge.donorName)
    : pledgeRes.data;
  assert(createdPledge && createdPledge.id, "In-kind pledge confirmed in pledges list");
  const pledgeId = createdPledge.id;

  // Admin checks pledge
  const adminPledges = await req("/api/pledges");
  assert(adminPledges.ok, "Admin fetched in-kind pledges");
  const foundPledge = adminPledges.data.find(p => p.id === pledgeId);
  assert(foundPledge && foundPledge.donorName === inKindPledge.donorName, "Pledge appears in Admin pledges list with correct donor name");

  // Admin updates status to 'received'
  const updatePledgeStatus = await req(`/api/pledges/${encodeURIComponent(pledgeId)}/status`, "PUT", { status: "received" });
  assert(updatePledgeStatus.ok, "Admin updated pledge status to 'received'");

  // Clean up in-kind
  await req(`/api/pledges/${encodeURIComponent(pledgeId)}`, "DELETE");
  await req(`/api/inkind_needs/${encodeURIComponent(createdNeed.id)}`, "DELETE");
  console.log("  ✓ Cleaned up test in-kind pledge and need item");

  // 5. MEDICINE ITEMS & MEDICINE PLEDGES
  console.log("\n--- 5. Testing Medicine Items & Pledges (Admin & User) ---");
  const medItem = {
    name: `Test Medicine ${timestamp}`,
    monthlyQty: 50,
    unitPrice: 120,
    totalMonthly: 6000,
    patientsHelped: 25,
    urgency: "High",
    description: { en: "Critical daily medication", am: "አስፈላጊ ዕለታዊ መድሃኒት" },
  };
  const createMedRes = await req("/api/medicine_items", "POST", medItem);
  assert(createMedRes.ok, "Admin added medicine item");
  const createdMed = createMedRes.data.find(m => m.name === medItem.name);
  assert(createdMed !== undefined, "Medicine item verified in database");

  // User views medicine items
  const userMeds = await req("/api/medicine_items");
  assert(userMeds.ok && userMeds.data.some(m => m.id === createdMed.id), "User can see newly added medicine item");

  // User submits medicine pledge
  const medPledge = {
    donorName: `Pharma Donor ${timestamp}`,
    donorPhone: "+251933445566",
    donorEmail: `pharma_${timestamp}@example.com`,
    items: [{ medicineId: createdMed.id, medicineName: createdMed.name, quantity: 10 }],
    date: new Date().toISOString().split("T")[0],
    notes: "Medicine pledge test",
  };
  const medPledgeRes = await req("/api/medicine_pledges", "POST", medPledge);
  assert(medPledgeRes.ok, "User submitted medicine pledge");
  const createdMedPledge = Array.isArray(medPledgeRes.data)
    ? medPledgeRes.data.find(p => p.donorName === medPledge.donorName)
    : medPledgeRes.data;
  assert(createdMedPledge && createdMedPledge.id, "Medicine pledge created");
  const medPledgeId = createdMedPledge.id;

  // Admin views medicine pledges
  const adminMedPledges = await req("/api/medicine_pledges");
  assert(adminMedPledges.ok, "Admin fetched medicine pledges");
  const foundMedPledge = adminMedPledges.data.find(p => p.id === medPledgeId);
  assert(foundMedPledge && foundMedPledge.donorName === medPledge.donorName, "Medicine pledge appears in Admin medicine pledges tab");

  // Admin updates medicine pledge status
  const updateMedPledgeRes = await req(`/api/medicine_pledges/${encodeURIComponent(medPledgeId)}/status`, "PUT", { status: "received" });
  assert(updateMedPledgeRes.ok, "Admin updated medicine pledge status to 'received'");

  // Clean up medicine
  await req(`/api/medicine_pledges/${encodeURIComponent(medPledgeId)}`, "DELETE");
  await req(`/api/medicine_items/${encodeURIComponent(createdMed.id)}`, "DELETE");
  console.log("  ✓ Cleaned up test medicine item and pledge");

  // 6. SUPPLY CATEGORIES & SUPPLIES PLEDGES
  console.log("\n--- 6. Testing Supply Categories, Items & Pledges ---");
  const supplyCat = {
    name: { en: `Sanitation Supplies ${timestamp}`, am: `የንጽህና ዕቃዎች ${timestamp}` },
    icon: "Package",
    color: "bg-brand-sky-400",
    items: [
      {
        name: { en: "Soap Bar", am: "ሳሙና" },
        neededQty: { en: "100 bars", am: "100 ሳሙናዎች" },
        urgency: "Medium",
        impactDesc: { en: "Daily hygiene", am: "ለዕለታዊ ንጽህና" },
      }
    ],
  };
  const createSupCatRes = await req("/api/supply_categories", "POST", supplyCat);
  assert(createSupCatRes.ok, "Admin created supply category with items");
  const createdSupCat = createSupCatRes.data.find(c => c.name.en === supplyCat.name.en);
  assert(createdSupCat && createdSupCat.items.length > 0, "Supply category and items verified in database");

  // User submits supplies pledge
  const supPledge = {
    donorName: `Supplies Donor ${timestamp}`,
    donorPhone: "+251944556677",
    donorEmail: `supplies_${timestamp}@example.com`,
    categoryId: createdSupCat.id,
    date: new Date().toISOString().split("T")[0],
    items: [
      { itemId: createdSupCat.items[0].id, itemName: createdSupCat.items[0].name.en, quantity: 20, custom: "" }
    ],
    notes: "Donating 20 bars of soap",
  };
  const supPledgeRes = await req("/api/supplies_pledges", "POST", supPledge);
  assert(supPledgeRes.ok, "User submitted supplies pledge");
  const createdSupPledge = Array.isArray(supPledgeRes.data)
    ? supPledgeRes.data.find(p => p.donorName === supPledge.donorName)
    : supPledgeRes.data;
  assert(createdSupPledge && createdSupPledge.id, "Supplies pledge created");
  const supPledgeId = createdSupPledge.id;

  // Admin views supplies pledges
  const adminSupPledges = await req("/api/supplies_pledges");
  assert(adminSupPledges.ok, "Admin fetched supplies pledges");
  const foundSupPledge = adminSupPledges.data.find(p => p.id === supPledgeId);
  assert(foundSupPledge && foundSupPledge.donorName === supPledge.donorName, "Supplies pledge appears in Admin supplies tab");

  // Admin updates status
  const updateSupPledgeRes = await req(`/api/supplies_pledges/${encodeURIComponent(supPledgeId)}/status`, "PUT", { status: "received" });
  assert(updateSupPledgeRes.ok, "Admin updated supplies pledge status to 'received'");

  // Clean up supplies
  await req(`/api/supplies_pledges/${encodeURIComponent(supPledgeId)}`, "DELETE");
  await req(`/api/supply_categories/${encodeURIComponent(createdSupCat.id)}`, "DELETE");
  console.log("  ✓ Cleaned up test supplies category and pledge");

  // 7. VOLUNTEER ROLES & APPLICATIONS
  console.log("\n--- 7. Testing Volunteer Roles & Applications ---");
  const volCategory = {
    name: { en: `Healthcare Volunteers ${timestamp}`, am: `የጤና በጎፈቃደኞች ${timestamp}` },
    icon: "Heart",
    color: "bg-brand-sky-400",
    roles: [
      {
        name: { en: "Nurse / Caregiver", am: "ነርስ / ተንከባካቢ" },
        description: { en: "Assisting patients with basic care", am: "ህሙማንን መንከባከብ" },
      }
    ],
  };
  const createVolCatRes = await req("/api/volunteer_roles", "POST", volCategory);
  assert(createVolCatRes.ok, "Admin created volunteer category and role");
  const createdVolCat = createVolCatRes.data.find(c => c.name.en === volCategory.name.en);
  assert(createdVolCat && createdVolCat.roles.length > 0, "Volunteer category and roles verified in database");

  // User submits volunteer application
  const volApp = {
    fullName: `Volunteer Applicant ${timestamp}`,
    email: `volunteer_${timestamp}@example.com`,
    phone: "+251955667788",
    interestArea: "medical",
    availability: "weekends",
    experience: "Certified nurse with 3 years experience",
    categoryId: createdVolCat.id,
    roleId: createdVolCat.roles[0].id,
    roleName: createdVolCat.roles[0].name.en,
  };
  const volAppRes = await req("/api/volunteers", "POST", volApp);
  assert(volAppRes.ok, "User submitted volunteer application");
  const createdVolApp = Array.isArray(volAppRes.data)
    ? volAppRes.data.find(v => v.fullName === volApp.fullName)
    : volAppRes.data;
  assert(createdVolApp && createdVolApp.id, "Volunteer application registered");
  const volAppId = createdVolApp.id;

  // Admin views volunteer applications
  const adminVolApps = await req("/api/volunteers");
  assert(adminVolApps.ok, "Admin fetched volunteer applications");
  const foundVolApp = adminVolApps.data.find(v => v.id === volAppId);
  assert(foundVolApp && foundVolApp.fullName === volApp.fullName, "Volunteer application appears in Admin volunteers list");

  // Admin updates status to 'accepted'
  const updateVolAppRes = await req(`/api/volunteers/${encodeURIComponent(volAppId)}/status`, "PUT", { status: "accepted" });
  assert(updateVolAppRes.ok, "Admin updated volunteer status to 'accepted'");

  // Clean up volunteers
  await req(`/api/volunteers/${encodeURIComponent(volAppId)}`, "DELETE");
  await req(`/api/volunteer_roles/${encodeURIComponent(createdVolCat.id)}`, "DELETE");
  console.log("  ✓ Cleaned up test volunteer role and application");

  // 8. EVENT CELEBRATION PLEDGES
  console.log("\n--- 8. Testing Event Celebration Pledges (Love Feasts) ---");
  const eventPledge = {
    name: `Celebrant ${timestamp}`,
    phone: "+251966778899",
    email: `celebrant_${timestamp}@example.com`,
    eventType: "birthday",
    customType: "",
    preferredDate: new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0],
    message: "Celebrating my 30th birthday by sharing a feast with the residents",
  };
  const eventPledgeRes = await req("/api/event_pledges", "POST", eventPledge);
  assert(eventPledgeRes.ok, "User submitted event celebration pledge");
  const createdEvtPledge = Array.isArray(eventPledgeRes.data)
    ? eventPledgeRes.data.find(e => e.name === eventPledge.name)
    : eventPledgeRes.data;
  assert(createdEvtPledge && createdEvtPledge.id, "Event pledge registered");
  const eventPledgeId = createdEvtPledge.id;

  // Admin views event pledges
  const adminEventPledges = await req("/api/event_pledges");
  assert(adminEventPledges.ok, "Admin fetched event pledges");
  const foundEventPledge = adminEventPledges.data.find(e => e.id === eventPledgeId);
  assert(foundEventPledge && foundEventPledge.name === eventPledge.name, "Event pledge appears in Admin events tab");

  // Admin updates status to 'confirmed'
  const updateEventStatusRes = await req(`/api/event_pledges/${encodeURIComponent(eventPledgeId)}/status`, "PUT", { status: "confirmed" });
  assert(updateEventStatusRes.ok, "Admin updated event pledge status to 'confirmed'");

  // Clean up event
  await req(`/api/event_pledges/${encodeURIComponent(eventPledgeId)}`, "DELETE");
  console.log("  ✓ Cleaned up test event pledge");

  // 9. IMAGE UPLOAD & NEWS ARTICLE CREATION / DRAFT / PUBLISH (ADMIN & USER)
  console.log("\n--- 9. Testing Image Upload, News Article Draft & Publish ---");
  // Upload test image via base64
  const sampleBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const uploadRes = await req("/api/upload", "POST", {
    filename: `e2e_photo_${timestamp}.png`,
    data: sampleBase64,
  });
  assert(uploadRes.ok, "Uploaded image successfully via /api/upload");
  assert(uploadRes.data.path && uploadRes.data.path.startsWith("/uploads/"), `Uploaded image path: ${uploadRes.data.path}`);
  const uploadedPath = uploadRes.data.path;

  // Verify file exists on local codebase disk in uploads directory
  const localDiskPath = path.join(process.cwd(), uploadedPath.replace(/^\//, ""));
  assert(fs.existsSync(localDiskPath), `Verified uploaded image file exists on disk: ${localDiskPath}`);

  // Create News Article as DRAFT first
  const articleData = {
    id: `news-e2e-${timestamp}`,
    slug: `test-news-e2e-${timestamp}`,
    title: {
      en: `Historic Milestone Reached at Selihom ${timestamp}`,
      am: `በሰሊሆም ታሪካዊ ምዕራፍ ተመዘገበ ${timestamp}`,
    },
    body: {
      en: `Selihom Rehabilitation Centre celebrated a major breakthrough today.\n\nThe community came together to support vital humanitarian work.`,
      am: `የሰሊሆም ማገገሚያ ማዕከል ዛሬ ትልቅ ስኬት አስመዝግቧል።\n\nህብረተሰቡ ድጋፍ አድርጓል።`,
    },
    category: "Community",
    imagePaths: [uploadedPath],
    coverImage: uploadedPath,
    author: "Chief Editor",
    publishedAt: new Date().toISOString(),
    isPublished: false, // DRAFT
  };

  const saveDraftRes = await req("/api/news", "POST", articleData);
  assert(saveDraftRes.ok, "Admin created news article as DRAFT");
  assert(Array.isArray(saveDraftRes.data.imagePaths) && saveDraftRes.data.imagePaths.includes(uploadedPath), "Draft article retains uploaded imagePaths in database");

  // Verify Draft does NOT appear on public news endpoint
  const publicNewsDraftCheck = await req("/api/news");
  assert(publicNewsDraftCheck.ok, "Fetched public news articles");
  const draftFoundPublic = publicNewsDraftCheck.data.some(a => a.id === articleData.id);
  assert(!draftFoundPublic, "Draft article is NOT visible to public users");

  // Verify Draft DOES appear in admin news list (?all=true)
  const adminNewsList = await req("/api/news?all=true");
  assert(adminNewsList.ok, "Admin fetched all articles including drafts");
  const draftFoundAdmin = adminNewsList.data.find(a => a.id === articleData.id);
  assert(draftFoundAdmin && draftFoundAdmin.isPublished === false, "Draft article is visible in Admin list with isPublished=false");
  assert(draftFoundAdmin.imagePaths && draftFoundAdmin.imagePaths.length > 0, "Admin news article displays attached image paths in table data");

  // Now Admin PUBLISHES the article
  const publishRes = await req(`/api/news/${encodeURIComponent(articleData.id)}/publish`, "PUT", { isPublished: true });
  assert(publishRes.ok, "Admin published the article");
  const publishedInAdmin = publishRes.data.find(a => a.id === articleData.id);
  assert(publishedInAdmin && publishedInAdmin.isPublished === true, "Article status updated to published");

  // Verify article now appears on public news list
  const publicNewsCheck = await req("/api/news");
  assert(publicNewsCheck.ok, "Fetched public news articles");
  const publishedPublic = publicNewsCheck.data.find(a => a.id === articleData.id);
  assert(publishedPublic !== undefined, "Published article is now visible on user-facing News page");
  assert(publishedPublic.title.en === articleData.title.en, "Published article displays correct English headline");
  assert(publishedPublic.title.am === articleData.title.am, "Published article displays correct Amharic headline");
  assert(publishedPublic.imagePaths.includes(uploadedPath), "Published article includes attached image paths on public frontend");

  // User fetches single article by slug
  const articleBySlugRes = await req(`/api/news/${encodeURIComponent(articleData.slug)}`);
  assert(articleBySlugRes.ok, "User successfully viewed single article by slug");
  assert(articleBySlugRes.data.id === articleData.id, "Single article endpoint returned exact matching article");

  // Clean up news article & test image
  await req(`/api/news/${encodeURIComponent(articleData.id)}`, "DELETE");
  if (fs.existsSync(localDiskPath)) fs.unlinkSync(localDiskPath);
  const publicDiskPath = path.join(process.cwd(), "public", uploadedPath.replace(/^\//, ""));
  if (fs.existsSync(publicDiskPath)) fs.unlinkSync(publicDiskPath);
  console.log("  ✓ Cleaned up test news article and uploaded image file");

  console.log("\n=======================================================");
  console.log("🎉 ALL TESTS PASSED! EVERY FUNCTIONALITY FULLY VERIFIED!");
  console.log("=======================================================\n");
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
