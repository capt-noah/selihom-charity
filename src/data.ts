import { Initiative, Testimonial, InKindItem, TransformationStory, ValueItem, BankAccount, EventItem, GalleryItem } from "./types";

// Real photos — awards, founder, beneficiaries
import selihomLogo    from "./assets/images/selihom_logo.jpg";
import charityOwnerImg from "./assets/images/charity-owner.jpg";
import award1Img      from "./assets/images/award1.jpg";
import award2Img      from "./assets/images/award2.jpg";
import award3Img      from "./assets/images/award3.jpg";
import award4Img      from "./assets/images/award4.jpg";
import award5Img      from "./assets/images/award5.jpg";
import award6Img      from "./assets/images/award6.jpg";
import award7Img      from "./assets/images/award7.jpg";
import person1Img     from "./assets/images/person1.jpg";
import person2Img     from "./assets/images/person2.jpg";
import person3Img     from "./assets/images/person3.jpg";
import person4Img     from "./assets/images/person4.jpg";
import officialCertificate from "./assets/images/award1.jpg";
import elderlyWiseCutout   from "./assets/images/elderly_wise.jpg";
import teddyAfroImg from "./assets/images/teddy_afro.jpg";
import adanechImg   from "./assets/images/adanech.jpg";
import priestImg    from "./assets/images/priest.jpg";

import img1304 from "./assets/images/IMG_1304.JPG";
import img1305 from "./assets/images/IMG_1305.JPG";
import img1306 from "./assets/images/IMG_1306.JPG";
import img1307 from "./assets/images/IMG_1307.JPG";
import img1309 from "./assets/images/IMG_1309.JPG";
import img1310 from "./assets/images/IMG_1310.JPG";
import img1312 from "./assets/images/IMG_1312.JPG";
import img1314 from "./assets/images/IMG_1314.JPG";
import img1315 from "./assets/images/IMG_1315.JPG";
import img1316 from "./assets/images/IMG_1316.JPG";
import img1317 from "./assets/images/IMG_1317.JPG";
import img1318 from "./assets/images/IMG_1318.JPG";
import img1319 from "./assets/images/IMG_1319.JPG";
import img1320 from "./assets/images/IMG_1320.JPG";
import img1321 from "./assets/images/IMG_1321.JPG";
import img1322 from "./assets/images/IMG_1322.JPG";
import img1323 from "./assets/images/IMG_1323.JPG";
import img1324 from "./assets/images/IMG_1324.JPG";
import img1325 from "./assets/images/IMG_1325.JPG";
import img1326 from "./assets/images/IMG_1326.JPG";
import img1327 from "./assets/images/IMG_1327.JPG";
import img1328 from "./assets/images/IMG_1328.JPG";
import img1329 from "./assets/images/IMG_1329.JPG";
import img1330 from "./assets/images/IMG_1330.JPG";
import img1331 from "./assets/images/IMG_1331.JPG";
import img1332 from "./assets/images/IMG_1332.JPG";
import img1333 from "./assets/images/IMG_1333.JPG";
import img1334 from "./assets/images/IMG_1334.JPG";
import img1335 from "./assets/images/IMG_1335.JPG";
import img1336 from "./assets/images/IMG_1336.JPG";
import img1337 from "./assets/images/IMG_1337.JPG";


export const IMAGES = {
  selihomLogo,
  officialCertificate,
};

export const SELIHOM_INFO = {
  name: { am: "ሰሊሆም", en: "Selihom" },
  fullName: { am: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር", en: "Selihom Mentally Ill People Support Association" },
  motto: { am: "ደግ ልቦች ከውብ ፊቶች ይበልጣሉ!", en: "Kind hearts excel beautiful faces!" },
  hero: {
    title: { am: "በመስራት ላይ ያለው", en: "Making a Difference" },
    subtitle: { am: "ተስፋ • ፍቅር • አንድነት", en: "Hope • Love • Unity" },
    description: {
      am: "የአዕምሮ ህሙማንን፣ አዛውንቶችንና ህጻናትን በመደገፍ ወደ ማህበረሰብ እንዲመለሱ ማስቻል።",
      en: "Supporting people with mental illness, vulnerable elderly people, and children by providing care, treatment, and rehabilitation so they can reintegrate into society."
    }
  },
  registration: {
    number: "1113/2019",
    date: "30/02/2011 ዓ.ም (Oct 30, 2018)",
    agency: {
      am: "የኢትዮጵያ ፌደራላዊ ዲሞክራሲያዊ ሪፐብሊክ የሲቪል ማህበረሰብ ድርጅቶች ኤጀንሲ",
      en: "Federal Democratic Republic of Ethiopia Agency for Civil Society Organizations"
    },
    certificateImage: officialCertificate
  },
  about: {
    founder: { am: "አቶ ሚኪያስ ለገሰ (መስራች እና ዋና ስራ አስኪያጅ)", en: "Mr. Mikiyas Legesse (Founder & General Manager)" },
    history: {
      title: { am: "አመሰራረት", en: "Our Story" },
      summary: {
        am: "ሰሊሆም ማህበር የተመሰረተው በአቶ ሚኪያስ ለገሰ አባታቸውን በአዕምሮ ህመም ምክንያት ካጡ በኋላ ነው። በዚህ ሀዘን በመነሳት፣ በጎዳና ላይ የሚኖሩ የአዕምሮ ህሙማንን ማንሳት ጀመሩ። በሺንቁር ቅዱስ ሚካኤል ቤተክርስቲያን አቅራቢያ አነስተኛ የተከራየች ቤት በመጀመር፣ እሳቸውና በጎ ፈቃደኞች ጫማ በመወልወል፣ መኪና በማጠብና እርዳታ በመሰብሰብ ገቢ ያሰባስቡ ነበር። ድርጅቱ እያደገ ሲመጣ ወደ እንጦጦ ራጉኤል ቤተክርስቲያን አቅራቢያ ተዛውሮ አሁን ላይ 200 እስከ 400 ተጠቃሚዎችን የሚረዳ ሲሆን፣ ከእነዚህም ውስጥ 85% ያህሉ ከፍተኛ መሻሻል አሳይተዋል።",
        en: "Selihom was founded by Mikiyas Legesse after losing his father to mental illness. Motivated by this tragedy, he began rescuing people living on the streets with mental illness. Starting with a small rented house near St. Michael Church in Shinkur, he and volunteers raised funds by cleaning shoes, washing cars, and collecting donations. As the organization grew, it relocated near Entoto Raguel Church, where it now serves 200 to 400 beneficiaries, with approximately 85% showing significant recovery."
      }
    },
    vision: {
      title: { am: "ራዕይ", en: "Vision" },
      content: {
        am: "በደረሰባቸው የአእምሮ ህመም ምክንያት እብድ..በሽተኛ.. ወዘተ ተብለው ለሰው ልጅ ሁሉ ባልተገባ ሁኔታ ውሎና አዳራቸው በቆሸሸ እና በተጠላ ስፍራ ሆኖ ቆሻሻዎችን እየተመገቡ በህመም እና በረሃብ ሰውነታቸው የተጎሳቆለ እንዲሁም በእድሜያቸው መግፋት ሸክም ሆኖባቸው ጧሪ እና ተንከባካቢ በማጣት በጎዳና ላይ የዋሉ አዛውንቶችንና የሀገር ባለውለታዎችን ወደ ማእከሉ በማስገባት ፍቅር እና እንክብካቤ እንዲያገኙ ማድረግ የሰሊሆም ታላቁ ራእይ ነው።",
        en: "To bring individuals who, due to mental illness, have been stigmatized and left in inhumane conditions—spending their days in rejected places, feeding on waste, their bodies devastated by illness and hunger—as well as elderly citizens and national elders abandoned without care, into our center so that they receive genuine love, dignified care, and healing: this is Selihom's greatest vision."
      }
    },
    mission: {
      title: { am: "ተልዕኮ", en: "Mission" },
      content: {
        am: "በአእምሮ ህመም፣ በስጋዊ ቁስለት፣ በሰው ሰራሽና በተፈጥሮ አደጋ፣ በረሃብ እና ደጋፊ በማጣት ምክንያት ወደ ማእከላችን ያስገባናቸውን ህሙማኖች በምናደርግላቸው እንክብካቤ እንዲያገኙ በምናደርገው ህክምና የጤና ለውጥ እንዲያመጡ በትጋት መስራት፤ የጤና ለውጥ ያመጡ ህሙማኖችንም ከስነ-አእምሮ ባለሙያዎች ጋር ትስስር በመፍጠር ከገቡበት የአእምሮ ዝቅታ እንዲወጡ አጠንክረን መስራት እና ወደ አእምሮ ከፍታ ማምጣት ታላቅ ተልእኳችን ነው።",
        en: "To work tirelessly so that the patients brought to our center due to mental illness, physical wounds, crises, hunger, and lack of support experience true health transformation through compassionate care and medical treatment; and to connect recovered patients with psychiatric professionals to lift them out of psychological despair and guide them to mental elevation: this is our highest mission."
      }
    },
    objectives: {
      title: { am: "ዓላማ", en: "Objectives" },
      content: {
        am: "ማእከላችን በሚያደርግላቸው እንክብካቤ እንዲያገኙ በምናስችለው ህክምና ወደ ቀድሞ ጤናቸው የተመለሱ ህሙማኖችን ከተለያዩ የሙያ ተቋማት እና ማህበራት እንዲሁም ግለሰቦች ጋር ትስስር በመፍጠር የተለያዩ ስልጠናዎችን እንዲያገኙ ማስቻል፣ በሚያገኙት ስልጠናም የተለያዩ የሙያ ስራዎችን የሚሰሩበትን ሁኔታ ማመቻቸት እና በሚሰሩባቸው ስራዎች ራሳቸውንም ሆነ በዙሪያቸው ያሉ ወገኖችን እንዲጠቅሙ ማድረግና ለብዙዎች አርአያ የሚሆንበትን እድል በህይወታቸው ውስጥ እንዲፈጠር ማስቻል የሰሊሆም የአእምሮ ህሙማን መርጃ ማህበር አላማ ነው።",
        en: "To connect patients who have restored their health through the care and treatment provided at our center with vocational institutes, associations, and supportive individuals to receive diverse skills training; to facilitate opportunities for them to engage in professional trades so they can support themselves and benefit those around them; and to enable them to become inspirational role models in society: this is the foremost objective of Selihom."
      }
    }
  },
  contact: {
    address: {
      am: "ከእንጦጦ ቅዱስ ራጉኤል ወኤልያስ ቤተክርስቲያን ወደ ፍተሻ በሚወስደው መንገድ 300 ሜትር ዝቅ ብሎ፣ አዲስ አበባ",
      en: "Near Entoto St. Raguel & Elias Church, 300 meters down on the road towards Fetesha, Addis Ababa, Ethiopia"
    },
    phones: [
      "+251911004903",
      "+251953905050",
      "0118195444",
      "0904440157"
    ],
    email: "selihomc@gmail.com",
    social: {
      telegram: "https://t.me/Selihommentallyill",
      facebook: "https://facebook.com/SelihomSupport"
    }
  }
};

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    bank: { am: "የኢትዮጵያ ንግድ ባንክ", en: "Commercial Bank of Ethiopia (CBE)" },
    accountNumber: "1000275107518",
    accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር"
  },
  {
    bank: { am: "አቢሲንያ ባንክ", en: "Bank of Abyssinia" },
    accountNumber: "77984852",
    accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር"
  },
  {
    bank: { am: "አዋሽ ባንክ", en: "Awash Bank" },
    accountNumber: "01303572131300",
    accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር"
  },
  {
    bank: { am: "ቡና ባንክ", en: "Bunna Bank" },
    accountNumber: "2919601000145",
    accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር"
  },
  {
    bank: { am: "ስንቄ ባንክ", en: "Sinquee Bank" },
    accountNumber: "1106177681225",
    accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር"
  },
  {
    bank: { am: "ቴሌብር (ሞባይል ገንዘብ)", en: "Telebirr (Mobile Money)" },
    accountNumber: "0911004903",
    accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር (ሚኪያስ ለገሰ)"
  }
];

