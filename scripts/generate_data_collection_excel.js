import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "..", "Selihom_Charity_Data_Collection_Template.xlsx");

const workbook = new ExcelJS.Workbook();
workbook.creator = "Antigravity Assistant";
workbook.lastModifiedBy = "Noah";
workbook.created = new Date();
workbook.modified = new Date();

// Helper styling function
function styleSheet(sheet, headerColor = "1E3A8A") {
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  
  // Style Header Row
  const headerRow = sheet.getRow(1);
  headerRow.height = 30;
  headerRow.font = { bold: true, color: { argb: "FFFFFF" }, size: 11, name: "Calibri" };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: headerColor }
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

  // Style all data rows
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.height = 25;
      row.alignment = { vertical: "middle", wrapText: true };
      row.font = { size: 10, name: "Calibri" };
      
      // Zebra striping
      if (rowNumber % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F8FAFC" }
        };
      }
    }

    // Add thin borders
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "CBD5E1" } },
        left: { style: "thin", color: { argb: "CBD5E1" } },
        bottom: { style: "thin", color: { argb: "CBD5E1" } },
        right: { style: "thin", color: { argb: "CBD5E1" } }
      };
    });
  });
}

// ─────────────────────────────────────────────────────────────
// 1. Org Profile & Settings
// ─────────────────────────────────────────────────────────────
const ws1 = workbook.addWorksheet("1. Org Profile");
ws1.columns = [
  { header: "Done? [✓]", key: "done", width: 12 },
  { header: "Field / Item Name", key: "field", width: 26 },
  { header: "English Requirement", key: "en", width: 35 },
  { header: "Amharic Requirement (የአማርኛ መረጃ)", key: "am", width: 35 },
  { header: "Example / Current Reference", key: "example", width: 45 },
  { header: "Actual Value Collected from Charity", key: "actual", width: 45 }
];
ws1.addRows([
  { done: "☐", field: "Organization Full Name", en: "Full legal English name", am: "ሙሉ ህጋዊ የአማርኛ ስም", example: "Selihom Mentally Ill People Support Association / ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር", actual: "" },
  { done: "☐", field: "Motto / Slogan", en: "Official English motto", am: "ይፋዊ መሪ ቃል", example: "\"Kind hearts excel beautiful faces!\" / \"ደግ ልቦች ከውብ ፊቶች ይበልጣሉ!\"", actual: "" },
  { done: "☐", field: "Registration Number", en: "Gov certificate license number", am: "የመንግስት ምዝገባ ቁጥር", example: "1113/2019 (Registry Code 6131)", actual: "" },
  { done: "☐", field: "Registration Date", en: "Official registration date", am: "የተመዘገበበት ቀን", example: "Feb 03, 2020", actual: "" },
  { done: "☐", field: "Regulatory Authority", en: "Registering government agency", am: "የመዘገበው የመንግስት ተቋም", example: "FDRE Agency for Civil Society Organizations / የሲቪል ማህበረሰብ ድርጅቶች ኤጀንሲ", actual: "" },
  { done: "☐", field: "Shelter Physical Address", en: "Detailed directions & location", am: "ዝርዝር የአድራሻ መግለጫ", example: "Near Entoto St. Raguel Church, on road toward Fetesha, Addis Ababa", actual: "" },
  { done: "☐", field: "Primary Phone Number", en: "Main mobile / director phone", am: "ዋና ስልክ ቁጥር", example: "+251 911 004903", actual: "" },
  { done: "☐", field: "Secondary Phone Number", en: "Office / alternate phone", am: "ተጨማሪ ስልክ ቁጥር", example: "+251 953 905050", actual: "" },
  { done: "☐", field: "Landline Phone (Optional)", en: "Landline phone if available", am: "መደበኛ ስልክ ቁጥር", example: "011 819 5444", actual: "" },
  { done: "☐", field: "Official Email Address", en: "Contact / donation email", am: "ይፋዊ ኢሜይል", example: "selihome@gmail.com", actual: "" },
  { done: "☐", field: "Telegram Channel / Group", en: "Telegram link", am: "የቴሌግራም ቻናል ሊንክ", example: "https://t.me/Selihommentallyill", actual: "" },
  { done: "☐", field: "Facebook Page URL", en: "Facebook page link", am: "የፌስቡክ ገጽ ሊንክ", example: "https://facebook.com/SelihomSupport", actual: "" },
  { done: "☐", field: "TikTok Page URL", en: "TikTok handle / link", am: "የቲክቶክ ገጽ ሊንክ", example: "https://tiktok.com/@selihomcharity", actual: "" },
  { done: "☐", field: "YouTube Channel URL", en: "YouTube channel link", am: "የዩቲዩብ ቻናል ሊንክ", example: "https://youtube.com/@selihomcharity", actual: "" },
  { done: "☐", field: "Instagram (Optional)", en: "Instagram profile link", am: "የኢንስታግራም ሊንክ", example: "", actual: "" },
  { done: "☐", field: "LinkedIn (Optional)", en: "LinkedIn profile link", am: "የሊንክድኢን ሊንክ", example: "", actual: "" },
  { done: "☐", field: "Founder Name & Role", en: "Founder name & title", am: "የመስራቹ ስም እና የስራ ድርሻ", example: "Mikiyas Legesse (Founder & Director) / ሚኪያስ ለገሰ", actual: "" }
]);
styleSheet(ws1, "1E3A8A");

