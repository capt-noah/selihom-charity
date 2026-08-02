import React from "react";
import { motion } from "motion/react";
import { Stethoscope, Home, GraduationCap, Briefcase, CheckCircle2 } from "lucide-react";
import { INITIATIVES } from "../data";
import { useLanguage } from "../context/LanguageContext";

const serviceIcons: Record<string, React.ComponentType<any>> = {
  "mental-health": Stethoscope,
  "elderly-support": Home,
  "children-support": GraduationCap,
  "skills-training": Briefcase,
};

const serviceDetails: Record<
  string,
  {
    amTitle: string;
    enTitle: string;
    amDesc: string;
    enDesc: string;
    amPoints: string[];
    enPoints: string[];
    tagAm: string;
    tagEn: string;
  }
> = {
  "mental-health": {
    amTitle: "የአዕምሮ ህክምናና የጎዳና ተሃድሶ",
    enTitle: "Mental Healthcare & Street Rescue",
    amDesc: "በጎዳና ላይ የሚኖሩ የአዕምሮ ህሙማንን በማንሳት ሁለንተናዊ የህክምና፣ የስነ-ልቦናና የተሃድሶ አገልግሎት እንሰጣለን።",
    enDesc: "Rescuing individuals with severe mental illness on streets, providing psychiatric care, medication, and full rehabilitation.",
    amPoints: ["ከጎዳና ማንሳትና ንፁህ መጠለያ", "ዕለታዊ የስነ-አእምሮና የህክምና ክትትል"],
    enPoints: ["Street rescue & clean shelter", "Daily psychiatric & medical care"],
    tagAm: "ህክምናና ተሃድሶ",
    tagEn: "Psychiatric Care"
  },
  "elderly-support": {
    amTitle: "የተጋላጭ አዛውንቶች እንክብካቤ",
    enTitle: "Elderly Care & Nutrition",
    amDesc: "ተንከባካቢና ቤተሰብ የሌላቸውን አዛውንቶች በክብርና በፍቅር መንከባከብ፣ ምግብና ህክምና ማቅረብ።",
    enDesc: "Providing housing, hot daily meals, medical kit deliveries, and dignity for abandoned senior citizens.",
    amPoints: ["ዕለታዊ የተመጣጠነ ምግብና መጠለያ", "የቤት ውስጥ ህክምናና የእንክብካቤ ድጋፍ"],
    enPoints: ["Nutritious daily meals & shelter", "In-home medical care & nurse checkups"],
    tagAm: "አዛውንቶች",
    tagEn: "Senior Housing"
  },
  "children-support": {
    amTitle: "የህጻናት ትምህርትና አጠቃላይ ድጋፍ",
    enTitle: "Child Welfare & Education",
    amDesc: "ተጋላጭና ቤተሰብ የሌላቸውን ህጻናት በትምህርት፣ በምግብና በህክምና በመደገፍ ብሩህ ተስፋ መስጠት።",
    enDesc: "Supporting orphaned and vulnerable children with school tuition, exercise books, meals, and academic tutoring.",
    amPoints: ["የደብተር፣ ቦርሳና ዩኒፎርም ድጋፍ", "ከትምህርት በኋላ ማጠናከሪያ ትምህርት"],
    enPoints: ["School backpacks & learning supplies", "After-school tutoring & mentorship"],
    tagAm: "ህጻናትና ትምህርት",
    tagEn: "Child Welfare"
  },
  "skills-training": {
    amTitle: "የሙያ ስልጠናና የስራ እድል",
    enTitle: "Vocational Skills & Jobs",
    amDesc: "ያገገሙ ሰዎችን በሙያ ስልጠና በማብቃት በራሳቸው እንዲቆሙና ስራ እንዲጀምሩ ማስቻል።",
    enDesc: "Empowering recovered beneficiaries with practical job skills and business toolkits for financial independence.",
    amPoints: ["የእደ-ጥበብና የሙያ ስልጠናዎች", "የስራ ማስጀመሪያ እቃዎች ድጋፍ"],
    enPoints: ["Practical craft & trade training", "Seed equipment & work toolkits"],
    tagAm: "የሙያ ስልጠና",
    tagEn: "Job Placement"
  }
};

interface InitiativesSectionProps {
  onDonateSelect?: (initiativeId: string, customAmount?: number) => void;
}

export default function InitiativesSection({ onDonateSelect }: InitiativesSectionProps) {
  const { language } = useLanguage();

  return (
    <section id="initiatives" className="py-24 bg-[#FAF8F5] relative overflow-hidden border-y border-brand-green-950/10">
      {/* Background radial accents to lift contrast */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-yellow-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Simple Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-green-950 tracking-tight mb-4">
            {language === "am" ? "የምናቀርባቸው አገልግሎቶች" : "Our Services & Initiatives"}
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
            {language === "am"
              ? "የአዕምሮ ህክምናን፣ የአዛውንቶች እንክብካቤን፣ የህጻናት ትምህርትንና የሙያ ስልጠናን በማቀናጀት ሁለንተናዊ ድጋፍ እንሰጣለን።"
              : "Providing comprehensive support through psychiatric healthcare, elder care, child education, and vocational skills."
            }
          </p>
        </div>

        {/* High-Contrast 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {INITIATIVES.map((item, idx) => {
            const details = serviceDetails[item.id] || serviceDetails["mental-health"];
            const Icon = serviceIcons[item.id] || Stethoscope;
            const title = language === "am" ? details.amTitle : details.enTitle;
            const desc = language === "am" ? details.amDesc : details.enDesc;
            const points = language === "am" ? details.amPoints : details.enPoints;
            const tag = language === "am" ? details.tagAm : details.tagEn;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white border-2 border-brand-green-950/15 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:border-brand-green-600/60 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Header with Badge Overlay */}
                  <div className="relative h-52 w-full overflow-hidden bg-gray-900">
                    <img
                      src={item.image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/70 via-transparent to-transparent" />
                    
                    {/* Floating Icon Pill */}
                    <div className="absolute top-3 left-3 bg-brand-green-950 text-brand-yellow-400 p-2.5 rounded-2xl shadow-lg border border-white/20 flex items-center gap-1.5">
                      <Icon className="w-4 h-4 stroke-[2.5]" />
                    </div>

                    {/* Category Tag */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white bg-brand-green-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 shadow-sm">
                        {tag}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-serif font-bold text-xl text-brand-green-950 leading-tight group-hover:text-brand-green-700 transition-colors">
                      {title}
                    </h3>

                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                      {desc}
                    </p>

                    {/* Specific Services Checklist */}
                    <div className="pt-3 space-y-2 border-t border-gray-100">
                      {points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2 text-xs font-semibold text-brand-green-950 bg-brand-green-50/70 p-2 rounded-xl border border-brand-green-100/80">
                          <CheckCircle2 className="w-4 h-4 text-brand-green-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
