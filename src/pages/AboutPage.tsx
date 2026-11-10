import React from "react";
import AboutSection from "../components/AboutSection";
import CoreValuesSection from "../components/CoreValuesSection";
import AchievementsSection from "../components/AchievementsSection";
import TeamSection from "../components/TeamSection";

export default function AboutPage() {
  return (
    <div className="pt-16">
      <AboutSection />
      <TeamSection />
      <AchievementsSection />
      <CoreValuesSection />
    </div>
  );
}
