import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, HeartHandshake, Stethoscope, Briefcase, Award, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

import founderImg from "../assets/images/charity-owner.jpg";
import person1Img from "../assets/images/person1.jpg";
import person2Img from "../assets/images/person2.jpg";
import person3Img from "../assets/images/person3.jpg";
import person4Img from "../assets/images/person4.jpg";

export default function TeamSection() {
  const { language } = useLanguage();

  const team = [
    {
      nameAm: "ዶ/ር ቴዎድሮስ ሀይሌ",
      nameEn: "Dr. Tewodros Haile",
      roleAm: "የስነ-አዕምሮ ህክምናና ጤና አስተባባሪ",
      roleEn: "Psychiatric & Clinical Lead",
      descAm: "የተጠቃሚዎችን የሆስፒታል ህክምና፣ የመድሃኒት ክትትልና የስነ-ልቦና ማገገም ይመራሉ።",
      descEn: "Coordinates specialized psychiatric evaluations, hospital referrals, and continuous clinical medication.",
      image: person1Img,
      icon: Stethoscope,
    },
    {
      nameAm: "ወ/ሮ ቤተልሄም ታደሰ",
      nameEn: "W/ro Betelhem Tadesse",
      roleAm: "የመጠለያና የተጠቃሚዎች ደህንነት ኃላፊ",
      roleEn: "Shelter Operations & Welfare Director",
      descAm: "በእንጦጦ ማዕከል የዕለት ምግብ ዝግጅት፣ ንጹህ አልባሳትና የነዋሪዎችን ደህንነት ያስተባብራሉ።",
      descEn: "Oversees daily residential operations, nutritious meal programs, and shelter safety for 400+ residents.",
      image: person2Img,
      icon: HeartHandshake,
    },
    {
      nameAm: "አቶ አማኑኤል ወርቁ",
      nameEn: "Ato Amanuel Worku",
      roleAm: "የፋይናንስና ግልጽነት ኃላፊ",
      roleEn: "Finance & Transparency Officer",
      descAm: "የማህበሩን ወርሃዊ የኦዲት ሪፖርቶች፣ የለጋሾች ግልጽነትና የሂሳብ አያያዝ በታማኝነት ያከናውናሉ።",
      descEn: "Ensures complete financial transparency, transparent donor accounting, and statutory audited compliance.",
      image: person3Img,
      icon: ShieldCheck,
    },
    {
      nameAm: "ወ/ሪት ሰላማዊት አበራ",
      nameEn: "W/rit Selamawit Abera",
      roleAm: "የሙያ ስልጠናና ማህበረሰብ ውህደት አስተባባሪ",
      roleEn: "Vocational Skills & Reintegration Lead",
      descAm: "ያገገሙ ሰዎችን በልብስ ስፌት፣ አነስተኛ ንግድና የእጅ ስራ በማሰልጠን ወደ ማህበረሰቡ እንዲቀላቀሉ ያደርጋሉ።",
      descEn: "Develops vocational training courses, startup toolkits, and transition plans for recovered beneficiaries.",
      image: person4Img,
      icon: Briefcase,
    },
  ];

  return (
    <section id="team" className="py-24 bg-gray-50/60 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-sky-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-green-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3"
          >
            {language === "am" ? "አመራርና አስተዳደር" : "Leadership & Governance"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-sky-950 tracking-tight mb-4"
          >
            {language === "am" ? "የሰሊሆም ቡድን እና አመራር" : "Meet Our Leadership & Team"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm sm:text-base leading-relaxed"
          >
            {language === "am"
              ? "የሰሊሆም ማህበር የሚመራው በቁርጠኛ ባለሙያዎች፣ በጤና አጋሮችና በበጎ ፈቃደኞች የጋራ አገልጋይነት ነው።"
              : "Driven by compassionate leaders, licensed psychiatric medical practitioners, shelter administrators, and community partners."}
          </motion.p>
        </div>

        {/* ── Founder Feature Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border-2 border-brand-sky-100 rounded-3xl p-6 sm:p-10 shadow-md mb-14 overflow-hidden relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Founder Image */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-56 h-64 sm:w-64 sm:h-72 rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-4 ring-brand-sky-100 group">
                <img
                  src={founderImg}
                  alt={language === "am" ? "አቶ ሚኪያስ ለገሰ" : "Ato Mikiyas Legesse"}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brand-sky-400">
                    {language === "am" ? "መስራች" : "Founder"}
                  </span>
                </div>
              </div>
            </div>

            {/* Founder Details */}
            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sky-50 text-brand-sky-600 text-xs font-bold border border-brand-sky-200">
                  <Award className="w-3.5 h-3.5" />
                  <span>{language === "am" ? "የሰሊሆም ማህበር መስራችና ስራ አስኪያጅ" : "Founder & General Manager"}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-sky-950">
                  {language === "am" ? "አቶ ሚኪያስ ለገሰ" : "Ato Mikiyas Legesse"}
                </h3>
              </div>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {language === "am"
                  ? "የሰሊሆም ማህበር በ2010 ዓ.ም. የተመሰረተው በአቶ ሚኪያስ ለገሰ ጥረት ነው። በጎዳና ላይ የወደቁ፣ የተጣሉና የአዕምሮ ህመም ያለባቸውን ወገኖች ከሞት አፋፍ በማዳን፣ ፍቅርና ክብካቤ በመስጠት ዛሬ ከ400 በላይ ወገኖችን በቋሚነት የሚያስተናግድ ተቋም እንዲሆን አስችለዋል።"
                  : "Selihom Association was founded in 2018 by Ato Mikiyas Legesse following personal tragedy turned into a lifetime mission. Rescuing vulnerable mentally ill and abandoned citizens directly from city streets, his vision has grown Selihom into a sanctuary caring for over 400 individuals every day."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-sky-950 bg-brand-sky-50/60 p-2.5 rounded-xl border border-brand-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-brand-sky-500 shrink-0" />
                  <span>{language === "am" ? "ቀጥተኛና ተጨባጭ እርዳታ" : "Direct & measurable street impact"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-brand-sky-950 bg-brand-sky-50/60 p-2.5 rounded-xl border border-brand-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-brand-green-500 shrink-0" />
                  <span>{language === "am" ? "የበር ከፈታ ፖሊሲና ግልጽነት" : "Open door policy & transparent reporting"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Key Leadership & Department Leads Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => {
            const Icon = member.icon;
            const name = language === "am" ? member.nameAm : member.nameEn;
            const role = language === "am" ? member.roleAm : member.roleEn;
            const desc = language === "am" ? member.descAm : member.descEn;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="bg-white border-2 border-gray-100 hover:border-brand-sky-300 rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Photo */}
                <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                  <img
                    src={member.image}
                    alt={name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-brand-sky-600 shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col space-y-2">
                  <h4 className="font-serif font-bold text-lg text-brand-sky-950 group-hover:text-brand-sky-600 transition-colors">
                    {name}
                  </h4>
                  <p className="text-xs font-black text-brand-sky-500 uppercase tracking-wider">
                    {role}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed flex-1 pt-1">
                    {desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
