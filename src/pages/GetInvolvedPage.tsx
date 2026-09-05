import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GetInvolvedSection from "../components/GetInvolvedSection";
import DonateSection from "../components/DonateSection";
import BookingSection from "../components/BookingSection";
import ContactSection from "../components/ContactSection";

export default function GetInvolvedPage() {
  const { hash } = useLocation();
  const [donateInitiativeId, setDonateInitiativeId] = useState<string | null>(
    null,
  );
  const [donateCustomAmount, setDonateCustomAmount] = useState<number | null>(
    null,
  );

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
    <div className="pt-16">
      <GetInvolvedSection />

      <DonateSection
        initialInitiativeId={donateInitiativeId}
        initialCustomAmount={donateCustomAmount}
        onClearInitialValues={() => {
          setDonateInitiativeId(null);
          setDonateCustomAmount(null);
        }}
      />

      <BookingSection />
      <ContactSection />
    </div>
  );
}
