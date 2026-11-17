import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DonateSection from "../components/DonateSection";

export default function DonatePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const timer = setTimeout(() => {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 120);
    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <div className="pt-16 min-h-screen">
      <DonateSection />
    </div>
  );
}