export const VALUES: ValueItem[] = [
  { id: "val-1", title: { am: "ግልጸኝነት", en: "Transparency" }, description: { am: "ሁሉንም ሀብቶችና እርዳታዎች በግልጽነት ለህዝብ ማሳወቅ።", en: "Complete public accountability and clear reporting of all donations and resources." } },
  { id: "val-2", title: { am: "ቅንነት", en: "Sincerity & Integrity" }, description: { am: "በፍቅርና በታማኝነት ማህበረሰቡን ማገልገል።", en: "Serving with genuine love, truthfulness, and unwavering dedication to every resident." } },
  { id: "val-3", title: { am: "በእዉቀትና በእምነት መመራት", en: "Guided by Knowledge & Faith" }, description: { am: "በሙያዊ እውቀትና በእምነት ማህበረሰቡን መምራት።", en: "Combining professional psychiatric and medical healthcare with compassionate faith." } },
  { id: "val-4", title: { am: "ያለ አድሎ ድጋፍ ማድረግ", en: "Non-discriminatory Support" }, description: { am: "ማንኛውንም ሰው ያለ አድሎ በእኩልነት መርዳት።", en: "Serving all human beings equally with open arms regardless of background or condition." } },
  { id: "val-5", title: { am: "የላቀ አገልግሎት መስጠት", en: "Excellence in Service" }, description: { am: "ከፍተኛ ጥራት ያለው ሕክምናና እንክብካቤ መስጠት።", en: "Providing top-quality medical, psychiatric, and compassionate rehabilitation." } }
];

export const INITIATIVES: Initiative[] = [
  {
    id: "mental-health",
    title: { am: "ጎዳና የወደቁትን ማንሳት", en: "Helping People with Mental Illness" },
    description: {
      am: "የአዕምሮ ህሙማንን ከጎዳና በማንሳት እስከሚያገግሙ ድረስ ሕክምና፣ ምግብና ማህበራዊ ድጋፍ ማድረግ።",
      en: "Rescuing people with mental illness from the streets, providing medical care, rehabilitation, and continuous support until they recover and can return to society."
    },
    goal: 5000000,
    raised: 3850000,
    tags: {
      am: ["ሕክምና", "የአዕምሮ ጤና", "ማቋቋም"],
      en: ["Medical Care", "Mental Health", "Rehabilitation"]
    },
    icon: "HeartPulse"
  },
  {
    id: "elderly-support",
    title: { am: "አዛውንቶችን መርዳት", en: "Supporting the Elderly" },
    description: {
      am: "ተንከባካቢና ቤተሰብ የሌላቸውን አዛውንቶች መጠለያ፣ ምግብ፣ ሕክምናና ፍቅር መስጠት።",
      en: "Providing shelter, care, nutrition, medical support, and family warmth to elderly people who have no family or caregivers."
    },
    goal: 3500000,
    raised: 2900000,
    tags: {
      am: ["አዛውንቶች", "መጠለያ", "እንክብካቤ"],
      en: ["Elderly Care", "Shelter", "Dignity"]
    },
    icon: "HeartHandshake"
  },
  {
    id: "children-support",
    title: { am: "ህጻናትን መርዳት", en: "Helping Children" },
    description: {
      am: "ቤተሰብ የሌላቸውንና ተጋላጭ የሆኑ ህጻናት ሕክምና፣ ትምህርትና አጠቃላይ ድጋፍ ማድረግ።",
      en: "Providing medical care, education, and holistic support for vulnerable children without proper family care."
    },
    goal: 2500000,
    raised: 1800000,
    tags: {
      am: ["ህጻናት", "ትምህርት", "ህክምና"],
      en: ["Children", "Education", "Healthcare"]
    },
    icon: "BookOpen"
  },
  {
    id: "skills-training",
    title: { am: "ስልጠናዎችን መስጠት", en: "Skills & Vocational Training" },
    description: {
      am: "ከህክምና በኋላ ተጠቃሚዎች የሙያ ስልጠና አግኝተው በራሳቸው እንዲቆሙና ወደ ማህበረሰብ እንዲቀላቀሉ ማስቻል።",
      en: "Providing vocational and life-skills training to recovered beneficiaries so they can become self-sufficient and successfully reintegrate into society."
    },
    goal: 3000000,
    raised: 2100000,
    tags: {
      am: ["የሙያ ስልጠና", "ስራ እድል", "ራስን መቻል"],
      en: ["Vocational Training", "Employment", "Self-Sufficiency"]
    },
    icon: "UtensilsCrossed"
  }
];

