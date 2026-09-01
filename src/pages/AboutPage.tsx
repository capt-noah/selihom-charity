import React from "react";
import AboutSection from "../components/AboutSection";
import CoreValuesSection from "../components/CoreValuesSection";
import AchievementsSection from "../components/AchievementsSection";

export default function AboutPage() {
  return (
    <div className="pt-16">
      <AboutSection />
      <AchievementsSection />
      <CoreValuesSection />
    </div>
  );
}
