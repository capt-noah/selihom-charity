import React, { useEffect } from "react";
import TransformationsSection from "../components/TransformationsSection";

export default function StoriesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-white">
      <TransformationsSection isFullPage={true} />
    </div>
  );
}