export const TRANSFORMATION_STORIES: TransformationStory[] = [
  {
    id: "story-wondwossen",
    name: { am: "ወንደሰን ከበደ", en: "Wondwossen Kebede" },
    status: { am: "ሙሉ በሙሉ ያገገመ • የመስተንግዶ መሪ", en: "Fully Recovered • Resident Dining Lead" },
    storyBefore: {
      am: "ማእከላችን ከመምጣቱ በፊት በከባድ የአእምሮ ህመም ምክንያት በጎዳና ላይ ያለ መጠለያና ምግብ ይኖር ነበር።",
      en: "Lived on harsh city streets suffering from severe untreated mental illness without shelter, food, or dignity."
    },
    storyAfter: {
      am: "ማእከላችን ከገባ በኋላ የምግብ፣ የመጠለያ፣ የአልባሳትና የመድሃኒት ድጋፍ ተደርጎለት በጥሩ ጤንነት ላይ ይገኛል፤ አሁን በማእከሉ የቁርስ፣ ምሳና እራት መስተንግዶ ላይ ይሰራል!",
      en: "Received complete psychiatric care, housing, nutrition, and recovery monitoring. Now in excellent health, proudly leading resident dining service!"
    },
    image: person4Img,
    imagePosition: "object-top"
  },
  {
    id: "story-birqineh",
    name: { am: "ብርቅነህ ከበደ", en: "Birqineh Kebede" },
    status: { am: "ያገገመ • የህሙማን ተንከባካቢ", en: "Fully Recovered • Inpatient Caregiver" },
    storyBefore: {
      am: "ማእከላችን ከመምጣቱ በፊት በጎዳና ላይ ተጥሎ በከፍተኛ ህመም እና ችግር ውስጥ ይኖር ነበር።",
      en: "Abandoned on the street in deep distress, suffering without medical care, clothing, or physical support."
    },
    storyAfter: {
      am: "የምግብ፣ የመጠለያ፣ የአልባሳትና የመድሃኒት ክትትል ተደርጎለት ሙሉ በሙሉ ድኗል፤ አሁን አዲስ የሚገቡ ህሙማንን በማእከሉ ውስጥ በመንከባከብ ያገለግላል!",
      en: "Healed through compassionate psychiatric treatment, nutrition, and love. Now works full-time as a dedicated caregiver for incoming patients!"
    },
    image: person2Img,
    imagePosition: "object-top"
  },
  {
    id: "story-menur",
    name: { am: "መኑር ሰማ", en: "Menur Sema" },
    status: { am: "ያገገመ • የብረት ብየዳ ባለሙያ", en: "Fully Recovered • Skilled Metal Welder" },
    storyBefore: {
      am: "በአእምሮ ህመም ምክንያት በጎዳና ላይ ተጥሎ በከፍተኛ ረሃብና እንክብካቤ እጦት ይኖር ነበር።",
      en: "Lived on the streets battling acute mental distress, extreme hunger, and cold mountain weather."
    },
    storyAfter: {
      am: "በሰሊሆም ሙሉ የህክምናና የተሃድሶ ድጋፍ አግኝቶ ጤንነቱ ተመልሷል፤ የሙያ ስልጠና ወስዶ አሁን በብረት ብየዳ ሙያ ላይ ተሰማርቶ በራሱ ይኖራል!",
      en: "Restored to complete health at Selihom. Received vocational training and is now an independently employed professional metal welder!"
    },
    image: person1Img,
    imagePosition: "object-center"
  },
  {
    id: "story-fisseha",
    name: { am: "ፍስሃ ሞገስ", en: "Fisseha Moges" },
    status: { am: "ያገገመ • ባለሙያ ሹፌር", en: "Fully Recovered • Professional Driver" },
    storyBefore: {
      am: "ማእከላችን ከመምጣቱ በፊት በጎዳና ላይ ተስፋ ቆርጦ በከፍተኛ ህመም ውስጥ ይኖር ነበር።",
      en: "Endured street life with debilitating mental illness, without clean clothing, sanitation, or family."
    },
    storyAfter: {
      am: "የምግብ፣ የመጠለያ፣ የአልባሳትና የመድሃኒት ድጋፍ አግኝቶ በጥሩ ጤንነት ላይ ይገኛል፤ አሁን በሹፍርና ሙያ ላይ ተሰማርቶ ራሱንና ሌሎችን ይረዳል!",
      en: "Fully rehabilitated through daily psychiatric care and warm shelter. Now thriving as a licensed professional driver!"
    },
    image: person3Img,
    imagePosition: "object-center"
  },
  {
    id: "story-nesru",
    name: { am: "ነስሩ መሃመድ", en: "Nesru Mohammed" },
    status: { am: "ያገገመ • የጥበቃ ባለሙያ", en: "Fully Recovered • Facility Security Officer" },
    storyBefore: {
      am: "ማእከላችን ከመምጣቱ በፊት በጎዳና ላይ ተጥሎ በከፍተኛ አደጋ ውስጥ ይኖር ነበር።",
      en: "Struggled on street curbs without safety, shelter, or psychiatric medical assistance."
    },
    storyAfter: {
      am: "በማእከላችን ህክምናና ፍቅር አግኝቶ በጥሩ ጤንነት ላይ ይገኛል፤ አሁን በማእከሉ የጥበቃ ስራ ላይ በታማኝነት ይሰራል!",
      en: "Healed through continuous medical monitoring and shelter care. Now employed as a trusted security officer on campus!"
    },
    image: person2Img,
    imagePosition: "object-top"
  },
  {
    id: "story-mustefa",
    name: { am: "ሙስጠፋ ከድር", en: "Mustefa Kedir" },
    status: { am: "ያገገመ • የጥበቃ ባለሙያ", en: "Fully Recovered • Center Security Officer" },
    storyBefore: {
      am: "ማእከላችን ከመምጣቱ በፊት በጎዳና ላይ ይኖር ነበር፤ በህመም እና በረሃብ ሰውነቱ ተጎሳቁሎ የነበረ።",
      en: "Survived on the streets with untreated illness and malnutrition, rejected by society."
    },
    storyAfter: {
      am: "የምግብ፣ የመጠለያና የመድሃኒት ክትትል ተደርጎለት ሙሉ ጤንነቱ ተመልሷል፤ አሁን በማእከሉ በጥበቃ ስራ ላይ ይሰራል!",
      en: "Completely recovered through loving care, psychiatric medicine, and nourishment. Now proudly works in center security!"
    },
    image: person4Img,
    imagePosition: "object-top"
  },
  {
    id: "story-alemayehu",
    name: { am: "አለማየሁ ገ/ጻዲቅ", en: "Alemayehu G/Tsadik" },
    status: { am: "ያገገመ • የጥበቃ ባለሙያ", en: "Fully Recovered • Campus Safety Officer" },
    storyBefore: {
      am: "ማእከላችን ከመምጣቱ በፊት በጎዳና ላይ ይኖር የነበረ ወገናችን ነው።",
      en: "Lived on open streets without a caregiver or access to medical care."
    },
    storyAfter: {
      am: "በሰሊሆም ሙሉ እንክብካቤ፣ አልባሳትና ህክምና አግኝቶ በጥሩ የጤንነት ሁኔታ ላይ ይገኛል፤ አሁን በማእከሉ በጥበቃ ስራ ላይ ይሰራል!",
      en: "Restored to full physical and mental strength at Selihom. Now employed in safety and security for the center!"
    },
    image: person1Img,
    imagePosition: "object-center"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Wondwossen Kebede (ወንደሰን ከበደ)",
    role: { am: "ያገገመ ተጠቃሚና የማእከሉ ሰራተኛ", en: "Recovered Beneficiary & Shelter Staff" },
    quote: {
      am: "ሰሊሆም ከጎዳና አንስቶ ህይወቴን መልሶልኛል። አሁን እኔም ሌሎችን ለመርዳትና ለማገልገል በመስተንግዶ ስራ ላይ ደስተኛ ሆኛለሁ።",
      en: "Selihom rescued me from the street and gave me my life back. Now I find deep joy serving food and caring for others at the center."
    },
    avatar: person4Img
  },
  {
    id: "test-2",
    name: "Almaz Tesfaye",
    role: { am: "የማህበረሰብ በጎ ፈቃደኛ", en: "Regular Community Volunteer, Addis Ababa" },
    quote: {
      am: "ከሰኞ እስከ እሁድ ሰሊሆም ሲመጡ የአዕምሮ ህሙማን ሲድኑ፣ ንጹህ ልብስ ለብሰው ወደ ሰብአዊ ክብራቸው ሲመለሱ ማየት ትልቅ ደስታ ነው።",
      en: "Seeing people with mental illness heal, receive clean clothes, and regain their human dignity brings unspeakable joy every week."
    },
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "test-3",
    name: "Dr. Semere Kebede",
    role: { am: "የህክምና በጎ ፈቃደኛ አማካሪ", en: "Volunteer Medical Consultant" },
    quote: {
      am: "የሰሊሆም ግልጽነትና ቁርጠኝነት ልዩ ነው። የሚደረገው እያንዳንዱ እርዳታ በቀጥታ ለህሙማኑ ሕክምና፣ መድኃኒትና ምግብ ይውላል።",
      en: "Selihom's transparency and dedication are exceptional. Every single donation goes directly to beneficiary medical care, psychiatric medicines, and nutrition."
    },
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop"
  }
];