// ─────────────────────────────────────────────────────────────
// 2. Bank Accounts
// ─────────────────────────────────────────────────────────────
const ws2 = workbook.addWorksheet("2. Bank Accounts");
ws2.columns = [
  { header: "Done? [✓]", key: "done", width: 12 },
  { header: "Bank Name (English)", key: "bankEn", width: 32 },
  { header: "Bank Name (Amharic)", key: "bankAm", width: 28 },
  { header: "Account Number / Telebirr", key: "accNum", width: 26 },
  { header: "Exact Legal Account Holder Name", key: "accName", width: 45 },
  { header: "Display Order", key: "order", width: 15 },
  { header: "Status / Notes", key: "notes", width: 25 }
];
ws2.addRows([
  { done: "☐", bankEn: "Commercial Bank of Ethiopia (CBE)", bankAm: "የኢትዮጵያ ንግድ ባንክ", accNum: "1000275107518", accName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር", order: "1", notes: "Primary Bank" },
  { done: "☐", bankEn: "Bank of Abyssinia", bankAm: "አቢሲንያ ባንክ", accNum: "77984852", accName: "Selihom Support Association", order: "2", notes: "Active" },
  { done: "☐", bankEn: "Awash Bank", bankAm: "አዋሽ ባንክ", accNum: "01303572131300", accName: "Selihom Support Association", order: "3", notes: "Active" },
  { done: "☐", bankEn: "Telebirr (Mobile Money)", bankAm: "ቴሌብር (ሞባይል ገንዘብ)", accNum: "0911004903", accName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር (ሚኪያስ ለገሰ)", order: "4", notes: "Mobile Remittance" },
  { done: "☐", bankEn: "Dashen Bank (If available)", bankAm: "ዳሽን ባንክ", accNum: "", accName: "", order: "5", notes: "" },
  { done: "☐", bankEn: "Cooperative Bank of Oromia", bankAm: "ኦሮሚያ ህብረት ስራ ባንክ", accNum: "", accName: "", order: "6", notes: "" }
]);
styleSheet(ws2, "065F46");

// ─────────────────────────────────────────────────────────────
// 3. Story, Vision & Values
// ─────────────────────────────────────────────────────────────
const ws3 = workbook.addWorksheet("3. Story, Vision & Values");
ws3.columns = [
  { header: "Done? [✓]", key: "done", width: 12 },
  { header: "Pillar / Section", key: "pillar", width: 25 },
  { header: "English Narrative / Description", key: "en", width: 50 },
  { header: "Amharic Narrative (የአማርኛ ዝርዝር መረጃ)", key: "am", width: 50 },
  { header: "Key Numbers / Figures Included", key: "numbers", width: 35 }
];
ws3.addRows([
  { done: "☐", pillar: "Founding Story (ታሪካችን)", en: "Detailed narrative: father's illness, initial shoe-shining & car-washing in Shinkur St. Michael, moving to Entoto Raguel, current shelter care.", am: "የአመሰራረት ታሪክ፡ መነሻ ምክንያት፣ በሺንቁር ቅዱስ ሚካኤል ጫማ በመወልወልና መኪና በማጠብ የተጀመረበት፣ ወደ እንጦጦ ራጉኤል የተደረገ ጉዞ እና የአሁኑ ቁመና።", numbers: "200+ beneficiaries, 85% recovery" },
  { done: "☐", pillar: "Vision Statement (ራዕይ)", en: "Long-term vision for psychiatric recovery, elder care, and dignified community reintegration.", am: "ለአዕምሮ ህሙማንና ተጋላጭ አዛውንቶች የህክምና፣ የስነ-ልቦና እና የማህበራዊ ድጋፍ በመስጠት ጤናማና ክብር ያለው ህይወት እንዲኖሩ ማድረግ።", numbers: "" },
  { done: "☐", pillar: "Mission Statement (ተልዕኮ)", en: "Daily mission of street rescue, medical diagnosis, housing, nutrition, and vocational empowerment.", am: "የአዕምሮ ህሙማንን ከጎዳና በማንሳት ሕክምና፣ ምክር፣ የሙያ ስልጠናና ድጋፍ መስጠት፣ እንዲሁም አዛውንቶችን መንከባከብ።", numbers: "" },
  { done: "☐", pillar: "Core Objectives (ዓላማዎች)", en: "3 to 5 clear objectives detailing medical treatment, family reunification, and self-sufficiency.", am: "ያገገሙ ሰዎችን በሙያ ስልጠና፣ በትብብርና በስራ እድሎች በማብቃት በራሳቸው የሚቆሙ ማድረግ።", numbers: "" },
  { done: "☐", pillar: "Value 1: Transparency", en: "Complete public accountability and clear reporting of all donations.", am: "ግልጽነት፡ ሁሉንም ሀብቶችና እርዳታዎች በግልጽነት ለህዝብ ማሳወቅ።", numbers: "" },
  { done: "☐", pillar: "Value 2: Integrity", en: "Serving with genuine love, truthfulness, and unwavering dedication.", am: "ቅንነት፡ በፍቅርና በታማኝነት ማገልገል።", numbers: "" },
  { done: "☐", pillar: "Value 3: Family Spirit", en: "Caring for every beneficiary as our beloved family member.", am: "ቤተሰባዊነት፡ ሁሉንም ተጠቃሚዎች እንደ አንድ ቤተሰብ መንከባከብ።", numbers: "" },
  { done: "☐", pillar: "Value 4: Excellence in Care", en: "Providing top-quality medical, psychiatric, and social care.", am: "የላቀ አገልግሎት፡ ከፍተኛ ጥራት ያለው ሕክምናና ድጋፍ መስጠት።", numbers: "" },
  { done: "☐", pillar: "Value 5: Equality", en: "Serving all human beings regardless of ethnicity, gender, or background.", am: "ያለ አድሎ ድጋፍ፡ ማንኛውንም ሰው ያለ አድሎ በእኩልነት መርዳት።", numbers: "" }
]);
styleSheet(ws3, "1E3A8A");

// ─────────────────────────────────────────────────────────────
// 4. Programs & Initiatives
// ─────────────────────────────────────────────────────────────
const ws4 = workbook.addWorksheet("4. Programs & Initiatives");
ws4.columns = [
  { header: "Done? [✓]", key: "done", width: 12 },
  { header: "Program Title (English)", key: "titleEn", width: 32 },
  { header: "Program Title (Amharic)", key: "titleAm", width: 28 },
  { header: "Description (English & Amharic)", key: "desc", width: 55 },
  { header: "Annual Target Budget (ETB)", key: "goal", width: 25 },
  { header: "Current Raised / Supported (ETB)", key: "raised", width: 28 }
];
ws4.addRows([
  { done: "☐", titleEn: "Helping People with Mental Illness", titleAm: "ጎዳና የወደቁትን ማንሳት", desc: "Rescuing people with mental illness from streets, providing psychiatric care, medicine, and sheltered rehabilitation.", goal: 5000000, raised: 3850000 },
  { done: "☐", titleEn: "Supporting the Elderly", titleAm: "አዛውንቶችን መርዳት", desc: "Providing shelter, nutritious meals, geriatric health support, clothing, and companionship to abandoned seniors.", goal: 3500000, raised: 2900000 },
  { done: "☐", titleEn: "Helping Vulnerable Children", titleAm: "ህጻናትን መርዳት", desc: "Providing education, school supplies, uniforms, healthcare, and nutrition to vulnerable children in the community.", goal: 2500000, raised: 1800000 },
  { done: "☐", titleEn: "Vocational & Skills Training", titleAm: "ስልጠናዎችን መስጠት", desc: "Equipping recovered beneficiaries with handicrafts, baking, and urban farming skills for self-sufficient livelihood.", goal: 3000000, raised: 2100000 },
  { done: "☐", titleEn: "(Add Additional Program)", titleAm: "(ተጨማሪ ፕሮግራም ካለ)", desc: "Any new specific programs (e.g. Family Reunification, Community Mental Health Clinic).", goal: 0, raised: 0 }
]);
styleSheet(ws4, "0F766E");

// ─────────────────────────────────────────────────────────────
// 5. Medicines & Goals (All Non-Monetary Medicine Needs)
// ─────────────────────────────────────────────────────────────
const ws5 = workbook.addWorksheet("5. Medicines & Goals");
ws5.columns = [
  { header: "Done? [✓]", key: "done", width: 12 },
  { header: "Medicine Name & Dosage (የመድሃኒት ስም)", key: "medName", width: 30 },
  { header: "Monthly Target Goal (ክኒን / Tablets)", key: "monthlyQty", width: 25 },
  { header: "Currently Available / In Stock", key: "available", width: 25 },
  { header: "Unit Price (ETB / Tablet)", key: "unitPrice", width: 22 },
  { header: "Total Monthly Budget (ETB)", key: "totalCost", width: 24 },
  { header: "People / Patients Helped (የሚረዱ ሰዎች)", key: "patients", width: 25 },
  { header: "Priority (High / Medium / Low)", key: "urgency", width: 24 },
  { header: "Clinical Purpose / Description (English & Amharic)", key: "notes", width: 45 }
];
ws5.addRows([
  { done: "☐", medName: "Haloperidol 5mg", monthlyQty: 3600, available: 1200, unitPrice: 5.5, totalCost: 19800, patients: 45, urgency: "High (ከፍተኛ)", notes: "Essential antipsychotic for severe psychosis, schizophrenia & acute mania" },
  { done: "☐", medName: "Chlorpromazine 100mg", monthlyQty: 4200, available: 1500, unitPrice: 6.2, totalCost: 26040, patients: 52, urgency: "High (ከፍተኛ)", notes: "Sedative antipsychotic for severe restlessness and acute agitation" },
  { done: "☐", medName: "Olanzapine 10mg", monthlyQty: 2100, available: 600, unitPrice: 18.0, totalCost: 37800, patients: 35, urgency: "High (ከፍተኛ)", notes: "Atypical antipsychotic for long-term psychiatric mood stabilization" },
  { done: "☐", medName: "Fluoxetine 20mg", monthlyQty: 1800, available: 800, unitPrice: 8.5, totalCost: 15300, patients: 28, urgency: "Medium (መካከለኛ)", notes: "Antidepressant for severe clinical depression, PTSD, and trauma" },
  { done: "☐", medName: "Carbamazepine 200mg", monthlyQty: 2400, available: 900, unitPrice: 7.0, totalCost: 16800, patients: 30, urgency: "High (ከፍተኛ)", notes: "Mood stabilizer and anticonvulsant for epilepsy & bipolar disorder" },
  { done: "☐", medName: "Risperidone 2mg", monthlyQty: 1500, available: 500, unitPrice: 14.5, totalCost: 21750, patients: 25, urgency: "High (ከፍተኛ)", notes: "Atypical antipsychotic for cognitive recovery and behavior control" },
  { done: "☐", medName: "Trihexyphenidyl (Artane) 2mg", monthlyQty: 3000, available: 1100, unitPrice: 4.0, totalCost: 12000, patients: 40, urgency: "Medium (መካከለኛ)", notes: "Prevents drug-induced tremor and stiffness side-effects" },
  { done: "☐", medName: "Sodium Valproate 200mg", monthlyQty: 1200, available: 350, unitPrice: 16.0, totalCost: 19200, patients: 20, urgency: "Medium (መካከለኛ)", notes: "Mood stabilizer for seizure prevention and bipolar mood swings" },
  { done: "☐", medName: "Multivitamins & Zinc", monthlyQty: 6000, available: 2000, unitPrice: 3.0, totalCost: 18000, patients: 200, urgency: "Medium (መካከለኛ)", notes: "Daily nutritional rehabilitation and immunity recovery for all residents" },
  { done: "☐", medName: "Wound Dressing & Antibiotics", monthlyQty: 50, available: 15, unitPrice: 350.0, totalCost: 17500, patients: 60, urgency: "High (ከፍተኛ)", notes: "Sterile gauze, iodine, antiseptic, and antibiotics for street rescue wounds" },
  { done: "☐", medName: "(Add Real Medicine Item 1)", monthlyQty: 0, available: 0, unitPrice: 0, totalCost: 0, patients: 0, urgency: "High", notes: "" },
  { done: "☐", medName: "(Add Real Medicine Item 2)", monthlyQty: 0, available: 0, unitPrice: 0, totalCost: 0, patients: 0, urgency: "Medium", notes: "" },
  { done: "☐", medName: "(Add Real Medicine Item 3)", monthlyQty: 0, available: 0, unitPrice: 0, totalCost: 0, patients: 0, urgency: "Low", notes: "" }
]);
styleSheet(ws5, "BE123C");

// ─────────────────────────────────────────────────────────────
// 6. In-Kind Supplies & Goals (5 Subcategories: Food, Hygiene, Medicine, Psychiatry, Supplies/Material)
// ─────────────────────────────────────────────────────────────
const ws6 = workbook.addWorksheet("6. In-Kind Supplies & Goals");
ws6.columns = [
  { header: "Done? [✓]", key: "done", width: 12 },
  { header: "Subcategory (የድጋፍ ዘርፍ)", key: "category", width: 22 },
  { header: "Item Name (English)", key: "nameEn", width: 28 },
  { header: "Item Name (Amharic)", key: "nameAm", width: 25 },
  { header: "Monthly Need Goal (ወርሃዊ የፍላጎት ግብ)", key: "qty", width: 28 },
  { header: "Current Available Stock (ያለው መጠን)", key: "available", width: 28 },
  { header: "Priority (High / Medium / Low)", key: "urgency", width: 24 },
  { header: "Beneficiaries Helped (የሚረዱ ሰዎች)", key: "beneficiaries", width: 24 },
  { header: "Impact Description (የፍላጎቱ ዝርዝርና ጥቅም)", key: "impact", width: 45 }
];
ws6.addRows([
  // 🍲 1. Food (ምግብ)
  { done: "☐", category: "Food (ምግብ)", nameEn: "Teff Grain (Sacks)", nameAm: "ጤፍ (ጆንያ/ኩንታል)", qty: "50 Sacks (ኩንታል) / Month", available: "15 Sacks", urgency: "High (ከፍተኛ)", beneficiaries: "200+ People", impact: "Daily fresh injera baking for all 200+ residents and street rescue intakes" },
  { done: "☐", category: "Food (ምግብ)", nameEn: "Cooking Oil (Jerrycans)", nameAm: "የምግብ ዘይት (ጄሪካን)", qty: "20 Jerrycans (20L) / Month", available: "5 Jerrycans", urgency: "High (ከፍተኛ)", beneficiaries: "200+ People", impact: "Daily meal and vegetable stew preparation in the central shelter kitchen" },
  { done: "☐", category: "Food (ምግብ)", nameEn: "Lentils & Split Peas", nameAm: "ምስርና ክክ/ሽሮ", qty: "15 Quintals / Month", available: "4 Quintals", urgency: "High (ከፍተኛ)", beneficiaries: "200+ People", impact: "Essential protein-rich stews and daily nutritious lunch/dinner meals" },
  { done: "☐", category: "Food (ምግብ)", nameEn: "Wheat Flour & Rice", nameAm: "የስንዴ ዱቄትና ሩዝ", qty: "20 Quintals / Month", available: "8 Quintals", urgency: "Medium (መካከለኛ)", beneficiaries: "200+ People", impact: "Morning breakfast bread baking and food grain variety" },
  { done: "☐", category: "Food (ምግብ)", nameEn: "Sugar, Tea & Milk Powder", nameAm: "ስኳር፣ ሻይ ቅጠልና የዱቄት ወተት", qty: "10 Quintals Sugar / Month", available: "3 Quintals", urgency: "Medium (መካከለኛ)", beneficiaries: "200+ People", impact: "Daily morning and evening warm tea service for vulnerable seniors and patients" },

  // 🧼 2. Hygiene (ንጽህና)
  { done: "☐", category: "Hygiene (ንጽህና)", nameEn: "Bath Soap & Laundry Bars", nameAm: "የገላና የልብስ ሳሙና", qty: "500 Bars / Month", available: "120 Bars", urgency: "High (ከፍተኛ)", beneficiaries: "200+ People", impact: "Daily resident bathing, handwashing, and personal hygiene sanitation" },
  { done: "☐", category: "Hygiene (ንጽህና)", nameEn: "Laundry Detergent & Bleach", nameAm: "ኦሞና በረኪና", qty: "30 Large Boxes / Month", available: "8 Boxes", urgency: "High (ከፍተኛ)", beneficiaries: "200+ People", impact: "Daily bedsheets, blankets, and resident clothing washing and disinfection" },
  { done: "☐", category: "Hygiene (ንጽህና)", nameEn: "Adult Diapers (Elderly)", nameAm: "የአዋቂ ዳይፐር", qty: "40 Packs / Month", available: "10 Packs", urgency: "High (ከፍተኛ)", beneficiaries: "35 Seniors", impact: "Essential dignity care for bedridden, disabled, and elderly incontinent residents" },
  { done: "☐", category: "Hygiene (ንጽህና)", nameEn: "Toothpaste & Toothbrushes", nameAm: "የጥርስ ሳሙናና ብሩሽ", qty: "200 Sets / Month", available: "50 Sets", urgency: "Medium (መካከለኛ)", beneficiaries: "200+ People", impact: "Oral health routine kits for recovering residents and incoming admissions" },
  { done: "☐", category: "Hygiene (ንጽህና)", nameEn: "Toilet Paper & Sanitizers", nameAm: "ሶፍትና ሳኒታይዘር", qty: "30 Packs / Month", available: "6 Packs", urgency: "Medium (መካከለኛ)", beneficiaries: "200+ People", impact: "Shelter bathroom and communal area hygiene maintenance" },

  // 💊 3. Medicine (መድሃኒት)
  { done: "☐", category: "Medicine (መድሃኒት)", nameEn: "First Aid & Gauze Bandages", nameAm: "የመጀመሪያ እርዳታና ባንዴጅ", qty: "50 Rolls / Month", available: "12 Rolls", urgency: "High (ከፍተኛ)", beneficiaries: "60 Patients", impact: "Immediate physical wound treatment and dressing for rescued street patients" },
  { done: "☐", category: "Medicine (መድሃኒት)", nameEn: "Medical Disinfectants & Alcohol", nameAm: "አልኮልና ሳቭሎን", qty: "25 Liters / Month", available: "6 Liters", urgency: "High (ከፍተኛ)", beneficiaries: "200+ People", impact: "Dispensary room sterilization and physical wound disinfection" },
  { done: "☐", category: "Medicine (መድሃኒት)", nameEn: "Blood Pressure & Glucose Kits", nameAm: "የደም ግፊትና ስኳር መመርመሪያ", qty: "10 Device Kits / Strips", available: "2 Kits", urgency: "Medium (መካከለኛ)", beneficiaries: "80 Elderly", impact: "Regular vital monitoring for elderly residents with chronic conditions" },

  // 🧠 4. Psychiatry / Psychology (ስነ-አእምሮ)
  { done: "☐", category: "Psychiatry (ስነ-አእምሮ)", nameEn: "Art Therapy Sketchbooks & Colors", nameAm: "የስዕልና ስነ-ጥበብ ደብተሮችና ቀለሞች", qty: "100 Books / Month", available: "25 Books", urgency: "Medium (መካከለኛ)", beneficiaries: "50 Patients", impact: "Expressive psychological therapy and calming cognitive rehabilitation" },
  { done: "☐", category: "Psychiatry (ስነ-አእምሮ)", nameEn: "Board Games, Chess & Puzzles", nameAm: "የጠረጴዛ ጨዋታዎች፣ ቼዝ፣ ዶሚኖ", qty: "20 Game Sets", available: "4 Sets", urgency: "Medium (መካከለኛ)", beneficiaries: "70 Patients", impact: "Brain stimulation, focus building, and social interaction among residents" },
  { done: "☐", category: "Psychiatry (ስነ-አእምሮ)", nameEn: "Music & Audio Therapy Players", nameAm: "የሙዚቃና የኦዲዮ ማዳመጫ እቃዎች", qty: "10 Audio Sets", available: "2 Sets", urgency: "Low (ዝቅተኛ)", beneficiaries: "60 Patients", impact: "Calming auditory therapy and spiritual relaxation for restless patients" },

  // 📦 5. Supplies / Material (ቁሳቁስ)
  { done: "☐", category: "Supplies (ቁሳቁስ)", nameEn: "Heavy Warm Blankets", nameAm: "ወፍራም ብርድልብሶች", qty: "100 Blankets / Season", available: "30 Blankets", urgency: "High (ከፍተኛ)", beneficiaries: "100 People", impact: "Essential protection against the cold, rainy Entoto mountain climate" },
  { done: "☐", category: "Supplies (ቁሳቁስ)", nameEn: "High-Density Foam Mattresses", nameAm: "የስፖንጅ ፍራሾች", qty: "40 Mattresses", available: "10 Mattresses", urgency: "High (ከፍተኛ)", beneficiaries: "40 People", impact: "Clean, dignified bedding for newly rescued residents and dormitory expansion" },
  { done: "☐", category: "Supplies (ቁሳቁስ)", nameEn: "Bed Sheets & Pillowcases", nameAm: "አንሶላና የትራስ ጨርቅ", qty: "150 Pairs", available: "40 Pairs", urgency: "Medium (መካከለኛ)", beneficiaries: "150 People", impact: "Dormitory bed sanitation, regular rotation, and peaceful sleep environment" },
  { done: "☐", category: "Supplies (ቁሳቁስ)", nameEn: "Warm Jackets, Sweaters & Coats", nameAm: "ጃኬቶችና ሹራቦች", qty: "150 Pieces", available: "45 Pieces", urgency: "High (ከፍተኛ)", beneficiaries: "150 People", impact: "Warm winter apparel for rescued elderly residents and psychiatric patients" },
  { done: "☐", category: "Supplies (ቁሳቁስ)", nameEn: "Kitchen Utensils, Pots & Plates", nameAm: "ትላልቅ ድስቶች፣ ሰሃኖችና ኩባያዎች", qty: "50 Sets", available: "15 Sets", urgency: "Medium (መካከለኛ)", beneficiaries: "200+ People", impact: "Large-scale cooking pots and dining utensils for communal resident meal times" }
]);
styleSheet(ws6, "D97706");

// ─────────────────────────────────────────────────────────────
// 7. Transformation Stories
// ─────────────────────────────────────────────────────────────
const ws7 = workbook.addWorksheet("7. Transformation Stories");
ws7.columns = [
  { header: "Done? [✓]", key: "done", width: 12 },
  { header: "Beneficiary Alias / Case Title", key: "title", width: 30 },
  { header: "Current Status / Milestone", key: "status", width: 28 },
  { header: "Before Story (Street Background / Trauma)", key: "before", width: 50 },
  { header: "After Story (Treatment, Healing & Daily Life Today)", key: "after", width: 50 },
  { header: "High-Res Photo Available?", key: "photo", width: 25 }
];
ws7.addRows([
  { done: "☐", title: "Psychiatric Care & Recovery (Case 1)", status: "Fully Recovered & Restored", before: "Living on street pavements with severe untreated illness and no shelter or caregivers.", after: "Provided psychiatric treatment, warm clothing, and holistic family care. Now peaceful and healthy.", photo: "Yes (person1.jpg)" },
  { done: "☐", title: "Restoration of Health & Joy (Case 2)", status: "Rehabilitated & Thriving", before: "Found in severe distress and vulnerability living on open city street corners.", after: "Received full psychiatric care and love. Now neatly dressed in traditional Habesha attire with joy.", photo: "Yes (person3.jpg)" },
  { done: "☐", title: "Rehabilitation & Dignity (Case 3)", status: "Recovered & Reintegrated", before: "Lived on street curbs struggling with chronic untreated psychiatric illness.", after: "Restored to complete health, clean-shaven, well-dressed, and living with human dignity.", photo: "Yes (person2.jpg)" },
  { done: "☐", title: "Full Recovery & Working (Case 4)", status: "Fully Recovered & Employed", before: "Suffered on city streets without shelter, proper food, or medical attention.", after: "Rehabilitated and healed. Now neatly groomed, wearing a formal suit, and working productively.", photo: "Yes (person4.jpg)" },
  { done: "☐", title: "(Add Real Story Case 5)", status: "", before: "", after: "", photo: "" },
  { done: "☐", title: "(Add Real Story Case 6)", status: "", before: "", after: "", photo: "" }
]);
styleSheet(ws7, "4338CA");

// ─────────────────────────────────────────────────────────────
// 8. News & Events
// ─────────────────────────────────────────────────────────────
const ws8 = workbook.addWorksheet("8. News & Events");
ws8.columns = [
  { header: "Done? [✓]", key: "done", width: 12 },
  { header: "Type (News / Event)", key: "type", width: 18 },
  { header: "Title (English & Amharic)", key: "title", width: 35 },
  { header: "Date / Time", key: "date", width: 22 },
  { header: "Category", key: "cat", width: 18 },
  { header: "Short Summary Excerpt", key: "excerpt", width: 40 },
  { header: "Full Article Body / Event Location & Goal", key: "body", width: 50 },
  { header: "Cover Photo File", key: "photo", width: 20 }
];
ws8.addRows([
  { done: "☐", type: "Event", title: "Shelter Expansion & Psychiatric Medication Drive", date: "August 21, 2026", cat: "Fundraising", excerpt: "Special fundraising effort to furnish 50 new recovery beds and medication.", body: "Location: Entoto Raguel Selihom Shelter. Target Goal: 2,000,000 ETB.", photo: "" },
  { done: "☐", type: "Event", title: "New Year Holiday Community Feast Drive", date: "September 10, 2026", cat: "Fundraising", excerpt: "Providing holiday meals and traditional attire for 200+ beneficiaries.", body: "Location: Selihom Center Addis Ababa. Target Goal: 800,000 ETB.", photo: "" },
  { done: "☐", type: "News", title: "Vocational Skills Program Graduation", date: "2026-09-15", cat: "Stories", excerpt: "15 beneficiaries successfully completed handicraft and baking training.", body: "Full story detailing graduation ceremony, testimonials, and self-reliance certificates.", photo: "" },
  { done: "☐", type: "News", title: "Expansion of Medical Dispensary Ward", date: "2026-08-01", cat: "Health", excerpt: "New clinical room equipped to safely store essential psychiatric drugs.", body: "Full story of partnership with medical consultants and pharmacy donors.", photo: "" }
]);
styleSheet(ws8, "15803D");

// ─────────────────────────────────────────────────────────────
// 9. Visiting & Volunteers
// ─────────────────────────────────────────────────────────────
const ws9 = workbook.addWorksheet("9. Visiting & Volunteers");
ws9.columns = [
  { header: "Done? [✓]", key: "done", width: 12 },
  { header: "Section", key: "section", width: 22 },
  { header: "Item / Role Name (English)", key: "nameEn", width: 30 },
  { header: "Item / Role Name (Amharic)", key: "nameAm", width: 28 },
  { header: "Schedule / Capacity / Time Slots", key: "schedule", width: 35 },
  { header: "Role Description / Responsibilities", key: "desc", width: 50 }
];
ws9.addRows([
  { done: "☐", section: "Visiting Hours", nameEn: "Morning Time Slot 1", nameAm: "የጠዋት ጉብኝት ሰዓት 1", schedule: "09:00 AM – 10:30 AM (Max 15 visitors)", desc: "Guided tour, meeting residents, morning prayer & tea time" },
  { done: "☐", section: "Visiting Hours", nameEn: "Morning Time Slot 2", nameAm: "የጠዋት ጉብኝት ሰዓት 2", schedule: "11:00 AM – 12:30 PM (Max 15 visitors)", desc: "Shelter walkthrough, lunchtime meal sharing assistance" },
  { done: "☐", section: "Visiting Hours", nameEn: "Afternoon Time Slot 1", nameAm: "ከሰዓት ጉብኝት ሰዓት 1", schedule: "02:00 PM – 03:30 PM (Max 15 visitors)", desc: "Rehabilitation activities, elder companionship" },
  { done: "☐", section: "Visiting Hours", nameEn: "Afternoon Time Slot 2", nameAm: "ከሰዓት ጉብኝት ሰዓት 2", schedule: "04:00 PM – 05:30 PM (Max 15 visitors)", desc: "Evening fellowship & drop-off of in-kind goods" },
  { done: "☐", section: "Volunteer Role", nameEn: "Kitchen & Meal Preparation", nameAm: "የምግብ ዝግጅትና ማብሰል", schedule: "Flexible / Weekdays & Weekends", desc: "Assisting cooks with vegetables, injera, and serving meals" },
  { done: "☐", section: "Volunteer Role", nameEn: "Medical & Psychiatric Nursing", nameAm: "የጤናና የህክምና ክትትል", schedule: "Weekdays / Morning Shifts", desc: "Supporting clinical staff with vitals, dressing, hygiene" },
  { done: "☐", section: "Volunteer Role", nameEn: "Elderly Companionship & Care", nameAm: "የአዛውንቶች እንክብካቤ", schedule: "Flexible", desc: "Walking, reading, listening, and encouraging seniors" },
  { done: "☐", section: "Volunteer Role", nameEn: "Vocational Handicraft Trainer", nameAm: "የሙያ ስልጠና አሰልጣኝ", schedule: "Weekly Sessions", desc: "Teaching knitting, baking, woodwork, or gardening" }
]);
styleSheet(ws9, "B45309");

// ─────────────────────────────────────────────────────────────
// 10. Testimonials & FAQs
// ─────────────────────────────────────────────────────────────
const ws10 = workbook.addWorksheet("10. Testimonials & FAQs");
ws10.columns = [
  { header: "Done? [✓]", key: "done", width: 12 },
  { header: "Type", key: "type", width: 18 },
  { header: "Person Name / Question (EN)", key: "itemEn", width: 35 },
  { header: "Person Name / Question (AM)", key: "itemAm", width: 35 },
  { header: "Role / Category", key: "category", width: 25 },
  { header: "Quote / Answer Content (EN & AM)", key: "content", width: 55 },
  { header: "Photo Available?", key: "photo", width: 20 }
];
ws10.addRows([
  { done: "☐", type: "Testimonial", itemEn: "Abebe Wale", itemAm: "አበበ ዋለ", category: "Recovered Beneficiary", content: "Selihom rescued me from the street and gave me my life back. Now I volunteer to help others heal.", photo: "Yes" },
  { done: "☐", type: "Testimonial", itemEn: "Almaz Tesfaye", itemAm: "አልማዝ ተስፋዬ", category: "Community Volunteer", content: "Seeing people with mental illness heal and regain their human dignity brings unspeakable joy.", photo: "Yes" },
  { done: "☐", type: "Testimonial", itemEn: "Dr. Semere Kebede", itemAm: "ዶ/ር ሰመረ ከበደ", category: "Medical Consultant", content: "Selihom's transparency and dedication are exceptional. Every donation goes directly to patient care.", photo: "Yes" },
  { done: "☐", type: "FAQ", itemEn: "Is Selihom an officially registered organization?", itemAm: "ሰሊሆም ማህበር ህጋዊ ፍቃድ ያለው ድርጅት ነው?", category: "Legal Registration", content: "Yes! Registered under No. 1113/2019 (Code 6131) with FDRE Agency for Civil Society Organizations.", photo: "N/A" },
  { done: "☐", type: "FAQ", itemEn: "Where and how was the organization founded?", itemAm: "ድርጅቱ ከየት ነው የተመሰረተው?", category: "Founding Story", content: "Founded by Mikiyas Legesse after losing his father to mental illness, starting in Shinkur.", photo: "N/A" },
  { done: "☐", type: "FAQ", itemEn: "How can I make a financial or in-kind donation?", itemAm: "እርዳታዎችን ወይም የገንዘብ ድጋፍን እንዴት መስጠት እችላለሁ?", category: "Donations", content: "Direct bank transfer to CBE, Abyssinia, Awash, Telebirr, or in-kind delivery to Entoto shelter.", photo: "N/A" },
  { done: "☐", type: "FAQ", itemEn: "Can I schedule a visit to the shelter?", itemAm: "ማህበሩን በአካል ጎብኝቼ ማየት እችላለሁ?", category: "Visits", content: "Yes! Visitors are welcome near Entoto St. Raguel Church. Booking in advance is recommended.", photo: "N/A" }
]);
styleSheet(ws10, "6B21A8");

// ─────────────────────────────────────────────────────────────
// 11. Photos & Documents Checklist
// ─────────────────────────────────────────────────────────────
const ws11 = workbook.addWorksheet("11. Photos & Documents");
ws11.columns = [
  { header: "Done? [✓]", key: "done", width: 12 },
  { header: "Asset Category", key: "cat", width: 25 },
  { header: "Required File / Photo Description", key: "desc", width: 45 },
  { header: "Recommended Resolution & Format", key: "format", width: 32 },
  { header: "Where It Will Be Displayed on Site", key: "placement", width: 35 },
  { header: "Status / File Name Collected", key: "status", width: 30 }
];
ws11.addRows([
  { done: "☐", cat: "Brand Identity", desc: "Official Selihom Logo (High Resolution)", format: "PNG (transparent background) & JPG", placement: "Header, Navbar, Footer, Certificates", status: "" },
  { done: "☐", cat: "Legal Documents", desc: "Government Registration Certificate Scan", format: "High-resolution flat scan / JPG", placement: "Legal Verification modal & About section", status: "" },
  { done: "☐", cat: "Leadership", desc: "Founder Ato Mikiyas Legesse Portrait", format: "High-res portrait photo (JPG)", placement: "Founder quote, About section, Leadership", status: "" },
  { done: "☐", cat: "Awards & Honors", desc: "Plaques, Certificates of Appreciation (6-8 photos)", format: "High-resolution photos (JPG/PNG)", placement: "Achievements & Awards interactive gallery", status: "" },
  { done: "☐", cat: "Facilities & Grounds", desc: "Entoto Raguel Compound & Shelter (6-10 photos)", format: "Landscape 1920x1080 (JPG)", placement: "Hero Carousel, About section, Visit booking", status: "" },
  { done: "☐", cat: "Daily Life & Care", desc: "Meal sharing, group therapy, garden (8-12 photos)", format: "High-resolution candid photos (JPG)", placement: "Main Gallery section & Initiatives", status: "" },
  { done: "☐", cat: "Recovery Stories", desc: "Before & After Recovery Photos (4-6 pairs)", format: "High-resolution portrait/landscape (JPG)", placement: "Transformation Stories interactive carousel", status: "" },
  { done: "☐", cat: "Vocational Skills", desc: "Beneficiaries learning crafts/baking (4-6 photos)", format: "High-resolution photos (JPG)", placement: "Programs section & News articles", status: "" }
]);
styleSheet(ws11, "374151");

// Save Workbook
await workbook.xlsx.writeFile(outputPath);
console.log(`\n✅ Enhanced Excel Workbook created at:\n${outputPath}\n`);
