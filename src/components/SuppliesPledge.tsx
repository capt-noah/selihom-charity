import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Package,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Minus,
  UtensilsCrossed,
  Droplets,
  Brain,
  Pill,
  Calendar,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  getSupplyCategories,
  saveSuppliesPledge,
  SupplyCategory,
  SupplyItem,
  type SuppliesPledge as SuppliesPledgeType,
} from "../utils/adminStorage";
import {
  sanitizeText,
  sanitizePhone,
  isValidEmail,
  isNonEmpty,
} from "../utils/sanitize";
import LoadingDots from "./LoadingDots";
import MedicinePledge from "./MedicinePledge";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  UtensilsCrossed,
  Droplets,
  Brain,
  Package,
  Pill,
};

const URGENCY_DOT: Record<string, string> = {
  High: "bg-red-500",
  Medium: "bg-amber-400",
  Low: "bg-brand-sky-400",
};

const URGENCY_BADGE: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-brand-sky-100 text-brand-sky-700 border-brand-sky-200",
};

// ── Built-in default single-word categories (Food, Hygiene, Psychiatry) ────────
const DEFAULT_CATEGORIES: SupplyCategory[] = [
  {
    id: "cat-food",
    name: { en: "Food", am: "ምግብ" },
    icon: "UtensilsCrossed",
    color: "bg-amber-500",
    items: [
      {
        id: "food-1",
        name: { en: "Teff & Grain Flour (Sacks)", am: "ጤፍ እና የእህል ዱቄት (ጆንያ)" },
        neededQty: { en: "50 Sacks / Month", am: "በወር 50 ጆንያ" },
        urgency: "High",
        impactDesc: {
          en: "Essential staple food for daily meals for 200+ beneficiaries.",
          am: "ለ200+ ተጠቃሚዎች የዕለት ተዕለት እንጀራና ምግብ ማዘጋጃ።",
        },
      },
      {
        id: "food-2",
        name: { en: "Cooking Oil (5L Cans)", am: "የምግብ ዘይት (ባለ 5 ሊትር)" },
        neededQty: { en: "40 Cans / Month", am: "በወር 40 ጄሪካን" },
        urgency: "High",
        impactDesc: {
          en: "Daily cooking and meal preparation.",
          am: "ለምግብ ዝግጅትና ወጥ ማብሰያ።",
        },
      },
      {
        id: "food-3",
        name: { en: "Lentils, Split Peas & Beans", am: "ምስር፣ ሽምብራና ባቄላ (ጥራጥሬ)" },
        neededQty: { en: "30 Sacks", am: "30 ጆንያ" },
        urgency: "Medium",
        impactDesc: {
          en: "High protein pulses for nutritional balance.",
          am: "የተመጣጠነ የፕሮቲን ምግብ ምንጭ።",
        },
      },
      {
        id: "food-4",
        name: { en: "Pasta, Macaroni & Rice", am: "ፓስታ፣ መኮሮኒና ሩዝ" },
        neededQty: { en: "25 Cartons", am: "25 ካርቶን" },
        urgency: "Medium",
        impactDesc: {
          en: "Quick carbohydrates and hearty dinner meals.",
          am: "ለእራትና ለቁርስ የሚሆኑ ምግቦች።",
        },
      },
      {
        id: "food-5",
        name: { en: "Sugar, Salt & Spices", am: "ስኳር፣ ጨው እና ቅመማቅመም" },
        neededQty: { en: "15 Sacks / Packets", am: "15 ጆንያ/ፓኬት" },
        urgency: "Low",
        impactDesc: {
          en: "Essential condiments for balanced kitchen prep.",
          am: "የወጥ ቤት ማጣፈጫና ማዘጋጃ ግብአቶች።",
        },
      },
    ],
  },
  {
    id: "cat-hygiene",
    name: { en: "Hygiene", am: "ንጽህና" },
    icon: "Droplets",
    color: "bg-brand-sky-500",
    items: [
      {
        id: "hyg-1",
        name: { en: "Body & Laundry Soap Bars", am: "የገላ እና የልብስ ሳሙና" },
        neededQty: { en: "300 Bars / Month", am: "በወር 300 ፍሬ" },
        urgency: "High",
        impactDesc: {
          en: "Maintains personal hygiene and disease prevention.",
          am: "የተጠቃሚዎችን ንጽህና ለመጠበቅና ከበሽታ ለመከላከል የሚያስፈልግ።",
        },
      },
      {
        id: "hyg-2",
        name: { en: "Toothpaste & Toothbrushes", am: "የጥርስ ብሩሽ እና ሳሙና" },
        neededQty: { en: "200 Sets", am: "200 ስብስብ" },
        urgency: "Medium",
        impactDesc: {
          en: "Daily oral hygiene and dental health care.",
          am: "የአፍና የጥርስ ንጽህና ለመጠበቅ።",
        },
      },
      {
        id: "hyg-3",
        name: { en: "Hair Shampoo & Conditioners", am: "የፀጉር ሻምፖና ቅባት" },
        neededQty: { en: "100 Bottles", am: "100 ጠርሙስ" },
        urgency: "Medium",
        impactDesc: {
          en: "Regular hair washing and grooming sessions.",
          am: "ለተጠቃሚዎች ሳምንታዊ የፀጉር እንክብካቤ።",
        },
      },
      {
        id: "hyg-4",
        name: { en: "Sanitary Pads (Dignity Kits)", am: "የሴቶች ንጽህና መጠበቂያ (ሞዴስ)" },
        neededQty: { en: "150 Packs / Month", am: "በወር 150 ፓኬት" },
        urgency: "High",
        impactDesc: {
          en: "Dignified menstrual hygiene care for female beneficiaries.",
          am: "ለሴት ታካሚዎች ወርሃዊ የንጽህና መጠበቂያ።",
        },
      },
      {
        id: "hyg-5",
        name: { en: "Disinfectants, Bleach & Detergent", am: "የወለል ማጽጃ፣ በረኪናና ዱቄት ሳሙና" },
        neededQty: { en: "50 Large Cans", am: "50 ትላልቅ ጀሪካን" },
        urgency: "High",
        impactDesc: {
          en: "Sanitising center dorms, bathrooms, and clinic rooms.",
          am: "የማዕከሉን ክፍሎች፣ መታጠቢያዎችንና ግቢውን ንጹህ ለማድረግ።",
        },
      },
    ],
  },
  {
    id: "cat-psychiatry",
    name: { en: "Psychiatry", am: "ስነ-አእምሮ" },
    icon: "Brain",
    color: "bg-purple-600",
    items: [
      {
        id: "psy-1",
        name: { en: "Art & Drawing Therapy Supplies", am: "የስዕልና የፈጠራ ቴራፒ ቁሳቁሶች" },
        neededQty: { en: "50 Sets", am: "50 ስብስብ" },
        urgency: "Medium",
        impactDesc: {
          en: "Helps patients express emotions, relieve stress, and rebuild focus.",
          am: "ስሜትን ለመግለጽ፣ ውጥረትን ለመቀነስና አእምሮን ለማረጋጋት።",
        },
      },
      {
        id: "psy-2",
        name: { en: "Sensory & Stress Relief Tools", am: "የጭንቀት ማስታገሻና የስሜት መረጋጊያ እቃዎች" },
        neededQty: { en: "40 Units", am: "40 ፍሬ" },
        urgency: "Medium",
        impactDesc: {
          en: "Reduces anxiety episodes and aids sensory grounding.",
          am: "ጭንቀትንና ፍርሃትን ለመቀነስ የሚረዱ የቴራፒ እቃዎች።",
        },
      },
      {
        id: "psy-3",
        name: { en: "Calming Weighted Blankets", am: "የእንቅልፍና የመረጋጊያ ከባድ ብርድልብሶች" },
        neededQty: { en: "30 Blankets", am: "30 ብርድልብስ" },
        urgency: "High",
        impactDesc: {
          en: "Helps traumatized and recovering individuals sleep peacefully.",
          am: "የጭንቀትና የእንቅልፍ እጦት ያለባቸው ታካሚዎች በሰላም እንዲተኙ ይረዳል።",
        },
      },
      {
        id: "psy-4",
        name: { en: "Cognitive Rehabilitation Games & Puzzles", am: "የአእምሮ ማነቃቂያ ጨዋታዎችና እንቆቅልሾች" },
        neededQty: { en: "25 Sets", am: "25 ስብስብ" },
        urgency: "Low",
        impactDesc: {
          en: "Rebuilds memory, logic, and social problem-solving skills.",
          am: "የማስታወስ ችሎታንና ማህበራዊ ግንኙነትን ለማዳበር።",
        },
      },
    ],
  },
  {
    id: "cat-supplies",
    name: { en: "Supplies", am: "ቁሳቁስ" },
    icon: "Package",
    color: "bg-teal-600",
    items: [
      {
        id: "sup-1",
        name: { en: "Warm Blankets & Bedding Sets", am: "ሞቅ ያሉ ብርድልብሶችና የመኝታ አንሶላዎች" },
        neededQty: { en: "150 Sets", am: "150 ስብስብ" },
        urgency: "High",
        impactDesc: {
          en: "Provides warmth and comfort for 200+ rescued and elderly residents in cold Entoto weather.",
          am: "በእንጦጦ ብርድ ወቅት ለህሙማንና ለአዛውንቶች ሞቅ ያለ መኝታ ለማዘጋጀት።",
        },
      },
      {
        id: "sup-2",
        name: { en: "Clothing, Jackets & Habesha Attire", am: "ንጹህ አልባሳት፣ ጃኬቶችና ባህላዊ ልብሶች" },
        neededQty: { en: "200 Sets", am: "200 ስብስብ" },
        urgency: "High",
        impactDesc: {
          en: "Dignified, clean clothing for newly rescued beneficiaries and holiday events.",
          am: "ከጎዳና ለተነሱ ተጠቃሚዎች ንጹህ ልብስና ለበዓላት የሚሆኑ አልባሳት።",
        },
      },
      {
        id: "sup-3",
        name: { en: "Kitchen Cookware, Pots & Utensils", am: "የወጥ ቤት ድስቶች፣ ሰሃኖችና የመመገቢያ እቃዎች" },
        neededQty: { en: "20 Large Sets", am: "20 ትላልቅ ስብስብ" },
        urgency: "Medium",
        impactDesc: {
          en: "Cooking and serving nutritious daily meals for the entire shelter.",
          am: "የዕለት ምግብ ለማብሰልና ለተጠቃሚዎች ለማቅረብ የሚረዱ የወጥ ቤት ቁሳቁሶች።",
        },
      },
      {
        id: "sup-4",
        name: { en: "Shoes, Slippers & Socks", am: "ጫማዎች፣ ነጠላ ጫማና ካልሲዎች" },
        neededQty: { en: "150 Pairs", am: "150 ጥንድ" },
        urgency: "Medium",
        impactDesc: {
          en: "Protects residents from injuries, fungal infections, and cold ground.",
          am: "የእግር ቁስለትንና በሽታን ለመከላከል ለተጠቃሚዎች የሚታደል።",
        },
      },
      {
        id: "sup-5",
        name: { en: "Stationery, Notebooks & Learning Toolkits", am: "የጽህፈት መሳሪያዎች፣ ደብተርና የስልጠና እቃዎች" },
        neededQty: { en: "100 Packs", am: "100 ፓኬት" },
        urgency: "Low",
        impactDesc: {
          en: "Supports vocational training, life skills, and children's education.",
          am: "ለተጠቃሚዎች የሙያ ስልጠናና ለህጻናት ትምህርት ድጋፍ የሚውል።",
        },
      },
    ],
  },
];