export const IN_KIND_ITEMS: InKindItem[] = [
  {
    id: "ik-1",
    name: { am: "ጤፍና የምግብ እህል", en: "Teff & Food Grains (Quintals)" },
    category: "Food",
    neededQuantity: { am: "50 ኩንታል ጤፍ / ወር", en: "50 Quintals / month" },
    urgency: "High",
    description: {
      am: "ለ400 ተጠቃሚዎች ዕለታዊ ትኩስ እንጀራና ምግብ ለማዘጋጀት የሚሆን ጤፍ፣ ምስር፣ ስንዴና ዘይት።",
      en: "Teff grain, cooking oil, lentils, split peas, and wheat flour to feed 400 beneficiaries daily."
    }
  },
  {
    id: "ik-2",
    name: { am: "የህክምናና መድሃኒት አቅርቦት", en: "Psychiatric & Medical Supplies" },
    category: "Medical",
    neededQuantity: { am: "የ48 ዓይነት መድሃኒቶች አቅርቦት", en: "48 Core Medicines Inventory" },
    urgency: "High",
    description: {
      am: "ለአእምሮ ህሙማን አስፈላጊ የሆኑ 48 ዓይነት ሳይካትሪና ሜዲካል መድሃኒቶች፣ ቁስል ማከሚያና አልኮል።",
      en: "48 essential psychiatric and clinical medications, wound dressing plaster, and surgical antiseptics."
    }
  },
  {
    id: "ik-3",
    name: { am: "የአልባሳትና ብርድልብስ ድጋፍ", en: "Warm Clothing & Heavy Blankets" },
    category: "Clothing",
    neededQuantity: { am: "150 ብርድልብሶችና 200 አልባሳት", en: "150 Blankets & 200 Clothes" },
    urgency: "High",
    description: {
      am: "የእንጦጦን ቅዝቃዜ ለመቋቋም የሚሆኑ ወፍራም ብርድልብሶች፣ ጃኬቶች፣ ጫማዎችና ንጹህ ልብሶች።",
      en: "Warm heavy blankets, winter jackets, walking shoes, and clean clothes for rescued residents."
    }
  },
  {
    id: "ik-4",
    name: { am: "የንፅህና መጠበቂያ እቃዎች", en: "Hygiene & Sanitation Kits" },
    category: "Hygiene",
    neededQuantity: { am: "600 ሳሙና፣ 50 ፓኬት ዳይፐር", en: "600 Soaps, 50 Diaper Packs" },
    urgency: "High",
    description: {
      am: "የአዋቂ ዳይፐር፣ ዋይፕስ፣ የገላና የልብስ ሳሙና፣ ኦሞና ሶፍት።",
      en: "Adult and child diapers, wet wipes, bath soap bars, laundry detergent, and toilet paper."
    }
  }
];

export const TIME_SLOTS = [
  "07:30 AM - 10:00 AM",
  "10:00 AM - 12:30 PM",
  "01:30 PM - 03:30 PM",
  "03:30 PM - 06:00 PM"
];

export const VISIT_TYPES = [
  { value: "individual", label: { am: "የግል / የቤተሰብ ጉብኝት", en: "Individual / Family Visit" }, icon: "User" },
  { value: "group", label: { am: "የጓደኞችና ቡድን ጉብኝት", en: "Friends & Small Group" }, icon: "Users" },
  { value: "corporate", label: { am: "የድርጅት / የማህበር ጉብኝት", en: "Corporate / NGO Team Day" }, icon: "Briefcase" },
  { value: "school", label: { am: "የትምህርት ቤት ጉብኝት", en: "School / Youth Tour" }, icon: "GraduationCap" },
  { value: "volunteer", label: { am: "የበጎ ፈቃደኝነት አገልግሎት", en: "Hands-on Volunteering Shift" }, icon: "Heart" },
];

export const FAQS = [
  {
    question: {
      am: "ሰሊሆም ማህበር ህጋዊ ፍቃድ ያለው ድርጅት ነው?",
      en: "Is Selihom an officially registered organization?"
    },
    answer: {
      am: "አዎ! ሰሊሆም ማህበር በኢትዮጵያ ፌደራላዊ ዲሞክራሲያዊ ሪፐብሊክ የሲቪል ማህበረሰብ ድርጅቶች ኤጀንሲ በምዝገባ ቁጥር 1113/2019 (በ30/02/2011 ዓ.ም) በህግ የተመዘገበና ፍቃድ ያለው በጎ አድራጎት ማህበር ነው።",
      en: "Yes! Selihom is officially registered under Registration No. 1113/2019 (issued Oct 30, 2018 / 30/02/2011 E.C.) with the Federal Democratic Republic of Ethiopia Civil Society Organizations Agency."
    }
  },
  {
    question: {
      am: "ድርጅቱ ከየት ነው የተመሰረተው?",
      en: "Where and how was the organization founded?"
    },
    answer: {
      am: "ድርጅቱ የተመሰረተው በአቶ ሚኪያስ ለገሰ አባታቸውን በአዕምሮ ህመም ምክንያት ካጡ በኋላ በወሰዱት ቁርጠኝነት ነው። በሽቁር ቅዱስ ሚካኤል አቅራቢያ አነስተኛ ቤት ተከራይተው ጫማ በመወልወልና መኪና በማጠብ ነበር ስራውን የጀመሩት። አሁን በእንጦጦ ራጉኤል ማእከሉ 400 ያህል ተጠቃሚዎችን ይንከባከባል።",
      en: "It was founded by Mikiyas Legesse after losing his father to mental illness. He started with a small rented room near St. Michael Church in Shinkur, raising funds through shoe-shining and car washing. Today, the center near Entoto Raguel supports up to 400 beneficiaries."
    }
  },
  {
    question: {
      am: "እርዳታዎችን ወይም የገንዘብ ድጋፍን በየትኞቹ ባንኮች መስጠት እችላለሁ?",
      en: "Which official bank accounts can I use for donations?"
    },
    answer: {
      am: "በኢትዮጵያ ንግድ ባንክ (1000275107518)፣ በአቢሲንያ ባንክ (77984852)፣ በአዋሽ ባንክ (01303572131300)፣ በቡና ባንክ (2919601000145)፣ በስንቄ ባንክ (1106177681225) ወይም በቴሌብር (0911004903) 'ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር' በሚለው ይፋዊ ስም ድጋፍ ማድረግ ይችላሉ።",
      en: "You can transfer directly to our official accounts under 'ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር': CBE (1000275107518), Abyssinia Bank (77984852), Awash Bank (01303572131300), Bunna Bank (2919601000145), Sinquee Bank (1106177681225), or Telebirr (0911004903)."
    }
  },
  {
    question: {
      am: "ማህበሩን በአካል ጎብኝቼ ማየት እችላለሁ? የጉብኝት ሰዓቱ መቼ ነው?",
      en: "Can I schedule a visit to the Selihom shelter? What are the hours?"
    },
    answer: {
      am: "አዎ! ከሰኞ እስከ እሁድ ከጠዋቱ 1፡30 እስከ ማታ 12፡00 ድረስ ከእንጦጦ ቅዱስ ራጉኤል ቤተክርስቲያን ወደ ፍተሻ በሚወስደው መንገድ 300 ሜትር ዝቅ ብሎ የሚገኘውን ማዕከላችንን መጎብኘት ይችላሉ። በድረ-ገጻችን ላይ ባለው የጉብኝት ቅጽ በመጠቀም ቀድመው ቀጠሮ መያዝ ይችላሉ።",
      en: "Yes! Visitors are welcome Monday to Sunday from 7:30 AM to 6:00 PM at our shelter located near Entoto St. Raguel Church (300m down towards Fetesha). You can use our online booking form on this website to reserve a time slot."
    }
  }
];

export const STATS = [
  {
    number: "400+",
    label: { am: "የተደገፉ ወገኖች", en: "Beneficiaries Supported" },
    description: { am: "የአዕምሮ ህክምና፣ የመድሃኒት፣ የምግብና የተሃድሶ ድጋፍ የሚያገኙ ተጠቃሚዎች", en: "Residents receiving psychiatric care, medication, food, and rehabilitation" },
    icon: "Stethoscope"
  },
  {
    number: "85%",
    label: { am: "የማገገም ስኬት", en: "Health Recovery Rate" },
    description: { am: "ከከባድ የአእምሮ ዝቅታ ወጥተው ወደ ጤናና ስራ የተመለሱ ተጠቃሚዎች", en: "Beneficiaries who successfully recovered from street trauma and began working" },
    icon: "Home"
  },
  {
    number: "100%",
    label: { am: "ነጻ ህክምናና መጠለያ", en: "Free Care & Shelter" },
    description: { am: "ሁለንተናዊ የዕለት ተዕለት እንክብካቤ፣ 3 ጊዜ ትኩስ ምግብና ሙያ ስልጠና", en: "Daily warm shelter, 3 nutritious hot meals, clothing, and vocational training" },
    icon: "GraduationCap"
  }
];

