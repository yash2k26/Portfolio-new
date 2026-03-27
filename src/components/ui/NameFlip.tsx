import React from "react";
export const NameFlip = () => (
  <div className="h-12.5 overflow-hidden inline-flex flex-col relative top-1">
    <div className="animate-flip text-(--text-primary) font-bold text-4xl tracking-tight leading-12.5">
      <span className="block h-12.5">Yash Bharadwaj</span>
      <span className="block h-12.5 text-(--text-muted)">YB</span>
      <span className="block h-12.5">Yash Bharadwaj</span>
    </div>
  </div>
);