// ── Single supply item row ─────────────────────────────────────────────────────
function SupplyRow({
  item,
  qty,
  language,
  t,
  onChangeQty,
}: {
  item: SupplyItem;
  qty: number;
  language: string;
  t: (b: { en: string; am: string }) => string;
  onChangeQty: (id: string, delta: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = qty > 0;

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
        selected
          ? "border-brand-sky-400 bg-brand-sky-50/40"
          : "border-gray-100 bg-white hover:border-brand-sky-200"
      }`}
    >
      {/* ── Collapsed row ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
      >
        {/* Urgency dot */}
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${URGENCY_DOT[item.urgency] || "bg-brand-sky-400"}`}
        />

        {/* Name */}
        <span className="font-semibold text-sm text-brand-sky-950 flex-1 leading-snug">
          {t(item.name)}
        </span>

        {/* Needed qty — compact */}
        <span className="hidden sm:inline text-[10px] text-gray-400 font-medium shrink-0">
          {t(item.neededQty)}
        </span>

        {/* Urgency badge */}
        <span
          className={`hidden sm:inline text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${URGENCY_BADGE[item.urgency] || "bg-gray-100 text-gray-700"}`}
        >
          {item.urgency}
        </span>

        {/* Qty badge if selected */}
        {selected && (
          <span className="bg-brand-sky-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
            ×{qty}
          </span>
        )}

        {/* Expand chevron */}
        <span className="text-gray-400 shrink-0 ml-1">
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>

      {/* ── Expanded detail ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3">
              {/* Impact description */}
              {item.impactDesc && (
                <p className="text-xs text-brand-sky-700 font-medium bg-brand-sky-50 border border-brand-sky-100 px-3 py-2 rounded-xl">
                  {t(item.impactDesc)}
                </p>
              )}

              {/* Needed quantity */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  {language === "am" ? "የሚያስፈልግ መጠን" : "Needed Quantity"}
                </span>
                <span className="font-black text-brand-sky-950">
                  {t(item.neededQty)}
                </span>
              </div>

              {/* Qty stepper */}
              <div
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 border ${
                  selected
                    ? "bg-brand-sky-50 border-brand-sky-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <span className="text-xs font-bold text-gray-600">
                  {language === "am" ? "የቃልኪዳን ብዛት" : "Pledge quantity"}
                </span>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeQty(item.id, -1);
                    }}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-sky-600 hover:bg-brand-sky-50 rounded-md cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-black text-brand-sky-950 min-w-[32px] text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeQty(item.id, 1);
                    }}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-sky-600 hover:bg-brand-sky-50 rounded-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main In-Kind / Supplies Pledge Component ──────────────────────────────────