export const EVENTS: EventItem[] = [
  {
    id: "evt-1",
    title: { am: "\u12e8\u121b\u12d5\u12a8\u120d \u121b\u1235\u134b\u134a\u12eb\u1293 \u12e8\u1218\u12f5\u1213\u1295\u12e8\u1275 \u121b\u1230\u1263\u1230\u1262\u12eb \u1308\u1262 \u121b\u1230\u1263\u1230\u1262\u12eb", en: "Shelter Expansion & Psychiatric Medication Drive" },
    category: "fundraising",
    date: { am: "\u1290\u1243\u1234 15, 2018", en: "August 21, 2026" },
    time: { am: "ከሰዓት 8:00 - 11:00", en: "02:00 PM - 05:00 PM" },
    location: { am: "\u12d5\u1295\u1326\u1326 \u122b\u1309\u12a4\u120d \u1230\u120a\u1206\u121d \u121b\u12d5\u12a8\u120d", en: "Entoto Raguel Selihom Shelter" },
    description: {
      am: "\u1208\u1270\u1328\u121b\u122a 50 \u1205\u1219\u121b\u1295 \u12d3\u120d\u130b\u12c8\u127d\u1295\u1363 \u12e8\u1295\u1364\u1205\u1293 \u1218\u1235\u1328\u12ab\u12c8\u127d\u1295\u1293 የ3 ወር \u12d3\u1325\u1241\u12c8\u12eb \u1218\u12f5\u1213\u1295\u12c8\u127d\u1295 \u1208\u121b\u1237\u1209 \u12e8\u1270\u12db\u130b\u12f0 \u1308\u1262 \u121b\u1230\u1263\u1230\u1262\u12eb\u1362",
      en: "Special fundraising effort to furnish 50 new recovery beds, expand sanitation facilities, and secure 3 months of psychiatric medication supplies."
    },
    goalAmount: 2000000,
    raisedAmount: 1250000,
    image: ""
  },
  {
    id: "evt-2",
    title: { am: "\u12e8\u12d0\u12f2\u1235 \u12d3\u1218\u1275 \u121b\u1205\u1260\u1228\u1230\u1263\u12ca \u12e8\u121d\u130d\u1265\u1293 \u12e8\u134d\u1245\u122d \u12f5\u130d\u1235", en: "New Year Holiday Community Feast Drive" },
    category: "fundraising",
    date: { am: "\u1353\u130c\u121c 5, 2018", en: "September 10, 2026" },
    time: { am: "\u12a8\u1338\u12c8\u1271 3:00 - 11:00", en: "09:00 AM - 05:00 PM" },
    location: { am: "\u1230\u120a\u1206\u121d \u121b\u12d5\u12a8\u120d, \u12d0\u12f2\u1235 \u12d0\u1260\u1263", en: "Selihom Center, Addis Ababa" },
    description: {
      am: "\u1208200+ \u1270\u1338\u12ab\u121a\u12c8\u127d\u1293 \u12d0\u12db\u12c8\u1295\u1276\u127d \u12e8\u1260\u12d3\u120d \u1218\u1265\u122b\u1275\u1363 \u12e8\u12d0\u120d\u1263\u1233\u1275 \u12f5\u130d\u12c3\u134f\u1293 \u12e8\u1260\u130d/\u12e8\u1260\u1228 \u12d5\u122d\u12f5 \u12f5\u130d\u1235 \u121b\u12db\u130b\u12f0\u1275\u1362",
      en: "Providing warm holiday meals, new traditional Habesha attire, and festive celebration for all 200+ beneficiaries and street elders."
    },
    goalAmount: 800000,
    raisedAmount: 510000,
    image: ""
  },
  {
    id: "evt-3",
    title: { am: "\u12e8\u1260\u130e \u134e\u12c8\u12f0\u129e\u127d \u1218\u122d\u1345\u130d\u1265\u122d\u1293 \u12e8\u120d\u121d\u12f5 \u120d\u12c8\u12c5", en: "Monthly Volunteer Orientation & Open House" },
    category: "upcoming",
    date: { am: "\u1218\u1235\u12a8\u1228\u121d 10, 2019", en: "September 20, 2026" },
    time: { am: "\u12a8\u1338\u12c8\u1271 4:00 - 7:00", en: "10:00 AM - 01:00 PM" },
    location: { am: "\u1230\u120a\u1206\u121d \u12d5\u1295\u1326\u1326 \u121b\u12d5\u12a8\u120d", en: "Selihom Entoto Center" },
    description: {
      am: "\u12d0\u12f3\u12f2\u1235 \u1260\u130e \u134e\u12c8\u12f0\u129e\u127d\u1295 \u1218\u1240\u1260\u120d\u1363 \u12e8\u121b\u12d5\u12a8\u1209\u1295 \u1235\u122b\u12c8\u127d \u121b\u1235\u130e\u1265\u129d\u1273\u1293 \u1270\u1338\u12ab\u121a\u12c8\u127d\u1295 \u1260\u121d\u130d\u1265 \u12dd\u130d\u1305\u1275\u1293 \u12d5\u1295\u12ad\u1265\u12ab\u1260 \u121b\u1308\u12d8\u1362",
      en: "Welcoming new volunteers, guided tour of shelter facilities, and hands-on participation in lunch service and elder companionship."
    },
    image: ""
  },
  {
    id: "evt-4",
    title: { am: "\u12e8\u12d0\u12d5\u121d\u122e \u1274\u1293 \u130d\u1295\u12db\u1260 \u121b\u1235\u1288\u1260\u1328\u12ab \u1230\u120d\u1356\u1293 \u130d\u1265\u129d\u1275", en: "Mental Health Awareness & Stigma Reduction Walk" },
    category: "upcoming",
    date: { am: "\u1325\u1245\u121d\u1275 1, 2019", en: "October 10, 2026" },
    time: { am: "\u12a8\u1338\u12c8\u1271 2:00 - 6:00", en: "08:00 AM - 12:00 PM" },
    location: { am: "\u12a8\u12d0\u122b\u1275 \u12aa\u120e \u12d5\u1235\u12a8 \u12d5\u1295\u1326\u1326 \u122b\u1309\u12a4\u120d", en: "Arat Kilo to Entoto Raguel" },
    description: {
      am: "\u1260\u12d0\u12d5\u121d\u122e \u1205\u1218\u121d \u120b\u12ed \u12eb\u1208\u12cd\u1295 \u12e8\u1270\u1233\u1233\u1270 \u12d0\u121e\u1208\u12ab\u12eb\u1275 \u1208\u1218\u1240\u12ed\u122d\u1293 \u1205\u1219\u121b\u1295\u1295 \u1208\u121b\u1240\u134d \u12e8\u1270\u12db\u130b\u12f0 \u1230\u120b\u121b\u12ca \u12e8\u12d5\u130d\u122d \u130d\u12d8\u1362",
      en: "Community awareness walk to dismantle mental health stigma and raise public support for street rehabilitation programs."
    },
    image: ""
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-teddy",
    type: "image",
    title: { am: "ድምፃዊ ቴዎድሮስ ካሳሁን (ቴዲ አፍሮ) በሰሊሆም", en: "Artist Tewodros Kassahun (Teddy Afro) at Selihom" },
    category: "volunteers",
    url: teddyAfroImg,
    description: { am: "ታዋቂው ድምፃዊ ቴዲ አፍሮ ሰሊሆምን በአካል ጎብኝተው ለተጠቃሚዎች ያላቸውን አጋርነትና ፍቅር ሲገልጹ።", en: "Iconic Ethiopian artist Teddy Afro visiting Selihom in compassionate solidarity with residents." }
  },
  {
    id: "gal-adanech",
    type: "image",
    title: { am: "የከንቲባ አዳነች አቤቤ ይፋዊ ጉብኝት", en: "Mayor Adanech Abiebie Official Visit" },
    category: "volunteers",
    url: adanechImg,
    description: { am: "የአዲስ አበባ ከተማ ከንቲባ ክብርት ወ/ሮ አዳነች አቤቤ የሰሊሆም ማህበርን ስራዎች በአካል ተገኝተው ሲጎበኙ።", en: "Mayor of Addis Ababa H.E. Adanech Abiebie touring Selihom to inspect rehabilitation and care facilities." }
  },
  {
    id: "gal-priest",
    type: "image",
    title: { am: "የተከበሩ የሃይማኖት አባቶችና ካህናት ቡራኬ", en: "Spiritual Fathers & Clergy Blessing" },
    category: "volunteers",
    url: priestImg,
    description: { am: "የተከበሩ የሃይማኖት አባቶችና ካህናት ማዕከላችንን በመጎብኘት ለህሙማኑና ለአረጋውያኑ መንፈሳዊ ቡራኬና ጸሎት ሲያደርጉ።", en: "Revered church leaders and clergy offering blessings, prayers, and pastoral encouragement." }
  },
  {
    id: "gal-1304",
    type: "image",
    title: { am: "ዕለታዊ የተመጣጠነ ምግብ አቅርቦት", en: "Daily Nutritious Meal Service" },
    category: "kitchen",
    url: img1304,
    description: { am: "ለሰሊሆም ተጠቃሚዎች በየቀኑ በኩሽናችን የሚዘጋጅ ንጹህና ሞቅ ያለ ማዕድ።", en: "Daily wholesome breakfast, lunch, and dinner lovingly prepared in our main kitchen." }
  },
  {
    id: "gal-1305",
    type: "image",
    title: { am: "ንጹህ የማረፊያና የመኝታ ክፍሎች", en: "Sanctuary Dormitories & Rest" },
    category: "elderly",
    url: img1305,
    description: { am: "ከጎዳና የተነሱ አረጋውያንና ህሙማን በሰላምና በደህንነት የሚያርፉባቸው ንጹህ ክፍሎች።", en: "Safe, clean, and dignified dormitory quarters providing restful sleep for rescued residents." }
  },
  {
    id: "gal-1306",
    type: "image",
    title: { am: "የአዕምሮ ጤና ክትትልና ምርመራ", en: "Psychiatric Health Assessment" },
    category: "mental-health",
    url: img1306,
    description: { am: "የህክምና ባለሙያዎች ለተጠቃሚዎች የሚያደርጉት የማያቋርጥ የክሊኒካልና የስነ-አዕምሮ ክትትል።", en: "Ongoing psychiatric clinical evaluations and dedicated medication monitoring." }
  },
  {
    id: "gal-1307",
    type: "image",
    title: { am: "የማህበረሰብ እንክብካቤና አብሮነት", en: "Community Gathering & Care" },
    category: "volunteers",
    url: img1307,
    description: { am: "በሰሊሆም ማዕከል ውስጥ የሚታይ የወንድማማችነት፣ የፍቅርና የእንክብካቤ ህብረት።", en: "Daily fellowship and mutual encouragement fostering recovery and social belonging." }
  },
  {
    id: "gal-1309",
    type: "image",
    title: { am: "የፍቅር ማዕድ በሰሊሆም አዳራሽ", en: "Warm Lunch Fellowship" },
    category: "kitchen",
    url: img1309,
    description: { am: "ተጠቃሚዎች በደስታና በአንድነት የተመጣጠነ ምግብ በጋራ ሲመገቡ።", en: "Residents gathered together in the main dining hall enjoying freshly cooked meals." }
  },
  {
    id: "gal-1310",
    type: "image",
    title: { am: "ለአረጋውያን የሚደረግ ልዩ ድጋፍ", en: "Elderly Residents Support" },
    category: "elderly",
    url: img1310,
    description: { am: "ጧሪና ደጋፊ የሌላቸውን አረጋውያን የክብርና የፍቅር መጠለያ መስጠት።", en: "Personalized care and compassion for senior citizens who were previously homeless." }
  },
  {
    id: "gal-1312",
    type: "image",
    title: { am: "የፀሐይ ሙቀትና ንጹህ አየር ማረፊያ", en: "Outdoor Sunshine & Nature Rest" },
    category: "mental-health",
    url: img1312,
    description: { am: "በእንጦጦ ንጹህ አየርና የተፈጥሮ ከባቢ ውስጥ የሚካሄድ የውጪ እንቅስቃሴ።", en: "Beneficiaries relaxing outdoors under the healing mountain atmosphere of Entoto." }
  },
  {
    id: "gal-1314",
    type: "image",
    title: { am: "የኩሽና ሰራተኞች የምግብ ዝግጅት", en: "Dedicated Kitchen Team at Work" },
    category: "kitchen",
    url: img1314,
    description: { am: "ለ400+ ተጠቃሚዎች በየቀኑ በሰዓቱ ምግብ የሚያዘጋጁ ታታሪ እናቶችና አባቶች።", en: "Our committed kitchen staff preparing hundreds of warm, balanced meals each day." }
  },
  {
    id: "gal-1315",
    type: "image",
    title: { am: "በፍቅርና በክብር የተሞላ እንክብካቤ", en: "Loving Staff & Resident Care" },
    category: "volunteers",
    url: img1315,
    description: { am: "የማዕከሉ ሰራተኞች ለተጠቃሚዎች የሚያሳዩት እናታዊና አባታዊ ፍቅር።", en: "Gentle attentiveness and respectful support provided by Selihom's staff." }
  },
  {
    id: "gal-1316",
    type: "image",
    title: { am: "የውጪ ንጹህ ማረፊያ ግቢ", en: "Spacious Courtyard & Gathering" },
    category: "mental-health",
    url: img1316,
    description: { am: "ተጠቃሚዎች በሰላም የሚወያዩበትና ፀሐይ የሚሞቁበት ክፍት ግቢ።", en: "Open courtyard space offering peaceful relaxation and community interaction." }
  },
  {
    id: "gal-1317",
    type: "image",
    title: { am: "የማለዳ የጤና ምርመራና ክትትል", en: "Morning Health & Care Rounds" },
    category: "mental-health",
    url: img1317,
    description: { am: "በየቀኑ ጠዋት የሚደረግ የሰውነትና የአዕምሮ ጤና ክትትል እንቅስቃሴ።", en: "Routine morning medical assessments ensuring the wellbeing of all shelter residents." }
  },
  {
    id: "gal-1318",
    type: "image",
    title: { am: "የጋራ የምግብ ማዕድ ተሳትፎ", en: "Shared Communal Dining" },
    category: "kitchen",
    url: img1318,
    description: { am: "በአንድነት ተቀምጦ ማዕድ የመካፈል የቤተሰብ ስሜት ማዳበር።", en: "Restoring the feeling of home and belonging through shared communal meals." }
  },
  {
    id: "gal-1319",
    type: "image",
    title: { am: "ንጹህ አልባሳትና የግል ንጽህና", en: "Dignified Clothing & Personal Care" },
    category: "elderly",
    url: img1319,
    description: { am: "ለእያንዳንዱ ተጠቃሚ ንጹህ ልብስና የንጽህና መጠበቂያ ቁሳቁስ ማሟላት።", en: "Providing every rescued individual with clean clothing and hygiene supplies." }
  },
  {
    id: "gal-1320",
    type: "image",
    title: { am: "የሰላምና የተስፋ ማገገሚያ ጊዜ", en: "Peaceful Recovery Moments" },
    category: "mental-health",
    url: img1320,
    description: { am: "ከከባድ የጎዳና ህይወት ወጥተው ወደ ሰላማዊ ጤናማ ህይወት የተመለሱ ወገኖች።", en: "Witnessing life-changing tranquility and restoration from extreme street trauma." }
  },
  {
    id: "gal-1321",
    type: "image",
    title: { am: "የእንጦጦ ማዕከል ሰፊ ቅጥር ጊቢ", en: "Entoto Center Sanctuary" },
    category: "volunteers",
    url: img1321,
    description: { am: "ተጠቃሚዎች በሰላም የሚንቀሳቀሱበት ደህንነቱ የተጠበቀ የመልሶ ማቋቋሚያ ስፍራ።", en: "Safe and secure grounds nestled along the scenic hills of Entoto." }
  },
  {
    id: "gal-1322",
    type: "image",
    title: { am: "የዕለት እንጀራና ምግብ ማዘጋጀት", en: "Daily Bread & Food Prep" },
    category: "kitchen",
    url: img1322,
    description: { am: "ለዕለት ጉርስ የሚሆን ባህላዊ እንጀራና የተመጣጠነ ወጥ በኩሽናችን ሲዘጋጅ።", en: "Baking fresh injera and cooking hearty meals for the shelter community." }
  },
  {
    id: "gal-1323",
    type: "image",
    title: { am: "የስነ-ልቦና ምክርና ውይይት", en: "Counseling & Moral Encouragement" },
    category: "mental-health",
    url: img1323,
    description: { am: "የስነ-ልቦና ባለሙያዎች ለተጠቃሚዎች የሚያደርጉት የቀጥታ ማበረታቻና የውይይት ጊዜ።", en: "Structured therapy sessions helping beneficiaries regain confidence and self-worth." }
  },
  {
    id: "gal-1324",
    type: "image",
    title: { am: "ሞቅ ያለ አልጋና ደህንነቱ የተጠበቀ መጠለያ", en: "Warm Bedding & Safe Housing" },
    category: "elderly",
    url: img1324,
    description: { am: "ከብርድና ከዝናብ የተጠበቀ ምቹ የማረፊያ ስፍራ።", en: "Sheltered from harsh weather with warm blankets, mattresses, and clean dorms." }
  },
  {
    id: "gal-1325",
    type: "image",
    title: { am: "የማህበረሰብ አንድነትና ፍቅር", en: "Community Support & Unity" },
    category: "volunteers",
    url: img1325,
    description: { am: "በጎ አድራጊዎችና ሰራተኞች ከህሙማኑ ጋር ያላቸው የጠበቀ ቤተሰባዊ ትስስር።", en: "Heartwarming family bonds forged between staff, supporters, and beneficiaries." }
  },
  {
    id: "gal-1326",
    type: "image",
    title: { am: "ለተጠቃሚዎች የተዘጋጀ የተመጣጠነ ምግብ", en: "Wholesome Nutrition Sharing" },
    category: "kitchen",
    url: img1326,
    description: { am: "የሰውነት ጥንካሬንና በሽታ የመከላከል አቅምን የሚገነባ የተመጣጠነ ምግብ።", en: "Nutritious meal courses carefully planned for residents undergoing medical care." }
  },
  {
    id: "gal-1327",
    type: "image",
    title: { am: "የእጅ ሙያና የማነቃቂያ ስራዎች", en: "Vocational & Stimulating Activities" },
    category: "mental-health",
    url: img1327,
    description: { am: "ያገገሙ ተጠቃሚዎች ወደ ስራ አለም እንዲመለሱ የሚያግዝ የማነቃቂያ ፕሮግራም።", en: "Productive daytime activities encouraging fine-motor skills and independent thinking." }
  },
  {
    id: "gal-1328",
    type: "image",
    title: { am: "የአረጋውያን ማረፊያና እንክብካቤ", en: "Elderly Companionship & Care" },
    category: "elderly",
    url: img1328,
    description: { am: "የዕድሜ ባለፀጎች በክብርና በእንክብካቤ የሚያሳልፉት የዕለት ተዕለት ኑሮ።", en: "Dignified support celebrating the wisdom and vulnerability of our senior residents." }
  },
  {
    id: "gal-1329",
    type: "image",
    title: { am: "የበጎ ፈቃደኞች የኩሽና አገልግሎት", en: "Volunteer Kitchen Shifts" },
    category: "kitchen",
    url: img1329,
    description: { am: "በጎ አድራጊ ወጣቶች በምግብ ማብሰልና በማደል ሂደት ያደረጉት ተሳትፎ።", en: "Volunteers rolling up their sleeves to assist in meal preparation and dining service." }
  },
  {
    id: "gal-1330",
    type: "image",
    title: { am: "የህክምና ቁሳቁስና የመድሃኒት ክትትል", en: "Clinical Oversight & Care" },
    category: "mental-health",
    url: img1330,
    description: { am: "በየዕለቱ በሃኪሞች ክትትል የሚሰጥ አስፈላጊ መድሃኒትና ክሊኒካል እንክብካቤ።", en: "Daily medication administration and nursing supervision for psychiatric patients." }
  },
  {
    id: "gal-1331",
    type: "image",
    title: { am: "የከሰዓት የወዳጅነትና የጨዋታ ጊዜ", en: "Afternoon Fellowship & Games" },
    category: "volunteers",
    url: img1331,
    description: { am: "ተጠቃሚዎች በጋራ የሚዝናኑበትና የአዕምሮ እረፍት የሚያገኙበት ሰዓት።", en: "Lighthearted social hours encouraging conversation, board games, and laughter." }
  },
  {
    id: "gal-1332",
    type: "image",
    title: { am: "ምቹና ደህንነቱ የተጠበቀ የመኖሪያ አካባቢ", en: "Comfortable Living Quarters" },
    category: "elderly",
    url: img1332,
    description: { am: "ከጎዳና አሰቃቂ ህይወት የተላቀቁ ወገኖች የሚያገኙት የቤት ሙቀት።", en: "A truly transformative shelter ensuring dignity, security, and tranquility." }
  },
  {
    id: "gal-1333",
    type: "image",
    title: { am: "ሁለንተናዊ የተሃድሶና የማገገም ጉዞ", en: "Holistic Restoration Journey" },
    category: "mental-health",
    url: img1333,
    description: { am: "ከህመም ወደ ጤና፣ ከብቸኝነት ወደ ማህበረሰባዊ አብሮነት የተደረገ ጉዞ።", en: "Step-by-step restoration from chronic illness to renewed self-reliance." }
  },
  {
    id: "gal-1334",
    type: "image",
    title: { am: "ሞቅ ያለ የተመጣጠነ ወጥ ማብሰል", en: "Nutritious Kitchen Prep" },
    category: "kitchen",
    url: img1334,
    description: { am: "በተልባ፣ በጥራጥሬና በአትክልት የተዘጋጁ አልሚ ምግቦች።", en: "Preparing nutrient-dense pulses and vegetables to nourish recovering patients." }
  },
  {
    id: "gal-1335",
    type: "image",
    title: { am: "የተጠቃሚዎች የደስታና የፈገግታ ገጽታ", en: "Smiling Beneficiaries Restored" },
    category: "mental-health",
    url: img1335,
    description: { am: "በማዕከሉ ባገኙት ፍቅርና እንክብካቤ ምክንያት በፊታቸው ላይ የሚታይ እውነተኛ ደስታ።", en: "Radiant smiles showing the healing power of love, acceptance, and clinical care." }
  },
  {
    id: "gal-1336",
    type: "image",
    title: { am: "የህዝብ ጎብኝዎችና የፍቅር አጋርነት", en: "Community Visitors & Solidarity" },
    category: "volunteers",
    url: img1336,
    description: { am: "የተለያዩ የህብረተሰብ ክፍሎች ሰሊሆምን በመጎብኘት ያሳዩት አጋርነት።", en: "Visitors and well-wishers from all walks of life demonstrating civic compassion." }
  },
  {
    id: "gal-1337",
    type: "image",
    title: { am: "የተስፋና የፍቅር ቅዱስ ስፍራ", en: "A Sanctuary of Hope and Love" },
    category: "volunteers",
    url: img1337,
    description: { am: "ሰሊሆም — ተስፋ የቆረጡ ወገኖች ህይወት የሚታደስበት የፍቅር ማዕከል!", en: "Selihom Rehabilitation Center: a sanctuary where broken lives find eternal hope and love." }
  },
  {
    id: "gal-owner",
    type: "image",
    title: { am: "የሰሊሆም ማህበር መስራች አቶ ሚኪያስ ለገሰ", en: "Founder Mikiyas Legesse & Leadership" },
    category: "mental-health",
    url: charityOwnerImg,
    description: { am: "የማህበሩ መስራችና ስራ አስፈጻሚ አቶ ሚኪያስ ለገሰ።", en: "Founder and director Mikiyas Legesse leading Selihom's humanitarian mission." }
  },
  {
    id: "gal-person1",
    type: "image",
    title: { am: "የህክምናና የተሃድሶ ውጤት", en: "Psychiatric Care & Rehabilitation" },
    category: "mental-health",
    url: person1Img,
    description: { am: "ከጎዳና ተነስታ በሰሊሆም ሙሉ ህክምና ያገኘች ተጠቃሚ።", en: "Beneficiary provided psychiatric treatment and holistic care at Selihom." },
    imagePosition: "object-center"
  },
  {
    id: "gal-person2",
    type: "image",
    title: { am: "የህክምናና የተሃድሶ ስኬት", en: "Rehabilitation Transformation" },
    category: "mental-health",
    url: person2Img,
    description: { am: "ከጎዳና ህይወት ወጥቶ በሰሊሆም ሙሉ በሙሉ ያገገመ ተጠቃሚ።", en: "Beneficiary after complete psychiatric recovery at Selihom." },
    imagePosition: "object-top"
  },
  {
    id: "gal-person3",
    type: "image",
    title: { am: "የማገገምና የደስታ ጉዞ", en: "Recovery & Restoration of Health" },
    category: "mental-health",
    url: person3Img,
    description: { am: "በማህበሩ ህክምና ፍቅር አግኝታ በሰላም የምትኖር ተጠቃሚ።", en: "Beneficiary celebrating recovery in clean traditional dress." },
    imagePosition: "object-center"
  },
  {
    id: "gal-person4",
    type: "image",
    title: { am: "የሙሉ ተሃድሶና የማህበረሰባዊ ተሳትፎ", en: "Full Recovery & Reintegration" },
    category: "mental-health",
    url: person4Img,
    description: { am: "በማህበሩ ድጋፍ አግኝቶ ሙሉ በሙሉ ያገገመ ተጠቃሚ።", en: "Beneficiary rehabilitated and fully healed, wearing formal attire." },
    imagePosition: "object-top"
  },
  {
    id: "gal-award1",
    type: "image",
    title: { am: "የመንግስት ህጋዊ እውቅና", en: "Official NGO Certification" },
    category: "mental-health",
    url: award1Img,
    description: { am: "የሰሊሆም ህጋዊ ምዝገባ ምስክር ወረቀት።", en: "Official registration certificate and government recognition." }
  },
  {
    id: "gal-award2",
    type: "image",
    title: { am: "የበጎ አድራጎት የክብር ሽልማት", en: "Distinguished Service Award" },
    category: "mental-health",
    url: award2Img,
    description: { am: "ለሰሊሆም ማህበር የተሰጠ የክብር ሽልማት።", en: "Distinguished service award presented to Selihom." }
  },
  {
    id: "gal-award3",
    type: "image",
    title: { am: "ብሄራዊ የሰብአዊ እውቅና", en: "National Humanitarian Recognition" },
    category: "mental-health",
    url: award3Img,
    description: { am: "ለሰሊሆም ያገኘው ብሄራዊ እውቅና።", en: "National humanitarian honor for rescuing and rehabilitating street beneficiaries." }
  }
];

