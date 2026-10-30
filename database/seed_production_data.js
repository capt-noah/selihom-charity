/**
 * database/seed_production_data.js
 *
 * Populates the Selihom MySQL database with authentic production data
 * directly provided by charity leadership in the official data collection form:
 * Selihom_Charity_Amharic_Data_Collection_Form11.docx (filled by Asaye Mebratu, 12/02/2019 E.C.)
 *
 * Usage:
 *   node database/seed_production_data.js
 */

import pool from "./db.js";

async function runSeed() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected to MySQL database. Beginning production data seed...\n");

    // ─────────────────────────────────────────────────────────────
    // 1. SITE SETTINGS
    // ─────────────────────────────────────────────────────────────
    console.log("1. Seeding site_settings (global)...");
    const phones = JSON.stringify(["+251911004903", "+251953905050", "0118195444", "0904440157"]);
    await conn.execute(`
      INSERT INTO site_settings (
        id, setting_key, org_name_en, org_name_am, motto_en, motto_am,
        phones, email, address_en, address_am,
        registration_number, registration_date, registration_agency_en, registration_agency_am,
        telegram_url, facebook_url, tiktok_url, youtube_url, instagram_url, linkedin_url
      ) VALUES (
        1, 'global',
        'Selihom Mentally Ill People Support Association',
        'ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር',
        'Kind hearts excel beautiful faces!',
        'ደግ ልቦች ከውብ ፊቶች ይበልጣሉ!',
        ?, 'selihomc@gmail.com',
        'Near Entoto St. Raguel & Elias Church, 300 meters down on the road towards Fetesha, Addis Ababa, Ethiopia',
        'ከእንጦጦ ቅዱስ ራጉኤል ወኤልያስ ቤተክርስቲያን ወደ ፍተሻ በሚወስደው መንገድ 300 ሜትር ዝቅ ብሎ፣ አዲስ አበባ',
        '1113/2019', '30/02/2011 ዓ.ም (Oct 30, 2018)',
        'Federal Democratic Republic of Ethiopia Agency for Civil Society Organizations',
        'የኢትዮጵያ ፌደራላዊ ዲሞክራሲያዊ ሪፐብሊክ የሲቪል ማህበረሰብ ድርጅቶች ኤጀንሲ',
        'https://t.me/Selihommentallyill',
        'https://facebook.com/SelihomSupport',
        'https://tiktok.com/@selihomcharity',
        'https://youtube.com/@selihomcharity',
        '', ''
      ) ON DUPLICATE KEY UPDATE
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
        youtube_url = VALUES(youtube_url)
    `, [phones]);
    console.log("   ✓ site_settings updated with official email 'selihomc@gmail.com' and Fetesha address");

    // ─────────────────────────────────────────────────────────────
    // 2. BANK ACCOUNTS (All 5 verified banks + Telebirr)
    // ─────────────────────────────────────────────────────────────
    console.log("2. Seeding bank_accounts...");
    const bankAccounts = [
      {
        id: "bank_cbe",
        nameEn: "Commercial Bank of Ethiopia (CBE)",
        nameAm: "የኢትዮጵያ ንግድ ባንክ",
        accNum: "1000275107518",
        accName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
        sort: 0
      },
      {
        id: "bank_abyssinia",
        nameEn: "Bank of Abyssinia",
        nameAm: "አቢሲንያ ባንክ",
        accNum: "77984852",
        accName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
        sort: 1
      },
      {
        id: "bank_awash",
        nameEn: "Awash Bank",
        nameAm: "አዋሽ ባንክ",
        accNum: "01303572131300",
        accName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
        sort: 2
      },
      {
        id: "bank_bunna",
        nameEn: "Bunna Bank",
        nameAm: "ቡና ባንክ",
        accNum: "2919601000145",
        accName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
        sort: 3
      },
      {
        id: "bank_sinqee",
        nameEn: "Sinquee Bank",
        nameAm: "ስንቄ ባንክ",
        accNum: "1106177681225",
        accName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
        sort: 4
      },
      {
        id: "bank_telebirr",
        nameEn: "Telebirr (Mobile Money)",
        nameAm: "ቴሌብር (ሞባይል ገንዘብ)",
        accNum: "0911004903",
        accName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር (ሚኪያስ ለገሰ)",
        sort: 5
      }
    ];

    // Wipe legacy/placeholder bank entries if any
    await conn.execute("DELETE FROM bank_accounts");
    for (const b of bankAccounts) {
      await conn.execute(`
        INSERT INTO bank_accounts (id, bank_name_en, bank_name_am, account_number, account_name, logo, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?, '', ?, 1)
      `, [b.id, b.nameEn, b.nameAm, b.accNum, b.accName, b.sort]);
    }
    console.log(`   ✓ ${bankAccounts.length} official bank accounts seeded`);

    // ─────────────────────────────────────────────────────────────
    // 3. MEDICINE ITEMS (48 Exact Real Medicines from the Form)
    // ─────────────────────────────────────────────────────────────
    console.log("3. Seeding medicine_items (48 real clinical items)...");
    const medicines = [
      { id: "med-01", name: "Olanzapine 5mg", qty: 1100, price: 8.50, total: 9350, patients: 45, urgency: "High", descEn: "Atypical antipsychotic for psychiatric mood stabilization and schizophrenia", descAm: "ለአእምሮ ስነ-ልቦና መረጋጋትና ስኪዞፈሪንያ ማከሚያ ሳይካትሪ መድሃኒት" },
      { id: "med-02", name: "Resperidone 4mg", qty: 3000, price: 12.00, total: 36000, patients: 65, urgency: "High", descEn: "Antipsychotic for psychiatric behavioral and cognitive recovery", descAm: "ለአእምሮ ጤናና ባህሪ ማረጋጊያ የሚሆን ከፍተኛ ሳይካትሪ መድሃኒት" },
      { id: "med-03", name: "Haloperidol 1.5mg", qty: 750, price: 4.00, total: 3000, patients: 30, urgency: "High", descEn: "Essential antipsychotic for acute psychosis and restlessness", descAm: "ለከፍተኛ አእምሮ ህመም እና መረበሽ ማረጋጊያ" },
      { id: "med-04", name: "Pregabaline 75mg", qty: 150, price: 15.00, total: 2250, patients: 15, urgency: "High", descEn: "Nerve pain stabilizer and severe psychiatric anxiety relief", descAm: "ለነርቭ ህመም እና ለአእምሮ ጭንቀት ማስታገሻ" },
      { id: "med-05", name: "Azithromycine 500mg", qty: 160, price: 22.00, total: 3520, patients: 25, urgency: "High", descEn: "Broad spectrum antibiotic for respiratory and bacterial infections", descAm: "ለባክቴሪያና ሳንባ ኢንፌክሽን ማከሚያ አንቲባዮቲክ" },
      { id: "med-06", name: "Omeprazol 20mg", qty: 30, price: 5.00, total: 150, patients: 10, urgency: "High", descEn: "Gastric acid reflux and stomach ulcer treatment", descAm: "ለጨጓራ ህመም እና አሲድ ማስታገሻ" },
      { id: "med-07", name: "Amlodipine 10mg", qty: 120, price: 6.00, total: 720, patients: 20, urgency: "High", descEn: "Hypertension and high blood pressure regulation for residents", descAm: "ለደም ግፊት መቆጣጠሪያ የሚሆን መድሃኒት" },
      { id: "med-08", name: "Amoxacilline 250mg (syrup)", qty: 8, price: 85.00, total: 680, patients: 8, urgency: "High", descEn: "Pediatric antibiotic oral suspension for infections", descAm: "ለህጻናት ኢንፌክሽን ማከሚያ አንቲባዮቲክ ሽሮፕ" },
      { id: "med-09", name: "Albendazol 400mg", qty: 40, price: 10.00, total: 400, patients: 40, urgency: "High", descEn: "Anti-parasitic deworming treatment for residents", descAm: "ለሆድ ውስጥ ጥገኛ ትላትሎች ማከሚያ" },
      { id: "med-10", name: "Amoxacilline 125mg (syrup)", qty: 4, price: 75.00, total: 300, patients: 4, urgency: "High", descEn: "Pediatric antibiotic syrup for young children", descAm: "ለህጻናት ህመም ማከሚያ አንቲባዮቲክ ፈሳሽ" },
      { id: "med-11", name: "Cotrimoxazole 240mg (syrup)", qty: 6, price: 80.00, total: 480, patients: 6, urgency: "High", descEn: "Antibacterial pediatric oral suspension", descAm: "ለህጻናት የባክቴሪያ ህመም ማከሚያ ሽሮፕ" },
      { id: "med-12", name: "Paracetamol suppository 250mg", qty: 20, price: 25.00, total: 500, patients: 10, urgency: "High", descEn: "Fever and acute pain relief for bedridden patients", descAm: "ለአልጋ ቁራኛ ህሙማን ትኩሳትና ህመም ማስታገሻ" },
      { id: "med-13", name: "Sodium valproate 200mg", qty: 3500, price: 8.00, total: 28000, patients: 70, urgency: "High", descEn: "Essential mood stabilizer and anticonvulsant for bipolar disorder and epilepsy", descAm: "ለአእምሮ መረበሽና ለሚጥል ህመም መከላከያ ዋና መድሃኒት" },
      { id: "med-14", name: "Pantoprazole 20mg", qty: 100, price: 7.00, total: 700, patients: 20, urgency: "High", descEn: "Treatment for severe gastritis and stomach irritation", descAm: "ለከባድ የጨጓራ ህመም ማስታገሻና መከላከያ" },
      { id: "med-15", name: "Adhesive plaster (large)", qty: 6, price: 350.00, total: 2100, patients: 60, urgency: "High", descEn: "Surgical adhesive plaster for street rescue wound dressing", descAm: "ለቁስል ማሰሪያና ማከሚያ የሚሆን ትልቅ ፕላስተር" },
      { id: "med-16", name: "Denatured alcohol 70% (1 L)", qty: 6, price: 220.00, total: 1320, patients: 200, urgency: "High", descEn: "Medical sterilization and wound disinfection alcohol", descAm: "ለህክምና ክፍል ንጽህናና ቁስል ማከሚያ አልኮል" },
      { id: "med-17", name: "Multi vitamin po", qty: 40, price: 180.00, total: 7200, patients: 120, urgency: "High", descEn: "Daily vitamin recovery for malnourished street beneficiaries", descAm: "ለተጎሳቆሉ ህሙማን የሰውነት አቅም ማጎልበቻ ቫይታሚን" },
      { id: "med-18", name: "Ketoconazole cream", qty: 10, price: 95.00, total: 950, patients: 25, urgency: "High", descEn: "Antifungal topical cream for street dermatitis and skin rashes", descAm: "ለቆዳ ህመም፣ ፈንገስና እከክ ማከሚያ ቅባት" },
      { id: "med-19", name: "Diazepam 10mg injection PRN", qty: 30, price: 45.00, total: 1350, patients: 15, urgency: "High", descEn: "Emergency sedative injection for severe acute agitation and seizures", descAm: "ለድንገተኛ አእምሮ መረበሽና የሚጥል በሽታ ማስታገሻ መርፌ" },
      { id: "med-20", name: "Haloperidol 5mg injection PRN", qty: 500, price: 40.00, total: 20000, patients: 80, urgency: "High", descEn: "Emergency psychiatric sedative for violent street rescue cases", descAm: "ለከፍተኛ አእምሮ ህመም እና መረበሽ ድንገተኛ መርፌ" },
      { id: "med-21", name: "Clonazepam 2mg", qty: 30, price: 18.00, total: 540, patients: 10, urgency: "High", descEn: "Anticonvulsant and severe panic/anxiety treatment", descAm: "ለከፍተኛ ጭንቀትና የሚጥል በሽታ መከላከያ" },
      { id: "med-22", name: "Lorazepam 1mg", qty: 15, price: 16.00, total: 240, patients: 8, urgency: "High", descEn: "Fast-acting calming sedative for restless psychiatric patients", descAm: "ለተረበሹ ህሙማን ፈጣን ማረጋጊያ መድሃኒት" },
      { id: "med-23", name: "Multivitamin syrup", qty: 4, price: 120.00, total: 480, patients: 15, urgency: "High", descEn: "Nutritional liquid vitamins for recovering children and seniors", descAm: "ለህጻናትና አረጋውያን የቫይታሚን ፈሳሽ" },
      { id: "med-24", name: "Vitamin B complex injection", qty: 10, price: 65.00, total: 650, patients: 10, urgency: "High", descEn: "Nerve recovery injection for alcohol-induced and malnutrition trauma", descAm: "ለነርቭ መዳከምና አቅም ማነስ የሚሰጥ መርፌ" },
      { id: "med-25", name: "Risperidone 2mg po", qty: 1500, price: 9.00, total: 13500, patients: 50, urgency: "High", descEn: "Maintenance psychiatric medication for cognitive clarity", descAm: "የአእምሮ ጤናን ወደ ነበረበት ለመመለስ የሚሰጥ ሳይካትሪ መድሃኒት" },
      { id: "med-26", name: "CalciDenk 1000mg/800IU PO", qty: 20, price: 320.00, total: 6400, patients: 30, urgency: "High", descEn: "Calcium and Vitamin D3 bone support for vulnerable seniors", descAm: "ለአረጋውያን የአጥንት ጥንካሬ ካልሲየምና ቫይታሚን ዲ" },
      { id: "med-27", name: "Sodium valproate 500mg", qty: 2100, price: 14.00, total: 29400, patients: 55, urgency: "High", descEn: "High-dose mood stabilizer for severe bipolar disorder", descAm: "ለከፍተኛ የአእምሮ መረበሽና ንዴት መቆጣጠሪያ" },
      { id: "med-28", name: "Amoxacilline 500mg", qty: 800, price: 7.00, total: 5600, patients: 60, urgency: "High", descEn: "Everyday antibacterial medication for general clinical care", descAm: "ለተለያዩ የባክቴሪያ ህመሞች የሚሆን አንቲባዮቲክ" },
      { id: "med-29", name: "Amlodipine 5mg po", qty: 100, price: 5.00, total: 500, patients: 20, urgency: "High", descEn: "Cardiovascular blood pressure regulation for shelter residents", descAm: "የደም ግፊት መቆጣጠሪያ መድሃኒት" },
      { id: "med-30", name: "Fluoxetine 20mg po", qty: 500, price: 8.00, total: 4000, patients: 35, urgency: "High", descEn: "Antidepressant for severe clinical trauma and depressive disorders", descAm: "ለከፍተኛ ድብርትና የአእምሮ ጭንቀት ማከሚያ" },
      { id: "med-31", name: "Sertraline 50mg po", qty: 20, price: 24.00, total: 480, patients: 10, urgency: "High", descEn: "Targeted psychiatric antidepressant for obsessive anxiety", descAm: "ለአእምሮ ጭንቀትና ድብርት ማከሚያ" },
      { id: "med-32", name: "Chlorpromazine 100mg po", qty: 600, price: 6.00, total: 3600, patients: 30, urgency: "High", descEn: "Sedative antipsychotic for severe psychosis and sleeplessness", descAm: "ለአእምሮ እረፍት ማጣትና እንቅልፍ ማጣት ማከሚያ" },
      { id: "med-33", name: "Co-amoxacilline 625mg po", qty: 50, price: 25.00, total: 1250, patients: 15, urgency: "High", descEn: "Augmented antibiotic for resistant infections", descAm: "ለከባድ ኢንፌክሽኖች የሚሰጥ ጠንካራ አንቲባዮቲክ" },
      { id: "med-34", name: "Metronidazole 500mg po", qty: 30, price: 4.50, total: 135, patients: 10, urgency: "High", descEn: "Treatment for waterborne parasitic infections and diarrhea", descAm: "ለሆድ ቁርጠትና አሜባ ማከሚያ" },
      { id: "med-35", name: "Fluphenazine 25ml injection", qty: 20, price: 180.00, total: 3600, patients: 20, urgency: "High", descEn: "Long-acting depot injection for long-term psychiatric adherence", descAm: "ለረጅም ጊዜ የአእምሮ ህመም መረጋጊያ መርፌ" },
      { id: "med-36", name: "Phenobarbitone 100mg po", qty: 120, price: 4.00, total: 480, patients: 15, urgency: "High", descEn: "Antiepileptic medication for regular seizure prevention", descAm: "የሚጥል በሽታ ድንገተኛ ጥቃትን መከላከያ" },
      { id: "med-37", name: "Phenobarbitone 30mg po", qty: 250, price: 3.00, total: 750, patients: 20, urgency: "High", descEn: "Low-dose antiepileptic control for vulnerable residents", descAm: "ለሚጥል በሽታ መቆጣጠሪያ አነስተኛ መጠን ክኒን" },
      { id: "med-38", name: "Phenytoin 100mg po", qty: 240, price: 5.00, total: 1200, patients: 20, urgency: "High", descEn: "Anticonvulsant for recurrent seizure episodes", descAm: "ለሚጥል ህመም መከላከያ መድሃኒት" },
      { id: "med-39", name: "Phenytoin 50mg po", qty: 1000, price: 3.50, total: 3500, patients: 40, urgency: "High", descEn: "Maintenance anticonvulsant for neurological stability", descAm: "ለነርቭና የሚጥል በሽታ መረጋጊያ መድሃኒት" },
      { id: "med-40", name: "Gabapentine 300mg po", qty: 50, price: 12.00, total: 600, patients: 12, urgency: "High", descEn: "Neuropathic pain modulator and psychiatric anxiety adjunct", descAm: "ለነርቭ ህመም እና ስነ-ልቦና መረበሽ ማስታገሻ" },
      { id: "med-41", name: "Meloxicam 15mg & Fusidic cream", qty: 50, price: 70.00, total: 3500, patients: 25, urgency: "High", descEn: "Anti-inflammatory pain relief and antibacterial skin infection cream", descAm: "ለህመም ማስታገሻና ለቆዳ ቁስል ማከሚያ ቅባት" },
      { id: "med-42", name: "Enalapril 5mg po", qty: 20, price: 5.00, total: 100, patients: 10, urgency: "High", descEn: "Cardiovascular ACE inhibitor for heart and kidney health", descAm: "ለልብና ደም ግፊት ጤና መጠበቂያ" },
      { id: "med-43", name: "Glucose 40%", qty: 20, price: 45.00, total: 900, patients: 20, urgency: "High", descEn: "Emergency treatment for acute hypoglycemia and collapse", descAm: "ለድንገተኛ የስኳር መጠን ማነስ ማከሚያ ግሉኮስ" },
      { id: "med-44", name: "Cloxacillin 500mg", qty: 100, price: 7.50, total: 750, patients: 20, urgency: "High", descEn: "Antibiotic for skin, wound, and soft tissue infections", descAm: "ለቆዳና ቁስል ኢንፌክሽን ማከሚያ አንቲባዮቲክ" },
      { id: "med-45", name: "Norfloxacin 400mg", qty: 100, price: 8.00, total: 800, patients: 20, urgency: "High", descEn: "Urinary tract and gastrointestinal infection antibiotic", descAm: "ለሽንት ቧንቧና ሆድ ኢንፌክሽን ማከሚያ" },
      { id: "med-46", name: "Ibuprofen 400mg PRN", qty: 100, price: 4.00, total: 400, patients: 30, urgency: "High", descEn: "Pain relief and fever reduction for daily medical dispensary", descAm: "ለራስ ምታት፣ ህመም እና ትኩሳት ማስታገሻ" },
      { id: "med-47", name: "Paracetamol 500mg", qty: 100, price: 3.00, total: 300, patients: 35, urgency: "High", descEn: "Essential first-line painkiller and fever reducer", descAm: "ለህመም እና ትኩሳት የመጀመሪያ ህክምና ክኒን" },
      { id: "med-48", name: "Ciprofloxaciline & Dexa eye drop", qty: 120, price: 85.00, total: 10200, patients: 60, urgency: "High", descEn: "Ophthalmic antibacterial and anti-inflammatory eye treatment", descAm: "ለአይን ኢንፌክሽን፣ መቅላትና ማሳከክ ማከሚያ ጠብታ" }
    ];

    await conn.execute("DELETE FROM medicine_items");
    for (const m of medicines) {
      await conn.execute(`
        INSERT INTO medicine_items
          (id, name, monthly_qty, unit_price, total_monthly, patients_helped, urgency, description_en, description_am)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [m.id, m.name, m.qty, m.price, m.total, m.patients, m.urgency, m.descEn, m.descAm]);
    }
    console.log(`   ✓ ${medicines.length} real medicines and medical supplies seeded`);

    // ─────────────────────────────────────────────────────────────
    // 4. SUPPLY CATEGORIES & SUPPLY ITEMS (5 Distinct Subcategories)
    // ─────────────────────────────────────────────────────────────
    console.log("4. Seeding supply_categories and supply_items...");

    const supplyCats = [
      {
        id: "cat-food",
        nameEn: "Food & Nutrition",
        nameAm: "ምግብና ተመጣጣኝ ምግብ",
        icon: "UtensilsCrossed",
        color: "bg-brand-yellow-400",
        sort: 0,
        items: [
          { id: "sup-food-01", nameEn: "Teff Grain (Sacks)", nameAm: "ጤፍ (ኩንታል/ጆንያ)", qtyEn: "50 Quintals / month", qtyAm: "50 ኩንታል/ወር", urgency: "High", descEn: "Daily fresh injera baking for all 400+ residents and street intakes", descAm: "ለ400+ ተጠቃሚዎች ዕለታዊ ትኩስ እንጀራ ጋገራ የሚሆን" },
          { id: "sup-food-02", nameEn: "Cooking Oil (Jerrycans)", nameAm: "የምግብ ዘይት (ጄሪካን)", qtyEn: "25 Jerrycans (20L) / month", qtyAm: "25 ጄሪካን (20ሊ)/ወር", urgency: "High", descEn: "Daily stew and vegetable meal cooking in shelter central kitchen", descAm: "ለዕለታዊ ወጥና ምግብ ማዘጋጃ የሚውል የምግብ ዘይት" },
          { id: "sup-food-03", nameEn: "Red Lentils (Misir)", nameAm: "ምስር ክክ", qtyEn: "15 Quintals / month", qtyAm: "15 ኩንታል/ወር", urgency: "High", descEn: "Essential protein nutrition for daily lunch and dinner meals", descAm: "ለዕለታዊ ምሳና እራት ወጥ ዝግጅት ፕሮቲን ያለው ምስር" },
          { id: "sup-food-04", nameEn: "Split Peas (Ater Kik)", nameAm: "አተር ክክ", qtyEn: "15 Quintals / month", qtyAm: "15 ኩንታል/ወር", urgency: "High", descEn: "Nutritious split pea stew for daily resident nourishment", descAm: "ለዕለታዊ አልሚ ክክ ወጥ ዝግጅት" },
          { id: "sup-food-05", nameEn: "Berbere (Red Pepper Spice)", nameAm: "በርበሬ", qtyEn: "5 Quintals / month", qtyAm: "5 ኩንታል/ወር", urgency: "High", descEn: "Traditional Ethiopian meal preparation spice", descAm: "ለዕለታዊ ወጥ ማጣፈጫና ማዘጋጃ" },
          { id: "sup-food-06", nameEn: "Shiro Flour", nameAm: "ሽሮ", qtyEn: "10 Quintals / month", qtyAm: "10 ኩንታል/ወር", urgency: "High", descEn: "Daily staple vegetarian stew flour for all residents", descAm: "ለዕለታዊ የሽሮ ወጥ ዝግጅት ዋና ግብአት" },
          { id: "sup-food-07", nameEn: "Sugar", nameAm: "ስኳር", qtyEn: "10 Quintals / month", qtyAm: "10 ኩንታል/ወር", urgency: "High", descEn: "Warm morning and evening tea service for residents and elderly", descAm: "ለጧትና ማታ ሻይ አገልግሎት የሚውል" },
          { id: "sup-food-08", nameEn: "Table Salt", nameAm: "ጨው", qtyEn: "5 Bags / month", qtyAm: "5 ከረጢት/ወር", urgency: "High", descEn: "Essential kitchen seasoning for daily dining", descAm: "ለምግብ ማጣፈጫ" },
          { id: "sup-food-09", nameEn: "Nutritional Porridge Flour (Atmit)", nameAm: "የአጥሚት እህል", qtyEn: "10 Quintals / month", qtyAm: "10 ኩንታል/ወር", urgency: "High", descEn: "Nutrient-dense warm porridge for bedridden and frail beneficiaries", descAm: "ለተዳከሙና አልጋ ላይ ላሉ ህሙማን አልሚ አጥሚት" },
          { id: "sup-food-10", nameEn: "Beso Grain (Roasted Barley)", nameAm: "የበሶ እህል", qtyEn: "8 Quintals / month", qtyAm: "8 ኩንታል/ወር", urgency: "High", descEn: "High-energy traditional recovery drink for patients", descAm: "ለህሙማን ጉልበት የሚሰጥ ባህላዊ የበሶ እህል" },
          { id: "sup-food-11", nameEn: "Wheat Baking Flour (Firno)", nameAm: "ፍርኖ ዱቄት", qtyEn: "20 Quintals / month", qtyAm: "20 ኩንታል/ወር", urgency: "High", descEn: "Fresh bread baking for daily resident breakfast", descAm: "ለጧት ቁርስ ዳቦ መጋገሪያ የሚሆን" },
          { id: "sup-food-12", nameEn: "Pasta", nameAm: "ፓስታ", qtyEn: "30 Cartons / month", qtyAm: "30 ካርቶን/ወር", urgency: "High", descEn: "Nutritious meal variation for lunch and dinner", descAm: "ለምግብ ልዩነትና ለተመጣጠነ ምግብ" },
          { id: "sup-food-13", nameEn: "Rice", nameAm: "ሩዝ", qtyEn: "15 Quintals / month", qtyAm: "15 ኩንታል/ወር", urgency: "High", descEn: "Digestible warm meals for recovering residents", descAm: "ለቀላልና ተመጣጣኝ የምግብ ዝግጅት" },
          { id: "sup-food-14", nameEn: "Macaroni", nameAm: "መኮረኒ", qtyEn: "30 Cartons / month", qtyAm: "30 ካርቶን/ወር", urgency: "High", descEn: "Daily communal meal preparation", descAm: "ለዕለታዊ ምግብ ዝግጅት" },
          { id: "sup-food-15", nameEn: "Red Onions", nameAm: "ቀይ ሽንኩርት", qtyEn: "20 Quintals / month", qtyAm: "20 ኩንታል/ወር", urgency: "High", descEn: "Fresh vegetable stew base for shelter kitchens", descAm: "ለዕለታዊ ወጥ ዝግጅት መሰረታዊ ግብአት" },
          { id: "sup-food-16", nameEn: "Fresh Carrots", nameAm: "ካሮት", qtyEn: "10 Quintals / month", qtyAm: "10 ኩንታል/ወር", urgency: "High", descEn: "Vitamin-rich vegetable stew addition for immunity", descAm: "ለተመጣጣኝ አልሚ ምግብ" },
          { id: "sup-food-17", nameEn: "Green Peppers (Qariya)", nameAm: "ቃሪያ", qtyEn: "5 Sacks / month", qtyAm: "5 ከረጢት/ወር", urgency: "High", descEn: "Fresh kitchen ingredient for daily stews", descAm: "ለምግብ ዝግጅት ማጣፈጫ" },
          { id: "sup-food-18", nameEn: "Fresh Potatoes", nameAm: "ድንች", qtyEn: "25 Quintals / month", qtyAm: "25 ኩንታል/ወር", urgency: "High", descEn: "Staple hearty vegetable stew for resident meals", descAm: "ለዕለታዊ አልሚ ድንች ወጥ ዝግጅት" },
          { id: "sup-food-19", nameEn: "Fresh Fruit Crates", nameAm: "ፍራፍሬዎች", qtyEn: "20 Crates / month", qtyAm: "20 ሳጥን/ወር", urgency: "High", descEn: "Fresh fruit vitamins for 43 fragile senior and child intakes", descAm: "ለ43 ተጋላጭ ህጻናትና አረጋውያን የቫይታሚን ድጋፍ" },
          { id: "sup-food-20", nameEn: "Cerifam Cereal", nameAm: "ሴሪፋም", qtyEn: "40 Packs / month", qtyAm: "40 ፓኬት/ወር", urgency: "High", descEn: "Easy-to-digest baby and convalescent cereal for 43 vulnerable intakes", descAm: "ለህጻናትና ልዩ እንክብካቤ ለሚሹ ህሙማን" },
          { id: "sup-food-21", nameEn: "Fresh Farm Eggs", nameAm: "እንቁላል", qtyEn: "50 Crates / month", qtyAm: "50 ሳህን/ወር", urgency: "High", descEn: "High-protein breakfast eggs for resident recovery", descAm: "ለጧት ቁርስ ፕሮቲን ሰጪ እንቁላል" },
          { id: "sup-food-22", nameEn: "Canned Powdered Milk", nameAm: "የቆርቆሮ ወተት", qtyEn: "30 Large Cans / month", qtyAm: "30 ቆርቆሮ/ወር", urgency: "High", descEn: "Infant and frail senior daily milk nutrition for 43 intakes", descAm: "ለህጻናትና አረጋውያን ዕለታዊ የወተት አልሚ ምግብ" }
        ]
      },
      {
        id: "cat-hygiene",
        nameEn: "Hygiene & Sanitation",
        nameAm: "ንፅህናና ሳኒቴሽን",
        icon: "Droplets",
        color: "bg-brand-sky-400",
        sort: 1,
        items: [
          { id: "sup-hyg-01", nameEn: "Adult & Senior Diapers", nameAm: "የአዋቂ ዳይፐር", qtyEn: "50 Packs / month", qtyAm: "50 ፓኬት/ወር", urgency: "High", descEn: "Dignified personal hygiene for bedridden, disabled, and elderly residents", descAm: "ለአልጋ ቁራኛና አረጋውያን ክብርና ንጽህና መጠበቂያ" },
          { id: "sup-hyg-02", nameEn: "Sanitary Wet Wipes", nameAm: "ዋይፕስ", qtyEn: "60 Packs / month", qtyAm: "60 ፓኬት/ወር", urgency: "High", descEn: "Gentle hygiene cleaning for immobile residents", descAm: "ለአልጋ ቁራኛና ለህሙማን ፈጣን የንጽህና መጠበቂያ" },
          { id: "sup-hyg-03", nameEn: "Bath Body Soap", nameAm: "የገላ ሳሙና", qtyEn: "600 Bars / month", qtyAm: "600 ፍሬ/ወር", urgency: "High", descEn: "Daily resident bathing, handwashing, and skin sanitation for 400+ people", descAm: "ለ400+ ተጠቃሚዎች ዕለታዊ ገላ መታጠቢያ" },
          { id: "sup-hyg-04", nameEn: "Laundry Soap & Detergent", nameAm: "የልብስ ሳሙናና ኦሞ", qtyEn: "40 Large Boxes / month", qtyAm: "40 ትላልቅ ካርቶን/ወር", urgency: "High", descEn: "Daily washing and sterilization of clothes, bedding, and blankets", descAm: "ለዕለታዊ ልብስ፣ ብርድልብስና አንሶላ ማጠቢያ" },
          { id: "sup-hyg-05", nameEn: "Soft Toilet Paper & Tissues", nameAm: "ሶፍት", qtyEn: "50 Packs / month", qtyAm: "50 ፓኬት/ወር", urgency: "High", descEn: "Communal shelter and restroom sanitation maintenance", descAm: "ለማእከሉ መጸዳጃና የግል ንጽህና መጠበቂያ" }
        ]
      },
      {
        id: "cat-supplies",
        nameEn: "Supplies, Bedding & Clothing",
        nameAm: "ቁሳቁስና አልባሳት",
        icon: "Package",
        color: "bg-brand-green-400",
        sort: 2,
        items: [
          { id: "sup-mat-01", nameEn: "Warm Heavy Blankets", nameAm: "ወፍራም ብርድ ልብስ", qtyEn: "150 Blankets / season", qtyAm: "150 ብርድልብስ/ወቅት", urgency: "High", descEn: "Essential protection against the cold Entoto mountain climate", descAm: "የእንጦጦን ቅዝቃዜ ለመቋቋም የሚሆን ወፍራም ብርድልብስ" },
          { id: "sup-mat-02", nameEn: "Clean Clothes & Warm Jackets", nameAm: "አልባሳትና ጃኬቶች", qtyEn: "200 Sets / season", qtyAm: "200 ልብሶች/ወቅት", urgency: "High", descEn: "Clean, dignified clothing and sweaters for rescued beneficiaries", descAm: "ለተረዱ ወገኖች ንጹህና ሞቅ ያለ ልብስ" },
          { id: "sup-mat-03", nameEn: "Durable Shoes", nameAm: "ጫማ", qtyEn: "150 Pairs / season", qtyAm: "150 ጥንድ/ወቅት", urgency: "High", descEn: "Footwear for street intake rescues who arrived barefoot or in rags", descAm: "እግራቸው ተጎድቶ ለሚገቡ ህሙማን ጠንካራ ጫማ" },
          { id: "sup-mat-04", nameEn: "High-Density Foam Mattresses", nameAm: "የስፖንጅ ፍራሽ", qtyEn: "40 Mattresses", qtyAm: "40 ፍራሾች", urgency: "High", descEn: "Clean, comfortable bedding for newly rescued residents in dormitories", descAm: "ለማገገሚያ ማእከሉ አዲስ አልጋዎች ንጹህ ፍራሽ" },
          { id: "sup-mat-05", nameEn: "Bed Sheets & Pillowcases", nameAm: "አንሶላና የትራስ ጨርቅ", qtyEn: "150 Pairs", qtyAm: "150 ጥንድ", urgency: "Medium", descEn: "Dormitory bed sanitation, regular rotation, and peaceful sleep", descAm: "ለመኝታ ክፍል ንጽህናና የተሟላ እረፍት" }
        ]
      },
      {
        id: "cat-medical",
        nameEn: "Medical Equipment & Dispensary",
        nameAm: "የህክምና ቁሳቁሶች",
        icon: "Stethoscope",
        color: "bg-brand-red-400",
        sort: 3,
        items: [
          { id: "sup-med-01", nameEn: "First Aid & Wound Dressing Kits", nameAm: "የመጀመሪያ እርዳታና ባንዴጅ", qtyEn: "50 Kits / month", qtyAm: "50 ስብስብ/ወር", urgency: "High", descEn: "Immediate wound cleaning and physical trauma treatment for street intakes", descAm: "ከጎዳና ሲገቡ የተጎዱ ህሙማንን ቁስል ማከሚያ" },
          { id: "sup-med-02", nameEn: "Blood Pressure & Glucose Monitors", nameAm: "የደም ግፊትና ስኳር መለኪያ", qtyEn: "10 Device Kits", qtyAm: "10 መሳሪያዎች", urgency: "Medium", descEn: "Routine vital monitoring for elderly and chronic hypertensive patients", descAm: "ለአረጋውያንና ለህሙማን የጤና ክትትል" },
          { id: "sup-med-03", nameEn: "Surgical Gloves & Antiseptics", nameAm: "ጓንትና ሳቭሎን", qtyEn: "30 Boxes / month", qtyAm: "30 ካርቶን/ወር", urgency: "High", descEn: "Dispensary hygiene and infection control during wound care", descAm: "በህክምና ወቅት ኢንፌክሽን መከላከያ" }
        ]
      },
      {
        id: "cat-psychiatric",
        nameEn: "Psychiatric & Therapy Supplies",
        nameAm: "ስነ-አእምሮና ቴራፒ",
        icon: "Brain",
        color: "bg-brand-orange-400",
        sort: 4,
        items: [
          { id: "sup-psy-01", nameEn: "Art Therapy Sketchbooks & Paints", nameAm: "የስዕል ደብተሮችና ቀለሞች", qtyEn: "100 Sets / month", qtyAm: "100 ስብስብ/ወር", urgency: "Medium", descEn: "Cognitive rehabilitation and creative psychological healing sessions", descAm: "ለአእምሮ እረፍትና ስነ-ጥበብ ቴራፒ" },
          { id: "sup-psy-02", nameEn: "Board Games, Chess & Dominoes", nameAm: "ቼዝ፣ ዶሚኖና ጠረጴዛ ጨዋታዎች", qtyEn: "25 Sets", qtyAm: "25 ጨዋታዎች", urgency: "Medium", descEn: "Mental stimulation, social cohesion, and focus rehabilitation", descAm: "ለአእምሮ ንቃትና ማህበራዊ ትስስር ማጎልበቻ" },
          { id: "sup-psy-03", nameEn: "Calming Music & Audio Therapy", nameAm: "የሙዚቃና ኦዲዮ ማዳመጫ", qtyEn: "10 Audio Sets", qtyAm: "10 እቃዎች", urgency: "Low", descEn: "Auditory relaxation and peaceful meditation for agitated residents", descAm: "ለተረበሹ ህሙማን ሰላምና እረፍት ሰጪ" }
        ]
      }
    ];

    await conn.execute("DELETE FROM supply_items");
    await conn.execute("DELETE FROM supply_categories");

    for (const c of supplyCats) {
      await conn.execute(`
        INSERT INTO supply_categories (id, name_en, name_am, icon, color, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [c.id, c.nameEn, c.nameAm, c.icon, c.color, c.sort]);

      for (let i = 0; i < c.items.length; i++) {
        const it = c.items[i];
        await conn.execute(`
          INSERT INTO supply_items
            (id, category_id, name_en, name_am, needed_qty_en, needed_qty_am, urgency, impact_desc_en, impact_desc_am, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [it.id, c.id, it.nameEn, it.nameAm, it.qtyEn, it.qtyAm, it.urgency, it.descEn, it.descAm, i]);
      }
    }
    console.log(`   ✓ ${supplyCats.length} supply categories and all items seeded successfully`);

    // ─────────────────────────────────────────────────────────────
    // 5. VOLUNTEER CATEGORIES & ROLES (Authentic Roles from the Form)
    // ─────────────────────────────────────────────────────────────
    console.log("5. Seeding volunteer_categories and volunteer_roles...");

    const volCats = [
      {
        id: "vcat-kitchen",
        nameEn: "Kitchen & Meal Service",
        nameAm: "ምግብ ዝግጅትና መስተንግዶ",
        icon: "UtensilsCrossed",
        color: "bg-brand-yellow-400",
        sort: 0,
        roles: [
          { id: "vrole-cook", nameEn: "Meal Preparation & Cooking", nameAm: "ምግብ ማዘጋጀት", descEn: "Help chop vegetables, bake injera/bread, and prepare nutritious daily meals for 400+ residents.", descAm: "ለ400+ ተጠቃሚዎች ዕለታዊ ምግብና እንጀራ ማዘጋጀት።" },
          { id: "vrole-serve", nameEn: "Meal Service & Dining Support", nameAm: "ምግብ ማቅረብና መመገብ", descEn: "Serve warm meals with love and assist frail or elderly residents during breakfast, lunch, and dinner.", descAm: "ለተጠቃሚዎች ምግብ በክብር ማቅረብና አቅም የሌላቸውን መመገብ።" }
        ]
      },
      {
        id: "vcat-grooming",
        nameEn: "Hygiene & Barbering",
        nameAm: "ንጽህናና ጸጉር ማስተካከል",
        icon: "Droplets",
        color: "bg-brand-sky-400",
        sort: 1,
        roles: [
          { id: "vrole-barber", nameEn: "Hair Cutting & Barbering", nameAm: "ጸጉር መቁረጥና መስራት", descEn: "Give clean, dignified haircuts and grooming for male and female recovering beneficiaries.", descAm: "ለወንዶችና ሴቶች ተጠቃሚዎች ጸጉር መቁረጥና ማስተካከል።" },
          { id: "vrole-bathing", nameEn: "Bathing & Personal Grooming", nameAm: "ገላ ማጠብና የግል ንጽህና", descEn: "Assist bedridden or elderly residents with gentle, compassionate warm bathing and clean dressing.", descAm: "አረጋውያንንና ታማሚዎችን ገላ ማጠብና ንጹህ ልብስ ማልበስ።" }
        ]
      },
      {
        id: "vcat-care",
        nameEn: "Elderly & Resident Care",
        nameAm: "የአዛውንቶችና ህሙማን እንክብካቤ",
        icon: "HeartHandshake",
        color: "bg-brand-green-400",
        sort: 2,
        roles: [
          { id: "vrole-companion", nameEn: "Elderly Companionship & Listening", nameAm: "የአዛውንት እንክብካቤና ጨዋታ", descEn: "Spend quality time listening, sharing stories, and offering warm emotional presence to abandoned seniors.", descAm: "ከአዛውንቶች ጋር ጊዜ ማሳለፍ፣ ማዳመጥና የፍቅር ወዳጅ መሆን።" },
          { id: "vrole-patient-care", nameEn: "Patient Recovery Accompaniment", nameAm: "ህሙማንን መንከባከብ", descEn: "Accompany residents during daily walks, recreational therapy, and peaceful courtyard activities.", descAm: "በግቢ ውስጥ ከህሙማን ጋር አብሮ መራመድና ማጽናናት።" }
        ]
      },
      {
        id: "vcat-operations",
        nameEn: "Shelter Maintenance & Utilities",
        nameAm: "የግቢ ስራዎችና እንጨት መፍለጥ",
        icon: "Settings",
        color: "bg-brand-orange-400",
        sort: 3,
        roles: [
          { id: "vrole-wood", nameEn: "Firewood Chopping & Heating", nameAm: "እንጨት መፍለጥ", descEn: "Chop firewood and manage kitchen hearths for daily large-scale cooking in the mountain shelter.", descAm: "ለምግብ ማብሰያና ለማሞቂያ የሚሆን እንጨት መፍለጥ።" },
          { id: "vrole-laundry", nameEn: "Laundry & Linen Washing", nameAm: "ልብስና አንሶላ ማጠብ", descEn: "Wash, sanitize, and fold dormitory bedsheets, blankets, and resident clothes.", descAm: "የህሙማንን ልብሶች፣ ብርድልብሶችና አንሶላዎችን ማጠብ።" },
          { id: "vrole-water", nameEn: "Water Fetching & Storage", nameAm: "ዉሃ መቅዳት", descEn: "Help transport, store, and manage water distribution throughout the shelter facility.", descAm: "ለማእከሉ የውሃ ማጠራቀሚያዎች ውሃ መቅዳትና ማቅረብ።" }
        ]
      },
      {
        id: "vcat-medical",
        nameEn: "Health & Medical Aid",
        nameAm: "የጤናና የህክምና እርዳታ",
        icon: "Stethoscope",
        color: "bg-brand-red-400",
        sort: 4,
        roles: [
          { id: "vrole-med-assist", nameEn: "Clinical Assistant / Nurse Volunteer", nameAm: "የጤና እርዳታና ክሊኒካል ድጋፍ", descEn: "Assist dispensary staff with vital signs check, wound dressing, and medication administration.", descAm: "በማእከሉ ክሊኒክ የደም ግፊት መለካት፣ ቁስል ማጠብና የመጀመሪያ እርዳታ መስጠት።" }
        ]
      }
    ];

    await conn.execute("DELETE FROM volunteer_roles");
    await conn.execute("DELETE FROM volunteer_categories");

    for (const vc of volCats) {
      await conn.execute(`
        INSERT INTO volunteer_categories (id, name_en, name_am, icon, color, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [vc.id, vc.nameEn, vc.nameAm, vc.icon, vc.color, vc.sort]);

      for (let ri = 0; ri < vc.roles.length; ri++) {
        const r = vc.roles[ri];
        await conn.execute(`
          INSERT INTO volunteer_roles (id, category_id, name_en, name_am, description_en, description_am, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [r.id, vc.id, r.nameEn, r.nameAm, r.descEn, r.descAm, ri]);
      }
    }
    console.log(`   ✓ ${volCats.length} volunteer categories and all practical roles seeded`);

    // ─────────────────────────────────────────────────────────────
    // 6. AVAILABILITY SLOTS (Aligned with Visiting Hours: 7:30 AM - 6:00 PM)
    // ─────────────────────────────────────────────────────────────
    console.log("6. Seeding availability_slots for Monday-Sunday visiting...");
    await conn.execute("DELETE FROM availability_slots");

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const slotTimes = [
      { start: "07:30 AM", end: "10:00 AM", label: "Morning Care & Breakfast Service / የጧት ቁርስና ጉብኝት" },
      { start: "10:00 AM", end: "12:30 PM", label: "Midday Visit & Fellowship / የቀን ጉብኝትና ህብረት" },
      { start: "01:30 PM", end: "03:30 PM", label: "Afternoon Therapy & Activity / የከሰዓት ቴራፒና እንቅስቃሴ" },
      { start: "03:30 PM", end: "06:00 PM", label: "Evening Fellowship & Dinner / የማታ እራትና መስተንግዶ" }
    ];

    for (let di = 0; di < days.length; di++) {
      const day = days[di];
      for (let si = 0; si < slotTimes.length; si++) {
        const st = slotTimes[si];
        const id = `slot-${day.toLowerCase()}-${si + 1}`;
        await conn.execute(`
          INSERT INTO availability_slots
            (id, slot_date, start_time, end_time, label, max_bookings, current_bookings, is_active)
          VALUES (?, ?, ?, ?, ?, 15, 0, 1)
        `, [id, `Every ${day}`, st.start, st.end, st.label]);
      }
    }
    console.log(`   ✓ 28 weekly visiting slots seeded across Monday to Sunday`);

    console.log("\n=======================================================");
    console.log("✅ PRODUCTION DATA SEED COMPLETED SUCCESSFULLY!");
    console.log("=======================================================\n");

  } catch (err) {
    console.error("❌ Seed failed with error:", err);
    throw err;
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

runSeed().catch(() => process.exit(1));
