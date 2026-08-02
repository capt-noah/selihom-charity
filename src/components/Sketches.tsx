import React from "react";

// Helping Hands holding a Heart (Care, Charity, Community, Giving)
export function HelpingHandsSketch({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.1" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Hand 1 (Left, giving/supporting) */}
      <path d="M15,75 C25,75 30,70 42,62 C48,58 55,58 60,63 L65,68" />
      <path d="M15,83 C28,83 36,78 45,68 C49,64 56,64 61,69 L67,75" />
      
      {/* Hand 2 (Right, receiving/holding) */}
      <path d="M85,75 C75,75 70,70 58,62 C52,58 45,58 40,63 L35,68" />
      <path d="M85,83 C72,83 64,78 55,68 C51,64 44,64 39,69 L33,75" />

      {/* Heart in the center being held */}
      <path d="M50,45 C50,45 42,32 32,38 C22,44 32,60 50,72 C68,60 78,44 68,38 C58,32 50,45 50,45 Z" fill="currentColor" fillOpacity="0.04" />
      
      {/* Rays of hope / light radiating from heart */}
      <path d="M50,15 L50,22" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
      <path d="M25,25 L30,30" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
      <path d="M75,25 L70,30" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
      <path d="M20,45 L27,45" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
      <path d="M80,45 L73,45" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
      
      {/* A small plant/leaf sprouting from the heart */}
      <path d="M50,38 Q52,30 58,28 Q54,32 50,38" fill="currentColor" fillOpacity="0.1" />
      <path d="M50,38 Q48,29 42,28 Q46,31 50,38" fill="currentColor" fillOpacity="0.1" />
    </svg>
  );
}

// Food Bowl / Nourishment Sketch (charity kitchens, soup programs, nutrition support)
export function FoodNourishSketch({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.1" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Steaming Bowl */}
      <path d="M20,50 L80,50 C80,68 68,80 50,80 C32,80 20,68 20,50 Z" fill="currentColor" fillOpacity="0.04" />
      {/* Rim of the bowl */}
      <ellipse cx="50" cy="50" rx="30" ry="4" />
      
      {/* Steam rising from the food */}
      <path d="M40,40 Q43,30 38,20 Q43,15 40,10" />
      <path d="M50,42 Q54,32 48,22 Q54,16 50,8" />
      <path d="M60,40 Q63,30 58,20 Q63,15 60,10" />
      
      {/* Base of the bowl */}
      <path d="M38,80 L62,80" />
      <path d="M42,80 C42,84 58,84 58,80" />

      {/* Two hands gently offering or framing the bowl */}
      <path d="M12,65 Q18,60 26,61" strokeWidth="0.8" />
      <path d="M88,65 Q82,60 74,61" strokeWidth="0.8" />
      
      {/* Little heart above the steam */}
      <path d="M50,4 C51,1.5 54,1.5 55,3 Q55,5 50,8 Q45,5 45,3 C46,1.5 49,1.5 50,4 Z" fill="currentColor" />
    </svg>
  );
}

// Education & Book Sketch (schools, learning development, knowledge pathways)
export function EducationBookSketch({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.1" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Open Book pages */}
      <path d="M50,80 C38,76 22,76 12,80 L12,35 C22,31 38,31 50,35 C62,31 78,31 88,35 L88,80 C78,76 62,76 50,80 Z" fill="currentColor" fillOpacity="0.04" />
      
      {/* Middle spine */}
      <path d="M50,35 L50,80" />
      
      {/* Additional overlapping pages for depth (fine sketch line) */}
      <path d="M14,37 C23,33 38,33 49,37" strokeWidth="0.7" opacity="0.6" />
      <path d="M86,37 C77,33 62,33 51,37" strokeWidth="0.7" opacity="0.6" />
      
      <path d="M14,76 C23,72 38,72 49,76" strokeWidth="0.7" opacity="0.6" />
      <path d="M86,76 C77,72 62,72 51,76" strokeWidth="0.7" opacity="0.6" />

      {/* Growing Tree / Plant out of the book representing educational growth */}
      <path d="M50,35 C50,22 45,18 45,12" strokeWidth="1.1" />
      <path d="M50,35 C50,25 55,20 55,14" strokeWidth="1.1" />
      
      {/* Leaves on the growing plant */}
      <path d="M45,12 C41,12 40,16 45,18 C48,16 48,12 45,12 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M55,14 C59,14 60,18 55,20 C52,18 52,14 55,14 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M48,22 C43,24 43,28 48,29 C51,27 51,23 48,22 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M52,22 C57,24 57,28 52,29 C49,27 49,23 52,22 Z" fill="currentColor" fillOpacity="0.1" />

      {/* Tiny stars or light sparks of knowledge */}
      <path d="M30,20 L30,24 M28,22 L32,22" strokeWidth="0.8" opacity="0.7" />
      <path d="M70,18 L70,22 M68,20 L72,20" strokeWidth="0.8" opacity="0.7" />
      <circle cx="20" cy="30" r="1.2" fill="currentColor" />
      <circle cx="80" cy="28" r="1.2" fill="currentColor" />
    </svg>
  );
}

// Health & Care Clinic Sketch (wellness centers, hospitals, protection shield wrapped in plant growth)
export function HealthCareSketch({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.1" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Outer Shield/Circle of protection */}
      <path d="M50,15 C50,15 80,18 80,48 C80,72 50,88 50,88 C50,88 20,72 20,48 C20,18 50,15 50,15 Z" fill="currentColor" fillOpacity="0.03" strokeWidth="0.8" />
      
      {/* Medical/Helping Cross inside */}
      <path d="M44,32 L56,32 L56,44 L68,44 L68,56 L56,56 L56,68 L44,68 L44,56 L32,56 L32,44 L44,44 Z" fill="currentColor" fillOpacity="0.05" />
      
      {/* Sprouting/winding leaf of life / olive branch wrapped around the cross */}
      <path d="M28,68 Q40,78 58,66" strokeWidth="1.2" />
      <path d="M58,66 Q65,60 72,42" strokeWidth="1.2" />
      
      {/* Leaflets along the branch */}
      <path d="M38,72 Q35,65 42,67 Q43,72 38,72 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M50,71 Q52,63 56,66 Q54,71 50,71 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M62,60 Q66,54 68,58 Q64,62 62,60 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M68,48 Q74,45 72,49 Q69,52 68,48 Z" fill="currentColor" fillOpacity="0.1" />
    </svg>
  );
}

// Delicate background coordinate grid overlay
export function DotGridPattern() {
  return (
    <div 
      className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none select-none z-0" 
    />
  );
}
