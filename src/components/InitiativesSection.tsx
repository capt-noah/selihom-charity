import React from "react";
import { motion } from "motion/react";
import { Stethoscope, Home, GraduationCap, Briefcase, CheckCircle2 } from "lucide-react";
import { INITIATIVES } from "../data";
import { useLanguage } from "../context/LanguageContext";

const serviceIcons: Record<string, React.ComponentType<any>> = {
  "mental-health":    Stethoscope,
  "elderly-support":  Home,
  "children-support": GraduationCap,
  "skills-training":  Briefcase,
};

// Each card gets a distinct accent matching the logo figures
const cardAccents = [
  { tag: "bg-brand-sky-400",    icon: "bg-brand-sky-400 text-white",    check: "text-brand-sky-500",    row: "bg-brand-sky-50 border-brand-sky-100"    },
  { tag: "bg-brand-green-400",  icon: "bg-brand-green-400 text-white",  check: "text-brand-green-500",  row: "bg-brand-green-50 border-brand-green-100"  },
  { tag: "bg-brand-yellow-400", icon: "bg-brand-yellow-400 text-white", check: "text-brand-yellow-600", row: "bg-brand-yellow-50 border-brand-yellow-100" },
  { tag: "bg-brand-orange-400", icon: "bg-brand-orange-400 text-white", check: "text-brand-orange-500", row: "bg-brand-orange-50 border-brand-orange-100" },
];

const serviceDetails: Record<string, { amTitle:string; enTitle:string; amDesc:string; enDesc:string; amPoints:string[]; enPoints:string[]; tagAm:string; tagEn:string }> = {
  "mental-health":    { amTitle:"የአዕምሮ ህክምናና ተሃድሶ",          enTitle:"Mental Healthcare & Rescue",   amDesc:"ከጎዳና ህሙማንን በማንሳት ሁለንተናዊ ህክምና።",    enDesc:"Rescuing individuals with mental illness, providing psychiatric care and rehabilitation.",  amPoints:["ከጎዳና ማንሳትና ንጹህ መጠለያ","ዕለታዊ ህክምና ክትትል"],        enPoints:["Street rescue & clean shelter","Daily psychiatric care"],      tagAm:"ህክምናና ተሃድሶ", tagEn:"Psychiatric Care" },
  "elderly-support":  { amTitle:"የአዛውንቶች እንክብካቤ",             enTitle:"Elderly Care & Nutrition",     amDesc:"ተንከባካቢ የሌላቸው አዛውንቶች ምግብ፣ ህክምና።",  enDesc:"Providing warm meals, medical support, and dignity to abandoned senior citizens.",        amPoints:["ዕለታዊ ምግብና መጠለያ","የቤት ህክምናና ድጋፍ"],                      enPoints:["Nutritious meals & shelter","In-home medical care"],           tagAm:"አዛውንቶች",      tagEn:"Senior Care"      },
  "children-support": { amTitle:"የህጻናት ትምህርትና ድጋፍ",           enTitle:"Child Welfare & Education",    amDesc:"ተጋላጭ ህጻናትን ትምህርት፣ ምግብ ድጋፍ።",      enDesc:"Supporting orphaned and vulnerable children with school tuition, meals, and tutoring.",   amPoints:["የትምህርት ቁሳቁስ ድጋፍ","ከትምህርት ጊዜ ውጭ ማጠናከሪያ"],               enPoints:["School supplies & backpacks","After-school tutoring"],         tagAm:"ህጻናትና ትምህርት",tagEn:"Child Welfare"    },
  "skills-training":  { amTitle:"የሙያ ስልጠናና የስራ እድል",          enTitle:"Vocational Skills & Jobs",     amDesc:"ያገገሙ ሰዎችን ሙያ ስልጠና ማብቃት።",          enDesc:"Empowering recovered beneficiaries with practical job skills for self-sufficiency.",       amPoints:["ሙያ ስልጠናዎች","የስራ ማስጀመሪያ ድጋፍ"],                              enPoints:["Practical trade training","Seed equipment kits"],              tagAm:"የሙያ ስልጠና",   tagEn:"Job Placement"   },
};

export default function InitiativesSection() {
  const { language } = useLanguage();

  return (
    <section id="initiatives" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-sky-50/80 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-yellow-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3">
            {language === "am" ? "አገልግሎቶቻችን" : "Our Services"}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-sky-950 tracking-tight mb-4">
            {language === "am" ? "የምናቀርባቸው አገልግሎቶች" : "Our Services & Initiatives"}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-medium">
            {language === "am"
              ? "ሁሉ አቀፍ ድጋፍ — ህክምና፣ አዛውንቶች፣ ህጻናት እና ሙያ ስልጠና።"
              : "Comprehensive support: psychiatric care, elderly housing, child education, and vocational skills."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {INITIATIVES.map((item, idx) => {
            const d     = serviceDetails[item.id] || serviceDetails["mental-health"];
            const Icon  = serviceIcons[item.id] || Stethoscope;
            const ac    = cardAccents[idx % cardAccents.length];
            const title = language === "am" ? d.amTitle : d.enTitle;
            const desc  = language === "am" ? d.amDesc  : d.enDesc;
            const pts   = language === "am" ? d.amPoints : d.enPoints;
            const tag   = language === "am" ? d.tagAm   : d.tagEn;

            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:border-brand-sky-200 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between group">
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-gray-900">
                    <img src={item.image} alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-sky-950/65 via-transparent to-transparent" />
                    <div className={`absolute top-3 left-3 ${ac.icon} p-2.5 rounded-2xl shadow-lg border border-white/20 flex items-center gap-1.5`}>
                      <Icon className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className={`text-[10px] font-black uppercase tracking-wider text-white ${ac.tag} px-3 py-1 rounded-lg shadow-sm`}>
                        {tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="font-serif font-bold text-xl text-brand-sky-950 leading-tight group-hover:text-brand-sky-500 transition-colors">{title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>

                    <div className="pt-3 space-y-2 border-t border-gray-100">
                      {pts.map((pt, pIdx) => (
                        <div key={pIdx} className={`flex items-start gap-2 text-xs font-semibold text-brand-sky-950 ${ac.row} p-2 rounded-xl border`}>
                          <CheckCircle2 className={`w-4 h-4 ${ac.check} shrink-0 mt-0.5`} />
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