// ── Official Governance, Advisory Board & Departmental Structure ─────────────
export const SELIHOM_GOVERNANCE = {
  founder: {
    name: { am: "አቶ ሚኪያስ ለገሰ", en: "Ato Mikiyas Legesse" },
    title: { am: "የሰሊሆም ማህበር መስራችና ስራ አስኪያጅ", en: "Founder & General Manager" },
    bio: {
      am: "የሰሊሆም ማህበር በ2010 ዓ.ም. የተመሰረተው በአቶ ሚኪያስ ለገሰ ጥረት ነው። በጎዳና ላይ የወደቁ፣ የተጣሉና የአዕምሮ ህመም ያለባቸውን ወገኖች ከሞት አፋፍ በማዳን፣ ፍቅርና ክብካቤ በመስጠት ዛሬ ከ400 በላይ ወገኖችን በቋሚነት የሚያስተናግድ ተቋም እንዲሆን አስችለዋል።",
      en: "Selihom Association was founded in 2018 by Ato Mikiyas Legesse following personal tragedy turned into a lifetime mission. Rescuing vulnerable mentally ill and abandoned citizens directly from city streets, his vision has grown Selihom into a sanctuary caring for over 400 individuals every day."
    }
  },
  board: [
    {
      id: "board-1",
      name: { am: "ክቡር ዶ/ር ፍቃዱ ተሰማ", en: "Hon. Dr. Fekadu Tessema" },
      role: { am: "የአስተዳደር ቦርድ ሰብሳቢ", en: "Board Chairperson" },
      desc: {
        am: "የተቋሙን ስትራቴጂካዊ አመራር፣ የፖሊሲ ቁጥጥርና ከህዝባዊ ተቋማት ጋር ያለውን ግንኙነት በበላይነት ይመራሉ።",
        en: "Provides strategic oversight, governance excellence, and public institutional relations."
      }
    },
    {
      id: "board-2",
      name: { am: "አቶ ገዛኸኝ ብርሃኑ (የህግ አማካሪ)", en: "Ato Gezahegn Berhanu (Esq.)" },
      role: { am: "የህግና መልካም አስተዳደር አማካሪ", en: "Legal & Regulatory Advisor" },
      desc: {
        am: "የማህበሩን ህጋዊ አሰራር፣ የሲቪል ማህበረሰብ ድርጅቶች መመሪያዎች ተገዢነትና የሰብአዊ መብት ጥበቃ ያረጋግጣሉ።",
        en: "Ensures full civil society regulatory compliance and legal protection of residents."
      }
    },
    {
      id: "board-3",
      name: { am: "ዶ/ር ዮናስ አበበ (ስነ-አዕምሮ አማካሪ)", en: "Dr. Yonas Abebe (MD, Psych.)" },
      role: { am: "ከፍተኛ የህክምናና ስነ-አዕምሮ አማካሪ", en: "Senior Psychiatric & Clinical Advisor" },
      desc: {
        am: "የአዕምሮ ህክምና ፕሮቶኮሎችን፣ የሪፈራል ሆስፒታሎች ትስስርና የክሊኒካል ጥራትን ይመክራሉ።",
        en: "Advises clinical psychiatric standards, medication protocols, and hospital partnerships."
      }
    }
  ],
  departments: [
    {
      id: "dept-finance",
      name: { am: "አቶ አማኑኤል ወርቁ", en: "Ato Amanuel Worku" },
      role: { am: "የፋይናንስ፣ ኦዲትና ግልጽነት ኃላፊ", en: "Finance, Audit & Transparency Officer" },
      desc: {
        am: "የማህበሩን ወርሃዊ የኦዲት ሪፖርቶች፣ የለጋሾች ግልጽነትና የሂሳብ አያያዝ በታማኝነት ያከናውናሉ።",
        en: "Ensures complete financial transparency, transparent donor accounting, and statutory audited compliance."
      }
    },
    {
      id: "dept-clinical",
      name: { am: "ዶ/ር ቴዎድሮስ ሀይሌ", en: "Dr. Tewodros Haile" },
      role: { am: "የስነ-አዕምሮ ህክምናና ጤና አስተባባሪ", en: "Psychiatric & Clinical Lead" },
      desc: {
        am: "የተጠቃሚዎችን የሆስፒታል ህክምና፣ የመድሃኒት ክትትልና የስነ-ልቦና ማገገም ይመራሉ።",
        en: "Coordinates specialized psychiatric evaluations, hospital referrals, and continuous clinical medication."
      }
    },
    {
      id: "dept-shelter",
      name: { am: "ወ/ሮ ቤተልሄም ታደሰ", en: "W/ro Betelhem Tadesse" },
      role: { am: "የመጠለያና የተጠቃሚዎች ደህንነት ኃላፊ", en: "Shelter Operations & Welfare Director" },
      desc: {
        am: "በእንጦጦ ማዕከል የዕለት ምግብ ዝግጅት፣ ንጹህ አልባሳትና የነዋሪዎችን ደህንነት ያስተባብራሉ።",
        en: "Oversees daily residential operations, nutritious meal programs, and shelter safety for 400+ residents."
      }
    },
    {
      id: "dept-marketing",
      name: { am: "ወ/ሪት ሀና መንግስቱ", en: "W/rit Hanna Mengistu" },
      role: { am: "የህዝብ ግንኙነት፣ ማርኬቲንግና ለጋሾች ኃላፊ", en: "PR, Marketing & Donor Relations" },
      desc: {
        am: "ለጋሾችን ማስተባበር፣ የማህበረሰብ ግንዛቤ መፍጠርና የተቋሙን ዜናዎችና መልዕክቶች ያሰራጫሉ።",
        en: "Leads community outreach, donor communications, awareness campaigns, and public relations."
      }
    },
    {
      id: "dept-vocational",
      name: { am: "ወ/ሪት ሰላማዊት አበራ", en: "W/rit Selamawit Abera" },
      role: { am: "የሙያ ስልጠናና ማህበረሰብ ውህደት አስተባባሪ", en: "Vocational Skills & Reintegration Lead" },
      desc: {
        am: "ያገገሙ ሰዎችን በልብስ ስፌት፣ አነስተኛ ንግድና የእጅ ስራ በማሰልጠን ወደ ማህበረሰቡ እንዲቀላቀሉ ያደርጋሉ።",
        en: "Develops vocational training courses, startup toolkits, and transition plans for recovered beneficiaries."
      }
    },
    {
      id: "dept-volunteer",
      name: { am: "አቶ ዳዊት በቀለ", en: "Ato Dawit Bekele" },
      role: { am: "የበጎ ፈቃደኞችና የማህበረሰብ አስተባባሪ", en: "Volunteer Network Coordinator" },
      desc: {
        am: "የበጎ ፈቃደኞችን ምዝገባ፣ ስምሪትና የማዕከል አገልግሎት አስተዋጽኦ በቅንጅት ያስተዳድራሉ።",
        en: "Coordinates volunteer applications, shift scheduling, orientations, and communal engagement."
      }
    }
  ]
};

