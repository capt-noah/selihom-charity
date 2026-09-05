import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Handshake,
  X,
  Send,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  UtensilsCrossed,
  Stethoscope,
  GraduationCap,
  Settings,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { VolunteerApplication } from "../types";
import {
  saveVolunteer,
  getVolunteerRoles,
  VolunteerCategory,
  VolunteerRole,
} from "../utils/adminStorage";
import {
  sanitizeText,
  sanitizePhone,
  isValidEmail,
  isNonEmpty,
} from "../utils/sanitize";
import { useNavigate } from "react-router-dom";
import LoadingDots from "./LoadingDots";

const FALLBACK_ICON_MAP: Record<string, React.ComponentType<any>> = {
  UtensilsCrossed,
  Stethoscope,
  GraduationCap,
  Settings,
  Users,
  Brain: HeartHandshake, // Brain isn't in lucide; use HeartHandshake
};

export default function GetInvolvedSection() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // ── Volunteer modal state ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<VolunteerApplication | null>(
    null,
  );

  // ── Volunteer role categories (from API) ──
  const [categories, setCategories] = useState<VolunteerCategory[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [otherRole, setOtherRole] = useState("");
  const [volunteerStep, setVolunteerStep] = useState<1 | 2 | 3>(1);

  // ── Form fields ──
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [availability, setAvailability] =
    useState<VolunteerApplication["availability"]>("weekends");
  const [experience, setExperience] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setRolesLoading(true);
    getVolunteerRoles()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setSelectedCatId(cats[0].id);
      })
      .catch(() => {})
      .finally(() => setRolesLoading(false));
  }, []);

  const selectedCategory = categories.find((c) => c.id === selectedCatId);
  const selectedRole = selectedCategory?.roles.find(
    (r) => r.id === selectedRoleId,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const cleanName = sanitizeText(fullName, 120);
    const cleanPhone = sanitizePhone(phone);
    const cleanEmail = sanitizeText(email, 120);
    const cleanExp = sanitizeText(experience, 1000);
    const cleanOtherRole = sanitizeText(otherRole, 120);

    if (!isNonEmpty(cleanName)) {
      setFormError(
        language === "am" ? "ሙሉ ስምዎን ያስገቡ።" : "Please enter your full name.",
      );
      return;
    }
    if (!isNonEmpty(cleanPhone) && !isNonEmpty(cleanEmail)) {
      setFormError(
        language === "am"
          ? "ስልክ ወይም ኢሜይልዎን ያስገቡ።"
          : "Please enter your phone or email.",
      );
      return;
    }
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      setFormError(
        language === "am"
          ? "ኢሜይሉ ትክክል አይደለም።"
          : "Please enter a valid email address.",
      );
      return;
    }
    if (!selectedCatId) {
      setFormError(
        language === "am" ? "የስራ ዘርፍ ይምረጡ።" : "Please select a category.",
      );
      return;
    }
    if (!selectedRoleId && !cleanOtherRole) {
      setFormError(language === "am" ? "ሚናዎን ይምረጡ ወይም ሌላ ሚና ይግለጹ።" : "Please select a role or specify another role.");
      return;
    }

    setIsSubmitting(true);

    // Derive interestArea from category id for backward compatibility
    const areaMap: Record<string, VolunteerApplication["interestArea"]> = {
      "vcat-food": "kitchen",
      "vcat-medical": "medical",
      "vcat-mental": "psychology",
      "vcat-education": "education",
    };
    const interestArea: VolunteerApplication["interestArea"] =
      areaMap[selectedCatId] || "general";

    const app: VolunteerApplication & {
      categoryId?: string;
      roleId?: string;
      roleName?: string;
    } = {
      id: "VOL-" + Math.floor(Math.random() * 900000 + 100000),
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      interestArea,
      availability,
      experience: cleanExp,
      status: "new",
      submittedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      // Extra fields (saved but typed as any for VolunteerApplication)
      categoryId: selectedCatId,
      roleId: selectedRoleId,
      roleName: selectedRole ? t(selectedRole.name) : cleanOtherRole,
    };

    await saveVolunteer(app as any);
    setSubmittedApp(app as any);
    setIsSubmitting(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setExperience("");
    setSelectedRoleId("");
    setOtherRole("");
  };

  const resetAndClose = () => {
    setIsModalOpen(false);
    setSubmittedApp(null);
    setFormError("");
    setSelectedRoleId("");
    setOtherRole("");
    setVolunteerStep(1);
  };

  const goToNextStep = () => {
    setFormError("");
    if (volunteerStep === 1 && !selectedCatId) {
      setFormError(language === "am" ? "የስራ ዘርፍ ይምረጡ።" : "Please select a category.");
      return;
    }
    if (volunteerStep === 2 && !selectedRoleId && !otherRole.trim()) {
      setFormError(language === "am" ? "ሚናዎን ይምረጡ ወይም ሌላ ሚና ይግለጹ።" : "Please select a role or specify another role.");
      return;
    }
    setVolunteerStep((step) => Math.min(3, step + 1) as 1 | 2 | 3);
  };

  const goToPreviousStep = () => {
    setFormError("");
    setVolunteerStep((step) => Math.max(1, step - 1) as 1 | 2 | 3);
  };

  const tracks = [
    {
      id: "volunteer",
      icon: Users,
      primary: true,
      title: { am: "በበጎ ፈቃደኝነት መሳተፍ", en: "Become a Volunteer" },
      description: {
        am: "ምግብ፣ ህክምና፣ ምክር ወይም ትምህርት ለማገልገል ይቀላቀሉን።",
        en: "Join our kitchen, medical, counseling, or tutoring shifts.",
      },
      badge: { am: "በጎ ፈቃደኝነት", en: "Volunteer" },
      ctaText: { am: "ለመመዝገብ ይጫኑ", en: "Apply Now" },
      tags: [
        { am: "ምግብ ቤት", en: "Food & Kitchen" },
        { am: "ህክምና", en: "Medical Support" },
        { am: "ቴራፒ", en: "Therapy" },
        { am: "ትምህርት", en: "Education" },
      ],
    },
    {
      id: "partner",
      icon: Handshake,
      primary: false,
      title: { am: "ድርጅታዊ አጋርነት", en: "Institutional Partnership" },
      description: {
        am: "ህክምና፣ ምግብ ወይም ሙያ ቁሳቁሶችን ያቅርቡልን።",
        en: "Sponsor medical equipment, food supplies, or vocational toolkits.",
      },
      badge: { am: "አጋርነት", en: "Partnership" },
      ctaText: { am: "በስልክ ያግኙን →", en: "Contact Us →" },
      tags: [] as { am: string; en: string }[],
    },
  ];

  return (
    <section
      id="get-involved"
      className="relative py-24 bg-brand-sky-50 overflow-hidden border-b border-brand-sky-100"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3"
          >
            {language === "am" ? "ተሳተፉ" : "Get Involved"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-extrabold text-brand-sky-950 mb-4 tracking-tight leading-tight"
          >
            {language === "am" ? (
              <>
                {" "}
                በሰሊሆም{" "}
                <span className="text-brand-sky-400 italic font-medium">
                  ተሳተፉ
                </span>
              </>
            ) : (
              <>
                {" "}
                Ways to{" "}
                <span className="text-brand-sky-400 italic font-medium">
                  Get Involved
                </span>
              </>
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm md:text-base leading-relaxed"
          >
            {language === "am"
              ? "ጊዜዎን ወይም ክህሎትዎን ለሰሊሆም ተጠቃሚዎች ያበርክቱ — ትልቅ ለውጥ ያደርጋሉ።"
              : "Your time or skills can transform lives. Choose how you want to serve our shelter residents."}
          </motion.p>
        </div>

        {!isModalOpen && <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tracks.map((track, idx) => {
            const Icon = track.icon;
            const handleClick = () =>
              track.id === "volunteer"
                ? setIsModalOpen(true)
                : document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={handleClick}
                className="bg-white rounded-3xl p-8 border-2 border-brand-sky-100 hover:border-brand-sky-400 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-brand-sky-50 text-brand-sky-600 rounded-2xl flex items-center justify-center shadow-sm border border-brand-sky-200 group-hover:bg-brand-sky-400 group-hover:text-white group-hover:border-brand-sky-400 transition-all">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border bg-brand-sky-50 text-brand-sky-600 border-brand-sky-200">
                      {t(track.badge)}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-brand-sky-950 mb-3 group-hover:text-brand-sky-500 transition-colors">
                    {t(track.title)}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-4">
                    {t(track.description)}
                  </p>
                  {track.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {track.tags.map((tag) => (
                        <span
                          key={tag.en}
                          className="text-[10px] font-bold bg-brand-sky-50 text-brand-sky-700 px-2.5 py-1 rounded-lg border border-brand-sky-200"
                        >
                          {language === "am" ? tag.am : tag.en}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                    className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      track.primary
                        ? "bg-brand-sky-400 hover:bg-brand-sky-500 text-white shadow-md shadow-brand-sky-400/25"
                        : "bg-brand-sky-50 hover:bg-brand-sky-100 text-brand-sky-800 border border-brand-sky-200"
                    }`}
                  >
                    <span>{t(track.ctaText)}</span>
                    <HeartHandshake className="w-4 h-4 text-brand-yellow-400 shrink-0" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>}
      </div>

      {/* ── Volunteer modal ── */}
      <AnimatePresence initial={false}>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mt-12 w-full"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 8 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl w-full max-w-4xl mx-auto p-5 sm:p-8 shadow-xl border-2 border-brand-sky-100 relative"
            >
              <button
                onClick={resetAndClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {submittedApp ? (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 bg-brand-sky-100 text-brand-sky-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-sky-600 bg-brand-sky-50 px-2.5 py-1 rounded-lg border border-brand-sky-200 block w-fit mx-auto">
                    ID: {(submittedApp as any).id}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-brand-sky-950">
                    {language === "am"
                      ? "ማመልከቻዎ ተቀብለናል!"
                      : "Application Submitted!"}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                    {language === "am"
                      ? "እናመሰግናለን! አስተዳደር ቡድናችን ብዙም ሳይቆይ ያግኝዎታል።"
                      : "Thank you! Our admin team will review your application and reach out shortly."}
                  </p>
                  <button
                    onClick={resetAndClose}
                    className="w-full py-3 bg-brand-sky-400 text-white font-bold text-sm rounded-xl hover:bg-brand-sky-500 cursor-pointer shadow-md"
                  >
                    {language === "am" ? "ዝጋ" : "Close"}
                  </button>
                </div>
              ) : (
                <div>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-sky-100 text-brand-sky-600 flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-brand-sky-950">
                        {language === "am"
                          ? "የበጎ ፈቃደኝነት ቅጽ"
                          : "Volunteer Application"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {language === "am"
                          ? "ዘርፍና ሚና ይምረጡ፣ ከዚያ ዝርዝር ያስገቡ"
                          : "Choose your area and role, then fill in your details"}
                      </p>
                    </div>
                  </div>

                  {rolesLoading ? (
                    <div className="flex items-center justify-center py-10 gap-2 text-brand-sky-400">
                      <LoadingDots />
                      <span className="text-xs font-medium">
                        {language === "am"
                          ? "ዘርፎችን በማምጣት ላይ..."
                          : "Loading categories..."}
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {formError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {formError}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pb-1">
                        {[1, 2, 3].map((step) => (
                          <React.Fragment key={step}>
                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black ${volunteerStep === step ? "bg-brand-sky-400 text-white" : volunteerStep > step ? "bg-brand-sky-100 text-brand-sky-700" : "bg-gray-100 text-gray-400"}`}>{step}</span>
                            {step < 3 && <span className={`h-px flex-1 ${volunteerStep > step ? "bg-brand-sky-300" : "bg-gray-200"}`} />}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Step 1: Category grid */}
                      {volunteerStep === 1 && <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-brand-sky-600 mb-3">
                          {language === "am"
                            ? "1. የስራ ዘርፍ ይምረጡ *"
                            : "1. Choose Your Area *"}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {categories.map((cat) => {
                            const Icon = FALLBACK_ICON_MAP[cat.icon] || Users;
                            const isSelected = selectedCatId === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setSelectedCatId(cat.id);
                                  setSelectedRoleId("");
                                  setOtherRole("");
                                }}
                                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 cursor-pointer transition-all text-center ${
                                  isSelected
                                    ? `${cat.color} text-white border-transparent shadow-md`
                                    : "bg-white border-brand-sky-100 text-brand-sky-700 hover:border-brand-sky-400"
                                }`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? "bg-white/20" : "bg-brand-sky-50"}`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-bold leading-snug">
                                  {t(cat.name)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button type="button" onClick={goToNextStep} className="rounded-xl bg-brand-sky-400 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-sky-500">{language === "am" ? "ቀጣይ" : "Next"}</button>
                        </div>
                      </div>}

                      {/* Step 2: Role within category */}
                      {volunteerStep === 2 && <div className="min-h-[280px] flex flex-col">
                        {selectedCategory && selectedCategory.roles.length > 0 ? (
                            <div>
                              <label className="block text-xs font-black uppercase tracking-widest text-brand-sky-600 mb-3">
                                {language === "am"
                                  ? "2. ሚናዎን ይምረጡ"
                                  : "2. Select a Specific Role"}
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1">
                                {selectedCategory.roles.map((role) => {
                                  const isSelected = selectedRoleId === role.id;
                                  return (
                                    <button
                                      key={role.id}
                                      type="button"
                                      onClick={() =>
                                        setSelectedRoleId(
                                          isSelected ? "" : role.id,
                                        )
                                      }
                                      className={`w-full flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all text-left ${
                                        isSelected
                                          ? "border-brand-sky-400 bg-brand-sky-50"
                                          : "border-gray-100 bg-white hover:border-brand-sky-200"
                                      }`}
                                    >
                                      <div>
                                        <span className="text-xs font-bold text-brand-sky-950 block">
                                          {t(role.name)}
                                        </span>
                                        <span className="text-[10px] text-gray-500">
                                          {t(role.description)}
                                        </span>
                                      </div>
                                      <ChevronRight
                                        className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? "text-brand-sky-400 rotate-90" : "text-gray-300"}`}
                                      />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : <p className="rounded-xl bg-brand-sky-50 p-4 text-sm text-brand-sky-700">{language === "am" ? "ይህ ዘርፍ የተወሰነ ሚና የለውም።" : "This area has no specific roles. You can specify another role below."}</p>}
                        <div className="mt-4">
                          <label className="block text-xs font-black uppercase tracking-widest text-brand-sky-600 mb-2">{language === "am" ? "ሌላ ሚና (አማራጭ)" : "Other role (optional)"}</label>
                          <input value={otherRole} onChange={(e) => { setOtherRole(e.target.value); setSelectedRoleId(""); }} placeholder={language === "am" ? "የሚፈልጉትን ሚና ይግለጹ" : "Describe the role you would like to do"} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-brand-sky-400" />
                        </div>
                        <div className="mt-4 flex justify-between">
                          <button type="button" onClick={goToPreviousStep} className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50">{language === "am" ? "ተመለስ" : "Back"}</button>
                          <button type="button" onClick={goToNextStep} className="rounded-xl bg-brand-sky-400 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-sky-500">{language === "am" ? "ቀጣይ" : "Next"}</button>
                        </div>
                      </div>}

                      {/* Step 3: Contact details */}
                      {volunteerStep === 3 && <div className="pt-1 space-y-3">
                        <label className="block text-xs font-black uppercase tracking-widest text-brand-sky-600">
                          {language === "am"
                            ? "3. የእርስዎ መረጃ"
                            : "3. Your Details"}
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={
                            language === "am" ? "ሙሉ ስም *" : "Full Name *"
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-sky-400 outline-none text-xs text-gray-900"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={language === "am" ? "ስልክ" : "Phone"}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-sky-400 outline-none text-xs text-gray-900"
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={language === "am" ? "ኢሜይል" : "Email"}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-sky-400 outline-none text-xs text-gray-900"
                          />
                        </div>
                        <select
                          value={availability}
                          onChange={(e) =>
                            setAvailability(e.target.value as any)
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-sky-400 outline-none text-xs text-gray-900 bg-white"
                        >
                          <option value="weekends">
                            {language === "am" ? "ቅዳሜና እሁድ" : "Weekends"}
                          </option>
                          <option value="weekdays">
                            {language === "am" ? "በስራ ቀናት" : "Weekdays"}
                          </option>
                          <option value="flexible">
                            {language === "am" ? "ተለዋዋጭ ጊዜ" : "Flexible"}
                          </option>
                        </select>
                        <textarea
                          rows={3}
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          placeholder={
                            language === "am"
                              ? "ልምድ ወይም ምክንያት (አማራጭ)"
                              : "Brief experience or motivation (optional)"
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-sky-400 outline-none text-xs text-gray-900 resize-none"
                        />
                        <div className="mt-4 flex justify-between gap-3">
                          <button type="button" onClick={goToPreviousStep} className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50">{language === "am" ? "ተመለስ" : "Back"}</button>
                          <button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl bg-brand-sky-400 py-2.5 text-xs font-bold text-white hover:bg-brand-sky-500 disabled:opacity-50">
                            {isSubmitting ? <LoadingDots label={language === "am" ? "በመላክ..." : "Submitting..."} className="justify-center" /> : <><Send className="mr-2 inline-block h-4 w-4 text-brand-yellow-400" />{language === "am" ? "ማመልከቻ ላክ" : "Submit Application"}</>}
                          </button>
                        </div>
                      </div>}

                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