export default function SuppliesPledge() {
  const { language, t } = useLanguage();

  const [categories, setCategories] = useState<SupplyCategory[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "food" | "hygiene" | "medicine" | "psychiatry" | "supplies"
  >("food");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customItems, setCustomItems] = useState<
    { id: string; name: string; qty: number }[]
  >([]);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");

  // Contact form & Estimated Delivery Date
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<SuppliesPledgeType | null>(null);

  useEffect(() => {
    getSupplyCategories()
      .then((cats) => {
        if (cats && cats.length > 0) {
          // Normalize server categories to filter out equipment and map properly
          const cleanCats = cats.filter((c) => {
            const nameEn = (c.name?.en || "").toLowerCase();
            return !nameEn.includes("equipment");
          });
          if (cleanCats.length > 0) {
            setCategories(cleanCats);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Map active tab to active category
  const activeCategory =
    categories.find((c) => {
      const nameEn = (c.name?.en || "").toLowerCase();
      if (activeTab === "food") return nameEn.includes("food") || c.id === "cat-food";
      if (activeTab === "hygiene") return nameEn.includes("hygiene") || c.id === "cat-hygiene";
      if (activeTab === "psychiatry") return nameEn.includes("psychiatry") || nameEn.includes("therapy") || c.id === "cat-psychiatry";
      if (activeTab === "supplies") return nameEn.includes("supplies") || nameEn.includes("ቁሳቁስ") || c.id === "cat-supplies";
      return false;
    }) ||
    DEFAULT_CATEGORIES.find((c) => {
      if (activeTab === "food") return c.id === "cat-food";
      if (activeTab === "hygiene") return c.id === "cat-hygiene";
      if (activeTab === "psychiatry") return c.id === "cat-psychiatry";
      if (activeTab === "supplies") return c.id === "cat-supplies";
      return false;
    }) ||
    categories[0];

  const changeQty = (itemId: string, delta: number) =>
    setQuantities((p) => ({
      ...p,
      [itemId]: Math.max(0, (p[itemId] || 0) + delta),
    }));

  const addCustom = () => {
    if (!customName.trim()) return;
    setCustomItems((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, name: customName.trim(), qty: 1 },
    ]);
    setCustomName("");
    setShowCustom(false);
  };

  const changeCustomQty = (id: string, delta: number) =>
    setCustomItems((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it,
        )
        .filter((it) => it.qty > 0),
    );

  const selectedRegular = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([itemId, qty]) => {
      let itemName = "";
      for (const cat of [...categories, ...DEFAULT_CATEGORIES]) {
        const found = cat.items.find((it: SupplyItem) => it.id === itemId);
        if (found) {
          itemName = t(found.name);
          break;
        }
      }
      return { itemId, itemName, quantity: qty, custom: "" };
    });

  const selectedCustom = customItems.map((it) => ({
    itemId: it.id,
    itemName: it.name,
    quantity: it.qty,
    custom: it.name,
  }));

  const allSelected = [...selectedRegular, ...selectedCustom];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanName = sanitizeText(donorName, 120);
    const cleanPhone = sanitizePhone(donorPhone);
    const cleanEmail = sanitizeText(donorEmail, 120);
    const cleanDate = sanitizeText(estimatedDeliveryDate, 80);

    if (!isNonEmpty(cleanName)) {
      setError(language === "am" ? "ስምዎን ያስገቡ።" : "Please enter your name.");
      return;
    }
    if (!isNonEmpty(cleanPhone) && !isNonEmpty(cleanEmail)) {
      setError(
        language === "am"
          ? "ስልክ ወይም ኢሜይልዎን ያስገቡ።"
          : "Please provide your phone or email.",
      );
      return;
    }
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      setError(
        language === "am" ? "ኢሜይሉ ትክክል አይደለም።" : "Please enter a valid email.",
      );
      return;
    }
    if (allSelected.length === 0) {
      setError(
        language === "am"
          ? "ቢያንስ 1 እቃ ይምረጡ።"
          : "Please select at least one item.",
      );
      return;
    }
    if (!cleanDate) {
      setError(
        language === "am"
          ? "የሚያስረክቡበትን ግምታዊ ቀን ይምረጡ።"
          : "Please specify an estimated delivery date.",
      );
      return;
    }

    setSubmitting(true);
    const pledge: SuppliesPledgeType = {
      id: "SUP-" + Math.floor(Math.random() * 900000 + 100000),
      donorName: cleanName,
      donorPhone: cleanPhone,
      donorEmail: cleanEmail,
      categoryId: activeCategory?.id || activeTab,
      items: allSelected,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      estimatedDeliveryDate: cleanDate,
      status: "pledged",
      notes: sanitizeText(notes, 500),
    };
    await saveSuppliesPledge(pledge);
    setSubmitted(pledge);
    setSubmitting(false);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-4 max-w-lg mx-auto"
      >
        <div className="w-16 h-16 bg-brand-sky-100 text-brand-sky-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>
        <span className="font-mono text-xs font-bold text-brand-sky-600 bg-brand-sky-50 border border-brand-sky-200 px-3 py-1 rounded-lg block w-fit mx-auto">
          {submitted.id}
        </span>
        <h3 className="font-serif text-2xl font-bold text-brand-sky-950">
          {language === "am"
            ? "ምስጋና! የዓይነት ቃልኪዳንዎ ደርሶናል።"
            : "Thank you! In-kind pledge received."}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {language === "am"
            ? `እናመሰግናለን ${submitted.donorName}! ግምታዊ የማድረሻ ቀንዎ (${submitted.estimatedDeliveryDate}) ላይ በመመስረት የአስተዳደር ቡድናችን ያገኝዎታል።`
            : `Thank you ${submitted.donorName}! We have recorded your estimated delivery date (${submitted.estimatedDeliveryDate}) and our team will be in touch.`}
        </p>
        <button
          onClick={() => {
            setSubmitted(null);
            setQuantities({});
            setCustomItems([]);
            setDonorName("");
            setDonorPhone("");
            setDonorEmail("");
            setEstimatedDeliveryDate("");
            setNotes("");
          }}
          className="px-6 py-2.5 bg-brand-sky-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-sky-500 cursor-pointer transition-colors"
        >
          {language === "am" ? "ሌላ ቃልኪዳን" : "Make Another Pledge"}
        </button>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-brand-sky-400">
        <LoadingDots />
        <span className="text-sm font-medium">
          {language === "am" ? "በመጫን ላይ..." : "Loading categories..."}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Strict Single-Word Category Options Bar: Food, Hygiene, Medicine, Psychiatry, Supplies ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 max-w-4xl mx-auto">
        {/* 1. Food (ምግብ) */}
        <button
          type="button"
          onClick={() => setActiveTab("food")}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer border ${
            activeTab === "food"
              ? "bg-amber-500 text-white border-transparent shadow-md ring-2 ring-amber-200"
              : "bg-white text-amber-900 border-amber-200 hover:border-amber-400 hover:bg-amber-50"
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 shrink-0" />
          <span>{language === "am" ? "ምግብ" : "Food"}</span>
        </button>

        {/* 2. Hygiene (ንጽህና) */}
        <button
          type="button"
          onClick={() => setActiveTab("hygiene")}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer border ${
            activeTab === "hygiene"
              ? "bg-brand-sky-500 text-white border-transparent shadow-md ring-2 ring-brand-sky-200"
              : "bg-white text-brand-sky-900 border-brand-sky-200 hover:border-brand-sky-400 hover:bg-brand-sky-50"
          }`}
        >
          <Droplets className="w-4 h-4 shrink-0" />
          <span>{language === "am" ? "ንጽህና" : "Hygiene"}</span>
        </button>

        {/* 3. Medicine (መድሃኒት) */}
        <button
          type="button"
          onClick={() => setActiveTab("medicine")}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer border ${
            activeTab === "medicine"
              ? "bg-rose-500 text-white border-transparent shadow-md ring-2 ring-rose-200"
              : "bg-white text-rose-900 border-rose-200 hover:border-rose-400 hover:bg-rose-50"
          }`}
        >
          <Pill className="w-4 h-4 shrink-0" />
          <span>{language === "am" ? "መድሃኒት" : "Medicine"}</span>
        </button>

        {/* 4. Psychiatry (ስነ-አእምሮ) */}
        <button
          type="button"
          onClick={() => setActiveTab("psychiatry")}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer border ${
            activeTab === "psychiatry"
              ? "bg-purple-600 text-white border-transparent shadow-md ring-2 ring-purple-200"
              : "bg-white text-purple-900 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
          }`}
        >
          <Brain className="w-4 h-4 shrink-0" />
          <span>{language === "am" ? "ስነ-አእምሮ" : "Psychiatry"}</span>
        </button>

        {/* 5. Supplies (ቁሳቁስ) */}
        <button
          type="button"
          onClick={() => setActiveTab("supplies")}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer border col-span-2 sm:col-span-1 ${
            activeTab === "supplies"
              ? "bg-teal-600 text-white border-transparent shadow-md ring-2 ring-teal-200"
              : "bg-white text-teal-900 border-teal-200 hover:border-teal-400 hover:bg-teal-50"
          }`}
        >
          <Package className="w-4 h-4 shrink-0" />
          <span>{language === "am" ? "ቁሳቁስ" : "Supplies"}</span>
        </button>
      </div>

      {/* ── Render Medicine View with Dynamic Goal Scale & Top Minimalistic Goal Card ── */}
      {activeTab === "medicine" ? (
        <div className="bg-rose-50/20 p-2 sm:p-4 rounded-3xl border border-rose-100">
          <MedicinePledge />
        </div>
      ) : (
        /* ── Render Standard Category Supplies View (Food, Hygiene, Psychiatry, Supplies) ── */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            {/* Selection counter */}
            {allSelected.length > 0 && (
              <div className="flex items-center justify-between bg-brand-sky-50 border border-brand-sky-200 rounded-xl px-4 py-2.5">
                <span className="text-xs font-bold text-brand-sky-700">
                  {allSelected.length}{" "}
                  {language === "am" ? "እቃዎች ተመርጠዋል" : "item(s) selected"}
                </span>
              </div>
            )}

            {/* Item rows */}
            {activeCategory && (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
                {activeCategory.items.map((item: SupplyItem) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.18 }}
                  >
                    <SupplyRow
                      item={item}
                      qty={quantities[item.id] || 0}
                      language={language}
                      t={t}
                      onChangeQty={changeQty}
                    />
                  </motion.div>
                ))}

                {/* Add custom item */}
                <div className="rounded-2xl border-2 border-dashed border-brand-sky-200 bg-white hover:border-brand-sky-400 transition-colors">
                  {showCustom ? (
                    <div className="p-4 space-y-2">
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder={
                          language === "am"
                            ? "ሌላ እቃ ስም..."
                            : "Custom item name..."
                        }
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none"
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addCustom())
                        }
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={addCustom}
                          className="flex-1 py-2 bg-brand-sky-400 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-sky-500 transition-colors"
                        >
                          {language === "am" ? "ጨምር" : "Add"}
                        </button>
                        <button
                          onClick={() => {
                            setShowCustom(false);
                            setCustomName("");
                          }}
                          className="px-3 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCustom(true)}
                      className="w-full flex items-center gap-2 px-4 py-3.5 text-xs font-bold text-brand-sky-600 hover:text-brand-sky-800 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      {language === "am" ? "ሌላ እቃ ጨምር" : "Add a custom item"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Custom items list */}
            {customItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-sky-500">
                  {language === "am" ? "ሌሎች እቃዎች" : "Custom Items"}
                </p>
                {customItems.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center gap-3 bg-white border-2 border-brand-sky-200 rounded-2xl px-4 py-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-sky-400 shrink-0" />
                    <span className="text-sm font-semibold text-brand-sky-950 flex-1">
                      {it.name}
                    </span>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-0.5">
                      <button
                        onClick={() => changeCustomQty(it.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-sky-600 rounded-md cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-black text-brand-sky-950 min-w-[28px] text-center">
                        {it.qty}
                      </span>
                      <button
                        onClick={() => changeCustomQty(it.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-sky-600 rounded-md cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact form & Estimated Delivery Date */}
          <div className="bg-white border-2 border-brand-sky-200 rounded-3xl p-6 shadow-xl space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <h3 className="font-serif font-bold text-base text-brand-sky-950">
                {language === "am" ? "የእርስዎ መረጃና የማስረከቢያ ቀን" : "Contact & Delivery Date"}
              </h3>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  {language === "am" ? "ሙሉ ስም *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder={language === "am" ? "ስምዎን ያስገቡ" : "Enter full name"}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {language === "am" ? "ስልክ ቁጥር *" : "Phone *"}
                  </label>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {language === "am" ? "ኢሜይል (አማራጭ)" : "Email (Optional)"}
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Estimated Delivery Date Picker */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-sky-900 mb-1">
                  <Calendar className="w-3.5 h-3.5 inline mr-1 text-brand-sky-500" />
                  {language === "am" ? "የሚያስረክቡበት ግምታዊ ቀን *" : "Estimated Delivery Date *"}
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={estimatedDeliveryDate}
                  onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none font-bold text-brand-sky-950 cursor-pointer"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  {language === "am"
                    ? "እቃውን መቼ ለማድረስ ወይም ለማስረከብ ያቅዳሉ?"
                    : "When do you plan to bring or send these supplies to Selihom?"}
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  {language === "am" ? "ማስታወሻ (አማራጭ)" : "Notes (Optional)"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    language === "am" ? "ተጨማሪ መልእክት..." : "Notes or drop-off details..."
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none resize-none font-medium"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <span className="text-xs font-bold text-brand-sky-700 bg-brand-sky-50 border border-brand-sky-200 rounded-xl px-3.5 py-3 text-center sm:text-left">
                  {language === "am" ? "የተመረጡ እቃዎች" : "Selected items"}:{" "}
                  <strong className="text-brand-sky-950 font-black">{allSelected.length}</strong>
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <LoadingDots label={language === "am" ? "በመላክ..." : "Submitting..."} className="justify-center" />
                  ) : (
                    <>
                      <Package className="w-4 h-4" />
                      <span>{language === "am" ? "ቃልኪዳን ላክ" : "Submit Pledge"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
